/** @format */

"use client";
import {
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import ExpandMoreRotate from "@/components/ui/icon/expand_more_rotate";
import { useFetchFolderStore } from "@/stores/StoreFetchFolder";
import { Folder } from "@mui/icons-material";

export type SectionList = {
  href: string;
  title: string;
  Icon: React.ReactNode;
  color?: string;
  isCollapsible?: boolean;
  folderLists?: any[];
  groupName?: string;
};

export function Section({
  sectionList,
  paddingLeft,
  selected,
  setSelected,
}: {
  sectionList: SectionList;
  paddingLeft?: number;
  selected?: string;
  setSelected?: (title: string) => void;
}) {
  const isSelected = selected === sectionList.title;
  const [open, setOpen] = React.useState(false);
  const setFolder = useFetchFolderStore((state) => state.setFolder);
  const selectedFolder = useFetchFolderStore((state) => state.selectedFolder);
  const setSelectedFolder = useFetchFolderStore(
    (state) => state.setSelectedFolder
  );

  const handleFolderClick = (folderId: string) => {
    setFolder(Number(folderId));
    setSelectedFolder(Number(folderId));
  };

  useEffect(() => {
    setOpen(isSelected);
    setSelectedFolder(sectionList.folderLists?.[0]?.FolderID);
  }, [isSelected]);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <Link
      href={sectionList.href}
      key={sectionList.title}
      onClick={() => {
        if (typeof setSelected !== "undefined") {
          setSelected(sectionList.title);
        }
      }}
    >
      <ListItem
        disablePadding
        sx={{
          "&:hover": {
            "& .MuiListItemButton-root": {
              fontWeight: "bold",
            },
          },
        }}
      >
        <ListItemButton
          selected={isSelected}
          onClick={sectionList.isCollapsible ? handleClick : undefined}
          sx={{
            // pl: paddingLeft,
            // textWrap: "nowrap",
            // overflow: "hidden",
            textOverflow: "ellipsis",
            // backgroundColor: "black",
            borderRadius: "16px",
            margin: "5px",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            width: "100%",
          }}
        >
          <IconButton color="inherit" size="small">
            {sectionList.Icon}
          </IconButton>

          <Typography variant="h5">{sectionList.title}</Typography>
          {sectionList.isCollapsible && (
            <ExpandMoreRotate
              expand={open}
              sx={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
      {sectionList.isCollapsible && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {sectionList.folderLists?.map((folder) => (
              <ListItem
                key={folder.FolderID}
                disablePadding
                sx={{
                  "&:hover": {
                    "& .MuiListItemButton-root": {
                      fontWeight: "bold",
                    },
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    backgroundColor:
                      folder.FolderID === selectedFolder
                        ? "#CFCFCF"
                        : "inherit", // Add this line
                    textWrap: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    gap: 1,
                    pl: 5,
                  }}
                  onClick={() => handleFolderClick(folder.FolderID)}
                >
                  <Folder
                    sx={{
                      color:
                        folder.FolderID === selectedFolder
                          ? "#000000"
                          : "#808080",
                    }}
                  />
                  <ListItemText
                    sx={{
                      width: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color:
                        folder.FolderID === selectedFolder
                          ? "black"
                          : "#808080",
                      "& .MuiListItemText-primary": {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.875rem",
                        fontWeight:
                          folder.FolderID === selectedFolder ? 650 : 400,
                      },
                    }}
                    primary={folder.FolderName}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </Link>
  );
}
