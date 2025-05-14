/** @format */

"use client";
import {
  Box,
  Divider,
  List,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Section, SectionList } from "./section_list";
import { useState } from "react";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ResearchRightSideBar from "./research_right_sidebar";
export default function DashboardLeftSideBar({
  sectionLists,
}: {
  sectionLists: SectionList[];
}) {
  const [select, setSelect] = useState<string>("");

  const Sections = sectionLists.map((sectionList, index) => {
    return (
      <>
        <Section
          selected={select}
          setSelected={setSelect}
          sectionList={sectionList}
          key={sectionList.title}
        />
        {index < sectionLists.length - 1 && <Divider />}
      </>
    );
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
          // width: "250px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* <List
            sx={{
              backgroundColor: !isSmallScreen ? "white" : "none",
              border: !isSmallScreen ? "1px solid " : "none",
              borderColor: !isSmallScreen ? "#ddd" : "none",
              borderRadius: "16px",
              paddingInline: "20px",
            }}
          >
            <HomeSection> {Sections}</HomeSection>
          </List> */}
          <List
            sx={{
              backgroundColor: !isSmallScreen ? "white" : "none",
              border: !isSmallScreen ? "1px solid " : "none",
              borderColor: !isSmallScreen ? "#ddd" : "none",
              borderRadius: "16px",
              paddingInline: "20px",
            }}
          >
            {" "}
            <ResearchRightSideBar />
          </List>
        </Box>

        {/* <Box
          sx={{
            display: "flex",
            color: "#3572EF",
            width: "100%",
          }}
        >
          <Button
            fullWidth
            sx={{
              paddingRight: "2rem",
              color: "#3572EF",

              ":hover": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              },
            }}
            href="/About-Scholarize"
          >
            <Box
              sx={{
                padding: "0.5rem",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <InfoIcon />
            </Box>
            About Scholarize
          </Button>
        </Box> */}
      </Box>
    </>
  );
}

export const HomeSection = ({ children }: { children: React.ReactNode }) => (
  <>
    <Typography
      variant="h5"
      sx={{
        textAlign: "center",
        fontWeight: "450",
        pt: "1.2rem",
        pb: "0.7rem",
        borderBottom: "1px solid #000",
      }}
    >
      Home
    </Typography>
    {children}
  </>
);
