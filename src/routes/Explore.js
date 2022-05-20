import { useState, useEffect } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { Search2Icon, SmallCloseIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../utils/firebase';
import { device, color } from '../style/variable';
import image from '../images/explore.png';
import ChatCorner from '../components/messages/ChatCorner';
import NoteCardExplore from '../components/NoteCardExplore';
import Loader from '../components/Loader';

const Container = styled.div`
  margin-bottom: 40px;
`;

const Upper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  position: relative;
  width: 100%;
  background-color: #efebe0;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledImage = styled.img`
  object-fit: cover;
  height: 250px;
  @media ${device.tablet} {
    height: 360px;
  }
`;

const ImageText = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  padding: 0 16px;
  transform: translateY(-70%);
  color: #fff;
  text-align: center;
`;

const TitleText = styled.div`
  font-size: 32px;
  font-weight: 700;
  line-height: 38px;
  margin-top: 6%;
  margin-bottom: 16px;
  text-shadow: black 0.1em 0.1em 0.2em;
  @media ${device.tablet} {
    margin-top: 0;
    font-size: 48px;
    font-weight: 700;
    line-height: 56px;
  }
`;

const SmallText = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  text-shadow: black 0.1em 0.1em 0.2em;
  @media ${device.tablet} {
    font-size: 20px;
    font-weight: 400;
    line-height: 32px;
  }
`;

const SearchWrapper = styled.div`
  z-index: 1;
  width: 100%;
  padding: 0 16px;
  text-align: center;
`;

const InputWrapper = styled.div`
  z-index: 1;
  width: 100%;
  max-width: 628px;
  margin: 0 auto;
  transform: translateY(-50%);
`;

const Suggest = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 8px;
  list-style: none;
`;

const ListTitle = styled.li`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #6e6d7a;
  margin-right: 16px;
  padding-bottom: 4px;
`;

const ListItem = styled.li`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin-right: 16px;
  padding-bottom: 4px;
  transition: color 200ms ease;
  color: ${color.secondary};
  cursor: pointer;
  &:hover {
    filter: brightness(140%);
  }
`;

const Content = styled.div`
  width: 100%;
  padding-top: 16px;
`;

const ContentGrid = styled.ol`
  display: grid;
  grid-gap: 36px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  list-style: none;
  padding: 0 20px;
  @media ${device.tablet} {
    padding: 0 32px;
  }
  @media ${device.laptop} {
    padding: 0 10%;
  }
`;

const NoData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Explore = () => {
  const [databaseNotes, setDatabaseNotes] = useState(null);
  const [renderNotes, setRenderNotes] = useState(null);
  const [term, setTerm] = useState('');
  const suggestions = ['工程師', '91APP', 'iOS', 'Android'];

  useEffect(() => {
    const fetchNotes = async () => {
      const data = await firebase.getPublicNotes();
      setDatabaseNotes(data);
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    setRenderNotes(databaseNotes);
  }, [databaseNotes]);

  useEffect(() => {
    if (term === '') {
      setRenderNotes(databaseNotes);
      return;
    }
    const filtered = databaseNotes.filter(note => {
      const regex = new RegExp(term, 'gi');
      return note.company_name.match(regex) || note.job_title.match(regex);
    });
    setRenderNotes(filtered);
  }, [term, databaseNotes]);

  if (!renderNotes) return <Loader />;

  return (
    <Container>
      <Upper>
        <Header>
          <ImageContainer>
            <StyledImage src={image} alt="explore" />
          </ImageContainer>
          <ImageText>
            <TitleText>探索·交流</TitleText>
            <SmallText>為自己打開人生更多扇窗戶</SmallText>
          </ImageText>
        </Header>
        <SearchWrapper>
          <InputWrapper>
            <InputGroup>
              <InputLeftElement
                ml="10px"
                zIndex={2}
                pointerEvents="none"
                children={<Search2Icon color="brand.300" />}
                top="11px"
              />
              <Input
                border="none"
                type="text"
                placeholder="輸入公司 / 職稱 搜尋公開筆記"
                value={term}
                onChange={e => setTerm(e.target.value)}
                bg="white"
                borderRadius="10px"
                h="60px"
                pl="50px"
                boxShadow="0px 8px 20px rgb(0 0 0 / 6%);"
              />
              <InputRightElement
                mr="10px"
                zIndex={2}
                children={<SmallCloseIcon color="brand.300" />}
                top="11px"
                cursor="pointer"
                onClick={() => setTerm('')}
              />
            </InputGroup>
          </InputWrapper>
          <Suggest>
            <ListTitle>搜尋建議：</ListTitle>
            {suggestions.map(suggestion => (
              <ListItem key={suggestion} onClick={() => setTerm(suggestion)}>
                {suggestion}
              </ListItem>
            ))}
          </Suggest>
        </SearchWrapper>
      </Upper>
      <Content>
        {renderNotes.length !== 0 ? (
          <ContentGrid>
            {renderNotes.map(note => (
              <NoteCardExplore key={note.note_id} note={note} />
            ))}
          </ContentGrid>
        ) : (
          <NoData>
            抱歉，尚無此關鍵字的公開筆記
            <br />
            <span>您可以嘗試新增拋磚引玉！</span>
          </NoData>
        )}
      </Content>
      <ChatCorner />
    </Container>
  );
};

export default Explore;
