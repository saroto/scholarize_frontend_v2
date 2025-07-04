/** @format */

"use client";
import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Section, SectionList } from "./collab_section_list";
import { useState } from "react";
import ExpandMoreRotate from "../ui/icon/expand_more_rotate";
import Link from "next/link";

export type CollaborationList = {
  href: string;
  headerTitle: string;
  icon: React.ReactNode;
  collapsible: {
    yes: boolean;
    default?: boolean;
  };
  sectionLists?: SectionList[];
};

export default function CollaborationLeftSideBar({
  collaborationLists,
  pathname,
}: Readonly<{
  collaborationLists: CollaborationList[];
  pathname?: string;
}>) {
  const [headerSelected, setHeaderSelected] = useState<string>(pathname ?? "");

  const HeaderSections = collaborationLists?.map((collaborationList, index) => {
    return (
      <HeaderSection
        headerSelected={headerSelected}
        setHeaderSelected={setHeaderSelected}
        collaborationList={collaborationList}
        key={collaborationList.headerTitle}
      />
    );
  });

  return (
    <>
      <List>{HeaderSections}</List>
    </>
  );
}

function HeaderSection({
  collaborationList,
  headerSelected,
  setHeaderSelected,
}: Readonly<{
  collaborationList: CollaborationList;
  headerSelected: string;
  setHeaderSelected: (title: string) => void;
}>) {
  const [open, setOpen] = useState<boolean>(
    collaborationList.collapsible.yes &&
      (collaborationList.collapsible.default ?? false)
  );

  const selected = headerSelected === collaborationList.headerTitle;

  return (
    <div className="flex w-full flex-col">
      <Link
        href={collaborationList.href}
        onClick={() => {
          if (typeof setHeaderSelected !== "undefined") {
            setHeaderSelected(collaborationList.headerTitle);
          }
        }}
      >
        <ListItemButton
          onClick={() => setOpen(!open)}
          selected={selected}
          sx={{
            display: "flex",
          }}
        >
          <IconButton
            color="inherit"
            sx={{
              display: "flex",
            }}
          >
            {collaborationList.icon}
          </IconButton>
          <ListItemText
            primary={collaborationList.headerTitle}
            sx={{
              display: "flex",
              textWrap: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              // "& .MuiListItemText-primary": {
              //   pl: 1,
              //   fontWeight: "bold",
              //   color: selected ? "#7200BB" : "black",
              // },
            }}
          />
          <ExpandMoreRotate
            expand={open}
            onClick={() => setOpen(!open)}
            sx={{ zIndex: 99 }}
          />
        </ListItemButton>
      </Link>
      {collaborationList.collapsible.yes && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {collaborationList.sectionLists?.map((sectionList, index) => {
            return (
              <Section
                paddingLeft={1.5}
                sectionList={sectionList}
                key={index}
              />
            );
          })}
        </Collapse>
      )}
    </div>
  );
}
