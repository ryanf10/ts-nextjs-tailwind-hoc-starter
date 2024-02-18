import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';

import { Chat } from '@/types/chat';

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
  reset: () => void;
};

const initialState = {
  notifying: true,
  chatList: null,
  activeChat: null,
  newChat: null,
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
  reset: () => {
    set(initialState);
  },
}));
const useChatStore = createSelectorHooks(useChatStoreBase);

export default useChatStore;
