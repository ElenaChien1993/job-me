import styled from 'styled-components';
import { Input } from '@chakra-ui/react';
import { device } from '../../style/variable';

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
    height: 25px;
  }
`;

const FilesWrap = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 15px;
  justify-content: space-between;
  & input {
    @media ${device.tablet} {
      margin-right: 10px;
    }
  }
  & label {
    width: 30%;
    @media ${device.mobileM} {
      width: auto;
      margin-bottom: 5px;
    }
    @media ${device.tablet} {
      width: 30%;
    }
  }
  @media ${device.mobileM} {
    align-items: flex-start;
    flex-direction: column;
  }
  @media ${device.tablet} {
    align-items: center;
    flex-direction: row;
  }
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & label {
    width: 50px;
    margin-bottom: 0;
  }
  @media ${device.mobileM} {
    width: 100%;
    margin-bottom: 5px;
  }
  @media ${device.tablet} {
    width: 40%;
    margin-right: 10px;
  }
`;

const FileLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & label {
    width: 50px;
    margin-bottom: 0;
  }
  @media ${device.mobileM} {
    width: 100%;
  }
  @media ${device.tablet} {
    width: 60%;
  }
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
    setDetails(prev => {
      return { ...prev, [objectKey]: update };
    });
  };

  return (
    <>
      <FilesWrap key="job_link">
        <label>職缺連結</label>
        <StyledInput
          type="text"
          defaultValue={details.job_link}
          onChange={e =>
            setDetails(prev => {
              return { ...prev, job_link: e.target.value };
            })
          }
        />
      </FilesWrap>
      <FilesWrap key="resume_link">
        <label>我的履歷連結</label>
        <StyledInput
          type="text"
          defaultValue={details.resume_link}
          onChange={e =>
            setDetails(prev => {
              return { ...prev, resume_link: e.target.value };
            })
          }
        />
      </FilesWrap>
      {details.attached_files.map((file, i) => {
        return (
          <FilesWrap key={i}>
            <FileName>
              <label>檔名</label>
              <StyledInput
                type="text"
                placeholder="請輸入檔案名稱"
                value={file.file_name}
                onChange={e =>
                  handleMapArrayInputChange(e, i, 'attached_files', 'file_name')
                }
              />
            </FileName>
            <FileLink>
              <label>連結</label>
              <StyledInput
                type="text"
                placeholder="請輸入檔案連結"
                value={file.file_link}
                onChange={e =>
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
