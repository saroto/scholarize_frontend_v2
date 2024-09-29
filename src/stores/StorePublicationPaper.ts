import { create } from "zustand";
import { publicResearchPaper } from "@/types";
interface PublicationPaperState {
  publicePaper: publicResearchPaper | null;
  setpublicePaper: (publicePaper: publicResearchPaper) => void;
}

export const usePublicationPaperStore = create<PublicationPaperState>(
  (set) => ({
    publicePaper: null,
    setpublicePaper: (publicePaper) => set({ publicePaper }),
  })
);
