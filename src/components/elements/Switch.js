import { Switch, FormControl } from '@chakra-ui/react';

const SwitchElement = ({isTimer, setIsTimer}) => {

  return (
    <FormControl display="flex" alignItems="center" w="50px" ml="20px">
      <Switch
        colorScheme='brand' size='lg'
        id="email-alerts"
        isChecked={isTimer}
        onChange={() => setIsTimer(!isTimer)}
      />
    </FormControl>
  );
};

export default SwitchElement;
