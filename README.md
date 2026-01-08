# Slack Bot Demo (Phase 1)

Hướng dẫn thiết lập nhanh để chạy Slack bot demo cục bộ (Node.js). Tài liệu viết bằng tiếng Việt.

Yêu cầu:
- Node.js 18+

## 1) Tạo Slack App
 - Vào https://api.slack.com/apps → Create New App → From scratch
 - Chọn workspace của bạn

## 2) Thêm OAuth Scopes (Bot Token Scopes)
 - app_mentions:read
 - chat:write
 - channels:read
 - groups:read
 - im:read
 - mpim:read

## 3) Bật Event Subscriptions
 - Enable Events: ON
 - Request URL: https://<NGROK_DOMAIN>/slack/events
   - Lưu ý: ban đầu Slack sẽ gửi `url_verification` để xác thực
 - Subscribe to Bot Events: `app_mention`, `message.im`

## 4) Cài đặt App vào Workspace
 - Install App → Lưu `Bot User OAuth Token` (xoxb-...)
 - Lưu `Signing Secret` từ Basic Information

## 5) Chuẩn bị cục bộ
 - Sao chép file `.env.example` thành `.env` và điền các giá trị:

Example `.env`:

```
PORT=3000
SLACK_BOT_TOKEN=xoxb-...
SLACK_SIGNING_SECRET=...
SLACK_CHANNEL_ONBOARDING=#onboarding
SLACK_CHANNEL_CONTRACT=#contract-reminder
DEMO_CRON_ENABLED=true
```

## 6) Tạo các kênh trong Slack
 - Tạo kênh `#onboarding` (hoặc tên khác, rồi cập nhật .env)
 - Tạo kênh `#contract-reminder` (hoặc tên khác, rồi cập nhật .env)
 - Lưu ý: **phải thêm bot vào từng kênh này** để bot có quyền gửi message

## 7) Cài đặt và chạy
 - Cài dependencies:

```bash
npm install
```

 - Chạy server:

```bash
npm run dev
```

## 8) Tạo tunnel với ngrok
 - Mở 1 terminal khác và chạy:

```bash
ngrok start --config=ngrok.yml slack-bot
```

 - Copy `https://<NGROK_DOMAIN>` và dán vào Slack App → Event Subscriptions → Request URL: `https://<NGROK_DOMAIN>/slack/events` → Save
 - Chờ Slack xác thực (Verified ✓)

Ngrok (gợi ý cấu hình)
 - File cấu hình `ngrok.yml` đã có sẵn trong repo. Chạy ngrok với cấu hình này:

```bash
ngrok start --config=ngrok.yml slack-bot
```

 - Sau khi chạy, bạn sẽ thấy một public HTTPS URL trong output của ngrok hoặc tại UI web `http://127.0.0.1:4040`.
 - Dán `https://<public-host>` vào Slack App → Event Subscriptions → Request URL: `https://<public-host>/slack/events`

Khi URL thay đổi
 - Trường hợp A (Free ngrok): URL sẽ thay đổi mỗi lần bạn khởi động ngrok. Nếu URL thay đổi, dán URL mới vào Slack Event Subscriptions và chờ Slack xác thực lại.
 - Trường hợp B (Reserved domain): nếu bạn có reserved domain/ngrok paid plan, mở `ngrok.yml` và bỏ comment `hostname: your-reserved-subdomain.ngrok.io`, rồi chạy lệnh trên — URL sẽ ổn định.
 - Mẹo: nếu Slack không xác thực Request URL, kiểm tra logs của server (console) và inspect UI (`http://127.0.0.1:4040`) để xem lỗi chi tiết.

## Phase-1: 5 Use Cases

Bot hiện hỗ trợ **5 use case** với rule-based routing và response variants (không rigid):

### Use Case 1: Quy trình xin nghỉ phép
- **Trigger:** User hỏi "Quy trình xin nghỉ phép như thế nào?" (hoặc keywords: "nghỉ phép", "xin nghỉ", "leave")
- **Response:** Bot trả lời quy trình 3 bước (form, quản lý, HR) với xác nhận thời gian xử lý
- **Kênh:** Trả lời trong **kênh/DM nơi user hỏi** (không redirect)
- **Variants:** 2-3 biến thể để không cứng nhắc

### Use Case 2: Giấy xác nhận công tác
- **Trigger:** User hỏi "Tôi cần giấy xác nhận công tác thì làm sao?" (hoặc keywords: "xác nhận công tác", "giấy xác nhận")
- **Response:** Bot hướng dẫn dùng form FORM-HC-02, liên hệ HR, thời gian 1-2 ngày
- **Kênh:** Trả lời trong **kênh/DM nơi user hỏi**
- **Variants:** 2-3 biến thể

### Use Case 3: Onboarding (Proactive)
- **Trigger:** Endpoint `POST /demo/onboarding`
- **Response:** Tin nhắn chào mừng với Day 1 checklist (nội quy, IT, HR)
- **Kênh:** `SLACK_CHANNEL_ONBOARDING` (ví dụ: #onboarding)
- **Test:** `curl -X POST http://localhost:3000/demo/onboarding`

### Use Case 4: Contract Reminder (Proactive + Cron)
- **Trigger (Cron):** Nếu `DEMO_CRON_ENABLED=true`, cron chạy mỗi phút
- **Trigger (Manual):** Endpoint `POST /demo/contract-reminder`
- **Response:** Tin nhắn nhắc hợp đồng (nhân viên, mã, hạn, action)
- **Kênh:** `SLACK_CHANNEL_CONTRACT` (ví dụ: #contract-reminder)
- **Test:** `curl -X POST http://localhost:3000/demo/contract-reminder`

### Use Case 5: Out-of-Scope (Safe Fallback)
- **Trigger:** User hỏi "Công ty có kế hoạch tăng lương năm nay không?" (hoặc keywords: "tăng lương", "kế hoạch", "tuyển dụng")
- **Response:** Bot trả lời "Tôi không có thông tin..." + hướng dẫn liên hệ HR
- **Kênh:** Trả lời trong **kênh/DM nơi user hỏi**
- **Variants:** 2-3 biến thể an toàn

## 9) Thử nghiệm

### Test Use Case 1 (Leave Policy)
```
- Channel: thêm bot vào một channel bằng `/invite @YourBot`
- Mention bot: `@yourbot Quy trình xin nghỉ phép như thế nào?`
- DM: gửi DM cho bot với nội dung tương tự
- Kỳ vọng: Bot trả lời chi tiết quy trình xin nghỉ
```

### Test Use Case 2 (Work Confirmation)
```
- Channel: `@yourbot Tôi cần giấy xác nhận công tác thì làm sao?`
- DM: gửi DM cho bot: "Giấy xác nhận công tác"
- Kỳ vọng: Bot hướng dẫn form FORM-HC-02 và thời gian xử lý
```

### Test Use Case 3 (Onboarding)
```bash
curl -X POST http://localhost:3000/demo/onboarding
```
- Kỳ vọng: Bot gửi tin nhắn chào mừng vào `SLACK_CHANNEL_ONBOARDING`

### Test Use Case 4 (Contract Reminder)
```bash
curl -X POST http://localhost:3000/demo/contract-reminder
```
- Kỳ vọng: Bot gửi tin nhắn nhắc hợp đồng vào `SLACK_CHANNEL_CONTRACT` ngay lập tức
- Hoặc nếu `DEMO_CRON_ENABLED=true`, chờ cron gửi mỗi phút

### Test Use Case 5 (Out-of-Scope)
```
- Channel: `@yourbot Công ty có kế hoạch tăng lương năm nay không?`
- DM: "Kế hoạch tuyển dụng?"
- Kỳ vọng: Bot trả lời an toàn "Tôi không có thông tin..." + hướng dẫn liên hệ HR
```

## Architecture

File chính:
- `server.js` – server Express, xác thực signature, xử lý events, cron, endpoint
- `scenario.js` – scenario router (Phase-1 rule-based) với 5 use case
- `.env.example` – ví dụ biến môi trường
- `package.json` – script `dev` và `start`
- `ngrok.yml` – cấu hình ngrok tunnel

## Ghi chú kỹ thuật / Checklist cấu hình

- [x] Enable Bot Token Scopes như mục trên
- [x] Enable Event Subscriptions và thêm 2 Bot Events: `app_mention`, `message.im`
- [x] Cập nhật Request URL với ngrok URL
- [x] Install/Reinstall App nếu thay đổi scope
- [x] **Thêm bot vào từng kênh:** `/invite @YourBot` trong #onboarding, #contract-reminder
- [x] Kiểm tra logs của server (xem reply có gửi đi không)
- [x] Test cron (nếu bật) bằng cách quan sát logs mỗi phút

## Phase-2 Roadmap
- Thêm RAG (simple vector DB + embeddings)
- Thêm more policies (IT, Finance, etc.)
- Support thread replies
- Analytics & logging
