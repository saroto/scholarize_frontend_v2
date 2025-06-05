"use client";

import { Document, Page } from "react-pdf";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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
import usePageStore from "@/stores/StorePageNumber";

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
  const { pageNumber: pageNumberChat, setPageNumber: setPageNumberChat } =
    usePageStore();
  const [pageNumber, setPageNumber] = useState<number | null>(1);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isError, setIsError] = useState<boolean>(false);

  console.log("zoom", zoom);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const defaultFileUrl =
    "https://tomato-occasional-reptile-365.mypinata.cloud/ipfs/bafybeicrwkcuhyibpnbzadvjw46tl7s5pl5k5rbf4iaega4x3odats642m";

  useEffect(() => {
    setFileUrl(url || defaultFileUrl);
  }, [url]);

  useEffect(() => {
    if (pageNumberChat !== null) {
      setPageNumber(pageNumberChat); // Set into local state
      // Scroll to page
      if (pageRefs.current[pageNumberChat - 1]) {
        pageRefs.current[pageNumberChat - 1]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [pageNumberChat]);

  console.log("file ur", fileUrl);
  const handleZoom = (factor: number, reset: boolean = false) => {
    setZoom((prevZoom) =>
      reset ? 1 : Math.max(0.5, Math.min(prevZoom + factor, 3))
    );
  };

  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPageNumberChat(null);

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

  useEffect(() => {
    if (pageNumber !== null && pageRefs.current[pageNumber - 1]) {
      pageRefs.current[pageNumber - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [pageNumber]);
  let calculatedWidth;

  if (typeof width === "number") {
    // If 'width' is passed as a number, apply zoom and ensure it's not greater than 500
    calculatedWidth = Math.min(width, 500);
  } else if (isSmallScreen) {
    // If it's a small screen and width is not passed, apply the zoom with a base of 350px
    calculatedWidth = 350 * zoom;
  } else {
    // If it's not a small screen and width is not passed, apply the zoom with a base of 500px
    calculatedWidth = 500 * zoom;
  }

  console.log("page number", zoom);
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
        {isError === false && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              paddingBottom: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                borderRadius: "8px",
                border: "1px solid ",
                borderColor: "#ddd",
                backgroundColor: "background.paper",
              }}
            >
              {/* Zoom Out Button */}
              <IconButton size="small" onClick={() => handleZoom(-0.2)}>
                <RemoveIcon fontSize="small" />
              </IconButton>
              {/* reset Button */}
              <IconButton size="small" onClick={() => handleZoom(-0.2, true)}>
                <RestartAltIcon fontSize="small" />
              </IconButton>
              {/* Zoom In Button */}
              <IconButton size="small" onClick={() => handleZoom(0.2)}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            {/* Manual Page Input */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {" "}
              <TextField
                type="text"
                value={pageNumber}
                onChange={handlePageChange}
                sx={{
                  borderColor: "#ddd",
                  width: 50,
                  height: 30,
                  "& .MuiInputBase-root": {
                    height: 30,
                    fontSize: "0.83rem",
                    padding: "0 8px",
                    fontWeight: 500,
                  },
                  "& .MuiOutlinedInput-input": {
                    textAlign: "center",
                    padding: "5px",
                  },
                }}
                inputProps={{ maxLength: 3 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                {" / " + numPages}
              </Typography>
            </Box>
          </Box>
        )}
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
        <Document
          file={fileUrl}
          loading={<PDFSkeleton />}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
          }}
          onLoadError={() => {
            setIsError(true);
          }}
          error={<PDFNotFound />}
          // options={{
          //   // Optimize for mobile
          //   cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
          //   cMapPacked: true,
          //   standardFontDataUrl:
          //     "https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/",
          //   // Reduce memory usage
          //   disableAutoFetch: true,
          //   disableStream: true,
          // }}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Box
              key={index}
              ref={(el) => {
                pageRefs.current[index] = el as HTMLDivElement | null;
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBlock: "10px",
                width: "100%",
                boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.1)",
                // opacity: pageNumber === index + 1 ? 1 : 0.5,
              }}
            >
              <Page
                loading={
                  <Skeleton
                    variant="rectangular"
                    height={20}
                    sx={{
                      minWidth: isSmallScreen ? "380px" : "500px",
                    }}
                  />
                }
                pageNumber={index + 1}
                width={calculatedWidth}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                //   className="pdf-page"
              />
            </Box>
          ))}
        </Document>
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
