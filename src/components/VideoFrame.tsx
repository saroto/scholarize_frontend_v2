import { Box } from "@mui/material";
interface VideoFrameProps {
  src?: string;
}
export default function VideoFrame({ src }: VideoFrameProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "900px",
        paddingBottom: "56.25%", // 16:9 aspect ratio (9/16 = 0.5625)
        height: 0,
        margin: "0 auto",
        marginBottom: "24px",
      }}
    >
      <iframe
        src={src}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "16px",
        }}
      />
    </Box>
  );
}
