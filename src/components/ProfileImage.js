import styled from 'styled-components';
import Avatar from 'boring-avatars';

import { color } from '../style/variable';

const ImageWrapper = styled.div`
  min-width: ${(props) => props.size}px;
  min-height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  border: ${(props) =>
    props.hasBorder ? `5px solid ${color.primary}` : 'none'};
  margin-right: ${(props) => props.marginRight}px;
  overflow: hidden;
`;

const StyledImg = styled.img`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  object-fit: cover;
`;

const ProfileImage = ({ user, size, hasBorder, marginRight, preview }) => {
  return (
    <ImageWrapper size={size} hasBorder={hasBorder} marginRight={marginRight}>
      {user.photo_url || preview ? (
        <StyledImg
          src={preview ? preview : user.photo_url}
          alt="head-shot"
          size={size}
          referrerpolicy="no-referrer"
        />
      ) : (
        <Avatar
          size={size}
          name={user.display_name}
          variant="beam"
          colors={['#C1DDC7', '#F5E8C6', '#BBCD77', '#DC8051', '#F4D279']}
        />
      )}
    </ImageWrapper>
  );
};

export default ProfileImage;
