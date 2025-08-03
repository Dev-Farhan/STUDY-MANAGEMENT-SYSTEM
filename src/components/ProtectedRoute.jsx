// components/ProtectedRoute.jsx
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("sb-qicafrmlpshpoxowcakl-auth-token"); // or sessionStorage
  // console.log(localStorage.getItem("sb-qicafrmlpshpoxowcakl-auth-token"),'pppppppppppppppppppppp')
  return isAuthenticated ? children : <Navigate to="/sign-in"  />;
};

export default ProtectedRoute;
