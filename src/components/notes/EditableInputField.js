import {
  EditablePreview,
  useColorModeValue,
  Input,
  Editable,
  Tooltip,
  EditableInput,
  EditableTextarea,
} from '@chakra-ui/react';

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
    </Editable>
  );
};

export default EditableInputField;
