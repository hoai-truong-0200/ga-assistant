/**
 * Scenario Router Module (Phase 1)
 * Rule-based routing với improved templates
 */

const {
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
} = require('./templates');
const { matchAdminIntent } = require('./intents/adminMatcher');

// Normalize text: remove Slack mention tags, trim, lowercase
function normalizeText(text) {
  return (text || '').replace(/<@[^>]+>/g, '').trim();
}

/**
 * Use Case 1: Leave Policy Q&A
 */
const leavePolicy = () => {
  return {
    type: 'leave_policy',
    textResponse: pickVariant(leavePolicyTemplates),
  };
};

/**
 * Use Case 2: Work Confirmation Letter Q&A
 */
const workConfirmation = () => {
  return {
    type: 'work_confirmation',
    textResponse: pickVariant(workConfirmationTemplates),
  };
};

/**
 * Use Case 3: Onboarding Proactive
 */
const onboardingMessage = () => {
  return {
    type: 'onboarding',
    textResponse: pickVariant(onboardingTemplates),
  };
};

/**
 * Use Case 4: Contract Reminder Proactive
 */
const contractReminderMessage = () => {
  return {
    type: 'contract_reminder',
    textResponse: pickVariant(contractReminderTemplates),
  };
};

/**
 * Use Case 5: Birthday Congratulations
 */
const birthdayMessage = (name = 'bạn') => {
  return {
    type: 'birthday',
    textResponse: pickVariant(birthdayTemplates(name)),
  };
};

/**
 * Use Case 6: Safe Out-of-Scope Fallback
 */
const safeOutOfScope = () => {
  return {
    type: 'out_of_scope',
    textResponse: pickVariant(outOfScopeTemplates),
  };
};

/**
 * Generic Help / Unknown
 */
const genericHelp = () => {
  return {
    type: 'generic_help',
    textResponse: pickVariant(helpTemplates),
  };
};

/**
 * Main routing function for user questions
 * Input: raw user text
 * Output: { type, textResponse }
 */
function routeUserMessage(rawText) {
  const text = normalizeText(rawText).toLowerCase();

  // Leave policy keywords
  if (
    text.includes('nghỉ phép') ||
    text.includes('xin nghỉ') ||
    text.includes('leave')
  ) {
    return leavePolicy();
  }

  // Work confirmation letter keywords
  if (
    text.includes('xác nhận công tác') ||
    text.includes('giấy xác nhận') ||
    text.includes('confirmation') ||
    text.includes('letter')
  ) {
    return workConfirmation();
  }

  // Out-of-scope: salary, company plans, hiring, etc.
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
    text.includes('giải thể') ||
    text.includes('restructure')
  ) {
    return safeOutOfScope();
  }

  // Admin intents: use admin matcher with scoring
  const adminMatch = matchAdminIntent(text);
  if (adminMatch) {
    if (adminMatch.intent === 'contract_copy') {
      return {
        type: 'admin_contract_copy',
        textResponse: pickVariant(contractCopyTemplates),
      };
    }
    if (adminMatch.intent === 'personal_update') {
      return {
        type: 'admin_personal_update',
        textResponse: pickVariant(personalUpdateTemplates),
      };
    }
    if (adminMatch.intent === 'lost_card') {
      return {
        type: 'admin_lost_card',
        textResponse: pickVariant(lostCardTemplates),
      };
    }
    if (adminMatch.intent === 'income_confirmation') {
      return {
        type: 'admin_income_confirmation',
        textResponse: pickVariant(incomeConfirmationTemplates),
      };
    }
    if (adminMatch.intent === 'admin_fallback') {
      return {
        type: 'admin_fallback',
        textResponse: pickVariant(adminFallbackTemplates),
      };
    }
  }

  // Generic / unknown
  if (text.length === 0 || text === '' || text === '@bot') {
    return genericHelp();
  }

  // Default fallback
  return genericHelp();
}

module.exports = {
  routeUserMessage,
  normalizeText,
  leavePolicy,
  workConfirmation,
  onboardingMessage,
  contractReminderMessage,
  birthdayMessage,
  safeOutOfScope,
  genericHelp,
};
