import { Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import { color } from '../../style/variable';

const StyledAddButton = styled(Button)`
  height: 25px;
  color: ${color.primary};
  font-size: 14px;
  margin: 10px 0;
`;

const AddField = ({ setter, objectKey, newValue }) => {
  const handleAddField = e => {
    setter(prev => {
      return {
        ...prev,
        [objectKey]: [...prev[objectKey], newValue],
      };
    });
  };

  return (
    <StyledAddButton size="sm" leftIcon={<AddIcon />} onClick={handleAddField}>
      新增欄位
    </StyledAddButton>
  );
};

export default AddField;
