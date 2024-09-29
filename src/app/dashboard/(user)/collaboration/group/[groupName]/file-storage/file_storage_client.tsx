/** @format */

"use client";

import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SelectFolder from "./select_folder";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import TableCellDetail from "./table_cell_detail";
import {
  Folder,
  getFilesByCollabId,
} from "@/app/api/service/collab/file-storage/getFilesByCollabId";
import { useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { uploadFiles } from "@/app/api/service/collab/file-storage/uploadFiles";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { getAllFolders } from "@/app/api/service/collab/file-storage/getAllFolders";
import UploadingDialog from "@/components/dialogs/uploading";
import { SocketContext } from "@/socketio/SocketIOProvider";
import { useFetchFolderStore } from "@/stores/StoreFetchFolder";
import { set } from "lodash";

type Props = {
  groupName: string;
};

export default function FileStorageClient({ groupName }: Props) {
  const folderIdFromStore = useFetchFolderStore((state) => state.folder); // Retrieve folder ID from Zustand store

  const [folder, setFolder] = useState<Folder | null>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [folderId, setFolderId] = useState<number>(folder?.folder_id || 0);

  const filesUploadRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState<number>(1); // Ensure page state is a number and default to 1
  const [collab_archive_status, setCollabArchiveStatus] =
    useState<boolean>(true);
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const group_id = searchParams?.get("groupId");
  const totalFiles = folder?.total_files || 0;
  const paginationCount = totalFiles > 10 ? Math.ceil(totalFiles / 10) : 1;
  const [uploading, setUploading] = useState(false);

  const socket = useContext(SocketContext);

  // Fetch folder ID from Zustand store
  useEffect(() => {
    if (folderIdFromStore) {
      setFolderId(Number(folderIdFromStore));
    }
  }, [folderIdFromStore]);

  const fetchFolders = async () => {
    try {
      if (session?.user.token && group_id) {
        const response = await getAllFolders(
          session.user.token,
          Number(group_id)
        );
        setFolders(response.folders);
        setFolderId(response.folders[0].FolderID);
      }
    } catch (error) {
      console.error("Failed to get folders", error);
    }
  };

  const handlePaginationPageChange = async (page: number) => {
    setPage(page);
    fetchFolder(page, folderId);
  };

  const fetchFolder = async (page: number, folderId: number) => {
    if (!session) return;

    const data = await getFilesByCollabId(session.user.token, {
      collabId: Number(group_id),
      folderId: folderId,
      page: page,
      count: 10,
    });

    if (!data.success) {
      toast.error("Failed to fetch files");
      return;
    }

    if (data.folder) {
      setFolder(data.folder);
    }
    if (data) {
      setCollabArchiveStatus(data.collab_archive_status);
    }
  };

  const handleFolderSelection = async (newFolderId: number) => {
    setPage(1); // Reset to the first page
    setFolderId(newFolderId);
    fetchFolder(1, newFolderId); // Fetch the first page of the new folder
  };

  useEffect(() => {
    if (session?.user.token && group_id && folderId !== 0) {
      fetchFolder(page, folderId);
    }
  }, [folderId, page]);

  // Socket
  useEffect(() => {
    const fileChangedHandler = (data: any) => {
      if (
        data.groupId === Number(group_id) &&
        data.fileuploaded === true &&
        folderId
      ) {
        fetchFolder(page, folderId);
      }
    };

    if (socket) {
      socket.on("fileuploaded", fileChangedHandler);
    }
    return () => {
      if (socket) {
        socket.off("fileuploaded", fileChangedHandler);
      }
    };
  }, [socket, folderId, page]);

  const handleUploadFiles = async () => {
    if (!session) return;

    const files = filesUploadRef.current?.files;
    if (!files) return;

    // check if file is more than 100mb
    for (const file of files) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Each file size should not exceed 100MB");
        return;
      }
    }

    const formData = new FormData();
    formData.append("folder_id", folderId.toString());
    for (const file of files) {
      formData.append("files", file);
    }

    setUploading(true);
    const uploaded = await uploadFiles(
      session.user.token,
      Number(group_id),
      formData,
      pathname as string
    );

    if (!uploaded.success) {
      if (uploaded.data.error === "Forbidden") {
        toast.error("You don't have permission to upload files");
        setUploading(false);
        return;
      }
      toast.error(uploaded.data.error);
      setUploading(false);
      return;
    }
    toast.success("Files uploaded successfully");
    setUploading(false);
    //fetchFolder();
    if (socket) {
      socket.emit("file", {
        groupId: Number(group_id),
        folderId: folderId,
        fileupload: true,
      });
    }
  };

  useEffect(() => {
    if (session?.user.token && group_id && folderId === 0) {
      fetchFolders();
    }

    if (session?.user.token && group_id && folderId !== 0) {
      fetchFolder(page, folderId);
    }
  }, [session?.user.token, group_id, folderId]);

  let TableFileRows;
  if (folder && folder.files.length > 0) {
    TableFileRows = folder.files.map((file) => {
      return (
        <TableRow key={file.file_id}>
          <TableCellDetail
            collab_archive_status={collab_archive_status}
            folderId={folder.folder_id}
            file={file}
            groupId={group_id ?? null}
            refetch={() => fetchFolder(page, folderId)}
            folders={folders}
          />
        </TableRow>
      );
    });
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Stack
        sx={{
          height: "72px",
          width: "100%",
          borderBottom: "1px solid #e0e0e0",
        }}
        spacing={8}
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
      >
        <Breadcrumbs
          sx={{
            paddingX: "1rem",
          }}
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link href="/dashboard/collaboration/groups">
            <Typography
              fontWeight={550}
              color="text.primary"
              className="hover:cursor-pointer"
              sx={{
                ":hover": {
                  color: "#7200BB",
                },
              }}
            >
              GROUP
            </Typography>
          </Link>
          <Tooltip title={decodeURIComponent(groupName)}>
            <Typography color="text.secondary" noWrap maxWidth={"100px"}>
              {decodeURIComponent(groupName)}
            </Typography>
          </Tooltip>
          <Typography color="text.secondary">File Storage</Typography>
          {folders.length > 0 && (
            <SelectFolder
              shouldSetSelectedFolder={true}
              folders={folders}
              setFolderId={handleFolderSelection} // Update setFolderId to handleFolderSelection
              folderId={folderId}
            />
          )}
        </Breadcrumbs>

        <input
          style={{
            display: "none",
          }}
          type="file"
          ref={filesUploadRef}
          multiple
          onChange={handleUploadFiles}
        />
        {collab_archive_status !== true && (
          <Button
            onClick={() => {
              filesUploadRef.current?.click();
            }}
            startIcon={<FileUploadOutlinedIcon />}
            variant="outlined"
            sx={{
              mr: "1rem !important",
              borderRadius: "1rem",
              bgcolor: "#7200BB",
              color: "#fff",
              border: "none",
              ":hover": {
                bgcolor: "#7200BB",
                filter: "contrast(0.6)",
                border: "none",
              },
            }}
          >
            Upload File
          </Button>
        )}
      </Stack>
      <Box
        sx={{
          p: 2,
          mt: "0",
        }}
      >
        <TableContainer className="rounded-[1.2rem] border-[1px] border-[#cfcfcf]">
          <Table>
            <TableHead>
              <TableRow className="bg-[#CFCFCF]">
                <TableCell align={"left"}>Name</TableCell>
                <TableCell align={"center"}>Size</TableCell>
                <TableCell align={"center"}>Uploaded By</TableCell>
                <TableCell align={"center"}>Date</TableCell>
                <TableCell align={"center"}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{TableFileRows}</TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <Pagination
            count={paginationCount}
            variant="outlined"
            page={page} // Ensure the pagination component is controlled
            onChange={(event, value) => handlePaginationPageChange(value)}
          />
        </div>
      </Box>
      {uploading && <UploadingDialog isUploading={uploading} />}
    </Container>
  );
}
