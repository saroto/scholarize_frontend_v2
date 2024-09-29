/** @format */

"use client";
import {
  Avatar,
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Rating,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import { forwardRef, use, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useContext } from "react";
import {
  Task,
  TaskData,
  TaskDetail,
  Subtasks,
  TaskComments,
  Comment,
  CollabContainer,
  CollabMember,
  User,
  Subtask,
} from "@/types";
import { useSearchParams } from "next/navigation";
import {
  UpdateTaskStatus,
  UpdateAssignee,
} from "@/app/api/service/collab/task";
import {
  CreateSubtask,
  GetAllSubtask,
  UpdateSubtaskName,
  DeleteSubtask,
} from "@/app/api/service/collab/task/subtask";
import {
  AddTaskComment,
  getTaskComment,
  addSubtaskComment,
  getSubtaskComment,
} from "@/app/api/service/collab/comment";
import { toast } from "react-toastify";
import { SocketContext } from "@/socketio/SocketIOProvider";

export default function ViewTaskDialog({
  open,
  onClose,
  tasks, //each status for the task
  taskDetail, //task details
  fetchtaskData, //all tasks
  onUpdatePriority,
  flag,
  setFlag,
  update_task_name, //update task name
  updateTaskData, //update task data refetch all tasks
  task_id,
  collabMember, //collab members
  collabDetail,
  updateSuccess,
}: {
  updateSuccess: boolean;
  open: boolean;
  onClose: () => void;
  tasks: Task;
  taskDetail: TaskDetail;
  fetchtaskData: TaskData;
  task_id: string;
  collabDetail: CollabContainer;
  collabMember: CollabMember;
  onUpdatePriority: () => void;
  flag: number;
  setFlag: (flag: number) => void;
  update_task_name: (newTaskTitle: string) => void;
  updateTaskData: () => void;
}) {
  const [editTaskTitle, setEditTaskTitle] = useState<boolean>(false);
  const taskStatusRef = useRef<HTMLInputElement>(null);

  const [assignedMembers, setAssignedMembers] = useState<User[]>(
    taskDetail?.task_assignee || []
  );

  const { data: session } = useSession();
  const [task, setTask] = useState(taskDetail || { task_title: "" });
  const searchParams = useSearchParams();
  const id = searchParams?.get("groupId");
  const socket = useContext(SocketContext);

  const assignMember = (member: User) => {
    if (assignedMembers.some((m) => m.user_email === member.user_email)) return;
    setAssignedMembers([...assignedMembers, member]);
  };

  const unassignMember = (member: User) => {
    setAssignedMembers(
      assignedMembers.filter((m) => m.user_email !== member.user_email)
    );
  };

  const [inputValue, setInputValue] = useState(task.task_title);
  const [originalTaskName, setOriginalTaskName] = useState(task.task_title);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setInputValue(value);
    setTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const taskName = async (task_name: string) => {
    if (updateSuccess === false) {
      setInputValue(originalTaskName);
    } else {
      setOriginalTaskName(task_name);
    }
    await update_task_name(task_name);
  };

  const handleUpdatePriority = async () => {
    onUpdatePriority();
    setFlag(flag === 0 ? 1 : 0);
  };

  useEffect(() => {
    setAssignedMembers(taskDetail?.task_assignee || []);
    setInputValue(taskDetail?.task_title || "");
    setTask(taskDetail || { task_title: " " });
    setFlag(Number(taskDetail?.task_priority));
  }, [taskDetail]);

  const handleUpdateAssignee = async () => {
    if (session) {
      const formData = new FormData();

      // Check if assigned member has changes
      const assignedMemberIds = assignedMembers.map((member) => member.user_id);
      let currentAssignedMemberIds = taskDetail?.task_assignee?.map(
        (member) => member.user_id || ""
      );

      if (currentAssignedMemberIds === undefined) {
        currentAssignedMemberIds = [];
      }

      // Check if assigned member has changes
      if (
        JSON.stringify(assignedMemberIds) ===
        JSON.stringify(currentAssignedMemberIds)
      ) {
        return;
      }

      assignedMembers.forEach((member) => {
        formData.append("assignee_ids", String(member.user_id));
      });

      formData.append("task_id", task_id);

      const res = await UpdateAssignee(
        session?.user.token,
        formData,
        String(id)
      );
      if (res.success) {
        toast.success("Assignee updated successfully");
        if (socket) {
          socket.emit("task", {
            groupId: id,
            taskchanged: true,
          });
        }
      } else {
        toast.error("Failed to update assignee");
        setAssignedMembers(taskDetail?.task_assignee || []);
      }
    }
  };

  const [subTask, setSubTask] = useState<Subtasks | undefined>();
  const getAllSubtask = async () => {
    if (session?.user.token && id) {
      const getAllSubtask = await GetAllSubtask(
        session?.user.token,
        id,
        task_id
      );
      if (getAllSubtask && getAllSubtask.success) {
        setSubTask(getAllSubtask.data);
      }
    }
  };

  // Get all subtask and assginee
  useEffect(() => {
    const getSubtaskHandler = (data: any) => {
      if (data.taskId === task_id && session?.user.token && id) {
        GetAllSubtask(session?.user.token, id, task_id).then((data) => {
          setSubTask(data && data.data);
        });
      }
    };

    if (socket) {
      socket.on("subtaskchanged", getSubtaskHandler);
    }

    return () => {
      if (socket) {
        socket.off("subtaskchanged", getSubtaskHandler);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (open) {
      getAllSubtask();
    }
  }, [open]);

  type ChatContext = {
    type: "task" | "subtask";
    id: string;
  };

  const [currentChat, setCurrentChat] = useState<ChatContext>({
    type: "task",
    id: task_id,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "80%",
          height: "80%",
          borderRadius: "2rem",
        },
        "& .MuiDialogContent-root": {
          padding: "0",
        },
        "& .MuiDialogTitle-root": {
          padding: "0",
        },
      }}
      fullWidth
    >
      <DialogTitle>
        <Stack
          sx={{
            padding: "1rem",
            px: "1.5rem",
          }}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            {editTaskTitle ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  taskName(inputValue);
                  setEditTaskTitle(false);
                }}
              >
                <TextField
                  fullWidth
                  sx={{
                    width: "35rem",
                  }}
                  required
                  id="task-title"
                  name="task_title"
                  variant="standard"
                  placeholder="Enter task title"
                  value={inputValue || ""}
                  onChange={handleInputChange}
                  inputRef={taskStatusRef}
                />
                <IconButton onClick={() => setEditTaskTitle(false)}>
                  <ClearRoundedIcon />
                </IconButton>
              </form>
            ) : (
              <>
                <Typography
                  className="truncate-text max-w-[15rem] sm:max-w-[20rem] md:max-w-[30rem] lg:max-w-[45rem] xl:max-w-[52.5rem] 2xl:max-w-[60rem]"
                  variant="h6"
                  noWrap
                  sx={{}}
                >
                  {inputValue}
                </Typography>
                {collabDetail.collab.collab_archive_status === false && (
                  <IconButton onClick={() => setEditTaskTitle(true)}>
                    <EditNoteRoundedIcon
                      className="abc"
                      sx={{
                        color: "#cfcfcf",
                      }}
                    />
                  </IconButton>
                )}
              </>
            )}
          </Stack>
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <IconButton
              onClick={() => {
                setCurrentChat({ type: "task", id: task_id });
              }}
            >
              <CommentIcon />
            </IconButton>
            <Rating
              name="no-value"
              value={flag}
              max={1}
              icon={<FlagRoundedIcon />}
              emptyIcon={<FlagOutlinedIcon />}
              onChange={
                collabDetail.collab.collab_archive_status === false
                  ? handleUpdatePriority
                  : undefined
              }
            />
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Divider />
      </DialogTitle>
      <DialogContent className="flex flex-row w-full h-full overflow-hidden">
        <Grid container xs={6} px={0.5} sx={{ height: "100%", width: "100%" }}>
          <Grid xs={12} height={"100%"} width={"100%"} overflow={"hidden"}>
            <StatusAndAssignTo
              handleUpdateAssignee={handleUpdateAssignee}
              assignMember={assignMember}
              unassignMember={unassignMember}
              assignedMembers={assignedMembers}
              ref={taskStatusRef}
              tasks={tasks}
              fetchtaskData={fetchtaskData}
              updateTaskData={updateTaskData}
              task_id={task_id}
              collabMember={collabMember}
              collabDetail={collabDetail}
            />
            {id && (
              <SubTasks
                collabDetail={collabDetail}
                task_id={task_id}
                collab_id={id}
                setCurrentChat={setCurrentChat}
                subTask={subTask}
                getAllSubtask={getAllSubtask}
              />
            )}
          </Grid>
        </Grid>
        <Grid
          container
          xs={6}
          sx={{
            borderLeft: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {currentChat.type === "task" && id && session && (
            <Chat
              collabDetail={collabDetail}
              taskDetail={taskDetail}
              task_id={currentChat.id}
              collab_id={id}
              token={session}
              chatType={currentChat.type}
              subTask={subTask?.subtasks}
              subTask_id={currentChat.id}
            />
          )}
          {subTask?.subtasks.map((subtask) => {
            return currentChat.type === "subtask" &&
              currentChat.id === subtask.SubtaskID &&
              id &&
              session ? (
              <Chat
                collabDetail={collabDetail}
                key={subtask.SubtaskID}
                taskDetail={taskDetail}
                task_id={currentChat.id}
                collab_id={id}
                token={session}
                chatType={currentChat.type}
                subTask={subTask?.subtasks}
                subTask_id={subtask.SubtaskID}
              />
            ) : null;
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

// Done
function Chat({
  taskDetail,
  task_id,
  collab_id,
  token,
  chatType,
  subTask,
  subTask_id,
  collabDetail,
}: {
  collabDetail: CollabContainer;
  token: Session;
  taskDetail?: TaskDetail;
  task_id: string;
  collab_id: string;
  subTask: Subtask[] | undefined;
  subTask_id: string;
  chatType: "task" | "subtask";
}) {
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLSpanElement>(null);
  const [chatMessages, setChatMessages] = useState<TaskComments>();
  const [chatInput, setChatInput] = useState("");
  const socket = useContext(SocketContext);

  const { data: session } = useSession();
  if (!session) return null;
  const sendMessage = () => {
    if (!session) return;
    if (!taskDetail) return;

    if (chatInputRef.current && chatType === "task") {
      const message = chatInputRef.current.value;
      const formData = new FormData();
      formData.append("task_id", task_id);
      formData.append("comment_text", message);

      try {
        AddTaskComment(session?.user.token, collab_id, formData);
        chatInputRef.current.value = "";
      } catch {
        console.log("Failed to add comment");
      }

      if (message) {
        const newComment = {
          comment_text: message,
          commented_by: {
            user_id: session.user.id,
            user_email: session.user.email,
            user_name: session.user.name,
            user_profile_img: session.user.image,
            user_role: "",
            user_status: true,
          },
          commented_at: new Date().toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
        };

        // setChatMessages((prevChatMessages) => {
        //   if (prevChatMessages) {
        //     return {
        //       ...prevChatMessages,
        //       comments: [...prevChatMessages.comments, newComment],
        //     };
        //   }
        //   return {
        //     comments: [newComment],
        //   };
        // });

        if (socket) {
          socket.emit("taskdialog", {
            groupId: collab_id,
            taskId: task_id,
            taskcomment: true,
            message: newComment,
          });
        }

        chatInputRef.current.value = "";
        chatInputRef.current.focus();
      }
    } else if (chatInputRef.current && chatType === "subtask") {
      const message = chatInputRef.current.value;
      const formData = new FormData();
      formData.append("subtask_id", subTask_id);
      formData.append("comment_text", message);

      try {
        addSubtaskComment(session?.user.token, collab_id, formData);

        chatInputRef.current.value = "";
      } catch {
        console.log("Failed to add comment");
      }

      if (message) {
        const newComment = {
          comment_text: message,
          commented_by: {
            user_id: session.user.id,
            user_email: session.user.email,
            user_name: session.user.name,
            user_profile_img: session.user.image,
            user_role: "",
            user_status: true,
          },
          commented_at: new Date().toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
        };

        // setChatMessages((prevChatMessages) => {
        //   if (prevChatMessages) {
        //     return {
        //       ...prevChatMessages,
        //       comments: [...prevChatMessages.comments, newComment],
        //     };
        //   }
        //   return {
        //     // return an initial state
        //     comments: [newComment],
        //   };
        // });

        if (socket) {
          socket.emit("taskdialog", {
            groupId: collab_id,
            subtaskId: subTask_id,
            subtaskcomment: true,
            message: newComment,
          });
        }
        chatInputRef.current.value = "";
        chatInputRef.current.focus();
      }
    }
    setChatInput("");
  };

  const getTaskComments = async () => {
    if (token.user.token) {
      await getTaskComment(token.user.token, collab_id, task_id).then(
        (data) => {
          setChatMessages(data);
        }
      );
    }
  };

  // Web Scoket for task comment
  useEffect(() => {
    const taskCommentHandler = (data: any) => {
      if (data.taskId === task_id) {
        setChatMessages((prevChatMessages) => {
          if (prevChatMessages) {
            return {
              ...prevChatMessages,
              comments: [...prevChatMessages.comments, data.message],
            };
          }
          return {
            comments: [data.message],
          };
        });
      }
    };

    if (socket) {
      socket.on("taskcommentchanged", taskCommentHandler);
    }
    return () => {
      if (socket) {
        socket.off("taskcommentchanged", taskCommentHandler);
      }
    };
  }, [socket]);

  // Web Scoket for subtask comment
  useEffect(() => {
    const subtaskCommentHandler = (data: any) => {
      if (data.subtaskId === subTask_id) {
        setChatMessages((prevChatMessages) => {
          if (prevChatMessages) {
            return {
              ...prevChatMessages,
              comments: [...prevChatMessages.comments, data.message],
            };
          }
          return {
            comments: [data.message],
          };
        });
      }
    };

    if (socket) {
      socket.on("subtaskcommentchanged", subtaskCommentHandler);
    }
    return () => {
      if (socket) {
        socket.off("subtaskcommentchanged", subtaskCommentHandler);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (chatType === "subtask") {
      if (token.user.token) {
        getSubtaskComment(token.user.token, collab_id, task_id).then((data) => {
          setChatMessages(data);
        });
      }
    } else {
      getTaskComments();
    }
  }, [task_id, token, chatType]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  if (!chatMessages) return null;
  return (
    <div className="w-full h-full">
      <Stack
        color="inherit"
        sx={{
          height: "10%",

          boxShadow:
            "0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        }}
      >
        {chatType === "task" && (
          <Typography variant="h6" fontSize={"16px"} noWrap p={2} my={"auto"}>
            <span className="text-[purple]">Task Comment</span> -{" "}
            {taskDetail?.task_title}
          </Typography>
        )}

        {chatType === "subtask" &&
          subTask?.map((subtask) => {
            return subtask.SubtaskID === task_id ? (
              <Typography
                key={subtask.SubtaskID}
                variant="h6"
                fontSize={"16px"}
                noWrap
                p={2}
                my={"auto"}
              >
                <span className="text-[blue]">Subask Comment</span> -{" "}
                {subtask.SubtaskTitle}
              </Typography>
            ) : null;
          })}
      </Stack>
      <Stack
        sx={{
          flexDirection: "column",
          height: "80%",
          overflow: "hidden",
        }}
      >
        <Stack
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            gap: 2,
            py: 2,
            // scrollbar style
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#ccc",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#bbb",
            },
          }}
        >
          {chatMessages?.comments?.map((comment) => {
            return (
              <ChatMessageDisplay
                chat={comment}
                token={session}
                key={comment.comment_id}
              />
            );
          })}
          <span
            style={{
              opacity: "hidden",
            }}
            ref={chatBottomRef}
          ></span>
        </Stack>
      </Stack>
      {collabDetail.collab.collab_archive_status === false && (
        <Stack
          px={2}
          direction={"row"}
          alignItems={"center"}
          gap={1}
          sx={{
            backgroundColor: "inherit",
            padding: 2,
            display: "flex",
            alignItems: "center",
            height: "10%",
            gap: 1,
            borderTop: "1px solid #e0e0e0",
            boxShadow:
              "0px 4px 5px 0px rgba(0,0,0,0.5),0px 1px 10px 0px rgba(0,0,0,0.12)",
          }}
        >
          <TextField
            inputRef={chatInputRef}
            fullWidth
            variant="standard"
            placeholder="Write a comment..."
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <IconButton
            onClick={sendMessage}
            disabled={chatInput === "" ? true : false}
          >
            <SendRoundedIcon
              sx={{
                color: chatInput === "" ? "333" : "blue",
              }}
            />
          </IconButton>
        </Stack>
      )}
    </div>
  );
}

//TODO: Add chat message display in testing
function ChatMessageDisplay({
  chat,
  token,
}: {
  chat: Comment;
  token: Session;
}) {
  return (
    <Stack
      px={2}
      direction={"row"}
      alignItems={"center"}
      justifyContent={
        token.user.email !== chat.commented_by.user_email
          ? "flex-start"
          : "flex-end"
      }
      gap={1}
    >
      {token.user.email !== chat.commented_by.user_email && (
        <div className="h-full flex flex-col justify-end">
          <Avatar src={chat.commented_by.user_profile_img} />
        </div>
      )}

      <Stack
        direction={"column"}
        alignItems={
          token.user.email !== chat.commented_by.user_email
            ? "flex-start"
            : "flex-end"
        }
        gap={1}
        px={0.5}
        width={"100%"}
      >
        <Typography
          sx={{
            fontWeight: "550",
            fontSize: "0.8rem",
            color: "#333",
          }}
        >
          {chat.commented_by.user_name}
        </Typography>

        <Tooltip
          placement={
            token.user.email !== chat.commented_by.user_email ? "right" : "left"
          }
          title={new Date(chat.commented_at).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
          sx={{}}
        >
          <Box
            sx={{
              px: "0.8rem",
              py: "0.5rem",
              borderRadius: "1.5rem",
              backgroundColor:
                token.user.name !== chat.commented_by.user_name
                  ? "#f5f5f5"
                  : "#e3f2fd",
              maxWidth: "70%",
              overflowWrap: "break-word",
            }}
          >
            <Typography variant="body1">{chat.comment_text}</Typography>
          </Box>
        </Tooltip>
      </Stack>

      {token.user.email === chat.commented_by.user_email && (
        <div className="h-full flex flex-col justify-end">
          <Avatar src={chat.commented_by.user_profile_img} />
        </div>
      )}
    </Stack>
  );
}

const StatusAndAssignTo = forwardRef(
  (
    {
      assignMember,
      unassignMember,
      updateTaskData,
      handleUpdateAssignee,
      assignedMembers,
      tasks,
      fetchtaskData,
      task_id,
      collabMember,
      collabDetail,
    }: {
      tasks: Task;
      task_id: string;
      fetchtaskData: TaskData;
      assignedMembers: User[];
      collabMember: CollabMember;
      assignMember: (member: User) => void;
      unassignMember: (member: User) => void;
      updateTaskData: () => void;
      handleUpdateAssignee: () => void;
      collabDetail: CollabContainer;
    },
    ref
  ) => {
    const [addMemberAnchorEl, setAddMemberAnchorEl] =
      useState<null | HTMLElement>(null);

    const handleAddMemberClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      setAddMemberAnchorEl(event.currentTarget);
    };

    const socket = useContext(SocketContext);
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const id = searchParams?.get("groupId");

    const UpdateStatus = async (task_status_id: string, task_id: string) => {
      const formData = new FormData();
      formData.append("task_status_id", task_status_id);
      formData.append("task_id", task_id);
      if (session) {
        const res = await UpdateTaskStatus(
          session?.user.token,
          formData,
          String(id)
        );
        if (res.success) {
          toast.success("Task status updated successfully");
          if (socket) {
            socket.emit("task", {
              groupId: id,
              taskchanged: true,
            });
          }
        } else {
          toast.error("Failed to update task status");
        }
      }
      if (updateTaskData) {
        updateTaskData();
      }
    };

    const uniqueStatusNames = [
      ...new Set(fetchtaskData.tasks.map((task) => task.task_status_name)),
    ];

    return (
      <Stack height={"20%"}>
        <Stack
          direction={"column"}
          sx={{
            px: "24px",
          }}
          justifyContent={"space-evenly"}
          height={"100%"}
        >
          <Stack direction={"row"} alignItems={"center"} gap={2}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "550",
              }}
            >
              Status:
            </Typography>
            {collabDetail.collab.collab_archive_status === false ? (
              <Stack
                sx={{
                  "& .MuiSelect-select": {
                    borderRadius: "2rem",
                    fontWeight: "550",
                    pl: "1rem",
                    color: `${tasks?.task_status_color}`,
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "2rem",
                    width: "15rem",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: `1px solid ${tasks?.task_status_color}`,
                    },
                  },
                  "& .MuiInputBase-root": {
                    width: "15rem",
                    borderRadius: "2rem",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    width: "15rem",
                    border: `1px solid ${tasks?.task_status_color}`,
                  },
                }}
              >
                <Select
                  inputRef={ref}
                  defaultValue={tasks?.task_status_name}
                  sx={{
                    width: "10rem",
                    minHeight: "2.5rem",
                    maxHeight: "3rem",
                  }}
                >
                  {uniqueStatusNames.map((statusName) => {
                    const status = fetchtaskData.tasks.find(
                      (task) => task.task_status_name === statusName
                    );

                    return status ? (
                      <MenuItem
                        value={status.task_status_name}
                        key={status.task_status_id}
                        onClick={() =>
                          UpdateStatus(status.task_status_id, task_id)
                        }
                        sx={{
                          color: "black",
                          fontWeight: "550",
                          "&.Mui-selected": {
                            backgroundColor: status.task_status_color,
                            color: "white",
                            ":hover": {
                              backgroundColor: status.task_status_color,
                              color: "white",
                            },
                          },
                          ":hover": {
                            backgroundColor: status.task_status_color,
                            color: "white",
                          },
                        }}
                      >
                        {status.task_status_name}
                      </MenuItem>
                    ) : null;
                  })}
                </Select>
              </Stack>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  textWrap: "nowrap",
                  fontWeight: "bold",
                  color: `${tasks?.task_status_color}`,
                }}
              >
                {tasks?.task_status_name}
              </Typography>
            )}
          </Stack>
          <Stack direction={"row"}>
            <Typography
              variant="body1"
              pr={1}
              sx={{
                textWrap: "nowrap",
                fontWeight: "550",
              }}
            >
              Assigned to:
            </Typography>
            <Stack
              flexWrap={"wrap"}
              direction={"row"}
              gap={0.5}
              alignItems={"center"}
            >
              {assignedMembers.slice(0, 5).map((member) => {
                return (
                  <Avatar
                    key={member.user_email}
                    src={member.user_profile_img}
                    title={member.user_name}
                    sx={{
                      width: 28,
                      height: 28,
                    }}
                  />
                );
              })}
              {assignedMembers.length > 5 && (
                <Avatar
                  sx={{
                    alignContent: "center",
                    textAlign: "center",
                    fontSize: "1rem",
                    width: 28,
                    height: 28,
                  }}
                >
                  +{assignedMembers.length - 1}
                </Avatar>
              )}

              {collabDetail.collab.collab_archive_status === false && (
                <IconButton
                  sx={{
                    width: 28,
                    height: 28,
                  }}
                  onClick={handleAddMemberClick}
                >
                  <ControlPointRoundedIcon
                    sx={{
                      width: 28,
                      height: 28,
                    }}
                  />
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Stack>

        <Menu
          anchorEl={addMemberAnchorEl}
          open={Boolean(addMemberAnchorEl)}
          onClose={() => {
            setAddMemberAnchorEl(null);
            handleUpdateAssignee();
          }}
          sx={{
            maxHeight: "50vh",
          }}
          //onClick={handleUpdateAssignee}
        >
          {collabMember.members.map((user) => {
            const isAssigned = assignedMembers.some(
              (m) => m.user_email === user.user_email
            );

            return (
              <MenuItem
                key={user.user_email}
                onClick={() => {
                  if (isAssigned) {
                    return unassignMember(user);
                  }
                  return assignMember(user);
                }}
              >
                <Stack direction={"row"} alignItems={"center"} gap={1}>
                  <Checkbox checked={isAssigned} />
                  <Avatar src={user.user_profile_img} />
                  <Typography variant="body1" noWrap>
                    {user.user_name}
                  </Typography>
                </Stack>
              </MenuItem>
            );
          })}
        </Menu>
      </Stack>
    );
  }
);

function SubTasks({
  task_id,
  collab_id,
  setCurrentChat,
  subTask,
  getAllSubtask,
  collabDetail,
}: {
  task_id: string;
  collab_id: string;
  setCurrentChat: (chat: { type: "task" | "subtask"; id: string }) => void;
  subTask: Subtasks | undefined;
  getAllSubtask: () => void;
  collabDetail: CollabContainer;
}) {
  const { data: session } = useSession();
  const socket = useContext(SocketContext);

  if (!session) return null;
  const [subtaskName, setSubtaskName] = useState("");
  const [updateTitleSuccess, setUpdateTitleSuccess] = useState<boolean>(false);
  // Socket
  const emitSocket = () => {
    if (socket) {
      socket.emit("taskdialog", {
        groupId: collab_id,
        taskId: task_id,
        subtaskchanged: true,
        userId: session.user.id,
      });
    }
  };

  const handelCreateSubtask = async (event: React.FormEvent) => {
    event?.preventDefault();
    const formData = new FormData();
    formData.append("task_id", task_id);
    formData.append("subtask_title", subtaskName);
    if (!subtaskName) {
      return;
    }
    try {
      const createsubtask = await CreateSubtask(
        session?.user.token,
        collab_id,
        formData
      );
      if (createsubtask && createsubtask.success) {
        toast.success("Subtask created successfully");
        setSubtaskName("");
        emitSocket();
      } else {
        toast.error("No permission to create subtask");
      }
    } catch {
      toast.error("Failed to create subtask");
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubtaskName(event.target.value);
  };

  const handleDeleteSubtask = async (subtask_id: string) => {
    const formData = new FormData();
    formData.append("subtask_id", subtask_id);

    try {
      const deletesubtask = await DeleteSubtask(
        session?.user.token,
        collab_id,
        formData
      );
      if (deletesubtask && deletesubtask.success) {
        toast.success("Subtask deleted successfully");
        setSubtaskName("");
        emitSocket();
      } else {
        toast.error("No permission to delete subtask");
      }
    } catch {
      console.log("Failed to delete subtask");
    }
  };

  const handleUpdateSubtaskName = async (
    subtask_id: string,
    subtask_title: string
  ) => {
    const fromData = new FormData();
    fromData.append("subtask_id", subtask_id);
    fromData.append("subtask_title", subtask_title);
    if (subtask_title) {
      const res = await UpdateSubtaskName(
        session?.user.token,
        collab_id,
        fromData
      );
      if (res && res.success) {
        setUpdateTitleSuccess(true);
        toast.success("Subtask name updated successfully");
        emitSocket();
      } else {
        setUpdateTitleSuccess(false);
        // setSubtaskName("");
        toast.error("No permission to update subtask name");
      }
    }
  };

  return (
    <Stack
      sx={{
        pl: 1,
        width: "100%",
        height: "80%",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        py={1}
        sx={{
          borderBottom: "1px solid #cfcfcf",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.2rem",
            fontWeight: "550",
            pl: 1,
          }}
        >
          SUBTASK
        </Typography>
      </Stack>

      <Stack
        direction={"column"}
        sx={{
          overflowY: "auto",
          padding: "0.5rem",
          // scrollbar style
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#ccc",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#bbb",
          },
        }}
      >
        {subTask?.subtasks.map((subtask) => (
          <SubTaskList
            collabDetail={collabDetail}
            key={subtask.SubtaskID}
            title={subtask.SubtaskTitle}
            subtask_id={subtask.SubtaskID}
            handleDeleteSubtask={handleDeleteSubtask}
            handleUpdateSubtaskName={handleUpdateSubtaskName}
            setCurrentChat={setCurrentChat}
            updateTitleSuccess={updateTitleSuccess}
          />
        ))}

        {collabDetail.collab.collab_archive_status === false && (
          <Stack direction={"row"} gap={1} alignItems={"center"} pl={"1.2rem"}>
            <form onSubmit={handelCreateSubtask} className="w-full">
              <TextField
                fullWidth
                required
                variant="standard"
                placeholder="Add subtask"
                value={subtaskName}
                onChange={handleInput}
              />
            </form>
            <IconButton onClick={handelCreateSubtask}>
              <AddRoundedIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

function SubTaskList({
  title,
  subtask_id,
  handleDeleteSubtask,
  handleUpdateSubtaskName,
  setCurrentChat,
  collabDetail,
  updateTitleSuccess,
}: {
  title: string;
  subtask_id: string;
  collabDetail: CollabContainer;
  updateTitleSuccess: boolean;
  handleDeleteSubtask: (subtask_id: string) => void;
  handleUpdateSubtaskName: (subtask_id: string, subtask_title: string) => void;
  setCurrentChat: (chat: { type: "task" | "subtask"; id: string }) => void;
}) {
  const [editTaskTitle, setEditTaskTitle] = useState<boolean>(false);
  const taskStatusRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(title);

  const defaultTitle = title;

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValue(value);
  };

  const [currentSubtaskName, setCurrentSubtaskName] = useState(title);

  const handleClearInput = () => {
    setInputValue(defaultTitle);
    setEditTaskTitle(false);
  };
  const UpdateSubtaskName = async (
    subtask_id: string,
    subtask_title: string
  ) => {
    if (updateTitleSuccess === false) {
      setInputValue(currentSubtaskName);
    } else {
      setCurrentSubtaskName(subtask_title);
    }
    await handleUpdateSubtaskName(subtask_id, subtask_title);
    setEditTaskTitle(false);
  };

  useEffect(() => {
    setInputValue(title);
  }, [title]);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      borderBottom={"1px solid #e0e0e0"}
      pl={2.5}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        className="truncate max-w-[15rem] sm:max-w-[20rem] md:max-w-[30rem] lg:max-w-[45rem] "
      >
        {editTaskTitle ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              UpdateSubtaskName(subtask_id, inputValue);
              setEditTaskTitle(false);
            }}
          >
            <TextField
              fullWidth
              sx={{
                width: "30rem",
              }}
              required
              id="subtask-title"
              name="subtask_title"
              variant="standard"
              placeholder="Enter task title"
              value={inputValue}
              onChange={handleChangeInput}
              inputRef={taskStatusRef}
            />
          </form>
        ) : (
          <>
            <Typography variant="body1" noWrap>
              {inputValue}
            </Typography>
          </>
        )}
      </Stack>
      <Stack direction={"row"} gap={1}>
        {collabDetail.collab.collab_archive_status === false && (
          <>
            {!editTaskTitle ? (
              <IconButton onClick={() => setEditTaskTitle(true)}>
                <EditNoteRoundedIcon />
              </IconButton>
            ) : (
              <IconButton onClick={handleClearInput}>
                <ClearRoundedIcon />
              </IconButton>
            )}

            <IconButton onClick={() => handleDeleteSubtask(subtask_id)}>
              <DeleteRoundedIcon />
            </IconButton>
          </>
        )}
        <IconButton
          onClick={() => {
            setCurrentChat({ type: "subtask", id: subtask_id });
          }}
        >
          <CommentIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
