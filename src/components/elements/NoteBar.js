import styled from 'styled-components';

const NoteWrapper = styled.div`
  display: flex;
  height: 80px;
  align-items: center;
  border-radius: 24px;
  background: white;
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  justify-content: center;
  margin-top: 20px;
`;

const CompanyName = styled.span`
  font-weight: 700;
  font-size: 25px;
  color: #306172;
`;

const JobTitle = styled.p`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 32px;
  color: black;
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

export default NoteBar;
