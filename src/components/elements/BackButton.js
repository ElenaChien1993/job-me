import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

const StyledButton = styled(Button)`
  && {
    position: ${(props) => (props.isStart ? 'static' : 'absolute')};
    left: 0;
    top: 0;
  }
`;

const BackButton = ({ path, isStart }) => {
  return (
    <Link to={path}>
      <StyledButton
        size="sm"
        leftIcon={<ChevronLeftIcon />}
        variant="outline"
        colorScheme="teal"
        isStart={isStart}
      >
        回前頁
      </StyledButton>
    </Link>
  );
};

export default BackButton;
