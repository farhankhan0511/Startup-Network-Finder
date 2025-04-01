import { useEffect } from 'react';
import GptSearch from './GptSearch';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';

const Browse = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store?.user);

  useEffect(() => {
    if (!user) {
      fetch("http://localhost:8080/profile", { credentials: "include" })
        .then((response) => response.json())
        .then((data) => {
          dispatch(addUser(data.user));
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [user, dispatch]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center'>
      <h1 className='text-4xl font-bold text-white mb-8'>Welcome to Startup Network Finder</h1>
      <GptSearch />
    </div>
  );
};

export default Browse;
