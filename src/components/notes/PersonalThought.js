import PropTypes from 'prop-types';

import * as S from '../../style/CommonElement';
import EditorArea from '../elements/Editor';

const PersonalThought = ({
  isPublic,
  noteId,
  details,
  titleText,
  targetKey,
}) => {
  return (
    <S.FieldWrapper>
      <S.TitleSection>
        <S.Title>{titleText}</S.Title>
        <S.TitleBack />
      </S.TitleSection>
      <S.Content>
        <EditorArea
          isPublic={isPublic}
          noteId={noteId}
          details={details}
          objectKey={targetKey}
        />
      </S.Content>
    </S.FieldWrapper>
  );
};

PersonalThought.propTypes = {
  isPublic: PropTypes.bool,
  noteId: PropTypes.string,
  details: PropTypes.object,
  titleText: PropTypes.string,
  targetKey: PropTypes.string,
};

export default PersonalThought;
