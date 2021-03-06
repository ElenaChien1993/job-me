import { useRadio, useRadioGroup, Box, HStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { color } from '../../style/variable';

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: color.primary,
          color: 'white',
          borderColor: color.primary,
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={[3, 3, 3, 5]}
        py={[2, 2, 2, 3]}
      >
        {props.children}
      </Box>
    </Box>
  );
}

const RadioGroup = ({ items, value, setter }) => {
  const options = items;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'radio',
    defaultValue: value,
    onChange: setter,
  });

  const group = getRootProps();

  return (
    <HStack spacing="30px" w="100%" {...group}>
      {options.map(value => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
};

RadioGroup.propTypes = {
  items: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setter: PropTypes.func.isRequired,
};

export default RadioGroup;
