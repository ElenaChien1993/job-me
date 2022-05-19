import {
  Editable,
  EditableInput,
  EditablePreview,
  Select,
} from '@chakra-ui/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as S from '../../style/CommonElement';

const StyledSalaryWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledEditable = styled(Editable)`
  && {
    min-width: 12%;
    margin-right: 10px;
  }
`;

const SalaryText = styled.div`
  margin: 0 10px;
`;

const CompanyInfo = ({ isPublic, details, setDetails, onBlurSubmit }) => {
  const handleInputSalaryChange = (e, type) => {
    setDetails(prev => {
      return { ...prev, salary: { ...details.salary, [type]: e.target.value } };
    });
  };

  return (
    <>
      <S.FieldWrapper>
        <S.Title>公司主要產品 / 服務</S.Title>
        {isPublic ? (
          <S.Content>
            {details.product === '' ? '未填寫' : details.product}
          </S.Content>
        ) : (
          <Editable
            defaultValue={
              details.product === '' ? '尚未填寫資料' : details.product
            }
            onSubmit={() => onBlurSubmit('product')}
          >
            <EditablePreview />
            <EditableInput
              onChange={e =>
                setDetails(prev => {
                  return { ...prev, product: e.target.value };
                })
              }
            />
          </Editable>
        )}
      </S.FieldWrapper>
      <S.FieldWrapper>
        <S.Title>薪資範圍</S.Title>
        {isPublic ? (
          <S.Content>
            {`${
              details.salary.range === '' ? '未填寫' : details.salary.range
            } K(千) ${details.salary.type}`}
          </S.Content>
        ) : (
          <StyledSalaryWrapper>
            <StyledEditable
              defaultValue={
                details.salary.range === ''
                  ? '尚未填寫資料'
                  : details.salary.range
              }
              onSubmit={() => onBlurSubmit('salary')}
            >
              <EditablePreview />
              <EditableInput
                onChange={e => handleInputSalaryChange(e, 'range')}
              />
            </StyledEditable>
            <SalaryText> K </SalaryText>
            <Select
              defaultValue={details.salary.type}
              variant="outline"
              isFullWidth={false}
              maxWidth="100px"
              onChange={e => handleInputSalaryChange(e, 'type')}
              onBlur={() => onBlurSubmit('salary')}
            >
              <option value="年薪">年薪</option>
              <option value="月薪">月薪</option>
            </Select>
          </StyledSalaryWrapper>
        )}
      </S.FieldWrapper>
    </>
  );
};

CompanyInfo.propTypes = {
  isPublic: PropTypes.bool,
  details: PropTypes.shape({
    product: PropTypes.string,
    salary: PropTypes.object,
  }).isRequired,
  setDetails: PropTypes.func,
  onBlurSubmit: PropTypes.func,
};

export default CompanyInfo;
