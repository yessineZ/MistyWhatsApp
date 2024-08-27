"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from '../../../convex/_generated/api'; 

type Task = {
  _id: string | number;
  text: string;
};

const TasksPage = () => {
  const tasks = useQuery(api.tasks.getTasks) as Task[] | undefined;
  const deleteTask = useMutation(api.tasks.deleteTask) ; 
  return (
    <div className="flex flex-col p-10 gap-5">
      <h1 className="text-4xl">All tasks are here in real time</h1>
      {tasks ? (
        tasks.map((task: Task) => (
          <div key={task._id} className="border-2 border-gray-200 px-4 py-2 rounded-md mb-2 flex max-w-md justify-between items-center ">
            <p>{task.text}</p>
            <button className="bg-red-600 text-white rounded hover:bg-red-950 hover:p-2 transition-all duration-150" onClick={
             async () => {
                await deleteTask({ id  : task._id})
              }
            }>Delete</button>
          </div>

        ))
      ) : (
        <p>Loading tasks...</p>
      )}
    </div>
  );
};

export default TasksPage;
