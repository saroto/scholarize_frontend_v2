import { Grid } from "@mui/material";
import TaskListViewCard from "./list_view_card";
import {
  CollabContainer,
  CollabMember,
  Task,
  TaskData,
  TaskDetail,
} from "@/types";
export default function TasksListView({
  fetchtaskData,
  updateTaskData,
  createTask,
  deleteTask,
  updatePriority,
  collabDetail,
  collabMember,
}: {
  fetchtaskData: TaskData;
  updateTaskData: () => void;
  createTask: (task_title: string, task_status_id: string) => void;
  deleteTask: (task_id: string) => void;
  updatePriority: (task_id: string) => void;
  collabDetail: CollabContainer;
  collabMember: CollabMember;
}) {
  return (
    <Grid container spacing={4} direction={"column"} p={0}>
      {fetchtaskData &&
        fetchtaskData.tasks.map((task) => (
          <Grid item xs key={task.task_status_id}>
            <TaskListViewCard
              title={task.task_status_name}
              color={task.task_status_color}
              updateTaskData={updateTaskData}
              task={task}
              fetchtaskData={fetchtaskData}
              createTask={createTask}
              deleteTask={deleteTask}
              updatePriority={updatePriority}
              collabDetail={collabDetail}
              collabMember={collabMember}
            />
          </Grid>
        ))}
    </Grid>
  );
}
