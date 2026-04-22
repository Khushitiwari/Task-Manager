
import { useTasks } from "../hooks/useTasks";

const Dashboard = () => {
  const { tasks, addTask, removeTask } = useTasks();

  return (
    <div>
      <button onClick={() => addTask({ title: "New Task" })}>
        Add Task
      </button>

      {tasks.map((task) => (
        <div key={task._id}>
          <h3>{task.title}</h3>
          <button onClick={() => removeTask(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;