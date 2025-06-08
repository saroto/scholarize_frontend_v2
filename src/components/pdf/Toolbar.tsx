import Box from "@mui/material/Box";
import {
  zoomPlugin,
  RenderZoomInProps,
  RenderZoomOutProps,
} from "@react-pdf-viewer/zoom";
import {
  pageNavigationPlugin,
  RenderGoToPageProps,
} from "@react-pdf-viewer/page-navigation";
import {
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLefIcon from "@mui/icons-material/ChevronLeft";
import { useEffect } from "react";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { printPlugin } from "@react-pdf-viewer/print";
import PrintIcon from "@mui/icons-material/Print";
import GetAppIcon from "@mui/icons-material/GetApp";
import { getFilePlugin } from "@react-pdf-viewer/get-file";

type ToolbarProps = {
  zoomPluginInstance: ReturnType<typeof zoomPlugin>;
  pageNavigationPluginInstance: ReturnType<typeof pageNavigationPlugin>;
  fullScreenPluginInstance: ReturnType<typeof fullScreenPlugin>;
  printPluginInstance?: ReturnType<typeof printPlugin>;
  getFilePluginInstance?: ReturnType<typeof getFilePlugin>;
  title?: string;
  isTtitleVisible?: boolean;
  pageNumber?: number;
  isChatPage?: boolean;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  zoomPluginInstance,
  pageNavigationPluginInstance,
  fullScreenPluginInstance,
  printPluginInstance,
  getFilePluginInstance,
  title,
  isTtitleVisible = true,
  pageNumber,
  isChatPage = false,
}) => {
  const { ZoomInButton, ZoomOutButton, ZoomPopover, ZoomIn, ZoomOut } =
    zoomPluginInstance;
  const {
    CurrentPageInput,
    NumberOfPages,
    CurrentPageLabel,
    GoToPreviousPage,
    GoToNextPage,
    jumpToPage,
  } = pageNavigationPluginInstance;
  const { EnterFullScreen } = fullScreenPluginInstance;
  const { Print } = printPluginInstance || {};
  const { Download } = getFilePluginInstance || {};

  useEffect(() => {
    if (typeof pageNumber === "number" && Number.isInteger(pageNumber)) {
      // PDF pages are 0-based index, so subtract 1
      jumpToPage(pageNumber - 1);
    }
  }, [pageNumber]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "0.5rem",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: "0.5rem",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {!isSmallScreen && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {" "}
            <ZoomOut>
              {(props: RenderZoomOutProps) => (
                <IconButton sx={zoomDisplayStyle} onClick={props.onClick}>
                  <ZoomOutIcon />
                </IconButton>
              )}
            </ZoomOut>
            <Box sx={DisplayZoomLevel}>
              <ZoomPopover />
            </Box>
            <ZoomIn>
              {(props: RenderZoomInProps) => (
                <IconButton sx={zoomDisplayStyle} onClick={props.onClick}>
                  <ZoomInIcon />
                </IconButton>
              )}
            </ZoomIn>
            <EnterFullScreen>
              {(props: { onClick: () => void }) => (
                <IconButton sx={buttonStyle} onClick={props.onClick}>
                  <FullscreenIcon />
                </IconButton>
              )}
            </EnterFullScreen>
            <Divider sx={dividerStyle} />
          </Box>
        )}

        <Box sx={groupStyle}>
          <GoToPreviousPage>
            {(props: RenderGoToPageProps) => (
              <IconButton
                disabled={props.isDisabled}
                onClick={props.onClick}
                sx={buttonStyle}
              >
                <ChevronLefIcon />
              </IconButton>
            )}
          </GoToPreviousPage>
          <CurrentPageInput />

          <Box sx={textStyle}>
            <Typography> of </Typography>
            <NumberOfPages />
            <GoToNextPage>
              {(props: RenderGoToPageProps) => (
                <IconButton
                  disabled={props.isDisabled}
                  onClick={props.onClick}
                  sx={buttonStyle}
                >
                  <ChevronRightIcon />
                </IconButton>
              )}
            </GoToNextPage>
          </Box>
          {!isChatPage && !isSmallScreen && (
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Divider sx={dividerStyle} />
              {Print && (
                <Print>
                  {(props: { onClick: () => void }) => (
                    <IconButton sx={buttonStyle} onClick={props.onClick}>
                      <PrintIcon />
                    </IconButton>
                  )}
                </Print>
              )}
              {Download && (
                <Download>
                  {(props: { onClick: () => void }) => (
                    <IconButton sx={buttonStyle} onClick={props.onClick}>
                      <GetAppIcon />
                    </IconButton>
                  )}
                </Download>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {isTtitleVisible
        ? !isSmallScreen && (
            <Typography
              sx={{
                fontSize: "12px",
                color: "#6c757d",
                fontWeight: "400",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
              }}
            >
              {title ? title + ".pdf" : "PDF Viewer"}
            </Typography>
          )
        : null}
    </Box>
  );
};

const buttonStyle = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #e9ecef",
  borderRadius: "6px",
  color: "#495057",
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease",
};

const DisplayZoomLevel = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #e9ecef",
  borderRadius: "6px",
  color: "#495057",
  width: "fit-content",
  height: "fit-content",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease",
};

const zoomDisplayStyle = {
  ...buttonStyle,
  width: "40px",
  fontSize: "13px",
  fontWeight: "500",
};

const groupStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "4px",
};

const textStyle = {
  fontSize: "14px",
  color: "#6c757d",
  fontWeight: "500",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const dividerStyle = {
  width: "1px",
  height: "24px",
  backgroundColor: "#dee2e6",
  margin: "0 4px",
};
