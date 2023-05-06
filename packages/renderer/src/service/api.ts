import { code200Error } from './util';
import { Enum } from '/@/constant';
import { packLocalData, clearLocalConversation } from '/@/utils/yUtil';

// 通话流程
export function completionAPI(list: Array<{type: string; text: string}>) {
  return code200Error({
    url: '/web/v1/chat/completions',
    // url: `/v1/completion`,
    method: 'POST',
    data: {
      appId: 'aigc_web',
      // appId: 'common',
      messages: list.map(v => {
        return {
          role: v.type === 'gpt' ? Enum.gpt : v.type,
          content: v.text,
        };
      }),
    },
  });
}

// sso配置
export function configAPI() {
  return code200Error({
    url: '/web/v1/sso',
    // url: `/v1/completion`,
    method: 'GET',
  });
}

// 获取推荐prompt
export function getPromptAPI() {
  return code200Error({
    url: '/web/v1/prompt/recommend',
    // url: `/v1/completion`,
    method: 'GET',
  });
}
export function getQuoteAPI() {
  return code200Error({
    url: '/web/v1/prompt/quote',
    method: 'GET',
  });
}

// 计算tiktoken
export function countTokenAPI(prompt: string) {
  return code200Error({
    url: '/web/v1/token/count',
    method: 'POST',
    data: {
      prompt,
    },
  });
}
// 消息赞踩
export function voteAPI(data: any) {
  return code200Error({
    url: '/web/v1/conversation/message/vote',
    method: 'POST',
    data,
  });
}
export function getConversationListAPI() {
  return code200Error({
    url: '/web/v1/conversation/list',
    method: 'GET',
  });
}

export function createConversationAPI() {
  return code200Error({
    url: '/web/v1/conversation/create',
    method: 'POST',
  });
}
// 分享赞踩
export function shareVoteAPI(shareKey: string, vote: any) {
  return code200Error({
    url: '/web/v1/conversation/share/vote',
    method: 'POST',
    data: {
      shareKey,
      vote,
    },
  });
}

export function getConversationDetailAPI(conversationId: string) {
  return code200Error({
    url: `/web/v1/conversation/detail?conversationId=${conversationId}`,
    method: 'GET',
  });
}

export function deleteConversationAPI(conversationId: string) {
  return code200Error({
    url: '/web/v1/conversation/delete',
    method: 'POST',
    data: {
      conversationId,
    },
  });
}
export function getShareDetailAPI(shareKey: string) {
  return code200Error({
  url: `/web/v1/conversation/share/detail?shareKey=${shareKey}`,
  method: 'GET',
});
}
export function createShareAPI(conversationId: string, messageIds: string[]) {
  return code200Error({
    url: '/web/v1/conversation/share/create',
    method: 'POST',
    data: {
      conversationId,
      messageIds,
    },
  });
}

export function editConversationAPI(conversationId: string, title: string) {
  return code200Error({
    url: '/web/v1/conversation/edit',
    method: 'POST',
    data: {
      conversationId,
      title,
    },
  });
}

// DO NOT USE THIS ONE
export function streamChatAPI(conversationId: string, content: string) {
  return fetch('/web/v1/stream/chat', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationId,
      content,
    }),
  });
}

export function moveConversationAPI() {
  const data = packLocalData();
  if (!data) return;
  return code200Error({
    url: '/web/v1/conversation/move',
    method: 'POST',
    data,
  })
    .then(clearLocalConversation)
    .then(() => {
      window.location.reload();
    });
}
