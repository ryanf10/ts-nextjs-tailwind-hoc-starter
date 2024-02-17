import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';

import { Chat } from '@/types/chat';

type ChatStoreType = {
  chatList: Array<Chat> | null;
  initChatList: (data: Array<Chat>) => void;
  reset: () => void;
};

const initialState = {
  chatList: null,
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
  reset: () => {
    set(initialState);
  },
}));
const useChatStore = createSelectorHooks(useChatStoreBase);

export default useChatStore;
