import create from 'zustand';

const useUserRoleStore = create((set) => ({
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),
}));

export default useUserRoleStore;