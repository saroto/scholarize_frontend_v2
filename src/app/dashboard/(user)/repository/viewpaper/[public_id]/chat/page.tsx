"use client";
import { mockEachResearchPaper } from "@/constants/research";
import { Eachpaper } from "@/types";
import { Box } from "@mui/material";
import PDFViewer from "@/components/pdf/PdfViewer";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useRef, useState } from "react";

interface ViewPaperParams {
  public_id: string;
}

export default function ChatPage({ params }: { params: ViewPaperParams }) {
  const id = params.public_id;
  const [eachPaper, setEachPaper] = useState<Eachpaper>();

  // const eachPaper = mockEachResearchPaper;

  useEffect(() => {
    setEachPaper(mockEachResearchPaper);
  }),
    [];
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

  return (
    <PanelGroup direction="horizontal" id="group">
      {/* PDF Viewer Panel */}
      <Panel defaultSize={60} minSize={20} id="left-panel">
        <Box sx={{ height: "100%", display: "flex" }} ref={leftPanelRef}>
          {eachPaper ? (
            <PDFViewer
              title={eachPaper.paper_info.research_title}
              width={pdfWidth}
            />
          ) : null}
        </Box>
      </Panel>

      {/* Splitter (Draggable) */}
      <PanelResizeHandle
        id="resize-handle"
        style={{
          width: "2px",
          backgroundColor: "#ddd",
          cursor: "col-resize",
        }}
      />

      {/* Chat Panel */}
      <Panel defaultSize={40} minSize={20} id="right-panel">
        <Box sx={{ height: "100%", display: "flex" }}>Chat Box Here</Box>
      </Panel>
    </PanelGroup>
  );
}
