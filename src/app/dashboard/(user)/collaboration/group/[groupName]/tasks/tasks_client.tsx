/** @format */

"use client";
import {
  Box,
  Breadcrumbs,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import { useEffect, useState, useContext } from "react";
import TasksBoardView from "./board_view";
import TasksListView from "./list_view";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { TaskData, CollabMember, CollabContainer } from "@/types";
import {
  getAllTask,
  createTask,
  DeleteTask,
  updatePriority,
  getCollabDetail,
  getCollabMember,
} from "@/app/api/service/collab/task";
import Link from "next/link";
import ScrollTop from "@/components/scroll-to-top";
import { Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { SocketContext } from "@/socketio/SocketIOProvider";

type Props = {
  params: { groupName: string };
};

export default function CollaborationGroupTaskClient({ params }: Props) {
  const [tab, setTab] = useState<string>("1");
  const searchParams = useSearchParams();
  const id = searchParams?.get("groupId");

  const { data: session } = useSession();
  const [taskData, setTaskData] = useState<TaskData>();
  const [collabDetail, setCollabDetail] = useState<CollabContainer>();

  const [collabMember, setCollabMember] = useState<CollabMember>();
  const socket = useContext(SocketContext);

  const fetchCollabMember = async () => {
    if (session?.user.token) {
      getCollabMember(session.user.token, String(id))
        .then((data) => {
          setCollabMember(data);
        })
        .catch(() => {
          // alert(error);
          console.error("Failed to fetch tasks");
        });
    }
  };

  useEffect(() => {
    fetchCollabMember();
  }, [id, session?.user.token]);

  //TODO: Fetch the task detail should be delete
  const fetchCollabDetail = async () => {
    if (session?.user.token && id) {
      getCollabDetail(session.user.token, String(id))
        .then((data) => {
          setCollabDetail(data);
        })
        .catch((error) => {
          // alert(error);
          console.error("Failed to fetch tasks", error);
        });
    }
  };

  const fetchTaskData = async () => {
    if (session?.user.token && id) {
      getAllTask(session.user.token, String(id))
        .then((data) => {
          setTaskData(data);
        })
        .catch((error) => {
          // alert(error);
          console.error("Failed to fetch tasks", error);
        });
    }
  };

  useEffect(() => {
    if (id && session?.user.token) {
      fetchTaskData();
    }
  }, [id, session?.user.token]);

  // Task Fetching on task creation using Socket
  useEffect(() => {
    const taskCreatedHandler = (data: any) => {
      if (data.groupId !== id) return;
      fetchTaskData();
    };

    if (socket) {
      socket.on("taskchanged", taskCreatedHandler);

      return () => {
        socket.off("taskchanged", taskCreatedHandler);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (id && session?.user.token) {
      fetchCollabDetail();
    }
  }, [id, session?.user.token]);

  const updateTaskData = () => {
    fetchTaskData();
  };

  const handelCreateTask = async (
    task_title: string,
    task_status_id: string
  ) => {
    const formData = new FormData();
    formData.append("task_title", task_title);
    formData.append("task_status_id", task_status_id);

    if (!session) return;

    try {
      const res = await createTask(session?.user.token, Number(id), formData);
      if (res && res.success) {
        toast.success("Task created successfully");
        if (socket) {
          socket.emit("task", {
            groupId: id,
            taskchanged: true,
          });
        }
      } else {
        toast.error("Failed to create task");
      }
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleDeleteTask = async (task_id: string) => {
    const formdata = new FormData();
    formdata.append("task_id", task_id);
    try {
      const res = await DeleteTask(
        String(session?.user.token),
        formdata,
        String(id)
      );
      // Remove the deleted task from the task data
      if (res.success) {
        toast.success("Task deleted successfully");
        if (socket) {
          socket.emit("task", {
            groupId: id,
            taskchanged: true,
          });
        }
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleUpdatePriority = async (task_id: string) => {
    const formdata = new FormData();
    formdata.append("task_id", task_id);

    try {
      const res = await updatePriority(
        String(session?.user.token),
        formdata,
        String(id)
      );
      if (res.success) {
        toast.success("Task priority updated successfully");

        if (socket) {
          socket.emit("task", {
            groupId: id,
            taskchanged: true,
          });
        }
      } else {
        toast.error("Failed to update task priority");
      }
    } catch (error) {
      toast.error("Failed to update task priority");
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

  return (
    <>
      <div id="back-to-top-anchor" />
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <Container maxWidth={false} disableGutters>
        <Stack
          sx={{
            height: "72px",
            width: "100%",
            borderBottom: "1px solid #e0e0e0",
          }}
          spacing={8}
          alignItems={"center"}
          justifyContent={"flex-start"}
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

            <Tooltip title={decodeURIComponent(params.groupName)}>
              <Typography
                key="3"
                color="text.secondary"
                noWrap
                maxWidth="100px"
              >
                {decodeURIComponent(params.groupName)}
              </Typography>
            </Tooltip>
            <Typography key="3" color="text.secondary">
              Tasks
            </Typography>
          </Breadcrumbs>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab
              label="Board View"
              icon={<GridViewIcon />}
              iconPosition="start"
              value="1"
            />
            <Tab
              label="List View"
              icon={<ListIcon />}
              iconPosition="start"
              value="2"
            />
          </Tabs>
        </Stack>
        <Box
          sx={{
            m: "1rem",
          }}
        >
          {tab === "1" ? (
            taskData && collabDetail && collabMember ? (
              <TasksBoardView
                fetchtaskData={taskData}
                updateTaskData={updateTaskData}
                createTask={handelCreateTask}
                deleteTask={handleDeleteTask}
                updatePriority={handleUpdatePriority}
                collabDetail={collabDetail}
                collabMember={collabMember}
              />
            ) : (
              <CircularProgress
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )
          ) : null}

          {tab === "2" ? (
            taskData && collabDetail && collabMember ? (
              <TasksListView
                fetchtaskData={taskData}
                updateTaskData={updateTaskData}
                createTask={handelCreateTask}
                deleteTask={handleDeleteTask}
                updatePriority={handleUpdatePriority}
                collabDetail={collabDetail}
                collabMember={collabMember}
              />
            ) : (
              <Typography variant="h6">Loading...</Typography>
            )
          ) : null}
        </Box>
      </Container>
    </>
  );
}
