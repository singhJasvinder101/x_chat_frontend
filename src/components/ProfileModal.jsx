import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Image,
  Text,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { chatState } from '../context/ChatProvider'

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      {
        children ? (
          <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton onClick={onOpen} icon={<ViewIcon />} />
        )
      }
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            // fontFamily="Noto sans"
            className='martelSans text-gray-600'
            d="flex"
            justifyContent="center"
          >
            Profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            className='d-flex flex-col justify-center items-center text-gray-700'
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModal
