// import React from 'react'
import { useEffect } from 'react';
import GptSearch from './GptSearch'
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';


const Browse = () => {
  const dispatch=useDispatch()
  useEffect(() => {
    // Fetch user profile data from the backend
    fetch("http://localhost:8080/profile")
      .then((response) => response.json())
      .then((data) => {
        (data.user);
      }).then((user)=>{dispatch(addUser(user))}
        
      )
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);
  return (
    <div className='bg-gray-950'>
      
      <GptSearch></GptSearch>
      

      
    </div>
  )
}

export default Browse