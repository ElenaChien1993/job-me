import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

import Member from './Member';

const RecommendModal = ({isOpen, onClose, recommend}) => {
  // const { onClose } = useDisclosure({ id: 'recommend' });
  return (
    <>
      <Modal size="xl" isOpen={isOpen} onClose={onClose} id="recommend">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>可以認識一下～</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {recommend.map((member, i) => {
              return (
                <Member key={i} note={member}/>
              )
            })}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              關閉
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecommendModal;
