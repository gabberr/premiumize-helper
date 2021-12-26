import {browser} from 'webextension-polyfill-ts';
import {createTransfer} from '../libs/premiumize';

browser.contextMenus.create({
  id: 'add-to-premiumize',
  title: 'Add to Premiumize',
  contexts: ['link'],
});

// https://gist.github.com/Rob--W/ec23b9d6db9e56b7e4563f1544e0d546
function escapeHTML(str: string): string {
  // Note: string cast using String; may throw if `str` is non-serializable, e.g. a Symbol.
  // Most often this is not the case though.
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

browser.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'add-to-premiumize') {
    // Always HTML-escape external input to avoid XSS.
    const safeUrl = escapeHTML(info.linkUrl || '');
    if (safeUrl) {
      createTransfer(safeUrl);
    }
  }
});
