import { useState, useEffect } from 'react';
import { Input } from '@chakra-ui/react';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
  }
`;

const StyledList = styled.div`
  width: 100%;
  padding-left: 17px;
`

const StyledListItem = styled.div`
  cursor: pointer;
  width: 100%;
  margin: 3px 0;
  &:hover {
    background-color: #999999
  }
`;

const RenderList = ({ companies, value, setValues, toggle, setToggle }) => {
  if (value && companies) {
    const filteredList = companies.filter(company => {
      const regex = new RegExp(value, "gi");
      return company.name.match(regex);
    });
    if (filteredList.length) {
      return (
        toggle && (
          <StyledList>
            {filteredList.map(company => {
              return (
                <StyledListItem
                  key={company.id}
                  onClick={() => {
                    setToggle(false);
                    setValues(prev => {
                      return { ...prev, company_name: company.name };
                    });
                  }}
                >
                  {company.name}
                </StyledListItem>
              );
            })}
          </StyledList>
        )
      );
    }

    return (
      <div>
        <li>紀錄查無此公司，將為您直接新增</li>
      </div>
    );
  }

  return null;
};

const SearchableInput = ({ value, setValues, companies }) => {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <StyledInput
        onChange={e => {
          setValues(prev => {
            return { ...prev, company_name: e.target.value };
          });
          setToggle(true);
        }}
        value={value}
      />
      <RenderList
        companies={companies}
        value={value}
        setValues={setValues}
        toggle={toggle}
        setToggle={setToggle}
      />
    </>
  );
};

export default SearchableInput;
