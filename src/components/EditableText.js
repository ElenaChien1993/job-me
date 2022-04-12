import {
  EditablePreview,
  useColorModeValue,
  IconButton,
  Input,
  useEditableControls,
  ButtonGroup,
  Editable,
  Tooltip,
  EditableInput,
  EditableTextarea,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import firebase from '../utils/firebase';

function EditableControls() {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
      <IconButton
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        icon={<CloseIcon boxSize={3} />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : null;
}

const EditableText = ({ prev, objectKey, noteId, details, setDetails }) => {
  const editNoteDetails = (e, key) => {
    if (e.target.value === details[key]) return;
    setDetails((prev) => {
      return { ...prev, [key]: e.target.value };
    });
    firebase.updateNoteDetails(noteId, key, e.target.value);
  };

  return (
    <Editable
      defaultValue={prev}
      isPreviewFocusable={true}
      selectAllOnFocus={false}
    >
      <Tooltip label="點擊開啟編輯模式">
        <EditablePreview
          py={2}
          px={4}
          _hover={{
            background: useColorModeValue('gray.100', 'gray.700'),
          }}
        />
      </Tooltip>
      <Input
        py={2}
        px={4}
        height="200px"
        as={EditableTextarea}
        onBlur={(e) => editNoteDetails(e, objectKey)}
      />
      <EditableControls />
    </Editable>
  );
};

export default EditableText;
