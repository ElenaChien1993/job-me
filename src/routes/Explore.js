import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import styled from 'styled-components';

import { device, color } from '../style/variable';
import image from '../images/explore.png';
import NoteCardExplore from '../components/NoteCardExplore';

const Container = styled.div``;

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
  @media ${device.mobileM} {
    height: 250px;
  }
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
  @media ${device.table} {
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
  @media ${device.mobileM} {
    padding: 0 20px;
  }
  @media ${device.table} {
    padding: 0 32px;
  }
  @media ${device.laptop} {
    padding: 0 72px;
  }
`;


const Explore = () => {
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
                // onChange={handleSearch}
                bg="white"
                borderRadius="10px"
                h="60px"
                pl="50px"
                boxShadow="0px 8px 20px rgb(0 0 0 / 6%);"
              />
            </InputGroup>
          </InputWrapper>
          <Suggest>
            <ListTitle>搜尋建議：</ListTitle>
            <ListItem>工程師</ListItem>
            <ListItem>人資</ListItem>
          </Suggest>
        </SearchWrapper>
      </Upper>
      <Content>
        <ContentGrid>
          <NoteCardExplore />
          <NoteCardExplore />
        </ContentGrid>
      </Content>
    </Container>
  );
};

export default Explore;
