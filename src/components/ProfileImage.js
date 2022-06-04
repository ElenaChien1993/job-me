import styled from 'styled-components';
import Avatar from 'boring-avatars';
import PropTypes from 'prop-types';

import { color } from '../style/variable';

const ImageWrapper = styled.div`
  min-width: ${({ size }) => size}px;
  min-height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  border: ${({ hasBorder }) => hasBorder ? `5px solid ${color.primary}` : 'none'};
  margin-right: ${({ marginRight }) => marginRight}px;
  overflow: hidden;
`;

const StyledImg = styled.img`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
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

ProfileImage.propTypes = {
  user: PropTypes.shape({
    photo_url: PropTypes.string,
    display_name: PropTypes.string,
  }).isRequired,
  size: PropTypes.number.isRequired,
  hasBorder: PropTypes.bool,
  marginRight: PropTypes.number,
  preview: PropTypes.string,
};

export default ProfileImage;
