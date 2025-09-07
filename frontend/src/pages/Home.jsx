import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState;

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    document.title = isLoggedIn ? `${authState.user.name}'s tasks` : "Task Manager";
  }, [authState, isLoggedIn]);

  return (
    <MainLayout>
      {!isLoggedIn ? (
        <div className='bg-primary text-white h-[40vh] py-8 text-center'>
          <h1 className='text-2xl'> Welcome to Task Manager App</h1>
          <Link to="/signup" className='mt-10 text-xl block space-x-2 hover:space-x-4'>
            <span className='transition-[margin]'>Join now to manage your tasks</span>
            <span className='relative ml-4 text-base transition-[margin]'>
              <i className="fa-solid fa-arrow-right"></i>
            </span>
          </Link>
        </div>
      ) : (
        <>
          <h1 className='text-lg mt-8 mx-8 border-b border-b-gray-300'>
            Welcome {authState.user.name}
          </h1>

          {/* Search & Filter */}
          <div className="max-w-[700px] m-auto mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Pass search & filter to Tasks */}
          <Tasks search={search} filterStatus={filterStatus} />
        </>
      )}
    </MainLayout>
  )
}

export default Home;
