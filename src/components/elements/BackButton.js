import { useNavigate } from 'react-router-dom';

import { Button, useDisclosure } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { device, color } from '../../style/variable';
import AlertModal from '../AlertModal';

const StyledButton = styled(Button)`
  && {
    position: ${props => (props.$isStart ? 'static' : 'absolute')};
    left: 0;
    top: 0;
    @media ${device.mobileM} {
      position: static;
      margin-bottom: 10px;
    }
    @media ${device.tablet} {
      position: ${props => (props.$isStart ? 'static' : 'absolute')};
      margin-bottom: 0;
    }
  }
`;

const BackButton = ({ path, $isStart }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ id: 'alert' });
  const navigate = useNavigate();

  const goTo = () => {
    navigate(path);
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        header="回練習首頁"
        content="目前設定與記錄將消失，確定返回練習首頁嗎？"
        actionText="確定"
        action={goTo}
      />
      <StyledButton
        size="sm"
        leftIcon={<ChevronLeftIcon />}
        variant="outline"
        color={color.primary}
        borderColor={color.primary}
        $isStart={$isStart}
        onClick={onOpen}
      >
        回前頁
      </StyledButton>
    </>
  );
};

BackButton.propTypes = {
  path: PropTypes.string.isRequired,
  $isStart: PropTypes.bool,
};

export default BackButton;
