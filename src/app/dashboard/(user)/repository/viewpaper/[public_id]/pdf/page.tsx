"use client";
import { mockEachResearchPaper } from "@/constants/research";
import { Eachpaper } from "@/types";
import { Box } from "@mui/material";
import PDFViewer from "@/components/pdf/PDFViewer";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ViewPaperParams {
  public_id: string;
}

export default function PDFPage({ params }: { params: ViewPaperParams }) {
  const id = params.public_id;
  const [eachPaper, setEachPaper] = useState<Eachpaper>();
  const searchParam = useSearchParams();

  const paperURL = `${process.env.NEXT_PUBLIC_CDN_URL}/api/view-pdf/${id}`;
  const paperTitle = searchParam?.get("title") ?? "No Title Found";

  console.log("paperURL", paperURL);
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
      {eachPaper ? <PDFViewer title={paperTitle} url={paperURL} /> : null}
    </Box>
  );
}
