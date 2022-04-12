import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, isLogIn }) => {
  let location = useLocation();
  return isLogIn ? (children) : (
    <Navigate to="/login" state={{ from: location }} />
  )
};

export default PrivateRoute;