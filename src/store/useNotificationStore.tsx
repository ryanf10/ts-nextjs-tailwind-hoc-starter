import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import produce from 'immer';
import { create } from 'zustand';

import { Notification } from '@/types/notification';

type NotificationStoreType = {
  notifications: Array<Notification> | null;
  init: (data: Array<Notification>) => void;
  addOne: (data: Notification) => void;
};

const useNotificationsBase = create<NotificationStoreType>((set) => ({
  notifications: null,
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
}));

const useNotifications = createSelectorHooks(useNotificationsBase);

export default useNotifications;
