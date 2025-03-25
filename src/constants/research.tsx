import { ResearchPaper } from "@/types";

export const mockResearchPapers: ResearchPaper = {
  research_paper_id: 1,
  public_id: "RP-2025-001",
  research_title: "Advancements in Quantum Computing Algorithms",
  departments: [
    {
      department_id: 1,
      department_name: "Computer Science",
      department_tag: "CS",
      department_color: "#EF4444",
      department_status: true,
    },
    {
      department_id: 2,
      department_name: "Physics",
      department_tag: "PHY",
      department_color: "#0F9D58",
      department_status: true,
    },
  ],
  pdf_path: "/research/quantum-computing-2025.pdf",
  fullText:
    "This paper explores novel quantum computing algorithms and their applications...",
  research_type: {
    ResearchTypeID: 1,
    ResearchTypeName: "Experimental",
    ResearchTypeStatus: true,
  },
  author: "Dr. Jane Smith",
  published_at: "2025-03-15",
  abstract:
    "In pursuing a bachelor's degree, undergraduate students must fulfill the requirements depending on their major, university, and country. At Paragon International University, completing a bachelor’s degree in the ICT faculty requires students to conduct an academic research project as a crucial component in their final year. In conducting the research, senior students encounter challenges such as difficulty finding topics, mismatched interests with the advisor, and managing research tasks.",
  user_id: 101,
};
