/** @format */

"use client";
import { Box, Divider, List } from "@mui/material";
import { Section, SectionList } from "./section_list";
import { useState } from "react";
import { Button } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
export default function CollaborationGroupSidebar({
  sectionLists,
}: {
  sectionLists: SectionList[];
}) {
  const [select, setSelect] = useState<string>("");

  const Sections = sectionLists.map((sectionList, index) => {
    return (
      <Section
        selected={select}
        setSelected={setSelect}
        sectionList={sectionList}
        key={sectionList.title}
      />
    );
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Box>
          <List>{Sections}</List>
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
