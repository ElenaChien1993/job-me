import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import {
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import styled from 'styled-components';

import Member from './Member';
import firebase from '../../utils/firebase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  margin: 10px 0;
`;

const ResultWrapper = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
`;

const StyledList = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 5px;
  margin-top: 5px;
  padding: 5px 0;
`;

const StyledListItem = styled.div`
  cursor: pointer;
  width: 100%;
  padding-left: 17px;
  &:hover {
    background-color: #fff6c9;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const NotFound = styled.div`
  margin-top: 5px;
  padding-left: 10px;
  color: #787676;
`;

const RenderList = ({
  data,
  value,
  setValue,
  toggle,
  setToggle,
  handleSearch,
}) => {
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
                    handleSearch(item.name);
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
        <NotFound>無相關資料～請嘗試其他關鍵字</NotFound>
      </div>
    );
  }

  return null;
};

const SearchMembers = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [term, setTerm] = useState('');
  const [data, setData] = useState(null);
  const [toggle, setToggle] = useState(true);
  const { currentUserId, setError } = useOutletContext();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const companies = await firebase.getWholeCollection('companies');
      const jobs = await firebase.getWholeCollection('job_titles');
      setData([...companies, ...jobs]);
    };
    if (data) return;

    fetchData();
  }, [data]);

  const handleSearch = async value => {
    if (value === '') {
      toast({
        title: '哎呀',
        description: '請輸入搜尋字',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    try {
      const result = await firebase.getRecommendedUsers(
        value,
        value,
        currentUserId
      );
      setSearchResult(result);
    } catch (error) {
      console.log(error);
      setError({ type: 1, message: '讀取資料發生錯誤，請稍後再試' });
    }
  };

  const onInputChange = value => {
    setSearchResult(null);
    setTerm(value);
    if (value === '') return;
    setToggle(true);
  };

  return (
    <Container>
      <Title>
        這份筆記的公司或職稱還沒有人分享耶 QQ
        <br />
        要不要搜尋其他公司看看？
      </Title>
      <InputGroup size="md">
        <SearchWrapper>
          <Input
            bg="white"
            pr="4.5rem"
            placeholder="請輸入完整公司名 / 職稱"
            value={term}
            onChange={e => onInputChange(e.target.value)}
          />
          <InputRightElement
            zIndex={0}
            pointerEvents="none"
            children={<Search2Icon color="brand.300" />}
          />
          <RenderList
            data={data}
            value={term}
            setValue={setTerm}
            toggle={toggle}
            setToggle={setToggle}
            handleSearch={handleSearch}
          />
        </SearchWrapper>
      </InputGroup>
      <ResultWrapper>
        {searchResult &&
          searchResult.length !== 0 &&
          searchResult.map((member, i) => {
            return <Member key={i} note={member} />;
          })}
        {searchResult?.length === 0 && <p>查無資料，請更換搜尋字</p>}
      </ResultWrapper>
    </Container>
  );
};

export default SearchMembers;
