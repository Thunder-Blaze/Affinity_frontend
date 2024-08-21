import { createContext, useCallback, useEffect, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Check for stored user data in local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array ensures this runs only once after initial render

  // Logout function
  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  // Login function
  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);

      try {
        const response = await fetch("https://9a71-117-219-22-193.ngrok-free.app/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(loginInfo),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("User", JSON.stringify(data));
        setUser(data);
        
        console.log("User successfully logged in:", data); // Log success message

      } catch (error) {
        setLoginError(error.message);
        setUser(null);
        console.error("Login error:", error.message); // Log error message
      } finally {
        setIsLoginLoading(false);
      }
    },
    [loginInfo]
  );

  // Update login information
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  // Registration state and functions
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [registerInfo, setRegisterInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    gender: "",
    age: null,
    location: "",
    openness: "",
    relation_type: "",
    interest: "",
    exp_qual: "",
    social_habits: "",
    past_relations: "",
    password: "",
    image_url: "",
    score: 0,
  });

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  // Register function
  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);

      try {
        const response = await axios.post(
          "http://localhost:3001/signup",
          registerInfo
        );

        localStorage.setItem("User", JSON.stringify(response.data));
        setUser(response.data);

        console.log("User successfully registered:", response.data); // Log success message

      } catch (error) {
        setRegisterError(error.response?.data?.message || error.message);
        console.error("Registration error:", error.response?.data?.message || error.message); // Log error message
      } finally {
        setIsRegisterLoading(false);
      }
    },
    [registerInfo]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
        setLoginError,

        registerInfo,
        setRegisterInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        setRegisterError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};