/**
 * Scenario Router Module (Phase 1)
 * Rule-based routing cho 5 use case với response variants
 */

// Normalize text: remove Slack mention tags, trim, lowercase
function normalizeText(text) {
  return (text || '').replace(/<@[^>]+>/g, '').trim();
}

// Random pick one variant
function pickVariant(variants) {
  return variants[Math.floor(Math.random() * variants.length)];
}

/**
 * Quy trình xin nghỉ phép
 * Keywords: "nghỉ phép", "xin nghỉ", "leave"
 */
const leavePolicy = () => {
  const variants = [
    `📋 Quy trình xin nghỉ phép:\n1. Điền form HR-NNV-001 cách tối thiểu 3 ngày làm việc trước\n2. Gửi cho quản lý trực tiếp để phê duyệt\n3. Chuyển HR sau khi quản lý duyệt\n✓ Được phê duyệt thường trong 1 ngày làm việc\nNguồn: SOP-NHANSU-01 (demo)`,
    `Để xin nghỉ phép, hãy:\n• Bước 1: Điền form xin nghỉ (HR-NNV-001)\n• Bước 2: Yêu cầu phê duyệt từ quản lý\n• Bước 3: Gửi tới phòng HR để xác nhận\nThời gian xử lý: ~1 ngày làm việc\n📄 Nguồn: SOP-NHANSU-01 (demo)`,
  ];
  return pickVariant(variants);
};

/**
 * Giấy xác nhận công tác (Work confirmation letter)
 * Keywords: "xác nhận công tác", "giấy xác nhận"
 */
const workConfirmation = () => {
  const variants = [
    `📃 Hướng dẫn lấy giấy xác nhận công tác:\n1. Gửi yêu cầu bằng form nội bộ (FORM-HC-02)\n2. Liên hệ trực tiếp phòng HR\n3. Thời gian xử lý: 1–2 ngày làm việc\n4. Nhận tại: Phòng HR tầng 3\nNguồn: FORM-HC-02 (demo)`,
    `Để được cấp giấy xác nhận công tác:\n• Bước 1: Điền FORM-HC-02 (mẫu nội bộ)\n• Bước 2: Nộp cho HR hoặc gửi email\n• Bước 3: Chờ 1–2 ngày làm việc\nĐối tác xử lý: Phòng HR, Tầng 3\n📧 Nguồn: FORM-HC-02 (demo)`,
  ];
  return pickVariant(variants);
};

/**
 * Safe fallback cho câu hỏi nằm ngoài scope
 * Salary raise, company plans, etc.
 */
const safeOutOfScope = () => {
  const variants = [
    `Hiện tại tôi không có thông tin chính thức về câu hỏi của bạn. Xin liên hệ:\n• 📞 Phòng HR: ext. 3000\n• 📧 hr@company.internal\n• 🤝 Quản lý trực tiếp của bạn\nTôi sẽ được cập nhật thêm tính năng trong Phase-1.5.`,
    `Xin lỗi, tôi chưa có thông tin này. Để được trả lời, bạn có thể:\n1. Liên hệ HR trực tiếp\n2. Hỏi quản lý của bạn\n3. Chờ thông báo chính thức từ công ty\nCảm ơn bạn đã hiểu. Phase-1.5 sẽ cải thiện thêm! 🚀`,
  ];
  return pickVariant(variants);
};

/**
 * Generic help / unknown question
 */
const genericHelp = () => {
  const variants = [
    `Xin chào! 👋 Tôi là bot hỗ trợ HR Phase-1.\nTôi có thể giúp bạn với:\n• Quy trình xin nghỉ phép\n• Giấy xác nhận công tác\n• Thông tin onboarding\nHãy hỏi tôi bất cứ điều gì! 😊`,
    `Chào bạn! Tôi là bot hỗ trợ công nhân sự. Hiện tại tôi hỗ trợ:\n💼 Xin nghỉ phép\n📃 Giấy xác nhận công tác\n🎯 Q&A nhanh\nBạn muốn biết thêm thông tin gì?`,
  ];
  return pickVariant(variants);
};

/**
 * Main routing function
 * Input: raw user text (may contain Slack mentions)
 * Output: { type, textResponse }
 *   type: "leave_policy" | "work_confirmation" | "out_of_scope" | "generic_help"
 */
function routeUserMessage(rawText) {
  const text = normalizeText(rawText).toLowerCase();

  // Leave policy keywords
  if (
    text.includes('nghỉ phép') ||
    text.includes('xin nghỉ') ||
    text.includes('leave')
  ) {
    return {
      type: 'leave_policy',
      textResponse: leavePolicy(),
    };
  }

  // Work confirmation letter keywords
  if (
    text.includes('xác nhận công tác') ||
    text.includes('giấy xác nhận') ||
    text.includes('confirmation') ||
    text.includes('letter')
  ) {
    return {
      type: 'work_confirmation',
      textResponse: workConfirmation(),
    };
  }

  // Out-of-scope: salary, company plans, etc.
  if (
    text.includes('tăng lương') ||
    text.includes('review lương') ||
    text.includes('lương năm nay') ||
    text.includes('salary raise') ||
    text.includes('salary review') ||
    text.includes('kế hoạch') ||
    text.includes('plan') ||
    text.includes('tuyển dụng') ||
    text.includes('hiring') ||
    text.includes('giải thể')
  ) {
    return {
      type: 'out_of_scope',
      textResponse: safeOutOfScope(),
    };
  }

  // Generic / unknown
  if (text.length === 0 || text === '' || text === '@bot') {
    return {
      type: 'generic_help',
      textResponse: genericHelp(),
    };
  }

  // Default fallback
  return {
    type: 'generic_help',
    textResponse: genericHelp(),
  };
}

module.exports = {
  routeUserMessage,
  normalizeText,
};
