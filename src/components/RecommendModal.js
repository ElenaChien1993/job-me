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

const RecommendModal = ({ isOpen, onClose, recommend, isLoading }) => {
  return (
    <>
      <Modal size="xl" isOpen={isOpen} onClose={onClose} id="recommend">
        <ModalOverlay />
        <ModalContent>
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
              <ModalHeader>可以認識一下～</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {recommend.length === 0 && (
                  <p>這份筆記的公司或職稱還沒有人分享耶 QQ</p>
                )}
                {recommend.map((member, i) => {
                  return <Member key={i} note={member} />;
                })}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
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
