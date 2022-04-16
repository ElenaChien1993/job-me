import styled from 'styled-components';

const NoteWrapper = styled.div`
  display: flex;
  height: 80px;
  align-items: center;
  border-radius: 24px;
  background: white;
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  justify-content: center;
  margin-top: 20px;
`;

const CompanyName = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: #306172;
  position: absolute;
  left: 0;
`;

const JobTitle = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: black;
`;

const NoteBar = ({ brief, className }) => {
  if (!brief) return;
  return (
    <NoteWrapper className={className}>
      <CompanyName>{brief.company_name}</CompanyName>
      <JobTitle>{brief.job_title}</JobTitle>
    </NoteWrapper>
  );
};

export default NoteBar;
