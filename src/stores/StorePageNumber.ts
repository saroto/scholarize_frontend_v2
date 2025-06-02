import { create } from "zustand";

type PageStore = {
  pageNumber: number | null; // page number can be null
  setPageNumber: (number: number | null) => void;
};

const usePageStore = create<PageStore>((set) => ({
  pageNumber: null, // default state is null
  setPageNumber: (number: number | null) => set({ pageNumber: number }),
}));

export default usePageStore;
