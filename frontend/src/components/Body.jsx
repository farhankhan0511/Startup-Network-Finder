// import  { useEffect } from 'react'
import Login from './Login'
import Browse from './Search'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import {addUser, removeUser} from "../utils/userSlice"
const Body = () => {
    // const dispatch=useDispatch()
    const approuter=createBrowserRouter([
        {
            path:"/",
            element:<Login />
        },
        {
            path:"/browse",
            element:<Browse />
        },
    ]);
   

  return (
    <div>
        <RouterProvider router={approuter}/>
    </div>
  )
};

export default Body;