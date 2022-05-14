import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { InputGroup, InputRightElement, Input, Button } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../../utils/firebase';
import Note from '../../components/NoteCard';
import ChatCorner from '../../components/ChatCorner';
import { color, device } from '../../style/variable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px auto 0;
  width: 80%;
  max-width: 1000px;
`;

const SearchBar = styled.div`
  width: 100%;
  height: 30px;
  margin-bottom: 16px;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding-left: 10px;
  font-size: 18px;
`;

const NotesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoNote = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: #999;
  @media ${device.mobileM} {
    font-size: 15px;
  }
  @media ${device.tablet} {
    font-size: 18px;
  }
  & span {
    color: ${color.secondary};
    font-weight: bold;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Notes = () => {
  const [databaseNotes, setDatabaseNotes] = useState([]);
  const [renderNotes, setRenderNotes] = useState([]);
  const { currentUserId } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    firebase.getNotes(currentUserId).then(data => {
      setDatabaseNotes(data);
      setRenderNotes(data);
    });
  }, [currentUserId]);

  const handleSearch = e => {
    const term = e.target.value;
    if (!term) {
      setRenderNotes(databaseNotes);
      return;
    }
    const filtered = databaseNotes.filter(note => {
      const regex = new RegExp(term, 'gi');
      return (
        note.company_name.match(regex) ||
        note.job_title.match(regex) ||
        note.tags.join().match(regex)
      );
    });
    setRenderNotes(filtered);
  };

  return (
    <Container>
      <SearchBar>
        <InputGroup>
          <StyledInput
            type="text"
            placeholder="輸入公司 / 職稱 / 標籤搜尋"
            onChange={handleSearch}
            bg="white"
          />
          <InputRightElement
            zIndex={0}
            pointerEvents="none"
            children={<Search2Icon color="brand.300" />}
          />
        </InputGroup>
      </SearchBar>

      <Link to="/notes/create" style={{ alignSelf: 'flex-end' }}>
        <Button
          _hover={{
            background: 'none',
            color: color.primary,
            border: `1px solid ${color.primary}`,
          }}
          h="2rem"
          fontSize="14px"
          my="10px"
          colorScheme="brand"
        >
          建立筆記
        </Button>
      </Link>

      <NotesWrapper>
        {databaseNotes.length !== 0 ? (
          renderNotes.map(note => {
            return (
              <Note
                currentUserId={currentUserId}
                note={note}
                key={note.note_id}
                databaseNotes={databaseNotes}
                setRenderNotes={setRenderNotes}
                setDatabaseNotes={setDatabaseNotes}
              />
            );
          })
        ) : (
          <NoNote>
            <p>尚未建立過筆記，請點擊右上方按鈕開始建立</p>
            <p>或是前往<span onClick={() => navigate('/explore')}>探索</span>查看其他會員的公開筆記</p>
          </NoNote>
        )}
      </NotesWrapper>
      <ChatCorner />
    </Container>
  );
};

export default Notes;
