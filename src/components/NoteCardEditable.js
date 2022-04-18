import React from 'react';
import { useState } from 'react';
import {
  Input,
  Editable,
  EditableInput,
  EditablePreview,
  Select,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon, CheckCircleIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import firebase from '../utils/firebase';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 182px;
  border-radius: 24px;
  background: white;
  padding: 0 40px;
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
`;

const ImageWrapper = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background: #f5cdc5;
  margin-right: 30px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 112px;
  justify-content: space-between;
`;

const CompanyName = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: #306172;
`;

const StyledCompanyPreview = styled(EditablePreview)`
  && {
    font-weight: 700;
    font-size: 25px;
    color: #306172;
  }
`;

const JobTitle = styled.p`
  font-weight: 700;
  font-size: 25px;
  color: black;
`;

const StyledJobPreview = styled(EditablePreview)`
  && {
    font-weight: 700;
    font-size: 25px;
    color: black;
  }
`;

const StyledAddressPreview = styled(EditablePreview)`
  && {
    font-weight: 700;
    font-size: 16px;
    color: #999999;
    width: 200px;
  }
`;

const Status = styled.p`
  font-weight: 700;
  font-size: 16px;
  color: #999999;
`;

const StyledSelect = styled(Select)`
  && {
    font-weight: 700;
    font-size: 16px;
    color: #999999;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TagsWrapper = styled.div`
  display: flex;
  margin-left: auto;
`;

const Tag = styled.div`
  padding: 13px 24px;
  height: 40px;
  background: #d5f4f7;
  border-radius: 6px;
  color: #306172;
  font-weight: 700;
  font-size: 16px;
  margin-right: 14px;
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
  }
`;

const NoteElement = React.memo(function NoteElement({
  uid,
  noteId,
  note,
  setNote,
  editable,
}) {
  const [isEditing, setIsEditing] = useState(false);
  console.log('NoteEl render');

  const onBlurSubmit = (objectKey) => {
    firebase.updateNoteBrief(uid, noteId, { [objectKey]: note[objectKey] });
  };

  const handlePressEnter = (e, objectKey) => {
    if (e.keyCode === 13) {
      firebase.updateNoteBrief(uid, noteId, { [objectKey]: note[objectKey] });
    }
  };

  const handleStatusChange = (e) => {
    console.log(e.target.value)
    setNote((prev) => {
      return { ...prev, status: e.target.value };
    });
  };

  console.log(note)
  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(',', 5);
    setNote((prev) => {
      return { ...prev, tags: tagsArray };
    });
  };

  const handleTagsSubmit = () => {
    firebase.updateNoteBrief(uid, noteId, { tags: note.tags });
    setIsEditing(false);
  };

  return (
    <>
      {editable ? (
        <Container>
          <ImageWrapper />
          <ContentWrapper>
            <Editable value={note.company_name} onSubmit={() => onBlurSubmit('company_name')}>
              <StyledCompanyPreview />
              <EditableInput
                onChange={(e) =>
                  setNote((prev) => {
                    return { ...prev, company_name: e.target.value };
                  })
                }
              />
            </Editable>
            <Editable value={note.job_title} onSubmit={() => onBlurSubmit('job_title')}>
              <StyledJobPreview />
              <EditableInput
                onChange={(e) =>
                  setNote((prev) => {
                    return { ...prev, job_title: e.target.value };
                  })
                }
              />
            </Editable>
            <StatusWrapper>
              <StyledSelect
                color="#999999"
                variant="filled"
                isFullWidth={false}
                maxWidth="120px"
                onChange={handleStatusChange}
                value={note.status}
                onBlur={() => onBlurSubmit('status')}
              >
                <option value="未申請">未申請</option>
                <option value="已申請">已申請</option>
                <option value="未錄取">未錄取</option>
                <option value="已錄取">已錄取</option>
                <option value="無聲卡">無聲卡</option>
                <option value="等待中">等待中</option>
              </StyledSelect>
              <Status>｜</Status>
              <Editable value={note.address}>
                <StyledAddressPreview />
                <EditableInput
                  onChange={(e) =>
                    setNote((prev) => {
                      return { ...prev, address: e.target.value };
                    })
                  }
                  onBlur={() => onBlurSubmit('address')}
                  onKeyDown={(e) => handlePressEnter(e, 'address')}
                />
              </Editable>
            </StatusWrapper>
          </ContentWrapper>
          <TagsWrapper>
            {!isEditing ? (
              <>
                {note.tags?.map((tag, i) => {
                  return <Tag key={i}>{tag}</Tag>;
                })}
                <IconButton
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  icon={<EditIcon />}
                />
              </>
            ) : (
              <>
                <StyledInput
                  size="sm"
                  defaultValue={note.tags.join(',')}
                  placeholder="請以「,」隔開每個標籤"
                  onChange={handleTagsChange}
                />
                <IconButton
                  size="sm"
                  onClick={handleTagsSubmit}
                  icon={<CheckCircleIcon />}
                />
              </>
            )}
          </TagsWrapper>
        </Container>
      ) : (
        <Container>
          <ImageWrapper />
          <ContentWrapper>
            <CompanyName>{note.company_name}</CompanyName>
            <JobTitle>{note.job_title}</JobTitle>
            <Status>{`${note.status}｜${note.address}`}</Status>
          </ContentWrapper>
          <TagsWrapper>
            {note.tags &&
              note.tags.map((tag, i) => {
                return <Tag key={i}>{tag}</Tag>;
              })}
          </TagsWrapper>
        </Container>
      )}
    </>
  );
});

export default NoteElement;
