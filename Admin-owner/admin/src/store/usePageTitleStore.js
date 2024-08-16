import create from 'zustand';

const usePageTitleStore = create((set) => ({
    pageTitle: '',
    setPageTitle: (title) => set({ pageTitle: title }),
}));

export default usePageTitleStore;