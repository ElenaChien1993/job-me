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
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

const EditableControls = () => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
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
  handleArrayInputChange,
  i,
  submitRef,
}) => {
  return (
    <Editable
      defaultValue={value === '' ? '尚未填寫資料' : value}
      isPreviewFocusable
      selectAllOnFocus={false}
      onSubmit={value => {
        handleArrayInputChange(value, i, 'responsibilities');
        submitRef.current = { key: 'responsibilities', index: i };
      }}
    >
      <Tooltip label="Click to edit">
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
        as={EditableInput}
        // onChange={e => console.log(e.target.value)}
      />
      <EditableControls />
    </Editable>
  );
};

{
  /* <Editable
  value={item === '' ? '尚未填寫資料' : item}
  key={uuid()}
  onSubmit={() => onBlurSubmit('responsibilities')}
>
  <StyledListItem>
    <EditablePreview />
    <EditableInput
      onChange={e => handleArrayInputChange(e, i, 'responsibilities')}
    />
    <DeleteButton
      w={4}
      h={4}
      ml={5}
      aria-label="delete item"
      icon={<SmallCloseIcon />}
      onClick={() => handleDelete(i, 'responsibilities')}
    />
  </StyledListItem>
</Editable>; */
}

export default EditableInputField;
