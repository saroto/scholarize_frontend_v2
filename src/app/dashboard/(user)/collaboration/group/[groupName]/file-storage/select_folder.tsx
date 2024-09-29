/** @format */

"use client";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { useFetchFolderStore } from "@/stores/StoreFetchFolder";

type Folder = {
  FolderID: number;
  FolderName: string;
};

export default function SelectFolder({
  folders,
  folderId,
  setFolderId,
  shouldSetSelectedFolder,
}: {
  folders: Folder[];
  folderId: number;
  setFolderId: (folderId: number) => void;
  shouldSetSelectedFolder?: boolean;
}) {
  const setSelectedFolder = useFetchFolderStore(
    (state) => state.setSelectedFolder
  );
  return (
    <Select
      variant="standard"
      startAdornment={
        <FolderOutlinedIcon
          sx={{
            color: "#000",
            marginRight: "0.5rem",
            fontWeight: "bold",
          }}
        />
      }
      value={folderId.toString()}
      autoWidth
      onChange={(e: SelectChangeEvent) => {
        setFolderId(Number(e.target.value));
        if (shouldSetSelectedFolder) {
          setSelectedFolder(Number(e.target.value));
        }
      }}
      sx={{
        color: "#000",
        fontWeight: "bold",
      }}
    >
      {folders.map((folder) => (
        <MenuItem key={folder.FolderID} value={folder.FolderID}>
          {folder.FolderName}
        </MenuItem>
      ))}
    </Select>
  );
}
