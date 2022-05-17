import styled from 'styled-components';
import {
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { device } from '../../style/variable';

const Reminder = styled.p`
  margin-bottom: 5px;
  color: #999;
  font-size: 14px;
  @media ${device.tablet} {
    font-size: 16px;
  }
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
    height: 25px;
  }
`;

const FilesWrap = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
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
  @media ${device.tablet} {
    align-items: flex-start;
    flex-direction: row;
  }
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 5px;
  @media ${device.tablet} {
    width: 40%;
    margin-right: 10px;
    margin-bottom: 0;
  }
`;

const FileLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  @media ${device.tablet} {
    width: 60%;
  }
`;

const DeleteButton = styled(CloseButton)`
  && {
    margin-right: 0;
    position: absolute;
    right: 0;
    z-index: 1;
    @media ${device.tablet} {
      margin-right: 5px;
      position: static;
    }
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

  const handleDelete = i => {
    const newData = details.attached_files.filter((_, index) => index !== i);
    setDetails(prev => {
      return { ...prev, attached_files: newData };
    });
  };

  const regex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gm;

  return (
    <>
      <Reminder>若連結欄位留空，則不會顯示該資訊在筆記中</Reminder>
      <FilesWrap key="job_link">
        <FormControl
          isInvalid={!details.job_link.match(regex) && details.job_link !== ''}
        >
          <FormLabel htmlFor="job_link">職缺連結</FormLabel>
          <StyledInput
            id="job_link"
            type="text"
            defaultValue={details.job_link}
            onChange={e => {
              setDetails(prev => {
                return { ...prev, job_link: e.target.value };
              });
            }}
          />
          <FormErrorMessage>請填寫正確的 URL 格式</FormErrorMessage>
        </FormControl>
      </FilesWrap>
      <FilesWrap key="resume_link">
        <FormControl
          isInvalid={
            !details.resume_link.match(regex) && details.resume_link !== ''
          }
        >
          <FormLabel htmlFor="resume_link">我的履歷連結</FormLabel>
          <StyledInput
            id="resume_link"
            type="text"
            defaultValue={details.resume_link}
            onChange={e =>
              setDetails(prev => {
                return { ...prev, resume_link: e.target.value };
              })
            }
          />
          <FormErrorMessage>請填寫正確的 URL 格式</FormErrorMessage>
        </FormControl>
      </FilesWrap>
      {details.attached_files.map((file, i) => {
        return (
          <FilesWrap key={i}>
            <DeleteButton size="sm" onClick={() => handleDelete(i)} />
            <FileName>
              <FormControl>
                <FormLabel mb="5px">檔名</FormLabel>
                <StyledInput
                  type="text"
                  placeholder="請輸入檔案名稱"
                  value={file.file_name}
                  onChange={e =>
                    handleMapArrayInputChange(
                      e,
                      i,
                      'attached_files',
                      'file_name'
                    )
                  }
                />
              </FormControl>
            </FileName>
            <FileLink>
              <FormControl isInvalid={!file.file_link.match(regex)}>
                <FormLabel mb="5px">連結</FormLabel>
                <StyledInput
                  type="text"
                  placeholder="請輸入檔案連結"
                  value={file.file_link}
                  onChange={e =>
                    handleMapArrayInputChange(
                      e,
                      i,
                      'attached_files',
                      'file_link'
                    )
                  }
                />
                <FormErrorMessage>請填寫正確的 URL 格式</FormErrorMessage>
              </FormControl>
            </FileLink>
          </FilesWrap>
        );
      })}
    </>
  );
};

EditFiles.propTypes = {
  details: PropTypes.shape({
    attached_files: PropTypes.array,
    job_link: PropTypes.string,
    resume_link: PropTypes.string,
  }).isRequired,
  setDetails: PropTypes.func.isRequired,
};

export default EditFiles;
