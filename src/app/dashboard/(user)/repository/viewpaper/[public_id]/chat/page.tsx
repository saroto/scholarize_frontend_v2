"use client";
import { Eachpaper } from "@/types";
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useRef, useState } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import { useSearchParams } from "next/navigation";
import PDFViewer from "@/components/pdf/PDFViewer";
import { useSession } from "next-auth/react";
import usePageStore from "@/stores/StorePageNumber";
import ZoomPDF from "@/components/pdf/ZoomPDF";
import Control from "@/components/pdf/Control";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import React from "react";

interface ViewPaperParams {
  public_id: string;
}

export default function ChatPage({ params }: { params: ViewPaperParams }) {
  const id = params.public_id;
  const searchParam = useSearchParams();
  const paperURL = `${process.env.NEXT_PUBLIC_CDN_URL}/api/view-pdf/${id}`;
  const paperTitle = searchParam?.get("title") ?? "No Title Found";
  const sessionId = searchParam?.get("sessionId") ?? "No Session ID Found";
  console.log("sessionId", sessionId);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const transformerRef = React.useRef<ReactZoomPanPinchRef>(null);
  const [pdfWidth, setPdfWidth] = useState(0);
  console.log("paperURL", paperURL);
  const [pageNumber, setPageNumber] = useState<number | null>(1);
  const { pageNumber: pageNumberChat, setPageNumber: setPageNumberChat } =
    usePageStore();
  const [numPages, setNumPages] = useState<number | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!leftPanelRef.current) return;

    const updateWidth = () => {
      if (leftPanelRef.current) {
        setPdfWidth(leftPanelRef.current.offsetWidth);
      }
    };

    // Set initial width
    updateWidth();

    // Observe width changes
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(leftPanelRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  console.log("pdf ", pdfWidth);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <PanelGroup direction="horizontal" id="group">
      {/* PDF Viewer Panel */}
      {!isSmallScreen && (
        <Panel defaultSize={60} minSize={20} id="left-panel">
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
              pageNumberChat={pageNumberChat}
              setPageNumberChat={setPageNumberChat}
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
        </Panel>
      )}

      {/* Splitter (Draggable) */}
      {!isSmallScreen && (
        <PanelResizeHandle
          id="resize-handle"
          style={{
            width: "2px",
            backgroundColor: "#ddd",
            cursor: "col-resize",
          }}
        />
      )}

      {/* Chat Panel */}
      <Panel
        defaultSize={40}
        minSize={30}
        id="right-panel"
        style={{ width: "100%" }}
      >
        {/* <Box sx={{ height: "100%", display: "flex" }}>Chat Box Here</Box> */}
        <ChatContainer />
      </Panel>
    </PanelGroup>
  );
}
