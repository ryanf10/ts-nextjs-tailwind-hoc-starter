import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';

import { Chat } from '@/types/chat';

type ChatStoreType = {
  chatList: Array<Chat> | null;
  initChatList: (data: Array<Chat>) => void;
  activeChatId: string | null;
  setActiveChatId: (value: string | null) => void;
  reset: () => void;
};

const initialState = {
  chatList: null,
  activeChatId: null,
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
  setActiveChatId: (value) => {
    set(
      produce<ChatStoreType>((state) => {
        state.activeChatId = value;
      })
    );
  },
  reset: () => {
    set(initialState);
  },
}));
const useChatStore = createSelectorHooks(useChatStoreBase);

export default useChatStore;
