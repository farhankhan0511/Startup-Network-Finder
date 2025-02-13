import 'react';

const Login = () => {
  
  // This function redirects the browser to your backend's OAuth endpoint.
  const handleGoogleSignIn = () => {
    // Replace with your backend URL; e.g., http://localhost:8080
    window.location.href = `http://localhost:8080/auth/google`;
  };

  return (
    <div>
     
      
      

      <div className="p-12 bg-opacity-80 bg-black absolute w-full md:w-3/12 my-40 mx-auto right-0 left-0 text-white">
        <h1 className="text-2xl m-2 p-4">Sign in with Google</h1>
        <button
          onClick={handleGoogleSignIn}
          className="bg-red-700 p-4 m-2 w-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
