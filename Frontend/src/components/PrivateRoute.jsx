import { useContext} from "react";
import { Navigate } from "react-router-dom";
import { UserConext } from "../context/UserContext";

const PrivateRoute = ({ children, role }) => {
  const { user,loading } = useContext(UserConext);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator instead of redirecting immediately
  }

  if (!user) {
    return <Navigate to="/" />;
  }
  
  if (!role.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
