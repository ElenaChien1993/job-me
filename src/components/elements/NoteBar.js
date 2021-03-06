import styled from 'styled-components';
import PropTypes from 'prop-types';

import { device, color } from '../../style/variable';

const NoteWrapper = styled.div`
  display: flex;
  height: 80px;
  align-items: center;
  border-radius: 24px;
  background: ${color.white};
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  justify-content: center;
  margin-top: 20px;
`;

const CompanyName = styled.span`
  font-weight: 700;
  color: ${color.primary};
  font-size: 20px;
  @media ${device.tablet} {
    font-size: 24px;
  }
`;

const JobTitle = styled.p`
  display: flex;
  align-items: center;
  font-weight: 700;
  color: black;
  font-size: 20px;
  @media ${device.tablet} {
    font-size: 24px;
  }
`;

const NoteBar = ({ brief, className }) => {
  if (!brief || brief === {}) return null;
  return (
    <NoteWrapper className={className}>
      <JobTitle>
        {brief.job_title} ｜ <CompanyName>{brief.company_name}</CompanyName>
      </JobTitle>
    </NoteWrapper>
  );
};

NoteBar.propTypes = {
  brief: PropTypes.shape({
    job_title: PropTypes.string,
    company_name: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default NoteBar;
