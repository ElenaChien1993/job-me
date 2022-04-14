import styled from 'styled-components';
import { Input } from '@chakra-ui/react';

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
  }
`;

const FilesWrap = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  & input {
    margin-right: 10px;
  }
  & label {
    width: 50px;
  }
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  width: 40%;
`;

const FileLink = styled.div`
  display: flex;
  align-items: center;
  width: 60%;
`;

const EditFiles = ({ details, setDetails }) => {
  const getObjectInArrayChangedValue = (value, index, objectKey, targetKey) => {
    const update = details[objectKey].map((item, i) =>
      index === i
        ? {
            ...item,
            [targetKey]: value,
          }
        : item
    );
    return update;
  };

  const handleMapArrayInputChange = (e, index, objectKey, targetKey) => {
    const update = getObjectInArrayChangedValue(
      e.target.value,
      index,
      objectKey,
      targetKey
    );
    setDetails((prev) => {
      return { ...prev, [objectKey]: update };
    });
  };

  return (
    <>
      <FilesWrap key="job_link">
        <FileLink>
          <label>職缺連結</label>
          <StyledInput
            type="text"
            defaultValue={details.job_link}
            onChange={(e) =>
              setDetails((prev) => {
                return { ...prev, job_link: e.target.value };
              })
            }
          />
        </FileLink>
      </FilesWrap>
      <FilesWrap key="resume_link">
        <FileLink>
          <label>我的履歷連結</label>
          <StyledInput
            type="text"
            defaultValue={details.resume_link}
            onChange={(e) =>
              setDetails((prev) => {
                return { ...prev, resume_link: e.target.value };
              })
            }
          />
        </FileLink>
      </FilesWrap>
      {details.attached_files.map((file, i) => {
        return (
          <FilesWrap key={i}>
            <FileName>
              <label>檔名</label>
              <StyledInput
                type="text"
                defaultValue={file.file_name}
                onChange={(e) =>
                  handleMapArrayInputChange(e, i, 'attached_files', 'file_name')
                }
              />
            </FileName>
            <FileLink>
              <label>連結</label>
              <StyledInput
                type="text"
                defaultValue={file.file_link}
                onChange={(e) =>
                  handleMapArrayInputChange(e, i, 'attached_files', 'file_link')
                }
              />
            </FileLink>
          </FilesWrap>
        );
      })}
    </>
  );
};

export default EditFiles;
