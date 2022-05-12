import styled from 'styled-components';

import image from '../images/explore.jpg';

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
  min-height: 250px;
  max-height: 360px;
  background-color: white;
`;

const ImageContainer = styled.div`
  width: 60%;
`;

const ImageText = styled.div``;

const Search = styled.div``;

const Content = styled.div``;

const Explore = () => {
  return (
    <Container>
      <Upper>
        <Header>
          <ImageContainer>
            <img src={image} alt="explore" style={{ objectFit: 'contain' }} />
          </ImageContainer>
          <ImageText></ImageText>
        </Header>
        <Search></Search>
      </Upper>
      <Content></Content>
    </Container>
  );
};

export default Explore;
