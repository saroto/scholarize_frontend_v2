"use client";
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
  const searchParam = useSearchParams();

  const paperURL = `${process.env.NEXT_PUBLIC_CDN_URL}/api/view-pdf/${id}`;
  const paperTitle = searchParam?.get("title") ?? "No Title Found";

  return (
    <Box>
      <PDFViewer
        url={paperURL}
        title={paperTitle}
        isTitleVisible={true}
        isChatPage={false}
      />
    </Box>
  );
}
