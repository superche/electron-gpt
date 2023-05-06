

export function getQuery(url = window.location.search) {
  const urlSearchParams = new URLSearchParams(url);
  return Object.fromEntries(urlSearchParams.entries());
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
  return Promise.resolve();
}

export function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text);
  }
  return navigator.clipboard.writeText(text).then(
    function () {
      // console.log('Async: Copying to clipboard was successful!')
    },
    function (err) {
      console.error('Async: Could not copy text: ', err);
    },
  );
}

//
export function setCookie(name: string, value: string, days: number) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

export function getCookie(name: string) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const storageKey = 'chatgpt-conversationList';

export function packLocalData() {
  const lists = (JSON.parse(localStorage.getItem(storageKey) || '{}') || {}).value;
  if (!lists) return null;
  const conversationList = lists.map((key: any, idx: number) => {
    const rawList = (JSON.parse(localStorage.getItem(`chatgpt-${key}`) || '{}') || {}).value;
    if (!rawList || !rawList.length) return null;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(key)) return null;
    const messageList = rawList.map((item: any) => ({
      role: item.type,
      content: item.text,
    }));
    return {
      title: `对话${idx + 1}`,
      conversationId: key,
      messageList,
    };
  }).filter(Boolean);
  if (!conversationList.length) return null;
  return { conversationList };
}

export function clearLocalConversation() {
  const lists = (JSON.parse(localStorage.getItem(storageKey) || '{}') || {}).value;
  if (!lists) return null;
  lists.forEach((key: any) => {
    localStorage.removeItem(`chatgpt-${key}`);
  });
  localStorage.removeItem(storageKey);
}
