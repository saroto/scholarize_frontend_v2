/** @format */

"use client";
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  IconButton,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import ViewTaskDialog from "./view_task_dialog";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Task,
  TaskData,
  TaskDetail,
  CollabContainer,
  CollabMember,
} from "@/types";
import { useSession } from "next-auth/react";

import { UpdateTaskName } from "@/app/api/service/collab/task/updateTaskName";
import { toast } from "react-toastify";
import { Circle } from "@mui/icons-material";
import ConfirmPopup from "@/components/dialogs/Confirm-popup";
import { SocketContext } from "@/socketio/SocketIOProvider";

export default function TaskDetailBoardView({
  taskDetail,
  tasks,
  fetchtaskData,
  handleDelete,
  updatePriority,
  updateTaskData,
  collabDetail,
  collabMember,
  taskStatusColor,
  taskStatusName,
}: {
  taskDetail: TaskDetail;
  tasks: Task;
  fetchtaskData: TaskData;
  collabDetail: CollabContainer;
  handleDelete: (taskId: string) => void;
  updatePriority: (task_id: string) => void;
  updateTaskData: () => void;
  collabMember: CollabMember;
  taskStatusColor: string;
  taskStatusName: string;
}) {
  const searchParams = useSearchParams();
  const id = searchParams?.get("groupId");

  const { data: session } = useSession();
  const [flag, setFlag] = useState(Number(taskDetail.task_priority));
  const [event, setEvent] = useState("");
  const [createTaskDialogOpen, setCreateTaskDialogOpen] =
    useState<boolean>(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] =
    useState<boolean>(false);

  const handleDeleteTask = async () => {
    try {
      if (session?.user.token) {
        await handleDelete(taskDetail.task_id);
      }
      setConfirmDeleteDialog(false);
    } catch (err) {
      toast.error("You don't have permission to delete task");
    }
  };

  const handleUpdatePriority = async () => {
    if (session?.user.token) {
      try {
        await updatePriority(taskDetail.task_id);
        setFlag(flag === 1 ? 1 : 0); // Only toggle the flag if updatePriority is successful
      } catch (error) {
        toast.error("You don't have permission to update priority");
      }
    }
  };

  const [updateSuccess, setUpdateSuccess] = useState(false); // Add a new state to hold the success status
  const socket = useContext(SocketContext);
  const update_task_name = async (newTaskTitle: string = "") => {
    const formdata = new FormData();
    formdata.append("task_id", taskDetail.task_id);
    formdata.append("task_title", newTaskTitle);
    try {
      const res = await UpdateTaskName(
        String(session?.user.token),
        formdata,
        String(id)
      );
      if (res.success) {
        setEvent(newTaskTitle);
        setUpdateSuccess(true); // Update the state to indicate success
        toast.success("Task name updated successfully");
        if (socket) {
          socket.emit("task", {
            groupId: id,
            taskchanged: true,
          });
        }
      } else {
        setUpdateSuccess(false); // Update the state to indicate failure
        toast.error("You don't have permission to edit task");
      }
    } catch (error) {
      setUpdateSuccess(false); // Update the state to indicate failure
      toast.error("You don't have permission to edit task");
    }
  };

  return (
    <>
      <ViewTaskDialog
        updateSuccess={updateSuccess}
        tasks={tasks}
        taskDetail={taskDetail}
        fetchtaskData={fetchtaskData}
        open={createTaskDialogOpen}
        onClose={() => setCreateTaskDialogOpen(false)}
        onUpdatePriority={handleUpdatePriority}
        flag={flag}
        setFlag={setFlag}
        update_task_name={update_task_name}
        updateTaskData={updateTaskData}
        task_id={taskDetail.task_id}
        collabDetail={collabDetail}
        collabMember={collabMember}
      />

      <Card
        key={taskDetail.task_id}
        sx={{
          borderRadius: "1rem",
          filter: "drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.1))",
          ":hover .open-task-dialog": {
            display: "flex",
          },
        }}
      >
        <CardContent
          sx={{
            height: "8rem",
            padding: 0,
            "&:last-child": {
              paddingBottom: 0,
            },
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction={"row"}
            padding={"1rem"}
            paddingBottom={0}
            sx={{
              justifyContent: "space-between",
              gap: "0.5rem",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              className="task-title-card"
              sx={{
                cursor: "pointer",
                width: "100%",
                ":hover": {
                  color: "blue",
                },
                maxHeight: "6rem",
                height: "100%",
                display: "-webkit-box",
                overflow: "hidden",
                whiteSpace: "normal",
                textOverflow: "ellipsis",
                wordWrap: "break-word",
                flexDirection: "column",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 4,
              }}
              onClick={() => setCreateTaskDialogOpen(true)}
            >
              <Typography>{event ? event : taskDetail.task_title}</Typography>
            </Box>
            <Box
              height="100%"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <Tooltip title="Priority" placement="right">
                <Rating
                  name="no-value"
                  value={flag}
                  onChange={
                    collabDetail.collab.collab_archive_status === false
                      ? handleUpdatePriority
                      : undefined
                  }
                  max={1}
                  icon={<FlagRoundedIcon />}
                  emptyIcon={<FlagOutlinedIcon />}
                />
              </Tooltip>

              <Tooltip title={taskStatusName} placement="right">
                <Circle
                  sx={{
                    color: taskStatusColor,
                    display: "flex",
                    fontSize: "0.75rem",
                    mx: "auto",
                  }}
                />
              </Tooltip>

              <Tooltip title="Open" placement="right">
                <OpenInNewIcon
                  className="open-task-dialog"
                  sx={{
                    color: "#c5c5c5",
                    display: "none",
                    fontSize: "1.25rem",
                    mx: "auto",
                    ":hover": {
                      color: "blue",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    setCreateTaskDialogOpen(true);
                  }}
                />
              </Tooltip>
            </Box>
          </Stack>
        </CardContent>
        <Divider />
        <Stack
          direction={"row"}
          alignItems={"center"}
          p={"0.5rem"}
          height={"3rem"}
          justifyContent={"space-between"}
        >
          <AvatarGroup
            max={5}
            sx={{
              "& .MuiAvatar-root": {
                width: 25,
                height: 25,
                fontSize: 15,
              },
            }}
          >
            {taskDetail.task_assignee &&
              taskDetail?.task_assignee.map((index) => (
                <Avatar
                  key={index.user_id}
                  alt={index.user_name}
                  src={index.user_profile_img}
                />
              ))}
          </AvatarGroup>
          {collabDetail.collab.collab_archive_status === false && (
            <IconButton onClick={() => setConfirmDeleteDialog(true)}>
              <DeleteRoundedIcon
                sx={{
                  color: "#cfcfcf",
                  "&:hover": {
                    color: "red",
                  },
                }}
              />
            </IconButton>
          )}
        </Stack>
      </Card>
      <ConfirmPopup
        confirmTitle="Delete Task"
        onConfirm={handleDeleteTask}
        open={confirmDeleteDialog}
        onClose={() => setConfirmDeleteDialog(false)}
      />
    </>
  );
}
