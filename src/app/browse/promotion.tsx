import { Box, Button, Container, Typography } from "@mui/material";
import CustomButton from "@/components/customButton";
import VideoFrame from "@/components/VideoFrame";
import { useRouter } from "next/navigation";
interface PromotionProps {
  open: boolean;
  setIsOpen(value: boolean): void;
}
export default function Promotion({ open, setIsOpen }: PromotionProps) {
  const router = useRouter();
  const youtubeSrc =
    "https://www.youtube.com/embed/K27diMbCsuw?si=8IeU36V7y6RmhaQl";
  return (
    <Container
      sx={{
        backgroundColor: "secondary.main",
        borderRadius: "16px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          Try Chat With Document
        </Typography>

        <VideoFrame src={youtubeSrc} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <CustomButton
          fullWidth
          onClick={() => {
            router.push("/repository");
          }}
        >
          Try Now
        </CustomButton>
        <CustomButton
          fullWidth
          onClick={() => {
            setIsOpen(false);
          }}
          sx={{
            backgroundColor: "secondary.main",
            color: "text.primary",
            border: "1px solid",
            borderColor: "text.disabled",
            "&:hover": {
              backgroundColor: "text.disabled",
              opacity: 0.8,
            },
          }}
        >
          No thanks
        </CustomButton>
      </Box>
    </Container>
  );
}
