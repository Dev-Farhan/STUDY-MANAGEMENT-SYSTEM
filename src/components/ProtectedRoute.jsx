// components/ProtectedRoute.jsx
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authToken"); // or sessionStorage
  return isAuthenticated ? children : <Navigate to="/sign-in"  />;
};

export default ProtectedRoute;
