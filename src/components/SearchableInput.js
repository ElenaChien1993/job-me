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
  background-color: #ffeadd;
  border-radius: 5px;
  margin-top: 5px;
  padding: 5px 0;
`;

const StyledListItem = styled.div`
  cursor: pointer;
  width: 100%;
  padding-left: 17px;
  &:hover {
    background-color: #FFF6C9;
  }
`;

const RenderList = ({ data, value, setValue, toggle, setToggle }) => {
  if (value && data) {
    const filteredList = data.filter(item => {
      const regex = new RegExp(value, "gi");
      return item.name.match(regex);
    });
    if (filteredList.length) {
      return (
        toggle && (
          <StyledList>
            {filteredList.map(item => {
              return (
                <StyledListItem
                  key={item.id}
                  onClick={() => {
                    setToggle(false);
                    setValue(item.name);
                  }}
                >
                  {item.name}
                </StyledListItem>
              );
            })}
          </StyledList>
        )
      );
    }

    return (
      <div>
        <li style={{marginTop: '10px'}}>紀錄查無此公司，將為您直接新增</li>
      </div>
    );
  }

  return null;
};

const SearchableInput = ({ value, setValue, data }) => {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <StyledInput
        onChange={e => {
          setValue(e.target.value);
          setToggle(true);
        }}
        value={value}
      />
      <RenderList
        data={data}
        value={value}
        setValue={setValue}
        toggle={toggle}
        setToggle={setToggle}
      />
    </>
  );
};

export default SearchableInput;
