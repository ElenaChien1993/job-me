import { Button } from '@chakra-ui/react';
import styled from 'styled-components';

import { device, color } from '../style/variable';
import hero from '../images/hero.png';
import feature1 from '../images/feature1.png';
import feature2 from '../images/feature2.png';
import feature3 from '../images/feature3.png';
import logo from '../images/logo-front.png';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto 40px;
  @media ${device.mobileM} {
    padding: 0 5%;
  }
  @media ${device.tablet} {
    padding: 0 10%;
  }
  @media ${device.laptopL} {
    padding: 0 144px;
  }
`;

const HeroWrapper = styled.div`
  @media ${device.mobileM} {
    margin: 40px 0;
  }
  @media ${device.laptop} {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center;
  }
`;

const HeroImageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: -20px auto 10px;
  max-width: 320px;
  @media ${device.tablet} {
    max-width: 440px;
  }
  @media ${device.laptop} {
    width: 44%;
    margin: 0;
    max-width: none;
  }
  @media ${device.laptopL} {
    width: 50%;
  }
`;

const StyledImage = styled.img`
  object-fit: cover;
`;

const ContentText = styled.div`
  text-align: center;
  @media ${device.laptop} {
    text-align: left;
    width: 56%;
  }
  @media ${device.laptopL} {
    width: 50%;
  }
`;

const HeroTitle = styled.div`
  font-weight: bold;
  font-size: 42px;
  color: ${color.primary};
  @media ${device.tablet} {
    font-size: 55px;
  }
`;

const HeroText = styled.div`
  max-width: 420px;
  margin: 10px auto;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.6);
  @media ${device.tablet} {
    font-size: 24px;
  }
  @media ${device.laptop} {
    margin: 10px 0;
  }
`;

const FeatureWrapper = styled.div`
  margin: 20px auto;
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px 0 hsl(215deg 6% 62% / 8%);
  @media ${device.tablet} {
    padding: 30px;
    margin: 40px auto;
  }
  @media ${device.laptop} {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const TextWrapper = styled.div`
  margin-bottom: 15px;
  @media ${device.laptop} {
    width: 46%;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${color.primary};
  @media ${device.tablet} {
    font-size: 24px;
  }
  @media ${device.laptop} {
    margin-bottom: 10px;
  }
  @media ${device.laptopL} {
    font-size: 30px;
  }
`;

const Text = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  @media ${device.tablet} {
    font-size: 18px;
  }
  @media ${device.laptopL} {
    font-size: 22px;
  }
`;

const ImageWrapper = styled.div`
  @media ${device.laptop} {
    width: 46%;
  }
`;

const Line = styled.hr`
  height: 1px;
  outline: none;
  border: none;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  max-width: 1260px;
`;

const SloganWrapper = styled.div`
  margin: 60px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const LogoWrapper = styled.div`
  width: 80px;
  margin: 0 auto 5px;
`;

const Creditor = styled.div`
  font-size: 0.7rem;
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <HeroWrapper>
        <HeroImageWrapper>
          <StyledImage src={hero} alt="hero" />
        </HeroImageWrapper>
        <ContentText>
          <HeroTitle>求職準備好夥伴</HeroTitle>
          <HeroText>
            好的工作是留給充分準備的人，
            <br />
            充分準備交給 Job Me！
          </HeroText>
          <Button
            colorScheme="brand"
            mt={['10px', null, null, null, '40px']}
            onClick={() => navigate('/notes')}
          >
            免費註冊
          </Button>
        </ContentText>
      </HeroWrapper>
      <FeatureWrapper>
        <TextWrapper>
          <Title>輕鬆紀錄你的求職準備</Title>
          <Text>統整所有求職資訊，建立屬於自己的職缺資料庫</Text>
        </TextWrapper>
        <ImageWrapper>
          <StyledImage src={feature1} alt="feature1" />
        </ImageWrapper>
      </FeatureWrapper>
      <FeatureWrapper>
        <TextWrapper>
          <Title>模擬面試自我練習</Title>
          <Text>可自由選擇錄音 / 錄影兩種練習模式，隨機出題讓模擬更真實！</Text>
        </TextWrapper>
        <ImageWrapper>
          <StyledImage src={feature2} alt="feature2" />
        </ImageWrapper>
      </FeatureWrapper>
      <FeatureWrapper>
        <TextWrapper>
          <Title>交流分享求職經驗</Title>
          <Text>和來自各方的求職者交流，認識公司也同時吸收不同看法和建議</Text>
        </TextWrapper>
        <ImageWrapper>
          <StyledImage src={feature3} alt="feature3" />
        </ImageWrapper>
      </FeatureWrapper>
      <Line />
      <SloganWrapper>
        <LogoWrapper>
          <StyledImage src={logo} alt="logo" />
        </LogoWrapper>
        <HeroTitle>今天開始 JOB ME</HeroTitle>
        <HeroText>
          工欲善其事，必先利其器
          <br />
          求職用 JOB ME，企業笑咪咪
        </HeroText>
        <Button
          colorScheme="brand"
          mt={['10px', null, null, null, '20px']}
          onClick={() => navigate('/notes')}
        >
          開始使用
        </Button>
      </SloganWrapper>
      <Line />
      <Creditor>
        <a href="https://storyset.com">Illustrations by Storyset</a>
      </Creditor>
    </Container>
  );
};

export default Landing;
