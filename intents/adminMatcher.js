// Admin intent matcher
// normalize text and match admin-related intents with simple scoring

function normalizeText(text) {
  if (!text) return '';
  // remove Slack mentions like <@U123...>
  let s = text.replace(/<@[^>]+>/g, ' ');
  // to lower case
  s = s.toLowerCase();
  // remove extra punctuation except letters, numbers and spaces
  s = s.replace(/["'`~@#\$%\^&\*\+=\[\]{}|\\<>\/\?;:(),.!\-]/g, ' ');
  // collapse spaces
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

const INTENTS = {
  contract_copy: {
    keywords: [
      'bản sao',
      'bản sao hợp đồng',
      'hợp đồng lao động',
      'hđlđ',
      'sao hợp đồng',
    ],
  },
  personal_update: {
    keywords: [
      'cập nhật',
      'thông tin cá nhân',
      'địa chỉ',
      'số tài khoản',
      'cccd',
      'cmnd',
      'thông tin liên lạc',
    ],
  },
  lost_card: {
    keywords: ['mất thẻ', 'cấp lại thẻ', 'thẻ nhân viên', 'mất thẻ nhân viên'],
  },
  income_confirmation: {
    keywords: [
      'xác nhận thu nhập',
      'hồ sơ ngân hàng',
      'xác nhận lương',
      'giấy xác nhận thu nhập',
      'thu nhập',
    ],
  },
};

const ADMIN_GENERAL_KEYWORDS = [
  'hcns',
  'hành chính',
  'hồ sơ',
  'biểu mẫu',
  'form',
  'form-hc',
  'form-hc-02',
];

function matchAdminIntent(rawText) {
  const text = normalizeText(rawText);
  if (!text) return null;

  let best = { intent: null, score: 0 };
  for (const [intent, data] of Object.entries(INTENTS)) {
    let score = 0;
    for (const kw of data.keywords) {
      if (text.includes(kw)) score += 1;
    }
    if (score > best.score) {
      best = { intent, score };
    }
  }

  if (best.score > 0) {
    return { intent: best.intent, score: best.score };
  }

  // if no specific intent matched but text contains admin-general keywords, return fallback
  for (const g of ADMIN_GENERAL_KEYWORDS) {
    if (text.includes(g)) {
      return { intent: 'admin_fallback', score: 0 };
    }
  }

  return null;
}

module.exports = { normalizeText, matchAdminIntent };
