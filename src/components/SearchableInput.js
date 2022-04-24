import { useState, useEffect } from 'react';
import { Input } from '@chakra-ui/react';
import styled from 'styled-components';

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
  }
`;

const RenderList = ({ companies, value, setValues, toggle, setToggle }) => {
  if (value) {
    const filteredList = companies.filter(company =>
      company.name.includes(value)
    );
    if (filteredList.length) {
      return (
        toggle && (
          <div>
            {filteredList.map(company => {
              return (
                <li
                  key={company.id}
                  onClick={() => {
                    setToggle(false);
                    setValues(prev => {
                      return { ...prev, company_name: company.name };
                    });
                  }}
                >
                  {company.name}
                </li>
              );
            })}
          </div>
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
