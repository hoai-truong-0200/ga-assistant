const express = require('express');
const crypto = require('crypto');
const dotenv = require('dotenv');
const { WebClient } = require('@slack/web-api');
const cron = require('node-cron');
const { routeUserMessage } = require('./scenario');

dotenv.config();

const PORT = process.env.PORT || 3000;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_DEFAULT_CHANNEL = process.env.SLACK_DEFAULT_CHANNEL || '#general';
const DEMO_CRON_ENABLED =
  (process.env.DEMO_CRON_ENABLED || 'false').toLowerCase() === 'true';

// Phase-1 channels per use case
const SLACK_CHANNEL_ONBOARDING =
  process.env.SLACK_CHANNEL_ONBOARDING || '#onboarding';
const SLACK_CHANNEL_CONTRACT =
  process.env.SLACK_CHANNEL_CONTRACT || '#contract-reminder';

const slack = new WebClient(SLACK_BOT_TOKEN);

const app = express();

// capture raw body for signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

function verifySlackSignature(req, res, next) {
  const timestamp = req.headers['x-slack-request-timestamp'];
  const signature = req.headers['x-slack-signature'];

  if (!SLACK_SIGNING_SECRET) {
    console.warn(
      'Cảnh báo: SLACK_SIGNING_SECRET chưa được cấu hình. Mọi yêu cầu Slack sẽ bị từ chối.'
    );
  }

  // Allow url_verification when signature missing (Slack sometimes doesn't send during initial verification)
  if (!signature || !timestamp) {
    if (req.body && req.body.type === 'url_verification') {
      console.warn(
        'Cảnh báo: Không có signature trong yêu cầu url_verification — cho phép tạm thời.'
      );
      return next();
    }
    console.warn('Thiếu signature hoặc timestamp. Từ chối yêu cầu.');
    return res.status(401).send('Unauthorized');
  }

  const fiveMinutes = 60 * 5;
  if (
    Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > fiveMinutes
  ) {
    console.warn('Từ chối yêu cầu do timestamp quá cũ');
    return res.status(401).send('Request timestamp out of range');
  }

  const sigBase = `v0:${timestamp}:${req.rawBody}`;
  const h = crypto.createHmac('sha256', SLACK_SIGNING_SECRET || '');
  h.update(sigBase);
  const mySig = `v0=${h.digest('hex')}`;

  const sigBuf = Buffer.from(signature, 'utf8');
  const mySigBuf = Buffer.from(mySig, 'utf8');
  if (
    sigBuf.length !== mySigBuf.length ||
    !crypto.timingSafeEqual(sigBuf, mySigBuf)
  ) {
    console.warn('Signature verification failed');
    console.warn('Headers:', {
      'x-slack-request-timestamp': timestamp,
      'x-slack-signature': signature,
    });
    console.warn('Computed signature:', mySig);
    console.warn('Raw body (snippet):', (req.rawBody || '').slice(0, 500));
    return res.status(401).send('Unauthorized');
  }

  next();
}

async function sendMessage(channel, text) {
  try {
    const res = await slack.chat.postMessage({ channel, text });
    console.log('Gửi tin nhắn tới', channel, 'ts=', res.ts);
    return res;
  } catch (err) {
    console.error('Lỗi khi gửi tin nhắn:', err?.data || err.message || err);
    throw err;
  }
}

app.post('/slack/events', verifySlackSignature, (req, res) => {
  console.log(
    '[SLACK EVENT] path=/slack/events body.type=',
    req.body && req.body.type
  );

  const body = req.body;

  if (body && body.type === 'url_verification') {
    // Slack URL verification - trả challenge
    console.log('Xử lý url_verification');
    return res.send(body.challenge);
  }

  // Acknowledge immediately for event callbacks
  if (body && body.type === 'event_callback') {
    res.status(200).send();

    const event = body.event || {};
    console.log(
      'Event nhận được:',
      event.type,
      'channel_type=',
      event.channel_type
    );

    // ignore bot messages to prevent loops
    if (event.subtype === 'bot_message' || event.bot_id) {
      console.log('Bỏ qua bot message');
      return;
    }

    if (event.type === 'app_mention') {
      let text = (event.text || '').replace(/<@[^>]+>/g, '').trim();
      if (!text) text = '';
      const route = routeUserMessage(text);
      const reply = route.textResponse;
      sendMessage(event.channel, reply).catch(() => {});
      return;
    }

    if (event.type === 'message' && event.channel_type === 'im') {
      const text = event.text || '';
      const route = routeUserMessage(text);
      const reply = route.textResponse;
      sendMessage(event.channel, reply).catch(() => {});
      return;
    }

    console.log('Event không xử lý:', event.type);
    return;
  }

  // Default
  res.status(200).send();
});

app.post('/demo/onboarding', async (req, res) => {
  try {
    await sendOnboardingMessage();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post('/demo/contract-reminder', async (req, res) => {
  try {
    await sendContractReminderMessage();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

async function sendOnboardingMessage() {
  const channel = SLACK_CHANNEL_ONBOARDING;
  const text = `Chào bạn 👋\nChào mừng bạn đến với công ty.\nDay 1 checklist:\n• Nội quy\n• Quy trình IT\n• Liên hệ HR\n📎 Tài liệu: (link nội bộ)`;
  return sendMessage(channel, text);
}

async function sendContractReminderMessage() {
  const channel = SLACK_CHANNEL_CONTRACT;
  const text = `🔔 Demo nhắc hợp đồng (Phase 1)\n• Nhân viên: Nguyễn Văn A\n• Mã hợp đồng: HR-2024-015\n• Hết hạn: 30/09/2026\n👉 Vui lòng kiểm tra`;
  return sendMessage(channel, text);
}

// Cron gửi tin nhắn mỗi phút nếu kích hoạt
if (DEMO_CRON_ENABLED) {
  console.log(
    'Cron demo được kích hoạt: gửi contract reminder mỗi phút tới',
    SLACK_CHANNEL_CONTRACT
  );
  cron.schedule('* * * * *', async () => {
    try {
      await sendContractReminderMessage();
    } catch (err) {
      console.error('Cron gửi thất bại:', err?.message || err);
    }
  });
} else {
  console.log(
    'Cron demo không được kích hoạt. Thiết lập DEMO_CRON_ENABLED=true để bật.'
  );
}

app.get('/', (req, res) => res.send('Slack demo server (Phase 1) đang chạy'));

app.listen(PORT, () =>
  console.log(`Server lắng nghe ở http://localhost:${PORT}`)
);
