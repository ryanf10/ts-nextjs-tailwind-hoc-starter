import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';

import { Chat } from '@/types/chat';
import { ChatMessage } from '@/types/chat-message';

type ChatStoreType = {
  notifying: boolean;
  setNotifying: (value: boolean) => void;
  chatList: Array<Chat & { isNewChat?: boolean }> | null;
  initChatList: (data: Array<Chat>) => void;
  activeChat: (Chat & { isNewChat?: boolean }) | null;
  setActiveChat: (value: Chat | null) => void;
  newChat: (Chat & { isNewChat?: boolean }) | null;
  setNewChat: (value: (Chat & { isNewChat?: boolean }) | null) => void;
  removeAndSaveNewChat: (newChatData: Chat & { isNewChat?: boolean }) => void;
  addOneChatFromSocket: (newChatData: Chat & { isNewChat?: boolean }) => void;
  newChatMessageFromSocket: Array<ChatMessage>;
  addOneNewChatMessageFromSocket: (data: ChatMessage) => void;
  reset: () => void;
};

const initialState = {
  notifying: true,
  chatList: null,
  activeChat: null,
  newChat: null,
  newChatMessageFromSocket: [],
};

const useChatStoreBase = create<ChatStoreType>((set) => ({
  ...initialState,
  initChatList: (data) => {
    set(
      produce<ChatStoreType>((state) => {
        state.chatList = data;
      })
    );
  },
  setNewChat: (value) => {
    set(
      produce<ChatStoreType>((state) => {
        if (state.chatList) {
          if (value && !state.newChat) {
            state.chatList.unshift(value);
          } else if (value && state.newChat) {
            state.chatList = [
              value,
              ...state.chatList.filter((item) => item.id != state.newChat?.id),
            ];
          } else if (!value && state.newChat) {
            state.chatList = state.chatList.filter(
              (item) => item.id != state.newChat?.id
            );
          }
          state.newChat = value;
        }
      })
    );
  },
  removeAndSaveNewChat: (newChatData) => {
    set(
      produce<ChatStoreType>((state) => {
        if (state.chatList && state.newChat) {
          state.chatList = state.chatList.filter(
            (item) => item.id != state.newChat?.id
          );
          state.chatList.unshift(newChatData);
          state.newChat = null;
        }
      })
    );
  },
  addOneChatFromSocket: (newChatData) => {
    set(
      produce<ChatStoreType>((state) => {
        if (state.newChat) {
          if (
            (state.newChat.user1.id == newChatData.user1.id &&
              state.newChat.user2.id == newChatData.user2.id) ||
            (state.newChat.user1.id == newChatData.user2.id &&
              state.newChat.user2.id == newChatData.user1.id)
          ) {
            if (state.chatList) {
              state.chatList = state.chatList.filter(
                (chat) => chat.id !== state.newChat?.id
              );
            }
            state.newChat = null;
            state.activeChat = newChatData;
          }
        }
        if (state.chatList) {
          state.chatList = state.chatList.filter(
            (item) => item.id != newChatData.id
          );
          state.chatList.unshift(newChatData);
        }
      })
    );
  },
  setActiveChat: (value) => {
    set(
      produce<ChatStoreType>((state) => {
        state.activeChat = value;
      })
    );
  },
  setNotifying: (value) => {
    set(
      produce<ChatStoreType>((state) => {
        state.notifying = value;
      })
    );
  },
  addOneNewChatMessageFromSocket: (data) => {
    set(
      produce<ChatStoreType>((state) => {
        state.newChatMessageFromSocket.push(data);
      })
    );
  },
  reset: () => {
    set(initialState);
  },
}));
const useChatStore = createSelectorHooks(useChatStoreBase);

export default useChatStore;
