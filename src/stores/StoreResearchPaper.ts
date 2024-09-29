import { create } from "zustand";
import { ResearchPaper } from "@/types";
interface ResearchPaperState {
  papers: ResearchPaper[];
  setPapers: (papers: ResearchPaper[]) => void;
}

export const useResearchPaperStore = create<ResearchPaperState>((set) => ({
  papers: [],
  setPapers: (papers) => set({ papers }),
}));
