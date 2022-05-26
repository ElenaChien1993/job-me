import React, { useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';

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
import PropTypes from 'prop-types';

import firebase from '../../utils/firebase';
import { device, color } from '../../style/variable';

const Container = styled.div`
  display: flex;
  border-radius: 24px;
  background: ${color.white};
  margin-bottom: 25px;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    transform: ${props => (props.hasHover ? 'translate(5px, 5px)' : '')};
  }
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 20px 40px 40px;
  @media ${device.laptop} {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 20px 40px;
  }
`;

const HeadWrapper = styled.div`
  min-width: 100px;
  min-height: 100px;
  border-radius: 50px;
  background: ${color.primary};
  color: ${color.white};
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 42px;
  font-weight: 700;
  display: none;
  @media ${device.laptop} {
    display: flex;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CompanyName = styled.p`
  font-weight: 700;
  font-size: 24px;
  color: ${color.secondary};
`;

const StyledCompanyPreview = styled(EditablePreview)`
  && {
    font-weight: 700;
    font-size: 24px;
    color: ${color.secondary};
  }
`;

const JobTitle = styled.p`
  font-weight: 700;
  font-size: 18px;
  color: ${color.primary};
`;

const StyledJobPreview = styled(EditablePreview)`
  && {
    font-weight: 700;
    font-size: 18px;
    color: ${color.primary};
  }
`;

const StyledAddressPreview = styled(EditablePreview)`
  && {
    font-weight: 500;
    font-size: 16px;
    color: #999999;
    width: 200px;
  }
`;

const Status = styled.p`
  font-weight: 500;
  font-size: 16px;
  color: #999999;
  margin-top: 5px;
`;

const StyledSelect = styled(Select)`
  && {
    font-weight: 500;
    font-size: 16px;
    color: #999999;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  @media ${device.mobileM} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TagsWrapper = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 105px));
  gap: 10px;
  margin-left: 0;
  margin-top: 10px;
  justify-content: flex-start;
  @media ${device.laptop} {
    margin-top: 0;
    margin-left: auto;
    max-width: 55%;
    grid-template-columns: repeat(auto-fit, minmax(100px, 120px));
    justify-content: flex-end;
  }
`;

const Tag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  background: ${color.third};
  border-radius: 6px;
  color: ${color.primary};
  font-weight: 500;
  font-size: 14px;
  max-width: 120px;
`;

const TagReminder = styled.div`
  position: absolute;
  left: 0;
  bottom: -30px;
  @media ${device.laptop} {
    left: auto;
    right: 0;
    bottom: -30px;
  }
`;

const StyledInput = styled(Input)`
  && {
    border-radius: 10px;
  }
`;

const NoteElement = React.memo(
  ({ uid, noteId, note, setNote, editable, isPublic }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { pathname } = useLocation();
    const { setError } = useOutletContext();

    const onBlurSubmit = objectKey => {
      try {
        firebase.updateNoteBrief(uid, noteId, { [objectKey]: note[objectKey] });
      } catch (error) {
        console.log(error);
        setError({ type: 1, message: '更新資料發生錯誤，請稍後再試' });
      }
    };

    const handleStatusChange = e => {
      setNote(prev => {
        return { ...prev, status: e.target.value };
      });
    };

    const handleTagsChange = e => {
      const tagsArray = e.target.value.split(',', 5);
      setNote(prev => {
        return { ...prev, tags: tagsArray };
      });
    };

    const handleTagsSubmit = async () => {
      try {
        await firebase.updateNoteBrief(uid, noteId, { tags: note.tags });
        setIsEditing(false);
      } catch (error) {
        console.log(error);
        setError({ type: 1, message: '更新資料發生錯誤，請稍後再試' });
      }
    };

    return (
      <>
        {editable ? (
          <Container
            hasHover={pathname === '/notes' || pathname === '/practice'}
          >
            <HeadWrapper>{note.company_name.split('', 1)}</HeadWrapper>
            <ContentWrapper>
              <Editable
                mb="5px"
                value={note.company_name}
                onSubmit={() => onBlurSubmit('company_name')}
              >
                <StyledCompanyPreview />
                <EditableInput
                  fontSize="24px"
                  color={color.secondary}
                  fontWeight={700}
                  onChange={e =>
                    setNote(prev => {
                      return { ...prev, company_name: e.target.value };
                    })
                  }
                />
              </Editable>
              <Editable
                mb="5px"
                value={note.job_title}
                onSubmit={() => onBlurSubmit('job_title')}
              >
                <StyledJobPreview />
                <EditableInput
                  fontSize="18px"
                  color={color.primary}
                  fontWeight={700}
                  onChange={e =>
                    setNote(prev => {
                      return { ...prev, job_title: e.target.value };
                    })
                  }
                />
              </Editable>
              <StatusWrapper>
                <StyledSelect
                  my="5px"
                  color="#999999"
                  variant="filled"
                  isFullWidth={false}
                  maxWidth="120px"
                  onChange={handleStatusChange}
                  value={note.status}
                  onBlur={() => onBlurSubmit('status')}
                >
                  <option style={{ marginTop: '5px' }} value="未申請">
                    未申請
                  </option>
                  <option value="已申請">已申請</option>
                  <option value="未錄取">未錄取</option>
                  <option value="已錄取">已錄取</option>
                  <option value="無聲卡">無聲卡</option>
                  <option value="等待中">等待中</option>
                </StyledSelect>
                <Editable
                  mb="5px"
                  defaultValue={
                    note.address === '' ? '尚未填寫資料' : note.address
                  }
                  onSubmit={() => onBlurSubmit('address')}
                >
                  <StyledAddressPreview />
                  <EditableInput
                    fontSize="16px"
                    color="#999"
                    fontWeight={500}
                    onChange={e =>
                      setNote(prev => {
                        return { ...prev, address: e.target.value };
                      })
                    }
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
                  <>
                    <StyledInput
                      size="sm"
                      defaultValue={note.tags.join(',')}
                      onChange={handleTagsChange}
                    />
                    <IconButton
                      size="sm"
                      onClick={handleTagsSubmit}
                      icon={<CheckCircleIcon />}
                    />
                  </>
                  <TagReminder>請以「,」隔開每個標籤</TagReminder>
                </>
              )}
            </TagsWrapper>
          </Container>
        ) : (
          <Container
            hasHover={pathname === '/notes' || pathname === '/practice'}
          >
            <HeadWrapper>{note.company_name.split('', 1)}</HeadWrapper>
            <ContentWrapper>
              <CompanyName>{note.company_name}</CompanyName>
              <JobTitle>{note.job_title}</JobTitle>
              {!isPublic && (
                <Status>{`${note.status}｜${note.address}`}</Status>
              )}
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
  }
);

NoteElement.propTypes = {
  uid: PropTypes.string,
  noteId: PropTypes.string,
  note: PropTypes.shape({
    tags: PropTypes.array,
    company_name: PropTypes.string,
    job_title: PropTypes.string,
    status: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  setNote: PropTypes.func,
  editable: PropTypes.bool,
  isPublic: PropTypes.bool,
};

export default NoteElement;
