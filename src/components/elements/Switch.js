import { Switch, FormControl, FormLabel } from '@chakra-ui/react';

const SwitchElement = ({isTimer, setIsTimer}) => {

  return (
    <FormControl display="flex" alignItems="center" w="50px">
      {/* <FormLabel htmlFor="email-alerts" mb="0">
        Enable email alerts?
      </FormLabel> */}
      <Switch
        id="email-alerts"
        isChecked={isTimer}
        onChange={() => setIsTimer(!isTimer)}
      />
    </FormControl>
  );
};

export default SwitchElement;
