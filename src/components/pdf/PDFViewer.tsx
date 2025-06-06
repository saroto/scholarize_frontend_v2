"use client";

import { Document, Page } from "react-pdf";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { pdfjs } from "react-pdf";
import {
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useZoomWithLoading, MinimalZoomControls } from "./Zoom";
import { LazyPDFPage } from "./LazyloadPage";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PDFViewerProps {
  url?: string;
  width?: number | string;
  title?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, width, title }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number | null>(0);
  const [inputValue, setInputValue] = useState<number | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  // const [zoom, setZoom] = useState<number>(1.0);
  const baseWidth = 500;
  const [isError, setIsError] = useState<boolean>(false);
  const { zoom, calculatedWidth, isZooming, zoomIn, zoomOut, resetZoom } =
    useZoomWithLoading(baseWidth);
  console.log("zoom", zoom);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const defaultFileUrl =
    "https://tomato-occasional-reptile-365.mypinata.cloud/ipfs/bafybeicrwkcuhyibpnbzadvjw46tl7s5pl5k5rbf4iaega4x3odats642m";

  useEffect(() => {
    setFileUrl(url || defaultFileUrl);
  }, [url]);

  console.log("file ur", fileUrl);

  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    console.log("handlePageChange value", value);
    // setPageNumberChat(null);

    // Allow empty input (when the user deletes the content)
    if (value === "") {
      setPageNumber(null);
      return;
    }

    // Convert to number and validate the page number
    const page = Number(value);
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
    }
  };

  // Handle Enter key press - this triggers navigation
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // navigateToPage();
    }
  };

  const [isNavigate, setIsNavigate] = useState(false);
  useEffect(() => {
    setIsNavigate(true);
    if (pageNumber !== null && pageRefs.current[pageNumber - 1]) {
      pageRefs.current[pageNumber - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [pageNumber]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
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
          {title + ".pdf"}
        </Typography>
        {/* Zoom Controls */}
        <MinimalZoomControls
          zoom={zoom}
          isZooming={isZooming}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetZoom={resetZoom}
          inputValue={pageNumber || null}
          handleInputChange={handlePageChange}
          onkeyPress={handleKeyPress}
          // navigate={navigateToPage}
          numPages={numPages || 1}
        />
      </Container>

      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        <Box>
          {/* PDF Document */}
          <Document
            file={fileUrl}
            onLoadError={() => {
              setIsError(true);
            }}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<PDFSkeleton />}
            error={<PDFNotFound />}
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Box
                key={index}
                ref={(el) => {
                  pageRefs.current[index] = el as HTMLDivElement | null;
                }}
              >
                <LazyPDFPage
                  key={index}
                  pageNumber={index + 1}
                  calculatedWidth={calculatedWidth}
                  isSmallScreen={isSmallScreen}
                  isZooming={isZooming}
                  isNavigation={isNavigate}
                />
              </Box>
            ))}
          </Document>
        </Box>
      </Box>
    </div>
  );
};

const PDFSkeleton = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        minWidth: isSmallScreen ? "380px" : "500px",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* Title */}
      <Skeleton variant="text" width="60%" height={40} />

      {/* Paragraph-like lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} variant="text" width={`${90 - i * 3}%`} height={20} />
      ))}

      {/* Large content block (e.g., PDF image/preview) */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={400}
        sx={{ borderRadius: 1 }}
      />
    </Box>
  );
};

const PDFNotFound = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 4,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "text.secondary",
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: 500,
        }}
      >
        PDF Not Found
      </Typography>
      <Typography variant="body1">
        We couldn't locate the PDF file. It may have been removed or the path is
        incorrect.
      </Typography>
    </Box>
  );
};

export default PDFViewer;
