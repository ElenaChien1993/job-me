import { Switch, FormControl } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const SwitchElement = ({ isTimer, setIsTimer }) => {
  return (
    <FormControl display="flex" alignItems="center" w="50px" ml="20px">
      <Switch
        colorScheme="brand"
        size="lg"
        id="email-alerts"
        isChecked={isTimer}
        onChange={() => setIsTimer(!isTimer)}
      />
    </FormControl>
  );
};

SwitchElement.propTypes = {
  isTimer: PropTypes.bool.isRequired,
  setIsTimer: PropTypes.func.isRequired,
};

export default SwitchElement;
