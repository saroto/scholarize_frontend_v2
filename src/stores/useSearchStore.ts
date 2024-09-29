import { create } from "zustand";
import { SearchOptions } from "@/types";

// Define the store's state including actions
interface SearchStoreState {
  filters: SearchOptions;
  updateFilters: (updates: Partial<SearchOptions>) => void;
  resetFilters: () => void;
}

// Create the store with typed actions
const useSearchStore = create<SearchStoreState>((set) => ({
  filters: {
    search: "",
    sort: "ASC",
    department: [],
    year: [],
    research_type: [],
  },
  updateFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates },
    })),
  resetFilters: () =>
    set({
      filters: {
        search: "",
        sort: "ASC",
        department: [],
        year: [],
        research_type: [],
      },
    }),
}));

export default useSearchStore;
