import { useState } from 'react';
import { Input } from '@chakra-ui/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { color } from '../style/variable';

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
  }
`;

const StyledList = styled.div`
  width: 100%;
  background-color: whitesmoke;
  border-radius: 5px;
  margin-top: 5px;
  padding: 5px 0;
  position: absolute;
  z-index: 3;
  top: 70px;
  box-shadow: 4px 5px 7px #888888;
`;

const StyledListItem = styled.div`
  cursor: pointer;
  width: 100%;
  padding-left: 17px;
  &:hover {
    background-color: ${color.third};
  }
`;

const NotFound = styled.div`
  position: absolute;
  margin-top: 5px;
  padding-left: 10px;
  color: #999999;
`;

const RenderList = ({ data, value, setValue, toggle, setToggle }) => {
  if (value && data) {
    const filteredList = data.filter(item => {
      const regex = new RegExp(value, 'gi');
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
        <NotFound>查無此紀錄，將為您直接新增</NotFound>
      </div>
    );
  }

  return null;
};

RenderList.propTypes = {
  data: PropTypes.array,
  value: PropTypes.string,
  setValue: PropTypes.func,
  toggle: PropTypes.bool.isRequired,
  setToggle: PropTypes.func,
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

SearchableInput.propTypes = {
  data: PropTypes.array,
  value: PropTypes.string,
  setValue: PropTypes.func,
};

export default SearchableInput;
