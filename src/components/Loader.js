import styled from 'styled-components';
import PropTypes from 'prop-types';

import { ReactComponent as LoaderSvg } from '../images/loader.svg';

const Container = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: ${({ hasShadow }) =>
    hasShadow ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255)'};
  z-index: 10;
`;

const Img = styled(LoaderSvg)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Loader = ({ isLoading, hasShadow }) => {
  return (
    <>
      {isLoading && (
        <Container hasShadow={hasShadow}>
          <Img alt="Loading" />
        </Container>
      )}
    </>
  );
};

Loader.propTypes = {
  isLoading: PropTypes.bool,
  hasShadow: PropTypes.bool,
};

export default Loader;
