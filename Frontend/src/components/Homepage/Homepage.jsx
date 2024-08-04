import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { isTokenExpired } from "../../utils/authutil";

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken-tok");
    if (!token || isTokenExpired(token)) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }


  }, []);



  function goto(path) {
    navigate(path);
  }

  function logout() {
    Cookies.remove("authToken-tok");
    setIsAuthenticated(false);
    goto("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md p-4 flex justify-between items-center">
        <h1 onClick={() => goto('/')} className="text-3xl font-extrabold text-indigo-600">StreamHub</h1>
        <div className="space-x-4">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => goto("/login")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center p-8">
        <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-2xl rounded-3xl p-12 max-w-lg w-full text-center">
          <h2 className="text-4xl font-bold mb-8 text-indigo-800">
            Welcome to StreamHub!
          </h2>
          <p className="text-gray-600 mb-8">
            Connect with your audience and share your passion in real-time.
          </p>
          <div className="flex flex-col space-y-6">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  goto("/login");
                } else {
                  goto("/broadcast");
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Start Streaming
            </button>
            <button
              onClick={() => goto("/view")}
              className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-8 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Browse Streams
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
