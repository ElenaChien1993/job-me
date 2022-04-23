import { useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';

import styled from 'styled-components';
import firebase from '../utils/firebase';

const StyledImage = styled(Image)`
  cursor: pointer;
`;

const AddImageModal = ({ isOpen, onClose, room, send }) => {
  const [image, setImage] = useState({ preview: '', raw: '' });
  const hiddenInputRef = useRef();

  const handleChooseFile = e => {
    hiddenInputRef.current.click();
  };

  const handleFileChange = e => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleUpload = async e => {
    const path = `chatrooms/${room.id}/${uuid()}`;
    const url = await firebase.uploadFile(path, image.raw).then(() => {
      return firebase.getDownloadURL(path);
    });

    await send(url, 1);
    onClose();

    setImage({
      preview: '',
      raw: '',
    });
  };

  return (
    <>
      <Modal
        size="xl"
        isOpen={isOpen}
        onClose={onClose}
        id="addImage"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>選擇要傳送的圖片</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <StyledImage
              objectFit='contain'
              boxSize="200px"
              alt="upload"
              src={image.preview}
              fallbackSrc={require('../images/add-document.svg').default}
              onClick={handleChooseFile}
            />
            <input
              type="file"
              ref={hiddenInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={5} onClick={handleUpload}>
              確認傳送
            </Button>
            <Button
              variant="outline"
              colorScheme="blue"
              mr={3}
              onClick={onClose}
            >
              關閉
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddImageModal;
