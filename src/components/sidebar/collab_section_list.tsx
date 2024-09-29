/** @format */

import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

export type SectionList = {
  href: string;
  title: string;
  Icon: React.ReactNode;
  color?: string;
};

export function Section({
  sectionList,
  paddingLeft,
  selected,
  setSelected,
}: Readonly<{
  sectionList: SectionList;
  paddingLeft?: number;
  selected?: string;
  setSelected?: (title: string) => void;
}>) {
  const isSelected = selected === sectionList.title;

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
            color: "#7200BB",
          },
          px: 2,
        }}
      >
        <ListItemButton
          selected={isSelected}
          sx={{
            py: 0.5,
            pl: paddingLeft,
            textWrap: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <IconButton color="inherit">{sectionList.Icon}</IconButton>
          <ListItemText primary={sectionList.title} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
}
