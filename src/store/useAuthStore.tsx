import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { produce } from 'immer';
import { create } from 'zustand';

import { callLogout } from '@/lib/api/auth/logout';
import { deleteCookie } from '@/lib/cookie';

import { Role } from '@/types/role';
import { AuthUser } from '@/types/user';

type AuthStoreType = {
  user: AuthUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, preferedRole?: Role) => void;
  logout: () => void;
  stopLoading: () => void;
  switchRole: (role: Role) => void;
};

const useAuthStoreBase = create<AuthStoreType>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user, preferedRole) => {
    let tempRole = user.roles[0];
    if (preferedRole) {
      const roleItem = user.roles.find((item) => item == preferedRole);
      if (roleItem) {
        tempRole = roleItem;
      }
    }
    localStorage.setItem('role', tempRole.id);
    set(
      produce<AuthStoreType>((state) => {
        state.isAuthenticated = true;
        state.user = user;
        state.role = tempRole;
      })
    );
  },
  logout: async () => {
    await deleteCookie(['refresh_token', 'access_token']);
    await callLogout();
    localStorage.removeItem('role');
    set(
      produce<AuthStoreType>((state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      })
    );
  },
  stopLoading: () => {
    set(
      produce<AuthStoreType>((state) => {
        state.isLoading = false;
      })
    );
  },
  switchRole: (role) => {
    localStorage.setItem('role', role.id);
    set(
      produce<AuthStoreType>((state) => {
        state.role = role;
      })
    );
  },
}));

const useAuthStore = createSelectorHooks(useAuthStoreBase);

export default useAuthStore;
