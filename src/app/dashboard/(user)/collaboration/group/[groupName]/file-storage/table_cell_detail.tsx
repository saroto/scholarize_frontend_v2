/** @format */

"use client";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TableCell,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import CloseIcon from "@mui/icons-material/Close";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { useContext, useEffect, useRef, useState } from "react";
import { File } from "@/app/api/service/collab/file-storage/getFilesByCollabId";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { deleteFileByFileId } from "@/app/api/service/collab/file-storage/deleteFileByFileId";
import { renameFileByFileId } from "@/app/api/service/collab/file-storage/renameFileByFileId";
import SelectFolder from "./select_folder";
import { moveFileByFileId } from "@/app/api/service/collab/file-storage/moveFileByFileId";
import { getFileBuffer } from "@/app/api/service/collab/file-storage/getFileBuffer";
import ConfirmPopup from "@/components/dialogs/Confirm-popup";
import { toast } from "react-toastify";
import { downloadCollabFile } from "@/app/api/service/collab/file-storage/downloadCollabFile";
import { downloadCollabFiles } from "@/app/api/service/downloadFiles";
import { SocketContext } from "@/socketio/SocketIOProvider";

export default function TableCellDetail({
  collab_archive_status,
  file,
  folderId,
  groupId,
  refetch,
  folders,
}: {
  collab_archive_status: boolean;
  file: File;
  folderId: number;
  groupId: string | null;
  refetch: () => Promise<void>;
  folders: any[];
}) {
  // filename state because on rename, i don't refetch data from api again
  const extension = file.file_name.split(".").slice(-1)[0];
  const [filename, setFilename] = useState<string>(file.file_name);
  const [editFilename, setEditFilename] = useState<boolean>(false);
  const filenameRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [moveFileDialog, setMoveFileDialog] = useState<boolean>(false);
  const [newFolderId, setNewFolderId] = useState<number>(folderId);
  const { data: session } = useSession();

  const openMoveFileDialog = () => {
    setMoveFileDialog(true);
  };

  const closeMoveFileDialog = () => {
    setMoveFileDialog(false);
  };

  // Note downloading file perform on client side, which expose api url to client
  const downloadFile = async () => {
    try {
      const response = await downloadCollabFiles(
        file.file_path,
        file.file_name
      );
      if (!response.success) {
        toast.error("Failed to download file");
        return;
      }

      const downloadUrl = response.url;

      // Create a temporary anchor element and trigger a click
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = ""; // This can be left empty, the server should set the filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const socket = useContext(SocketContext);

  useEffect(() => {
    const fileChangedHandler = async (data: any) => {
      if (data.groupId === Number(groupId) && data.fileupdated && folderId) {
        await refetch();
      }
    };

    if (socket) {
      socket.on("fileupdated", fileChangedHandler);
    }

    return () => {
      if (socket) {
        socket.off("fileupdated", fileChangedHandler);
      }
    };
  }, [socket, folderId]);

  const [confirmDeleteDialog, setConfirmDeleteDialog] =
    useState<boolean>(false);
  const deleteFile = async () => {
    if (!session) return;

    const deleted = await deleteFileByFileId(
      session.user.token,
      Number(groupId),
      file.file_id,
      pathname as string
    );
    setConfirmDeleteDialog(false);
    if (!deleted.success) {
      toast.error("No permission to delete file ");
      return;
    }
    toast.success("File deleted successfully");
    if (socket) {
      socket.emit("file", {
        groupId: Number(groupId),
        folderId: folderId,
        fileupdated: true,
      });
    }
  };

  const renameFile = async () => {
    if (!session) return;
    if (!editFilename) return;
    if (!filenameRef.current) return;

    let newFilename = filenameRef.current.value;

    if (filename === newFilename) {
      return setEditFilename(false);
    }

    // Check if no extension in new filename
    if (!newFilename.includes(".")) {
      // append old extension to new filename
      newFilename = newFilename + "." + extension;
    }

    // check if file extension is different in new filename
    if (newFilename.split(".").slice(-1)[0] !== extension) {
      // append old extension to new filename
      newFilename = newFilename + "." + extension;
    }

    const renamed = await renameFileByFileId(
      session.user.token,
      Number(groupId),
      file.file_id,
      folderId,
      newFilename,
      pathname as string
    );

    if (!renamed.success) {
      toast.error("No permission to rename file");
      return;
    }
    toast.success("File renamed successfully");
    setFilename(newFilename);
    setEditFilename(false);
    if (socket) {
      socket.emit("file", {
        groupId: Number(groupId),
        folderId: folderId,
        fileupdated: true,
      });
    }
  };

  const moveFile = async () => {
    if (!session) return;
    if (newFolderId === folderId) return closeMoveFileDialog();

    const moved = await moveFileByFileId(
      session.user.token,
      Number(groupId),
      file.file_id,
      newFolderId,
      pathname as string
    );

    if (!moved.success) {
      toast.error("No permission to move file");
      return;
    }

    toast.success("File moved successfully");
    closeMoveFileDialog();
    if (socket) {
      socket.emit("file", {
        groupId: Number(groupId),
        folderId: folderId,
        fileupdated: true,
      });
    }
  };

  return (
    <>
      <TableCell align="center">
        <Stack direction={"row"} gap={0.5} alignItems={"center"}>
          <InsertDriveFileOutlinedIcon
            sx={{
              verticalAlign: "middle",
              paddingRight: "0.5rem",
            }}
          />
          {editFilename ? (
            <>
              <form
                onSubmit={(formEvent: React.FormEvent) => {
                  formEvent.preventDefault();
                  renameFile();
                }}
                className="flex items-center gap-2"
              >
                <TextField
                  variant="standard"
                  placeholder="Enter filename"
                  defaultValue={filename}
                  inputRef={filenameRef}
                  sx={{
                    width: "20rem",
                  }}
                />

                <DoneRoundedIcon
                  onClick={renameFile}
                  sx={{
                    cursor: "pointer",
                    ":hover": {
                      color: "green",
                    },
                  }}
                />

                <ClearRoundedIcon
                  onClick={() => setEditFilename(false)}
                  sx={{
                    cursor: "pointer",
                    ":hover": {
                      color: "red",
                    },
                  }}
                />
              </form>
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                className="truncate sm:max-w-[15rem] md:max-w-[20rem] lg:max-w-[25rem]"
              >
                {filename}
              </Typography>
              {collab_archive_status === false && (
                <IconButton
                  onClick={() => setEditFilename(true)}
                  sx={{
                    paddingcenter: "0.5rem",
                  }}
                >
                  <EditNoteRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </>
          )}
        </Stack>
      </TableCell>
      <TableCell align="center">{file.file_size}</TableCell>
      <TableCell align="center">
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Avatar
            src={file.user_details.user_profile_img}
            sx={{
              width: "24px",
              height: "24px",
            }}
          />
          {file.user_details.user_name}
        </Stack>
      </TableCell>
      <TableCell align="center">
        {new Date(file.updated_at).toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </TableCell>
      <TableCell align="center">
        <IconButton onClick={downloadFile}>
          <FileDownloadOutlinedIcon fontSize="small" />
        </IconButton>
        {collab_archive_status === false && (
          <IconButton onClick={openMoveFileDialog}>
            <DriveFileMoveOutlinedIcon fontSize="small" />
          </IconButton>
        )}
        {collab_archive_status === false && (
          <IconButton onClick={() => setConfirmDeleteDialog(true)}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        )}
        <ConfirmPopup
          confirmTitle="Delete file"
          onConfirm={deleteFile}
          open={confirmDeleteDialog}
          onClose={() => setConfirmDeleteDialog(false)}
          filename={file.file_name}
        />
      </TableCell>

      <Dialog
        open={moveFileDialog}
        onClose={closeMoveFileDialog}
        sx={{
          "& .MuiDialog-paper": {
            width: "40rem",
            borderRadius: "1rem",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: "0",
            maxWidth: "40rem",
          }}
        >
          <Stack
            alignItems={"center"}
            justifyContent={"space-between"}
            direction={"row"}
          >
            <span>Move File to Another Folder</span>
            <Tooltip
              title="Close"
              sx={{
                float: "right",
              }}
            >
              <IconButton onClick={closeMoveFileDialog} color="inherit">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack gap={2} mt={3}>
            <Box>
              <Typography variant="body2" noWrap>
                Moving <strong className="text-[blue]">{filename}</strong> to
              </Typography>
            </Box>
            <SelectFolder
              folderId={newFolderId}
              setFolderId={setNewFolderId}
              folders={folders}
              shouldSetSelectedFolder={false}
            />
          </Stack>
          <Stack alignItems={"flex-end"} justifyContent={"center"} mt={2.5}>
            <Button
              variant="contained"
              onClick={moveFile}
              sx={{
                borderRadius: "1rem",
                padding: "0.5rem 2rem",
                "&:hover": {
                  backgroundColor: "#2b6cb0",
                },
              }}
            >
              Move
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
