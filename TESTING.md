# Testing Guide - Slack Bot Phase 1

Hướng dẫn kiểm tra tất cả 6 use case của bot.

## Prerequisites

1. ✅ Server đang chạy: `npm run dev`
2. ✅ Ngrok đang chạy: `ngrok start --config=ngrok.yml slack-bot`
3. ✅ Slack App đã được install vào workspace
4. ✅ Bot đã được thêm vào từng channel:
   - `/invite @YourBot` trong #onboarding
   - `/invite @YourBot` trong #contract-reminder
   - `/invite @YourBot` trong #birthday
5. ✅ `.env` đã được cấu hình với bot token và signing secret

## Test Cases

### Use Case 1: Leave Policy Q&A

**Test in Channel:**
```
@bot Quy trình xin nghỉ phép như thế nào?
```

**Test in DM:**
```
[gửi DM cho bot] Xin nghỉ phép khi nào?
```

**Expected Response:**
- Bot trả lời quy trình 3 bước (submit form, manager approval, HR confirmation)
- Bao gồm thời gian xử lý (1 ngày làm việc)
- Kết thúc với "Nguồn: SOP-NHANSU-01 (demo)"
- Có thể là 1 trong 3 variants đã chuẩn bị

**Other Keywords to Test:**
- "xin nghỉ phép"
- "nghỉ phép"
- "leave"
- "leave request"

---

### Use Case 2: Work Confirmation Letter Q&A

**Test in Channel:**
```
@bot Tôi cần giấy xác nhận công tác thì làm sao?
```

**Test in DM:**
```
[gửi DM cho bot] Giấy xác nhận công tác?
```

**Expected Response:**
- Bot hướng dẫn nộp FORM-HC-02
- Đề cập thời gian xử lý (1–2 ngày làm việc)
- Có liên hệ HR hoặc nơi nhận tài liệu
- Kết thúc với "Nguồn: FORM-HC-02 (demo)"
- Có thể là 1 trong 3 variants

**Other Keywords to Test:**
- "xác nhận công tác"
- "giấy xác nhận"
- "confirmation letter"
- "work certificate"

---

### Use Case 3: Onboarding (Proactive - Manual Trigger)

---

### Admin Q&A: Hành chính (4 câu hỏi chính)

**Câu hỏi để test (gửi @bot trong channel hoặc DM):**
- "Tôi muốn xin bản sao hợp đồng lao động thì cần làm gì?"
- "Tôi muốn cập nhật thông tin cá nhân thì làm thế nào?"
- "Tôi bị mất thẻ nhân viên, xin cấp lại như thế nào?"
- "Tôi cần giấy xác nhận thu nhập để làm hồ sơ ngân hàng thì làm sao?"

**Expected Behavior:**
- Bot trả lời trong cùng channel/DM nơi câu hỏi được hỏi.
- Mỗi intent có 2–3 biến thể câu trả lời chuyên nghiệp.
- Nếu bot không chắc, trả admin fallback và yêu cầu thêm thông tin (tên thủ tục/biểu mẫu/mục đích).

**Example tests:**
```
@bot Tôi muốn xin bản sao hợp đồng lao động thì cần làm gì?
@bot Làm sao để cập nhật thông tin cá nhân?
@bot Mình bị mất thẻ nhân viên, xin cấp lại như thế nào?
@bot Tôi cần giấy xác nhận thu nhập để làm hồ sơ ngân hàng
```

**Admin fallback test:**
```
@bot Tôi cần thủ tục hành chính liên quan đến đào tạo nhân viên
```
Kỳ vọng: Bot trả lời admin fallback, hỏi thêm tên thủ tục/biểu mẫu hoặc đề nghị liên hệ HCNS.

---

**Test Command:**
```bash
curl -X POST http://localhost:3000/demo/onboarding \
  -H "Content-Type: application/json"
```

**Expected Result:**
- Message appears in #onboarding (hoặc channel được set trong SLACK_CHANNEL_ONBOARDING)
- Content bao gồm:
  - Welcome greeting
  - Day 1 Checklist (nội quy, IT setup, HR)
  - Links to internal resources
  - Offer to help
- Polished, professional tone

**Check Server Logs:**
```
[output]
Gửi tin nhắn tới #onboarding ts=1.234567...
```

---

### Use Case 4: Contract Reminder (Proactive - Cron + Manual Trigger)

**Test Manual Trigger:**
```bash
curl -X POST http://localhost:3000/demo/contract-reminder \
  -H "Content-Type: application/json"
```

**Expected Result:**
- Message appears in #contract-reminder (hoặc SLACK_CHANNEL_CONTRACT)
- Content bao gồm:
  - Employee name, contract code, expiry date
  - Clear CTA (contact HR)
  - Line: "Nếu đã xử lý, vui lòng bỏ qua thông báo này."
- Professional tone

**Test Cron (if DEMO_CRON_ENABLED=true):**
- Wait for up to 1 minute
- Watch #contract-reminder channel
- Message should appear every minute
- Check server logs:
  ```
  Gửi tin nhắn tới #contract-reminder ts=...
  ```

---

### Use Case 5: Birthday Congratulations (Proactive - Manual Trigger)

**Test Command (with name):**
```bash
curl -X POST http://localhost:3000/demo/birthday \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "channel": "#birthday"
  }'
```

**Test Command (with custom channel override):**
```bash
curl -X POST http://localhost:3000/demo/birthday \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trần Thị B",
    "channel": "#general"
  }'
```

**Expected Result:**
- Message appears in #birthday (or overridden channel)
- Content bao gồm:
  - Person name clearly mentioned
  - Warm, professional congratulations
  - 1–2 paragraphs max
  - Include emoji (🎉, 🎂, etc.)
- Response: `{ "ok": true, "sentTo": "#birthday" }`

**Error Test (missing name):**
```bash
curl -X POST http://localhost:3000/demo/birthday \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Error:**
```json
{
  "ok": false,
  "error": "Missing or invalid \"name\" field. Expected: { \"name\": \"Nguyễn Văn A\", \"channel\": \"#optional\" }"
}
```

**Check Server Logs:**
```
[BIRTHDAY] Gửi tin nhắn sinh nhật cho Nguyễn Văn A tới #birthday
Gửi tin nhắn tới #birthday ts=...
```

---

### Use Case 6: Out-of-Scope Safe Fallback

**Test in Channel:**
```
@bot Công ty có kế hoạch tăng lương năm nay không?
```

**Test in DM:**
```
[gửi DM cho bot] Tuyển dụng thêm người không?
```

**Expected Response:**
- Bot trả lời "Hiện tại mình không có thông tin..."
- Provide contact options (HR, manager, official announcement)
- Professional, non-speculative tone
- Offer to help with known policies
- Có thể là 1 trong 2 variants

**Other Keywords to Test:**
- "tăng lương"
- "review lương"
- "lương năm nay"
- "kế hoạch tuyển dụng"
- "hiring"
- "salary raise"
- "company plan"
- "giải thể"

---

### Use Case 7: Unknown Question / Help

**Test in Channel:**
```
@bot Chào
```

**Test in Channel:**
```
@bot
```

**Test in DM:**
```
[gửi DM cho bot bất kỳ tin nhắn không khớp với use case nào]
```

**Expected Response:**
- Bot trả lời help message
- List those capabilities (xin nghỉ phép, giấy xác nhận, sinh nhật, onboarding, v.v.)
- Provide example questions
- Keep under 8 lines
- Có thể là 1 trong 2 variants

---

## Automated Testing

### Test All Endpoints Quickly

Create a file `test.sh`:

```bash
#!/bin/bash

echo "=== Test 1: Onboarding ==="
curl -X POST http://localhost:3000/demo/onboarding -H "Content-Type: application/json"
sleep 2

echo ""
echo "=== Test 2: Contract Reminder ==="
curl -X POST http://localhost:3000/demo/contract-reminder -H "Content-Type: application/json"
sleep 2

echo ""
echo "=== Test 3: Birthday (Success) ==="
curl -X POST http://localhost:3000/demo/birthday \
  -H "Content-Type: application/json" \
  -d '{"name": "Nguyễn Văn A"}'
sleep 2

echo ""
echo "=== Test 4: Birthday (Error - no name) ==="
curl -X POST http://localhost:3000/demo/birthday \
  -H "Content-Type: application/json" \
  -d '{}'

echo ""
echo "=== All endpoint tests complete ==="
```

Run:
```bash
bash test.sh
```

---

## Message Variants Verification

Bot uses `pickVariant()` to randomly select from multiple response templates. To verify all variants are being used:

1. **Leave Policy:** Call multiple times and watch for different wordings
   ```bash
   @bot Quy trình xin nghỉ phép?
   @bot Xin nghỉ phép khi nào?
   @bot leave process?
   ```

2. **Work Confirmation:** Same approach
   ```bash
   @bot Giấy xác nhận?
   @bot Xác nhận công tác?
   @bot confirmation letter?
   ```

3. **Birthday:** Try multiple names
   ```bash
   curl -X POST http://localhost:3000/demo/birthday -d '{"name": "A"}' ...
   curl -X POST http://localhost:3000/demo/birthday -d '{"name": "B"}' ...
   ```

---

## Debugging

### Check Server Logs

Look for patterns:

```
[SLACK EVENT] path=/slack/events body.type=event_callback
Event nhận được: app_mention channel_type= im
[BIRTHDAY] Gửi tin nhắn sinh nhật cho Nguyễn Văn A tới #birthday
Gửi tin nhắn tới #onboarding ts=1.234567890.abc123
```

### Check Ngrok Inspector

Open `http://127.0.0.1:4040` to see:
- All POST requests to `/slack/events`
- Request headers (x-slack-request-timestamp, x-slack-signature)
- Request body (JSON event payload)
- Response status (should be 200)

### Check Channel History

In Slack:
- Go to each channel (#onboarding, #contract-reminder, #birthday)
- Check last messages
- Verify bot is the sender

---

## Checklist: Full Test Coverage

- [ ] **Use Case 1 - Leave Q&A**
  - [ ] Test in channel mention
  - [ ] Test in DM
  - [ ] Test multiple keywords
  - [ ] Verify 3 step process in response

- [ ] **Use Case 2 - Work Confirmation Q&A**
  - [ ] Test in channel mention
  - [ ] Test in DM
  - [ ] Test multiple keywords
  - [ ] Verify FORM-HC-02 mentioned
  - [ ] Verify 1–2 days processing time

- [ ] **Use Case 3 - Onboarding Proactive**
  - [ ] POST /demo/onboarding returns 200 + { ok: true }
  - [ ] Message appears in #onboarding
  - [ ] Message includes Day 1 checklist
  - [ ] Professional tone

- [ ] **Use Case 4 - Contract Reminder Proactive**
  - [ ] POST /demo/contract-reminder returns 200 + { ok: true }
  - [ ] Message appears in #contract-reminder
  - [ ] Includes employee name, contract code, expiry date
  - [ ] Includes "Nếu đã xử lý..." line
  - [ ] Cron sends message every minute (if enabled)

- [ ] **Use Case 5 - Birthday Congratulations**
  - [ ] POST /demo/birthday with name returns 200 + { ok: true, sentTo: "..." }
  - [ ] Message appears in correct channel
  - [ ] Includes person name
  - [ ] Warm and professional tone
  - [ ] Error handling works (missing name → 400)
  - [ ] Channel override works

- [ ] **Use Case 6 - Out-of-Scope Fallback**
  - [ ] Test salary raise question
  - [ ] Test company plan question
  - [ ] Test hiring question
  - [ ] Verify safe response (not speculative)
  - [ ] Verify HR contact options provided

- [ ] **Use Case 7 - Help/Unknown**
  - [ ] Test random/unknown question
  - [ ] Verify help message appears
  - [ ] Verify example questions listed

- [ ] **Channel Setup**
  - [ ] Bot invited to #onboarding
  - [ ] Bot invited to #contract-reminder
  - [ ] Bot invited to #birthday
  - [ ] Bot can post in each channel

- [ ] **Signature Verification**
  - [ ] Slack requests are verified
  - [ ] Invalid signatures rejected (401)
  - [ ] Valid requests processed (200)

---

## Notes

- Messages use Vietnamese language with professional tone
- Response variants prevent rigid/repetitive behavior
- All proactive endpoints validate input and return proper error responses
- Server logs include detailed info for debugging
- Cron can be toggled with `DEMO_CRON_ENABLED` env var
