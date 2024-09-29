/** @format */

"use client";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useState } from "react";
import ConfirmPopup from "@/components/dialogs/Confirm-popup";
import { useSession } from "next-auth/react";
import {
  CollabContainer,
  CollabMember,
  Task,
  TaskData,
  TaskDetail,
} from "@/types";
import ViewTaskDialog from "./view_task_dialog";
import { UpdateTaskName } from "@/app/api/service/collab/task/updateTaskName";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { SocketContext } from "@/socketio/SocketIOProvider";
import { useContext } from "react";

export default function TaskDetailListView({
  tasks,
  fetchtaskData,
  taskDetail,
  handleDelete,
  updatePriority,
  updateTaskData,
  collabDetail,
  collabMember,
}: {
  tasks: Task;
  taskDetail: TaskDetail;
  fetchtaskData: TaskData;
  handleDelete: (taskId: string) => void;
  updatePriority: (task_id: string) => void;
  updateTaskData: () => void;
  collabDetail: CollabContainer;
  collabMember: CollabMember;
}) {
  if (!taskDetail) return null;
  const [flag, setFlag] = useState(Number(taskDetail.task_priority));

  const handleDeleteTask = () => {
    setConfirmDeleteDialog(false);
    handleDelete(taskDetail.task_id);
  };
  const handleUpdatePriority = () => {
    updatePriority(taskDetail.task_id);
    setFlag(flag === 1 ? 1 : 0);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleToggle = () => setDialogOpen(!dialogOpen);
  const [confirmDeleteDialog, setConfirmDeleteDialog] =
    useState<boolean>(false);

  const searchParams = useSearchParams();
  const id = searchParams?.get("groupId");

  const { data: session } = useSession();
  const [event, setEvent] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
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
        setUpdateSuccess(true);
        toast.success("Task name updated successfully");
        if (socket) {
          socket.emit("task", {
            groupId: id,
            taskchanged: true,
          });
        }
      } else {
        setUpdateSuccess(false);
        toast.error("You don't have permission to edit task");
      }
    } catch (error) {
      setUpdateSuccess(false);
      toast.error("You don't have permission to edit task");
    }
  };

  return (
    <>
      <ViewTaskDialog
        updateSuccess={updateSuccess}
        tasks={tasks}
        fetchtaskData={fetchtaskData}
        taskDetail={taskDetail}
        open={dialogOpen}
        onClose={handleToggle}
        update_task_name={update_task_name}
        onUpdatePriority={handleUpdatePriority}
        flag={flag}
        setFlag={setFlag}
        task_id={taskDetail.task_id}
        collabDetail={collabDetail}
        collabMember={collabMember}
        updateTaskData={updateTaskData}
      />
      <Stack
        direction={"row"}
        py={1}
        alignItems={"center"}
        width={"100%"}
        justifyContent={"space-between"}
      >
        <div className="flex align-middle justify-between flex-row w-[6/12] gap-2">
          <Rating
            sx={{
              display: "flex",
              my: "auto",
            }}
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

          <Typography
            className="sm:w-[25rem] md:w-[32.5rem] lg:w-[35rem] xl:w-[50rem]"
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              display: "block",
              cursor: "pointer",
              overflow: "hidden", // Ensures overflow content is hidden
              whiteSpace: "nowrap", // Prevents text from wrapping
              textOverflow: "ellipsis", // Adds ellipsis for overflow text
              "&:hover": {
                color: "#7200BB",
              },
            }}
            onClick={() => setDialogOpen(true)}
          >
            {event ? event : taskDetail.task_title}
          </Typography>
        </div>
        <AvatarGroup
          max={5}
          sx={{
            display: "flex",
            alignItems: "center",
            "& .MuiAvatar-root": {
              width: 25,
              height: 25,
              fontSize: 16,
            },
          }}
        >
          {taskDetail.task_assignee &&
            taskDetail.task_assignee.map((assignee) => (
              <Avatar
                key={assignee.user_id}
                alt={assignee.user_name}
                src={assignee.user_profile_img}
              />
            ))}
        </AvatarGroup>

        <div className="flex align-middle justify-between flex-row w-[4/12]">
          {collabDetail.collab.collab_archive_status === false && (
            <IconButton
              onClick={() => setConfirmDeleteDialog(true)}
              sx={{
                display: "flex",
              }}
            >
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
        </div>
      </Stack>
      <ConfirmPopup
        confirmTitle="Delete Task"
        onConfirm={handleDeleteTask}
        open={confirmDeleteDialog}
        onClose={() => setConfirmDeleteDialog(false)}
      />
    </>
  );
}
