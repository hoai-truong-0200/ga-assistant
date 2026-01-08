/**
 * Response Templates Module (Phase 1)
 * Professional, realistic, company-appropriate Vietnamese responses
 */

function pickVariant(variants) {
  return variants[Math.floor(Math.random() * variants.length)];
}

/**
 * Use Case 1: Leave Policy Q&A
 */
const leavePolicyTemplates = [
  `📋 **Quy trình xin nghỉ phép:**

Bạn có thể xin nghỉ phép theo các bước sau:
1️⃣ **Tạo đơn:** Điền biểu mẫu HR-NNV-001 trên hệ thống HR (https://hr.company.vn) - khuyến khích nộp tối thiểu 3 ngày làm việc trước
2️⃣ **Duyệt:** Gửi cho Quản lý trực tiếp để xem xét và phê duyệt
3️⃣ **Xác nhận:** Sau khi quản lý duyệt, hệ thống tự động gửi tới HR để ghi nhận

Thông thường phê duyệt sẽ hoàn tất trong 1 ngày làm việc.

Nếu cần hỗ trợ: 📞 HR ext. 3000 | 📧 hr@company.internal

Nguồn: SOP-NHANSU-01 (demo)`,

  `Để xin nghỉ phép, hãy làm theo quy trình sau:

👉 **Bước 1 - Điền đơn:** Truy cập HR Portal và tạo đơn xin nghỉ phép (FORM HR-NNV-001)
   → Lưu ý: nộp ít nhất 3 ngày trước ngày nghỉ

👉 **Bước 2 - Chờ phê duyệt:** Quản lý của bạn sẽ nhận được thông báo và xem xét
   → Phê duyệt thường hoàn tất trong 1 ngày làm việc

👉 **Bước 3 - Xác nhận:** Khi được phê duyệt, HR sẽ ghi nhận vào hệ thống
   → Bạn sẽ nhận email xác nhận

Nếu có thắc mắc: Liên hệ HR (ext. 3000 hoặc hr@company.internal)

Nguồn: SOP-NHANSU-01 (demo)`,

  `Để xin nghỉ phép, vui lòng thực hiện theo quy trình sau:

**Bước 1:** Vào hệ thống HR Portal (https://hr.company.vn) → chọn "Xin Nghỉ Phép" → điền FORM HR-NNV-001
*(Nên nộp trước 3 ngày làm việc để có thời gian phê duyệt)*

**Bước 2:** Gửi yêu cầu cho Quản lý trực tiếp → chờ duyệt
*(Thường mất 1 ngày làm việc)*

**Bước 3:** Sau khi được phê duyệt, hệ thống tự động chuyển tới HR → ghi nhận
→ Bạn sẽ nhận email xác nhận và lịch sử nghỉ phép

**Hỗ trợ:** HR Team ext. 3000 | hr@company.internal

Nguồn: SOP-NHANSU-01 (demo)`,
];

/**
 * Use Case 2: Work Confirmation Letter Q&A
 */
const workConfirmationTemplates = [
  `📃 **Hướng dẫn lấy Giấy Xác Nhận Công Tác:**

1️⃣ **Nộp đơn:** Điền biểu mẫu FORM-HC-02 trên HR Portal hoặc gửi email tới HR Team
2️⃣ **Thời gian xử lý:** 1–2 ngày làm việc
3️⃣ **Nhận giấy:** Đến phòng HR (Tầng 3) hoặc nhận qua email (nếu chọn)

**Cần gấp?** Liên hệ trực tiếp: HR ext. 3000 | hr@company.internal

Tài liệu: FORM-HC-02 (demo)`,

  `Để được cấp Giấy Xác Nhận Công Tác, hãy làm theo các bước sau:

👉 **Bước 1:** Truy cập HR Portal (https://hr.company.vn) → tìm "Yêu Cầu Giấy Xác Nhận" → điền FORM-HC-02
   *Hoặc gửi email trực tiếp tới: hr@company.internal*

👉 **Bước 2:** Chờ xử lý (thường 1–2 ngày làm việc)

👉 **Bước 3:** Nhận giấy tại phòng HR (Tầng 3) hoặc qua email

**Nếu cần gấp:** Hãy liên hệ HR Team ext. 3000 để yêu cầu ưu tiên

Tài liệu: FORM-HC-02 (demo)`,

  `Quy trình lấy Giấy Xác Nhận Công Tác:

**Nộp yêu cầu:**
- Truy cập https://hr.company.vn → chọn "Giấy Xác Nhận Công Tác"
- Điền FORM-HC-02 (ghi rõ mục đích sử dụng)
- Gửi yêu cầu

**Thời gian xử lý:** 1–2 ngày làm việc

**Nhận giấy:**
- Tại phòng HR (Tầng 3, Khối A)
- Hoặc qua email nếu chọn giao thức điện tử

**Hỗ trợ:** HR ext. 3000 | hr@company.internal

Tài liệu: FORM-HC-02 (demo)`,
];

/**
 * Admin Q&A Templates (new)
 */
const contractCopyTemplates = [
  `📄 **Bản sao hợp đồng lao động:**

Bạn có thể yêu cầu **bản sao hợp đồng lao động** bằng cách gửi yêu cầu tới HCNS qua FORM-HC-REQUEST hoặc qua HR Portal.
Sau khi nhận yêu cầu, HCNS sẽ xác minh thông tin và phát hành bản sao trong vòng **1–2 ngày làm việc**.

Nếu cần gấp, vui lòng liên hệ trực tiếp HCNS: ext. 3000 | hr@company.internal

Nguồn: Quy trình HCNS (demo)`,

  `Để xin **bản sao hợp đồng lao động**, bạn vui lòng gửi yêu cầu qua hệ thống HCNS (FORM-HC-REQUEST) hoặc email tới HR.
HCNS sẽ kiểm tra và xử lý, thường trong **1–2 ngày làm việc**. Bạn sẽ nhận được file qua email hoặc nhận trực tiếp tại phòng HCNS.

Nguồn: Quy trình HCNS (demo)`,
];

const personalUpdateTemplates = [
  `🔔 **Cập nhật thông tin cá nhân:**

Bạn có thể **cập nhật tự phục vụ** trên HR Portal (mục "Hồ sơ cá nhân"). Nếu một số thông tin cần xác minh (ví dụ: thay đổi số tài khoản ngân hàng, CCCD), vui lòng gửi kèm giấy tờ liên quan tới HCNS.
Thời gian xử lý: thường **1–2 ngày làm việc** khi cần xác minh.

Nguồn: Quy định quản lý hồ sơ nhân sự (demo)`,

  `Để cập nhật thông tin cá nhân (địa chỉ, số điện thoại, số tài khoản...), bạn có thể thay đổi trực tiếp trên HR Portal.
Nếu thay đổi yêu cầu chứng minh (ví dụ: đổi số tài khoản), vui lòng nộp giấy tờ cho HCNS để xác nhận. HCNS xử lý trong vòng **1–2 ngày làm việc**.

Nguồn: Quy định quản lý hồ sơ nhân sự (demo)`,
];

const lostCardTemplates = [
  `🔑 **Mất thẻ nhân viên - Cấp lại:**

Nếu bạn làm mất thẻ, vui lòng thông báo ngay cho HCNS và Quản lý trực tiếp, sau đó nộp yêu cầu cấp lại qua FORM-HC-LOST hoặc liên hệ phòng HCNS.
HCNS sẽ yêu cầu xác minh danh tính trước khi cấp thẻ mới. Thời gian xử lý: **1–2 ngày làm việc** (tùy trường hợp).

Nguồn: Quy trình hành chính nội bộ (demo)`,

  `Trường hợp mất thẻ nhân viên, làm theo các bước:
1. Báo mất với HCNS/Quản lý
2. Điền form yêu cầu cấp lại (FORM-HC-LOST)
3. HCNS xác minh và cấp thẻ mới

Liên hệ HCNS để được hỗ trợ nhanh: ext. 3000 | hr@company.internal

Nguồn: Quy trình hành chính nội bộ (demo)`,
];

const incomeConfirmationTemplates = [
  `💼 **Xác nhận thu nhập (dành cho hồ sơ ngân hàng):**

Vui lòng gửi yêu cầu xác nhận thu nhập tới HCNS bằng FORM-HC-INCOME hoặc email kèm thông tin mục đích (ví dụ: hồ sơ vay ngân hàng).
HCNS xử lý và cung cấp giấy xác nhận trong vòng **1–2 ngày làm việc**.

Nguồn: Quy trình HCNS (demo)`,

  `Để nhận giấy xác nhận thu nhập, bạn hãy nộp yêu cầu qua HR Portal hoặc gửi email tới HR Team, đính kèm thông tin cần thiết.
HCNS sẽ chuẩn bị tài liệu trong **1–2 ngày làm việc** và gửi cho bạn.

Nguồn: Quy trình HCNS (demo)`,
];

const adminFallbackTemplates = [
  `Hiện tại mình chưa tìm thấy hướng dẫn hành chính phù hợp để trả lời chắc chắn.
Bạn có thể gửi thêm: tên thủ tục/biểu mẫu, mục đích sử dụng, hoặc bộ phận liên quan.
Trong trường hợp cần gấp, bạn vui lòng liên hệ trực tiếp HCNS để được hỗ trợ.`,

  `Mình chưa có dữ liệu hành chính chính xác cho câu hỏi này.
Vui lòng cung cấp thêm: tên thủ tục, biểu mẫu hoặc mục đích sử dụng, mình sẽ cố gắng tìm trong tài liệu nội bộ.
Nếu cần hỗ trợ ngay, liên hệ HCNS: ext. 3000 | hr@company.internal`,
];

/**
 * Use Case 3: Onboarding Proactive
 */
const onboardingTemplates = [
  `🎉 **Chào mừng bạn đến với gia đình công ty!**

Chúng tôi rất vui được chào đón bạn. Dưới đây là những việc cần hoàn thành ngày hôm nay:

✅ **Day 1 Checklist:**
   • 📋 Ký các giấy tờ nội bộ tại HR
   • 💻 Nhận tài khoản IT & cài đặt máy tính
   • 👤 Làm quen với các thành viên trong team
   • 📖 Đọc qua Nội Quy Công Ty

📎 **Tài liệu hữu ích:**
   • Nội Quy: https://intranet.company.vn/policies
   • IT Setup Guide: https://intranet.company.vn/it-onboarding
   • Org Chart: https://intranet.company.vn/team

**Nếu bạn cần bất kỳ hỗ trợ nào:** Hãy liên hệ HR Team hoặc Quản lý của bạn. Chúng tôi sẵn sàng giúp đỡ! 🤝`,

  `🎉 **Chúc mừng bạn chính thức trở thành một phần của đội ngũ công ty!**

Để giúp bạn bắt đầu nhanh chóng, hãy hoàn thành các việc sau hôm nay:

📋 **Những công việc cần làm:**
   • Ký các tài liệu hành chính tại phòng HR (Tầng 3)
   • Thiết lập tài khoản công ty với IT Team
   • Làm quen với Nội Quy Công Ty
   • Gặp mặt trực tiếp Quản lý của bạn

📚 **Hướng dẫn & Tài liệu:**
   → Nội Quy Công Ty: https://intranet.company.vn/policies
   → Hướng dẫn IT Setup: https://intranet.company.vn/onboarding
   → Sơ đồ Tổ Chức: https://intranet.company.vn/org-chart

📞 **Bất kỳ câu hỏi nào:** Tìm HR Team hoặc Quản lý của bạn. Chúng tôi luôn sẵn sàng! 🙌`,
];

/**
 * Use Case 4: Contract Reminder Proactive
 */
const contractReminderTemplates = [
  `🔔 **Nhắc hợp đồng - Cần xác nhận sắp tới**

Hợp đồng dưới đây sắp hết hạn:

📌 **Nhân viên:** Nguyễn Văn A
📌 **Mã hợp đồng:** HR-2024-015
📌 **Hết hạn:** 30/09/2026

👉 **Hành động:** Vui lòng liên hệ HR Team để gia hạn hoặc xác nhận tiếp tục hợp đồng.

💡 *Nếu đã xử lý, vui lòng bỏ qua thông báo này.*

📧 HR: hr@company.internal | 📞 ext. 3000`,

  `📅 **Nhắc nhở: Hợp đồng sắp hết hạn**

Hợp đồng dưới đây cần được xem xét trong thời gian tới:

🔹 Nhân viên: Nguyễn Văn A
🔹 Mã hợp đồng: HR-2024-015
🔹 Ngày hết hạn: 30/09/2026

**Yêu cầu:** Vui lòng liên hệ HR Team để tiến hành gia hạn, ký lại hoặc kết thúc hợp đồng.

*(Nếu đã hoàn tất, không cần phản hồi thêm.)*

📞 HR Team ext. 3000 | 📧 hr@company.internal`,
];

/**
 * Use Case 5: Birthday Congratulations
 */
const birthdayTemplates = (name = 'bạn') => [
  `🎉 **Chúc mừng sinh nhật ${name}!**

Hôm nay là một ngày đặc biệt — ngày sinh nhật của bạn! Chúng tôi rất vui và trân trọng có bạn làm một phần của đội ngũ.

Chúc bạn một ngày thật tuyệt vời, đầy năng lượng và tinh thần, cùng những thành tích mới trong công việc lẫn cuộc sống. 🌟

Cảm ơn bạn đã đồng hành cùng chúng tôi! 🙌`,

  `🎂 **Sinh nhật vui vẻ, ${name}!**

Hôm nay là ngày để vinh danh bạn — người đã mang đến những đóng góp giá trị cho đội ngũ của chúng tôi.

Chúc bạn luôn năng động, sáng tạo, và đạt được những mục tiêu lớn lao. Một ngày tuyệt vời đang chờ bạn! 🎉

Cảm ơn vì những gì bạn đã làm cho công ty. Hẹn gặp lại để chia sẻ niềm vui! 🌈`,

  `🎊 **Chúc mừng ngày sinh nhật của ${name}!**

Hôm nay, chúng tôi muốn gửi lời chúc đến bạn — một người tài năng, cẩn thận và luôn đóng góp tích cực cho đội.

Mong rằng năm tuổi mới này sẽ mang đến cho bạn nhiều sức khỏe, hạnh phúc, cũng như những cơ hội mới để phát triển bản thân.

Chúc bạn một ngày thật đáng nhớ! 🌟💫`,
];

/**
 * Use Case 6: Out-of-Scope Safe Fallback
 */
const outOfScopeTemplates = [
  `Cảm ơn bạn đã hỏi! 😊

Hiện tại mình chưa có thông tin chính thức về vấn đề này. Để được trả lời chính xác, bạn có thể:

📞 **Liên hệ trực tiếp HR Team:** ext. 3000 | hr@company.internal
👤 **Hỏi Quản lý của bạn** để được hướng dẫn
📢 **Chờ thông báo chính thức** từ công ty

Nếu bạn cần giúp với các chính sách hiện có (xin nghỉ phép, giấy xác nhận công tác, v.v.), mình sẵn sàng hỗ trợ!`,

  `Xin lỗi, mình chưa có thông tin chính thức về câu hỏi của bạn. 😌

Đây là những cách tốt nhất để được trả lời:

1️⃣ Liên hệ **HR Team:** ext. 3000 hoặc hr@company.internal
2️⃣ Hỏi **Quản lý của bạn** hoặc **Giám đốc Phòng**
3️⃣ Kiểm tra **Intranet:** https://intranet.company.vn/policies

**Nếu bạn có câu hỏi về nội quy, hành chính, hay quy trình công ty, mình sẵn sàng giúp!** 🙌`,
];

/**
 * Generic Help Message (when no intent matched)
 */
const helpTemplates = [
  `👋 Xin chào! Mình là bot hỗ trợ HR (Phase 1).

**Mình có thể giúp bạn với:**
📋 **Nội quy:** Hỏi về quy trình xin nghỉ phép
📃 **Hành chính:** Tìm hiểu cách lấy giấy xác nhận công tác
🎉 **Sinh nhật:** Gửi lời chúc mừng (admin only)
🎯 **Onboarding:** Hướng dẫn ngày đầu tiên

**Hãy hỏi mình bất cứ điều gì!** 😊`,

  `Chào bạn! 👋 Mình là trợ lý HR của công ty.

**Mình hiện hỗ trợ:**
• 🏢 Quy trình xin nghỉ phép & những chính sách nội bộ
• 📄 Cách lấy giấy xác nhận công tác
• 👶 Hướng dẫn onboarding cho nhân viên mới
• 🔔 Nhắc nhở hợp đồng & sự kiện quan trọng
• 🎂 Những lời chúc mừng sinh nhật từ công ty

**Ví dụ câu hỏi:** "Quy trình xin nghỉ phép?", "Lấy giấy xác nhận công tác như thế nào?"

Bạn muốn hỏi gì? 🤔`,
];

module.exports = {
  pickVariant,
  leavePolicyTemplates,
  workConfirmationTemplates,
  onboardingTemplates,
  contractReminderTemplates,
  birthdayTemplates,
  outOfScopeTemplates,
  contractCopyTemplates,
  personalUpdateTemplates,
  lostCardTemplates,
  incomeConfirmationTemplates,
  adminFallbackTemplates,
  helpTemplates,
};
