// import React from 'react'
import { useEffect } from 'react';
import GptSearch from './GptSearch'
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';


const Browse = () => {
  const dispatch=useDispatch()
  const user=useSelector((store)=>store?.user)
  useEffect(() => {
    // Fetch user profile data from the backend
    !user && fetch("http://localhost:8080/profile",{credentials: "include"})
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