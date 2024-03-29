import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';

import { Notification } from '@/types/notification';

type NotificationStoreType = {
  notifying: boolean;
  setNotifying: (value: boolean) => void;
  notifications: Array<Notification> | null;
  init: (data: Array<Notification>) => void;
  addOne: (data: Notification) => void;
  reset: () => void;
};

const initialState = {
  notifying: true,
  notifications: null,
};

const useNotificationsBase = create<NotificationStoreType>((set) => ({
  ...initialState,
  init: (data) => {
    set(
      produce<NotificationStoreType>((state) => {
        state.notifications = data;
      })
    );
  },
  addOne: (data) => {
    set(
      produce<NotificationStoreType>((state) => {
        if (state.notifications) {
          state.notifications.unshift(data);
        }
      })
    );
  },
  setNotifying: (value) => {
    set(
      produce<NotificationStoreType>((state) => {
        state.notifying = value;
      })
    );
  },
  reset: () => {
    set(initialState);
  },
}));

const useNotifications = createSelectorHooks(useNotificationsBase);

export default useNotifications;
