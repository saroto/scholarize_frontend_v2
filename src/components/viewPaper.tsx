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
    <div className="flex justify-center pb-3">
      <Box
        sx={{
          border: "2px solid #e0e0e0",
          borderRadius: 5,
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <Grid container sx={{ padding: 5 }} spacing={3}>
          <Grid item container>
            {viewPaper?.paper?.departments?.map((department) => (
              <Chip
                label={department.department_tag}
                size="medium"
                sx={{
                  marginRight: 1,
                  display: "flex",
                  backgroundColor: department.department_color,
                  color: "#fff",
                  fontSize: "1.2rem",
                  my: 0.5,
                }}
                key={department.department_id}
              ></Chip>
            ))}
          </Grid>

          <Grid item container xs={12}>
            <Box width={"100%"}>
              <Typography
                variant="h4"
                key={viewPaper?.paper.research_paper_id}
                fontWeight={"bold"}
                color={"#2F2F85"}
                sx={{
                  textTransform: "capitalize",
                  textWrap: "wrap",
                  wordWrap: "break-word",
                }}
              >
                {viewPaper?.paper.research_title}
              </Typography>
            </Box>
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
            <Box display={"flex"} sx={{ justifyContent: "center" }}>
              <ArticleIcon sx={{ display: "flex" }} />
              <Typography
                sx={{
                  marginLeft: 0.7,
                  fontSize: "1.1rem",
                  fontWeight: "550",
                }}
              >
                {viewPaper?.paper.research_type.ResearchTypeName}
              </Typography>
            </Box>
          </Grid>
          <Grid item container>
            <Box display={"flex"}>
              <PermIdentityIcon sx={{ display: "flex" }} />
              <Typography
                sx={{
                  marginLeft: 0.7,
                  fontSize: "1.1rem",
                  // fontStyle: "italic",
                }}
              >
                {viewPaper?.paper.author}
              </Typography>
            </Box>
          </Grid>
          <Grid item container>
            <Box display={"flex"}>
              <CalendarMonthIcon sx={{ display: "flex" }} />
              <Typography sx={{ marginLeft: 0.7, fontSize: "1.1rem" }}>
                {viewPaper?.paper.published_at}
              </Typography>
            </Box>
          </Grid>
          {viewPaper?.paperInfo.Advisor !== "None" && (
            <Grid item container>
              <Box component="span" mr={1}>
                <Typography sx={{ fontWeight: "bold" }}>Advisor: </Typography>
              </Box>
              <Typography sx={{ fontSize: "1.1rem" }}>
                {/* <span className="font-bold">Advisor: </span> */}
                {viewPaper?.paperInfo.Advisor}
              </Typography>
            </Grid>
          )}

          <Grid item container>
            <Box component="span" mr={1}>
              <Typography sx={{ fontWeight: "bold" }}>Keyword: </Typography>
            </Box>
            <Typography sx={{ fontSize: "1.1rem" }}>
              {/* <span className="font-bold">Tag: </span> */}
              {viewPaper?.paperInfo.Tag}
            </Typography>
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

          <Grid item container mt="1rem">
            <Box width={"100%"}>
              <Typography variant="h4" mb="1rem">
                Abstract
              </Typography>
              <Typography variant="body1">
                {viewPaper?.paper.abstract}
              </Typography>
            </Box>
          </Grid>

          <Grid item container>
            {/* <Box width={"100%"}>
                  <Divider />
                </Box> */}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
