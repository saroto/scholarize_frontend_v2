"use client";
import { mockEachResearchPaper } from "@/constants/research";
import { Eachpaper } from "@/types";
import { Box } from "@mui/material";
import PDFViewer from "@/components/pdf/PdfViewer";
import { useEffect, useState } from "react";

interface ViewPaperParams {
  public_id: string;
}

export default function PDFPage({ params }: { params: ViewPaperParams }) {
  const id = params.public_id;
  const [eachPaper, setEachPaper] = useState<Eachpaper>();

  // const eachPaper = mockEachResearchPaper;

  useEffect(() => {
    setEachPaper(mockEachResearchPaper);
  }),
    [];

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        // backgroundColor: "black",
      }}
    >
      {eachPaper ? (
        <PDFViewer title={eachPaper.paper_info.research_title} />
      ) : null}
    </Box>
  );
}
