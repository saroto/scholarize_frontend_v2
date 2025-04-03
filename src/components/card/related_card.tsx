import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

interface RelatedCard {
  title?: string;
  description?: string;
  link?: string;
}
export default function RelatedCard({ title, description, link }: RelatedCard) {
  return (
    <Card
      sx={{
        boxShadow: "none",
        width: "100%",
        backgroundColor: "transparent",
      }}
    >
      {/* <CardActionArea> */}
      <CardContent
        sx={{
          padding: 0,
          "&:last-child": {
            padding: 0,
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => (window.location.href = "https://your-link.com")}
        >
          {title}
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 300 }}>
          {description}
        </Typography>
      </CardContent>
      {/* </CardActionArea> */}
    </Card>
  );
}
