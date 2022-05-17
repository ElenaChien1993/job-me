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

const EditableControls = () => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup
      justifyContent="end"
      size="sm"
      // position="absolute"
      right={0}
      top="-4px"
      zIndex={3}
      spacing={2}
      mt={2}
    >
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton
        icon={<CloseIcon boxSize={3} />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : null;
};

const EditableInputField = ({
  value,
  onSubmitCallback,
  callbackArgs,
  i,
  submitRef,
}) => {
  return (
    <Editable
      ml={4}
      w="90%"
      defaultValue={value === '' ? '尚未填寫資料' : value}
      isPreviewFocusable
      selectAllOnFocus={false}
      onSubmit={value => {
        onSubmitCallback(value, i, callbackArgs.objectKey, callbackArgs.subKey);
        submitRef.current = { key: callbackArgs.objectKey, index: i };
      }}
    >
      <Tooltip label="點擊開啟編輯">
        <EditablePreview
          pr={4}
          py={2}
          _hover={{
            background: useColorModeValue('gray.100', 'gray.700'),
          }}
        />
      </Tooltip>
      <Input
        w="98%"
        py={2}
        pl={0}
        as={callbackArgs.subKey === 'answer' ? EditableTextarea : EditableInput}
      />
      {/* <EditableControls /> */}
    </Editable>
  );
};

export default EditableInputField;
