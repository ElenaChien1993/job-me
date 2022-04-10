import { Outlet, Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  margin: 0 auto;
  padding-top: 20px;
  width: 80%;
`;

const Layout = () => {

  return (
    <Container>
      <nav>
        <ul>
          <li><Link to="/notes">Notes</Link></li>
          <li><Link to="/practice">Practice</Link></li>
        </ul>

      </nav>
      <Outlet />
    </Container>
  )
}

export default Layout;
