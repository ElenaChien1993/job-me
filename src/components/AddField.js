import styled from 'styled-components';

const StyledAddButton = styled.button`
  height: 30px;
  color: #306172;
  font-size: 16px;
  margin-bottom: 16px;
  cursor: pointer;
`;

const AddField = ({setter, newValue, objectKey}) => {
  const handleAddField = (e) => {
    e.preventDefault();
    setter((prev) => {
      return {
        ...prev,
        [objectKey]: [
          ...prev[objectKey],
          newValue,
        ],
      };
    });
  };

  return (
    <StyledAddButton onClick={handleAddField}>
      ＋新增欄位
    </StyledAddButton>
  )
}

export default AddField;