import { create } from "zustand";
interface ResearchPaperIdState {
  research_paper_id: number;
  setResearchPaperId: (research_paper_id: number) => void;
}

export const useResearchPaperIdStore = create<ResearchPaperIdState>((set) => ({
  research_paper_id: Number(localStorage.getItem("research_paper_id")) || 0,
  setResearchPaperId: (research_paper_id) => {
    localStorage.setItem("research_paper_id", research_paper_id.toString());
    set({ research_paper_id });
  },
}));
