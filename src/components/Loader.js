import styled from "styled-components";
import { ReactComponent as LoaderSvg } from "../images/loader.svg";

const Container = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: rgba(255, 255, 255);
  z-index: 5;
`;

const Img = styled(LoaderSvg)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Loader = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <Container>
          <Img alt="Loading" />
        </Container>
      )}
    </>
  );
};

export default Loader;
