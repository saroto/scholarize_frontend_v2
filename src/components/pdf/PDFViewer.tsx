"use client";

import { Box } from "@mui/material";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import usePageStore from "@/stores/StorePageNumber";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./pdf.css";
import {
  zoomPlugin as realZoomPlugin,
  RenderZoomInProps,
} from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin as realPageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { Toolbar } from "./Toolbar";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import { printPlugin } from "@react-pdf-viewer/print";
import { getFilePlugin } from "@react-pdf-viewer/get-file";
import "@react-pdf-viewer/print/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";

export function zoomPlugin() {
  return realZoomPlugin();
}

export function pageNavigationPlugin() {
  return realPageNavigationPlugin();
}

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PDFViewerProps {
  url?: string;
  width?: number | string;
  title?: string;
  isTitleVisible?: boolean;
  isChatPage?: boolean;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  width,
  title,
  isTitleVisible,
  isChatPage = false,
}) => {
  const { pageNumber: pageNumberChat, setPageNumber: setPageNumberChat } =
    usePageStore();

  ("https://tomato-occasional-reptile-365.mypinata.cloud/ipfs/bafybeicrwkcuhyibpnbzadvjw46tl7s5pl5k5rbf4iaega4x3odats642m");

  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();
  const printPluginInstance = printPlugin();
  const getFilePluginInstance = getFilePlugin({
    fileNameGenerator: (file) => {
      return title ? `${title}.pdf` : "document.pdf";
    },
  });

  return (
    <Box sx={{ height: "100vh", justifyContent: "center", width: "100%" }}>
      <Box
        sx={{
          height: "90%",
          width: "100%",
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #ddd",
          overflow: "hidden",
        }}
      >
        <Toolbar
          zoomPluginInstance={zoomPluginInstance}
          pageNavigationPluginInstance={pageNavigationPluginInstance}
          fullScreenPluginInstance={fullScreenPluginInstance}
          printPluginInstance={printPluginInstance}
          getFilePluginInstance={getFilePluginInstance}
          title={title}
          isTtitleVisible={isTitleVisible}
          isChatPage={isChatPage}
          pageNumber={pageNumberChat ?? 0}
        />
        <Box sx={{ height: "100%", overflow: "auto", width: "100%" }}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
            <Viewer
              fileUrl={url ?? ""}
              plugins={[
                zoomPluginInstance,
                pageNavigationPluginInstance,
                fullScreenPluginInstance,
                printPluginInstance,
                getFilePluginInstance,
              ]}
              defaultScale={SpecialZoomLevel.PageFit}
            />
          </Worker>
        </Box>
      </Box>
    </Box>
  );
};

export default PDFViewer;
