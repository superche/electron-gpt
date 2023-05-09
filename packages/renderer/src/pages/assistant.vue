<template>
  <div class="overflow-hidden w-full h-full relative">
    <div class="bg-gray-900 hidden md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col">
      <div class="flex h-full min-h-0 flex-col ">
        <div class="aside scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
          <nav class="flex w-full h-full flex-1 flex-col space-y-1 p-2">
            <a
              class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
              @click="handleClickCreateConversation"
            >
              <image :src="createConversationImage"></image>
              新建对话
            </a>
            <div class="aside-top flex flex-col gap-2 text-gray-100 text-sm">
              <div
                v-for="(item, index) of conversationList"
                :key="item.conversationId"
              >
                <a
                  class="menu-item text-white flex py-3 px-3 pr-10 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all group"
                  :data-active="item.conversationId === activeConversationId"
                  :data-id="item.conversationId"
                  @click="handleClickChat(item)"
                >
                  <image :src="chatIcon" />
                  <span
                    :title="item.title"
                    class="flex-1 inline-block truncate text-ellipsis max-h-5 overflow-hidden break-all relative"
                  >
                    <span v-if="item !== currentEditConversation">{{ item.title }}</span>
                    <input
                      v-else
                      ref="conversationNameInput"
                      v-model="newConversationName"
                      maxlength="20"
                      style="background:#ddd;color:#000;padding:0 6px;width:150px;outline:0 none;"
                      @keyup="(e) => handleKeyupEditConversationName(item, e)"
                    />
                  </span>
                  <div class="absolute flex right-1 z-10 text-gray-300 visible">
                    <button
                      v-if="item !== currentEditConversation"
                      class="p-1 hover:text-white"
                      @click="e => {
                        e.stopPropagation();
                        currentEditConversation = item;
                        nextTick(() => {
                          conversationNameInput?.focus();
                        });
                      }"
                    >
                      <Icon name="edit-o" />
                    </button>
                    <button
                      v-else
                      class="p-1 hover:text-white"
                      @click="e => {
                        e.stopPropagation();
                        editConversation(item);
                      }"
                    >
                      <Icon name="check" />
                    </button>

                    <button
                      v-if="item !== currentEditConversation"
                      class="p-1 hover:text-white"
                      @click="e => {
                        e.stopPropagation();
                        deleteConversation(index);
                      }"
                    >
                      <Icon name="delete-o" />
                    </button>
                    <button
                      v-else
                      class="p-1 hover:text-white"
                      @click="e => {
                        e.stopPropagation();
                        currentEditConversation = null;
                      }"
                    >
                      <Icon name="close" />
                    </button>
                  </div>
                </a>
              </div>
            </div>
            <div class="aside-bottom">
              <div class="flex-col flex-1 overflow-y-auto border-b border-white/20"></div>
              <a
                class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                @click="handleClickChangeDarkMode"
              >
                <image :src="darkmodeImg" />
                切换模式
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
    <div class="flex h-full flex-1 flex-col md:pl-[260px]">
      <main class="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div class="flex-1 overflow-hidden dark:bg-gray-800">
          <Loading
            v-if="conversationLoading"
            size="large"
            style="padding: 200px 0"
          />
          <Message
            v-if="messageList.length > 0"
            ref="messageListComponent"
            :list="messageList"
            :conversation-id="activeConversationId"
            :is-share="false"
            :ready-to-share="readyToShare"
          ></Message>
          <ExamplePrompt
            v-show="messageList.length <= 0 && !conversationLoading"
            @choose="(v: any) => {
              if (waitingForAnswer) return;
              inputText = v.content || v.prompt;
            }"
          />
        </div>
        <div class="pt-2 absolute bottom-0 left-0 w-full md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
          <Share
            :ready-to-share="readyToShare"
            :is-done="isDone"
            :is-error="isError"
            @set-ready-to-share="setReadyToShare"
            @copy-link="copyLink"
            @handle-share="handleShare"
            @handle-response="() => doChat(true)"
          />
          <div class="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
            <div class="relative flex h-full flex-1 md:flex-col">
              <el-autocomplete
                v-show="readyToShare"
                v-model="inputText"
                :fetch-suggestions="promptAllList"
                clearable
                class="inline-input w-50"
                placeholder="Please Input"
                @select="() => doChat()"
              ></el-autocomplete>
              <AutoComplete
                v-show="!readyToShare"
                v-model="inputText"
                :list="promptAllList"
                @submit="() => doChat()"
              >
                <button
                  v-if="showPrompt"
                  class="send-btn absolute p-1 rounded-md text-gray-500  hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                  @click="() => doChat()"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="22"
                      y1="2"
                      x2="11"
                      y2="13"
                    ></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </AutoComplete>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, computed, nextTick, onMounted } from 'vue';
import type { Ref } from 'vue';
import { ElMessage } from 'element-plus';
import wcwidth from 'wcwidth';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import { statusEnum } from '/@/constant';
import { copyTextToClipboard } from '/@/utils/yUtil';
import {
  getConversationListAPI,
  createConversationAPI,
  getConversationDetailAPI,
  deleteConversationAPI,
  editConversationAPI,
  moveConversationAPI,
  getQuoteAPI,
  createShareAPI,
} from '/@/service/api';
import createConversationImage from '/@/../assets/assistant_createconversation.svg';
import chatIcon from '/@/../assets/assistant_chaticon.svg';
import darkmodeImg from '/@/../assets/assistant_darkmode.svg';

// Props & Emits
export interface IProps {
  conversationId?: string;
}
const props = defineProps<IProps>();

// Data
const inputText = ref(''); // 输入框的内容
const waitingForAnswer = ref(false); // 等待服务端回答中
const streamTimer = ref(null as any);
const messageList = ref([] as any[]); // 当前对话包含的消息列表
const conversationLoading = ref(false);
const conversationList = ref([] as any[]); // 左侧的对话列表
const activeConversationId: Ref<string | null> = ref(null); // 当前被激活的对话 conversationId
const currentEditConversation = ref(null as any);
const newConversationName = ref('');
const returnText = ref(''); // 暂存流式返回的对话内容
const showPrompt = ref(false);
const promptList = ref(['']);
const promptDataList = ref(['']);
const promptAllList = ref([] as any[]);
// const selectedPrompt = ref(null);
const isAccept = ref(false);
const isDrawImg = ref(false); // 判断当前是否正在生成图片中
const imageData = ref({} as any); // 暂存图片数据
const waitingForImgAnswer = ref(false); // 等待请求图片数据中
const returnImage = ref(''); // 暂存图片流式返回内容
const streamImgTimer = ref(null as any); // 图片定时器
const isGernarateImageIndex = ref(null as any); // 图片项index
const isGernarateTextIndex = ref(null as any); // 文字项index
const readyToShare = ref(false);

// Constant
const UPDATE_PER_SECOND = 25;
const MAX_CONVERSATION_COUNT = 30;

// Computed
const isError = computed(() => {
  if (!messageList.value.length) return false;

  return messageList.value.at(-1).status === statusEnum.error;
});
const isDone = computed(() => {
  if (!messageList.value.length) return false;

  return messageList.value.at(-1).status === statusEnum.done;
});
const emptyConversationId = computed(() => {
  if (!conversationList.value.length) return null;
  return conversationList.value[0].messageCount ? null : conversationList.value[0].conversationId;
});
const chating = computed(() => {
  return Boolean(waitingForAnswer.value || streamTimer.value || waitingForImgAnswer.value || streamImgTimer.value);
});
const activeConversation = computed(() => {
  if (!conversationList.value.length) return null;
  return conversationList.value.find(item => item.conversationId === activeConversationId.value);
});

// DOM Refs
const messageListComponent = ref(null as any);
const conversationNameInput = ref(null as any);

// Watch
watch(activeConversationId, (newV) => {
  messageList.value = [];
  inputText.value = '';
  returnText.value = '';
  clearTimer();
  getConversationDetail(newV as string);
  if (streamImgTimer.value) {
    clearTimeout(streamImgTimer.value);
  }
  streamImgTimer.value = null;
  isDrawImg.value = false;
  returnImage.value = '';
  readyToShare.value = false;
});
watch(currentEditConversation, (newV) => {
  if (newV) {
    newConversationName.value = newV.title;
  } else {
    newConversationName.value = '';
  }
});

// Lifecycles
onMounted(() => {
  getConversationList();
  moveConversationAPI();
  getMyQuote();
});

// Methods
const handleClickChangeDarkMode = () => {
  const dom = window.document.querySelector('#app');
  dom?.classList.toggle('dark');
  dom?.classList.toggle('light');
};
const clearTimer = () => {
  if (streamTimer.value) {
    clearTimeout(streamTimer.value);
  }
  streamTimer.value = null;
};
const scrollToEnd = (instant?: boolean) => {
  if (!messageList.value.length) return;

  if (instant) {
    messageListComponent.value.scrollEnd();
  } else {
    nextTick(() => {
      messageListComponent.value.scrollEnd();
    });
  }
};
const handleClickChat = (item: any) => {
  if (chating.value) return;
  activeConversationId.value = item.conversationId;
};
const getConversationList = async () => {
  const res = await getConversationListAPI();
  conversationList.value = res?.data?.list || [];
  if (
    (!conversationList.value.length || !emptyConversationId.value)
    && conversationList.value.length < MAX_CONVERSATION_COUNT
  ) {
    await createConversation();
  }
  activeConversationId.value = props.conversationId || conversationList.value[0].conversationId;
};
const handleClickCreateConversation = () => {
  if (messageList.value.length === 0) {
    ElMessage.warning('当前对话为空，可以直接使用当前对话');
  } else if (conversationList.value.length >= MAX_CONVERSATION_COUNT) {
    deleteConversationLast();
    createConversation();
  } else {
    createConversation();
  }
};
const createConversation = async () => {
  if (chating.value) return;
  if (emptyConversationId.value) {
    ElMessage.warning('当前已有空白对话，请优先使用空白对话');
    activeConversationId.value = emptyConversationId.value;
    return;
  }
  try {
    const res = await createConversationAPI();
    conversationList.value.unshift(res.data);
    activeConversationId.value = res.data.conversationId;
  } catch (e: any) {
    ElMessage.error('新建对话失败 ' + e.message || '');
  }
};
const getConversationDetail = async (conversationId: string) => {
  conversationLoading.value = true;
  const res = await getConversationDetailAPI(conversationId);
  if (res.data?.conversationId !== activeConversationId.value) return;

  messageList.value = res.data?.messageList || [];
  conversationLoading.value = false;
  scrollToEnd();
};
const quickGetConversationDetail = async (conversationId: string) => {
  const res = await getConversationDetailAPI(conversationId);
  messageList.value = res.data?.messageList || [];
  readyToShare.value = true;
};
const getMyQuote = async () => {
  try {
    const res = await getQuoteAPI();
    const datalist = res.data?.list || [];
    promptList.value = datalist.map((item: any) => item.title);
    promptDataList.value = datalist.map((item: any) => item.prompt);
    promptAllList.value = datalist ?? [];
    isAccept.value = true;
  } catch (e) {
    ElMessage.error('请刷新页面重试');
  }
};
const deleteConversation = async (index: number) => {
  if (chating.value) return;
  if (conversationList.value.length === 1) return ElMessage.warning('至少保留一个对话');
  if (!conversationList.value[index].messageCount) return ElMessage.warning('空白对话不可删除');
  try {
    await deleteConversationAPI(conversationList.value[index].conversationId);
    if (conversationList.value[index].conversationId === activeConversationId.value) {
      activeConversationId.value = conversationList.value[index].conversationId;
    }
    conversationList.value.splice(index, 1);
  } catch (e: any) {
    ElMessage.error('删除对话失败 ' + e.message || '');
  }
};
const deleteConversationLast = async () => {
  try {
    const lastOneConversationId = conversationList.value.at(-1).conversationId;
    await deleteConversationAPI(lastOneConversationId);
    conversationList.value.pop();
  } catch (e: any) {
    ElMessage.error('删除对话失败 ' + e.message || '');
  }
};
const handleKeyupEditConversationName = (item: any, e: any) => {
  if (e.which === 13 || e.keyCode === 13) {
    editConversation(item);
  }
};
const editConversation = async (item: any) => {
  if (newConversationName.value === '') return ElMessage.warning('名字不能为空');
  if (wcwidth(newConversationName.value) > 20) return ElMessage.warning('最长10个中文或20个英文字符');
  if (item.title === newConversationName.value) return currentEditConversation.value = null;
  try {
    const res = await editConversationAPI(item.conversationId, newConversationName.value);
    if (res.status === 0) {
      item.title = newConversationName.value;
    }
    currentEditConversation.value = null;
  } catch (e: any) {
    ElMessage.error('修改对话失败 ' + e.message || '');
  }
};
const createShare = async (conversationId: string, messageIds: any) => {
  if (messageIds <= 0) return ElMessage.warning('请选择至少一条对话');
  try {
    const res = await createShareAPI(conversationId, messageIds);
    if (res.status === 0) {
      await copyTextToClipboard(res.data.shareUrl);
      ElMessage.success('复制成功');
      readyToShare.value = false;
    }
  } catch (e: any) {
    ElMessage.error('复制失败 ' + e.message || '');
  }
};
const myslice = (str: any) => {
  let count = 0;
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      count += 1;
    } else {
      count += 2;
    }

    if (count > 20) {
      break;
    }

    result += str[i];
  }
  return result;
};
// 图片流式请求
const streamChatImg = async (content: any, regenerate: any, imgObj: any) => {
  isGernarateImageIndex.value = null;
  return fetchEventSource('/web/v1/stream/chat', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      conversationId: activeConversationId.value,
      regenerate: +Boolean(regenerate),
    }),
    openWhenHidden: true,
    onopen: async (response) => {
      if (response.ok && response.headers.get('content-type') === 'text/event-stream') {
        imgObj.image = response.headers.get('image');
        imgObj.status = statusEnum.streaming;
        imgObj.messageId = response.headers.get('assistant-message-id');
        isGernarateImageIndex.value = messageList.value.findIndex(item => item.messageId === response.headers.get('assistant-message-id'));
        startConsumeImg(0, 2);
        return;
      }
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw new Error('response.status error');
      }
    },
    onmessage(msg) {
      // if the server emits an error message, throw an exception
      // so it gets handled by the onerror callback below:
      if (msg.event === 'FatalError') throw new Error(msg.data);
      const data = JSON.parse(msg.data);
      imageData.value = data;
      if (data.lastOne) return;
      if (data.content.length > returnImage.value.length) returnImage.value = data.content;
    },
    onclose() {
      // if the server closes the connection unexpectedly, retry:
      // throw new Error()
    },
    onerror(err) {
      throw err;
    },
  });
};
// 图片内容流式展示
const startConsumeImg = (start: number, lastLen: number) => {
  if (!waitingForImgAnswer.value && start >= returnImage.value.length) {
    if (streamImgTimer.value) {
      clearTimeout(streamImgTimer.value);
    }
    streamImgTimer.value = null;
    isDrawImg.value = false;
    messageList.value[isGernarateImageIndex.value].status = statusEnum.done;
    return;
  }
  streamImgTimer.value = setTimeout(() => {
    if (start === 0) {
      messageList.value.at(isGernarateImageIndex.value).content = '';
    }
    const nextLen = waitingForImgAnswer.value ? 2 : ~~((returnImage.value.length - start) / UPDATE_PER_SECOND);
    lastLen = Math.max(nextLen, lastLen);
    messageList.value.at(isGernarateImageIndex.value).content = imageData.value.content;
    startConsumeImg(Math.min(returnImage.value.length, start + lastLen), lastLen);
    scrollToEnd(true);
  }, ~~(1000 / UPDATE_PER_SECOND));
};
// 文字流式请求
const streamChat = async (content: any, regenerate: any, textObj: any) => {
  isGernarateTextIndex.value = null;

  return fetchEventSource('/web/v1/stream/chat', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      conversationId: activeConversationId.value,
      regenerate: +Boolean(regenerate),
    }),
    openWhenHidden: true,
    onopen: async (response) => {
      if (response.ok && response.headers.get('content-type') === 'text/event-stream') {
        textObj.image = response.headers.get('image');
        textObj.status = statusEnum.streaming;
        textObj.messageId = response.headers.get('assistant-message-id');
        isGernarateTextIndex.value = messageList.value.findIndex(item => item.messageId === response.headers.get('assistant-message-id'));
        startConsumeText(0, 2);
        return;
      }
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        // client-side errors are usually non-retriable:
        throw new Error('response.status error');
      }
    },
    onmessage: (msg) => {
      // if the server emits an error message, throw an exception
      // so it gets handled by the onerror callback below:
      if (msg.event === 'FatalError') throw new Error(msg.data);
      const data = JSON.parse(msg.data);
      if (data.lastOne) return;
      if (data.content.length > returnText.value.length) returnText.value = data.content;
    },
    onclose() {
      // if the server closes the connection unexpectedly, retry:
      // throw new Error()
    },
    onerror(err) {
      throw err;
    },
  });
};
// 由于后端的流式响应并不是平滑的，所以前端模拟一个平滑的流式输出
// 流式请求的响应结束之前，每秒做 40 次输出，每次输出 2 个字符
// 流式请求响应结束之后，剩下的所有内容在 1 秒内输出完毕
const startConsumeText = (start: number, lastLen: number) => {
  if (!waitingForAnswer.value && start >= returnText.value.length) {
    clearTimer();
    messageList.value.at(isGernarateTextIndex.value).status = statusEnum.done;
    return;
  }
  streamTimer.value = setTimeout(() => {
    if (start === 0) messageList.value.at(isGernarateTextIndex.value).content = '';
    const nextLen = waitingForAnswer.value ? 2 : ~~((returnText.value.length - start) / UPDATE_PER_SECOND);
    lastLen = Math.max(nextLen, lastLen);
    messageList.value.at(isGernarateTextIndex.value).content += returnText.value.substring(start, start + lastLen);
    startConsumeText(Math.min(returnText.value.length, start + lastLen), lastLen);
    scrollToEnd(true);
  }, ~~(1000 / UPDATE_PER_SECOND));
};
const doChat = async (regenerate?: boolean) => {
  // 等待答案响应中，生成文字与图片不冲突
  if (chating.value && isDrawImg.value) {
    if (inputText.value.indexOf('画一幅画') > -1) return ElMessage.warning('当前正在生成图片，请稍后再试～');
  }
  if (chating.value && !isDrawImg.value) {
    if (inputText.value.indexOf('画一幅画') < 0) return;
  }
  if (!regenerate) {
    if (inputText.value.trim() === '') return;
    if (inputText.value.length > 2000) return ElMessage.error('您的内容太长了，不要超出2000字哦~');
    if (inputText.value.indexOf('画一幅画') > -1 && inputText.value.trim().length < 6) {
      return ElMessage.warning('请输入您的绘画要求哦～');
    }
  }
  if (regenerate) {
    const lastOne = messageList.value[messageList.value.length - 1];
    messageListComponent.value.postVote({
      v: lastOne,
      idx: messageList.value.length - 1,
      vote: -1, mark: 1,
    });
  }
  // 自动改名
  if (activeConversation.value.title === '新对话' && messageList.value.length === 0) {
    newConversationName.value = myslice(inputText.value.trim());
    editConversation(activeConversation.value);
  }
  const content = regenerate ? messageList.value.at(-2).content : inputText.value;
  waitingForImgAnswer.value = content.includes('画一幅画');
  if (!regenerate) {
    inputText.value = '';
  }
  returnText.value = '';
  returnImage.value = '';
  if (regenerate) {
    messageList.value.length = messageList.value.length - 2;
  }
  messageList.value.push({
    content,
    role: 'user',
  });
  scrollToEnd();
  try {
    if (content.includes('画一幅画')) {
      const imgObj = {
        status: statusEnum.loading,
        role: 'assistant',
        content: '生成中...',
      };
      messageList.value.push(imgObj);
      isDrawImg.value = true;
      await streamChatImg(content, regenerate, imgObj);
    } else {
      const textObj = {
        status: statusEnum.loading,
        role: 'assistant',
        content: '回答中...',
      };
      messageList.value.push(textObj);
      await streamChat(content, regenerate, textObj);
    }
  } catch (e) {
    console.log({ e });
    ElMessage.error('出错了，请刷新页面或稍后重试');
  }
  if (content.includes('画一幅画')) {
    waitingForImgAnswer.value = false;
  } else {
    waitingForAnswer.value = false;
  }
  if (activeConversationId.value === emptyConversationId.value && !regenerate) {
    conversationList.value[0].messageCount = (conversationList.value[0].messageCount || 0) + 2;
  }
};
const setReadyToShare = () => {
  readyToShare.value = false;
};
const copyLink = () => {
  const checkedList = messageListComponent.value.checkedList;
  createShare(activeConversationId.value as string, checkedList);
};
const handleShare = () => {
  quickGetConversationDetail(activeConversationId.value as string);
};
</script>

<style lang="scss" scoped>
.mtd-select-input {
  position: relative;
  top: 38px;
}
</style>
