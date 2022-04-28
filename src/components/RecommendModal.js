import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
  Flex,
} from '@chakra-ui/react';

import Member from './Member';
import SearchMembers from './SearchMembers';

const RecommendModal = ({ isOpen, onClose, recommend, isLoading }) => {
  return (
    <>
      <Modal scrollBehavior="inside" size="xl" isOpen={isOpen} onClose={onClose} id="recommend">
        <ModalOverlay />
        <ModalContent bgColor="#FFE6CA">
          {isLoading ? (
            <Flex justify="center">
              <Spinner
                thickness="4px"
                speed="0.75s"
                emptyColor="gray.200"
                color="blue.500"
                w="100px"
                h="100px"
                my="20px"
              />
            </Flex>
          ) : (
            <>
              <ModalHeader bgColor="#306172" color="white" borderRadius="0.375rem 0.375rem 0 0">可以認識一下～</ModalHeader>
              <ModalCloseButton color="white"/>
              <ModalBody>
                {recommend.length === 0 && (
                  <SearchMembers />
                )}
                {recommend.map((member, i) => {
                  return <Member key={i} note={member} />;
                })}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="brand" mr={3} onClick={onClose}>
                  關閉
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default RecommendModal;
