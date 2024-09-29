// // src/stores/StoreFetchFolder.ts
// import { create } from "zustand";

// interface FetchFolderState {
//   folder: string | null;
//   setFolder: (folder: string) => void;
// }

// export const useFetchFolderStore = create<FetchFolderState>((set) => ({
//   folder: null,
//   setFolder: (folder) => set({ folder }),
// }));

// src/stores/StoreFetchFolder.ts
import { create } from "zustand";

interface FetchFolderState {
  folder: number | null;
  setFolder: (folder: number) => void;
  selectedFolder: number | null;
  setSelectedFolder: (folder: number) => void;
}

export const useFetchFolderStore = create<FetchFolderState>((set) => ({
  folder: null,
  setFolder: (folder) => set({ folder }),
  selectedFolder: 116 as number | null,
  setSelectedFolder: (folder) => set({ selectedFolder: folder }),
}));
