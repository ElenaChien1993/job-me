import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';

const PrivateRoute = ({ children, isLogIn }) => {
  let location = useLocation();
  const props = useOutletContext();
  
  return isLogIn ? (
    <Outlet context={props}/>
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default PrivateRoute;
