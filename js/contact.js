/**
 * Contact section behaviour: copy the email address and keep the footer year
 * current. Both degrade gracefully — the mailto link always works even when the
 * clipboard API is unavailable (it needs a secure context).
 */

import { qs } from './core/dom.js';
import { t, onLangChange } from './i18n/i18n.js';

export const EMAIL = 'alejandroprietodiez05@gmail.com';

const FEEDBACK_TIMEOUT_MS = 2600;

let feedbackTimer = null;

function showFeedback(node, message) {
  if (!node) return;

  node.textContent = message;
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    node.textContent = '';
  }, FEEDBACK_TIMEOUT_MS);
}

async function copyEmail(feedback) {
  try {
    await navigator.clipboard.writeText(EMAIL);
    showFeedback(feedback, t('contactCopied'));
  } catch (error) {
    showFeedback(feedback, t('contactCopyFailed'));
  }
}

export function initContact() {
  const button = qs('#copyEmailButton');
  const feedback = qs('#copyEmailFeedback');

  if (button) {
    button.addEventListener('click', () => copyEmail(feedback));
    onLangChange(() => {
      if (feedback) feedback.textContent = '';
    });
  }

  const yearNode = qs('#footerYear');
  if (yearNode) {
    yearNode.textContent = t('footerRights', { year: new Date().getFullYear() });
    onLangChange(() => {
      yearNode.textContent = t('footerRights', { year: new Date().getFullYear() });
    });
  }
}
