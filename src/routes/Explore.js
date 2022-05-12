import styled from 'styled-components';

import { device, color } from '../style/variable';
import image from '../images/explore.png';

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

const Content = styled.div``;

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
        <SearchWrapper></SearchWrapper>
      </Upper>
      <Content></Content>
    </Container>
  );
};

export default Explore;
