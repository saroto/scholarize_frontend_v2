"use client";
import { Eachpaper } from "@/types";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useRef, useState } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import { useSearchParams } from "next/navigation";
import PDFViewer from "@/components/pdf/PDFViewer";
import { useSession } from "next-auth/react";

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
  const [pdfWidth, setPdfWidth] = useState(0);

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
          <Box sx={{ height: "100%", display: "flex" }} ref={leftPanelRef}>
            {/* <PDFViewer title={paperTitle} url={paperURL} width={pdfWidth} /> */}
            <PDFViewer title={paperTitle} url={paperURL} />
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
