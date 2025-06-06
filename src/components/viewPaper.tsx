import { awaiting_paper, Eachpaper, submissionsHodPaper } from "@/types";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import DownloadButton from "./download-file";
import ArticleIcon from "@mui/icons-material/Article";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function ViewPaper({
  viewPaper,
}: {
  viewPaper: awaiting_paper | submissionsHodPaper;
}) {
  return (
    // <div className="flex justify-center pb-3">
    <Box
      sx={{
        width: "100%",
        display: "flex",
        height: "100%",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Grid item xs={12}>
        <Box
          width={"100%"}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography
            variant="h4"
            key={viewPaper?.paper?.research_paper_id}
            fontWeight={"bold"}
            sx={{
              textTransform: "capitalize",
              textWrap: "wrap",
              wordWrap: "break-word",
            }}
          >
            {viewPaper?.paper?.research_title}
          </Typography>
          {viewPaper?.paper?.departments?.map((department) => (
            <Chip
              label={department?.department_tag}
              size="small"
              sx={{
                marginRight: 1,
                display: "flex",
                backgroundColor: department.department_color,
                color: "#fff",
                my: 0.5,
                alignSelf: "flex-start",
              }}
              key={department?.department_id}
            />
          ))}
        </Box>
      </Grid>
      <Grid item container>
        <Stack
          direction="row"
          sx={{
            justifyContent: "center",
          }}
        >
          <Box
            width={"100%"}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={{ display: "flex" }}>
              {viewPaper && <DownloadButton submission={viewPaper} />}
            </Box>
          </Box>
        </Stack>
      </Grid>
      <Grid
        item
        container
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",

            width: "100%",
            gap: "10px",
          }}
        >
          <ArticleIcon sx={{ display: "flex" }} />
          <Typography variant="h5" sx={{ color: "text.secondary" }}>
            {viewPaper?.paper?.research_type.ResearchTypeName}
          </Typography>
        </Box>
      </Grid>
      <Grid item container>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: "10px",
          }}
        >
          <PermIdentityIcon sx={{ display: "flex" }} />
          <Typography variant="h5" sx={{ color: "text.secondary" }}>
            {viewPaper?.paper?.author}
          </Typography>
        </Box>
      </Grid>
      <Grid item container>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: "10px",
          }}
        >
          <CalendarMonthIcon sx={{ display: "flex" }} />
          <Typography variant="h5" sx={{ color: "text.secondary" }}>
            {viewPaper?.paper?.published_at}
          </Typography>
        </Box>
      </Grid>
      {viewPaper?.paperInfo?.Advisor !== "None" && (
        <Grid item container>
          <Box component="span" mr={1}>
            <Typography
              variant="h5"
              sx={{ color: "text.primary", fontWeight: 500 }}
            >
              Advisor:{" "}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: "text.secondary" }}>
            {/* <span className="font-bold">Advisor: </span> */}
            {viewPaper?.paperInfo?.Advisor}
          </Typography>
        </Grid>
      )}

      <Grid item container>
        <Box component="span" mr={1}>
          <Typography
            variant="h5"
            sx={{ color: "text.primary", fontWeight: 500 }}
          >
            Keyword:{" "}
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ color: "text.secondary" }}>
          {/* <span className="font-bold">Tag: </span> */}
          {viewPaper?.paperInfo?.Tag}
        </Typography>
      </Grid>

      <Grid item container mt="1rem">
        <Box
          width={"100%"}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
            }}
          >
            Abstract
          </Typography>
          <Typography variant="h5">{viewPaper?.paper?.abstract}</Typography>
        </Box>
      </Grid>

      <Grid item container>
        {/* <Box width={"100%"}>
                  <Divider />
                </Box> */}
      </Grid>
    </Box>
    // </div>
  );
}
