"use client";
import { Eachpaper } from "@/types";
import { Box, Container, IconButton, Typography } from "@mui/material";
import PDFViewer from "@/components/pdf/PDFViewer";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ZoomPDF from "@/components/pdf/ZoomPDF";
import { ReactZoomPanPinchRef, useControls } from "react-zoom-pan-pinch";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Control from "@/components/pdf/Control";
import React from "react";
interface ViewPaperParams {
  public_id: string;
}

export default function PDFPage({ params }: { params: ViewPaperParams }) {
  const id = params.public_id;
  // const [eachPaper, setEachPaper] = useState<Eachpaper>();
  const searchParam = useSearchParams();
  const transformerRef = React.useRef<ReactZoomPanPinchRef>(null);

  const paperURL = `${process.env.NEXT_PUBLIC_CDN_URL}/api/view-pdf/${id}`;
  const paperTitle = searchParam?.get("title") ?? "No Title Found";

  console.log("paperURL", paperURL);
  const [pageNumber, setPageNumber] = useState<number | null>(1);
  // const { pageNumber: pageNumberChat, setPageNumber: setPageNumberChat } =
  //   usePageStore();
  const [numPages, setNumPages] = useState<number | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
        // backgroundColor: "black",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          sx={{
            paddingInline: "none",
            marginIn: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
            }}
          >
            {paperTitle + ".pdf"}
          </Typography>
        </Container>
        <Control
          transformerRef={transformerRef}
          pageRefs={pageRefs}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          // setPageNumberChat={setPageNumberChat}
          numPages={numPages}
        />
        <ZoomPDF
          ref={transformerRef}
          onZoomScaleChange={(scale) => {
            console.log("Zoom scale changed:", scale);
          }}
        >
          <PDFViewer
            title={paperTitle}
            url={paperURL}
            numPages={numPages}
            setNumPages={setNumPages}
            pageRefs={pageRefs}
          />
        </ZoomPDF>
      </Box>
    </Box>
  );
}
