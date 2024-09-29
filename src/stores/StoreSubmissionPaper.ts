import { create } from "zustand";
import { SubmissionPaper } from "@/types";
interface SubmissionPaperState {
  submissionPaper: SubmissionPaper | null;
  setSubmissionPaper: (papers: SubmissionPaper) => void;
}

export const useSubmissionPaperStore = create<SubmissionPaperState>((set) => ({
  submissionPaper: null,
  setSubmissionPaper: (submissionPaper) => set({ submissionPaper }),
}));
