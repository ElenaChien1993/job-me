import styled from 'styled-components';
import { color } from './variable';

const FieldWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  position: relative;
`;

const TitleSection = styled.div`
  position: relative;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: ${color.primary};
  z-index: 1;
  position: relative;
`;

const TitleBack = styled.div`
  height: 13px;
  position: absolute;
  top: 16px;
  left: 0;
  background-color: ${color.third};
  z-index: 0;
  width: 100%;
`;

const Content = styled.div`
  font-size: 1.1rem;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${color.primary};
`;

const PublicListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PublicDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${color.primary};
  margin-right: 10px;
`;

export {
  FieldWrapper,
  Title,
  Content,
  TitleSection,
  TitleBack,
  ListItem,
  Dot,
  PublicListItem,
  PublicDot,
};
