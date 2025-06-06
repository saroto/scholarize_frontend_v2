import { Box, CircularProgress, Skeleton } from "@mui/material";
import { memo, useState, useRef, useEffect } from "react";
import { Page } from "react-pdf";

// Memoized PDF Page - only re-renders when props actually change
interface LazyPDFPageProps {
  pageNumber: number;
  calculatedWidth: number;
  isSmallScreen: boolean;
  onPageVisible?: (pageNumber: number) => void;
  isZooming?: boolean;
  isNavigation?: boolean;
}

export const LazyPDFPage = memo<LazyPDFPageProps>(
  ({
    pageNumber,
    calculatedWidth,
    isSmallScreen,
    isZooming,
    onPageVisible,
    isNavigation = false,
  }) => {
    const [shouldLoad, setShouldLoad] = useState(isNavigation);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const pageRef = useRef<HTMLDivElement | null>(null);

    console.log("LazyPDFPage rendered for page:", shouldLoad);
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            onPageVisible?.(pageNumber);
          }
        },
        {
          rootMargin: "200px 0px",
          threshold: 0.1,
        }
      );

      if (pageRef.current) {
        observer.observe(pageRef.current);
      }

      return () => {
        if (pageRef.current) {
          observer.unobserve(pageRef.current);
        }
      };
    }, [pageNumber, onPageVisible]);

    // Show loading when zooming or page is loading
    const showLoading = isZooming || isPageLoading;

    return (
      <Box
        ref={pageRef}
        sx={{
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          width: "100%",
          justifyContent: "center",
          minHeight: shouldLoad ? "auto" : "600px",
          position: "relative",
          transition: "opacity 0.2s ease",
          opacity: isZooming ? 0.7 : 1,
        }}
      >
        {/* Loading overlay */}
        {showLoading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 10,
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}

        {shouldLoad ? (
          <Box
            sx={{
              boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.1)",
              marginBlockEnd: "10px",
            }}
          >
            <Page
              loading={<PageSkeleton isSmallScreen={isSmallScreen} />}
              pageNumber={pageNumber}
              width={calculatedWidth}
              renderTextLayer={!isZooming}
              renderAnnotationLayer={!isZooming}
              onLoadStart={() => setIsPageLoading(true)}
              onLoadSuccess={() => setIsPageLoading(false)}
              onLoadError={() => setIsPageLoading(false)}
            />
          </Box>
        ) : (
          <PageSkeleton isSmallScreen={isSmallScreen} />
        )}
      </Box>
    );
  }
);
// Separate memoized PDF Page component
interface MemoizedPDFPageProps {
  pageNumber: number;
  width: number;
  isSmallScreen: boolean;
}

// Memoized skeleton
const PageSkeleton = memo<{ isSmallScreen: boolean }>(({ isSmallScreen }) => (
  <Skeleton
    variant="rectangular"
    height={600}
    sx={{
      minWidth: isSmallScreen ? "380px" : "500px",
    }}
  />
));

const MemoizedPDFPage = memo<MemoizedPDFPageProps>(
  ({ pageNumber, width, isSmallScreen }) => {
    return (
      <Box
        sx={{
          backgroundColor: "transparent",
          boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.1)",
          marginBlockEnd: "10px",
        }}
      >
        {" "}
        <Page
          loading={<PageSkeleton isSmallScreen={isSmallScreen} />}
          pageNumber={pageNumber}
          width={width}
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      </Box>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison - only re-render if width changed significantly
    const widthDiff = Math.abs(prevProps.width - nextProps.width);
    console.log("Width diff:", widthDiff);

    const significantChange = widthDiff > 20; // Only re-render if width changed by more than 20px

    return (
      prevProps.pageNumber === nextProps.pageNumber &&
      prevProps.isSmallScreen === nextProps.isSmallScreen &&
      !significantChange
    );
  }
);
