import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ isLogIn }) => {
  let location = useLocation();
  const props = useOutletContext();
  
  return isLogIn ? (
    <Outlet context={props}/>
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

PrivateRoute.propTypes = {
  isLogIn: PropTypes.bool,
};

export default PrivateRoute;
