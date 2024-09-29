/** @format */

// src/components/sidebar/schedule_left_sidebar.tsx
import React, { useState } from "react";
import {
  List,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Tooltip,
} from "@mui/material";
import { SectionList } from "./section_list";

export default function ScheduleLeftSideBar({
  collabList,
  onGroupToggle,
  selectedGroups,
}: {
  collabList: SectionList[];
  onGroupToggle: (id: string) => void;
  selectedGroups: string[];
}) {
  // Function to handle checkbox toggle
  const handleCheckboxChange = (id: string) => {
    onGroupToggle(id);
  };

  return (
    <List
      sx={{
        padding: 3,
        paddingTop: 3,
        height: "100%",
        maxWidth: "360px",
        textDecoration: "none",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          width: "100%",
          textAlign: "center",
          fontWeight: "550",
          marginBottom: 2,
        }}
      >
        COLLABORATION
      </Typography>
      <FormGroup>
        {collabList?.map((section) => (
          <Tooltip
            title={section.title}
            key={section.title}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "#333",
                  color: "white",
                  fontSize: "0.8rem",
                },
              },
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedGroups.includes(section.href)}
                  onChange={() => handleCheckboxChange(section.href)}
                  name={section.title}
                  sx={{
                    color: section.color ? section.color : "#3788d8",
                    "&.Mui-checked": {
                      color: section.color ? section.color : "#3788d8",
                    },
                  }}
                />
              }
              label={section.title}
              sx={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: "100%",
                "& .MuiTypography-root": {
                  fontWeight: "550",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                },
              }}
            />
          </Tooltip>
        ))}
      </FormGroup>
    </List>
  );
}
