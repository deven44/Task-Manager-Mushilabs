import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = ({ search, filterStatus }) => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [page, setPage] = useState(1);
  const [fetchData, { loading }] = useFetch();
  const limit = 3;

  const fetchTasks = useCallback(() => {
    let url = `/tasks?search=${encodeURIComponent(search)}&status=${filterStatus}&page=${page}&limit=${limit}`;
    const config = { url, method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => {
      setTasks(data.tasks);
      setTotalTasks(data.total);
    });
  }, [authState.token, fetchData, search, filterStatus, page]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  };

  const totalPages = Math.ceil(totalTasks / limit);

  return (
    <div className="my-2 mx-auto max-w-[700px] py-4">
      {tasks.length !== 0 && <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your tasks ({totalTasks})</h2>}

      {loading ? <Loader /> : (
        <div>
          {tasks.length === 0 ? (
            <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
              <span>No tasks found</span>
              <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new task</Link>
            </div>
          ) : (
            tasks.map((task, index) => {
              const globalIndex = (page - 1) * limit + index + 1;
              return (
                <div key={task._id} className='bg-white my-4 p-8 text-gray-600 rounded-md shadow-md'>
                  <div className='flex items-center mb-2'>
                    <span className='font-medium'>Task {globalIndex}: {task.title}</span>
                    
                    <span className={`ml-4 px-2 py-1 rounded text-white text-sm ${
                      task.taskStatus === "done" ? "bg-gray-600" :
                      task.taskStatus === "pending" ? "bg-gray-600" :
                      "bg-gray-600"
                    }`}>
                      {"Status: "}{task.taskStatus}
                    </span>

                    <span className={`ml-2 px-2 py-1 rounded text-white text-sm ${
                      task.priority === "high" ? "bg-red-600" :
                      task.priority === "medium" ? "bg-yellow-500" :
                      task.priority === "low" ? "bg-green-500" :
                      "bg-gray-400"
                    }`}>
                      {"Priority: "}{task.priority}
                    </span>

                    <Tooltip text={"Edit this task"} position={"top"}>
                      <Link to={`/tasks/${task._id}`} className='ml-auto mr-4 text-gray-600 cursor-pointer'>
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>
                    <Tooltip text={"Delete this task"} position={"top"}>
                      <span className='text-gray-500 cursor-pointer' onClick={() => handleDelete(task._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>
                  <div className='whitespace-pre mb-2'>{task.description}</div>
                  <div className='text-sm text-gray-400'>Created on: {new Date(task.createdAt).toLocaleString()}</div>
                </div>
              );
            })
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)} className="px-3 py-1 border rounded">Prev</button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-primary text-white' : ''}`}
                >{i + 1}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)} className="px-3 py-1 border rounded">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
