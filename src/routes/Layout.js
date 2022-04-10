import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import firebase from '../utils/firebase';

const Container = styled.div`
  margin: 0 auto;
  padding-top: 20px;
  width: 80%;
`;

const Layout = ({ isLogin }) => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    firebase.signOut()
      .then(() => {
        alert('已成功登出');
        navigate('/login', { state: { from: { pathname: '/notes' } } });
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    firebase.getNotes('UQjB80NDcqNauWxuSKl2y7VQg5J3').then(snaps => {
      snaps.forEach(doc => {
        setNotes(prev => [...prev, doc.data()]);
      });
    });
  }, []);

  return (
    <Container>
      <nav>
        <ul>
          <li><Link to="/notes">Notes</Link></li>
          <li><Link to="/practice">Practice</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          {!isLogin && (<button onClick={handleLogout}>Log out</button>)}
        </ul>

      </nav>
      <Outlet context={[notes]}/>
    </Container>
  )
}

export default Layout;
