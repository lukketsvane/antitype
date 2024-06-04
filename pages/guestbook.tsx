import { useState, useRef, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Container, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Input, Box, Flex, Text, useColorModeValue, Grid } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';
import Image from 'next/image';

const Guestbook = () => {
  const { data: session } = useSession();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const sigCanvas = useRef(null);
  const bgColor = useColorModeValue('white', '#121212');
  const buttonBg = useColorModeValue('gray.100', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const penColor = useColorModeValue('white', 'black');
  const imgFilter = useColorModeValue('none', 'invert(1)');
  
  useEffect(() => {
    async function fetchEntries() {
      const res = await fetch('/api/guestbook');
      const data = await res.json();
      setEntries(data);
    }
    fetchEntries();
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const onSubmit = async (data) => {
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      body: JSON.stringify({ ...data, signature }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const newEntry = await res.json();
      setEntries((prev) => [newEntry, ...prev]);
      reset();
      setIsOpen(false);
    } else {
      console.error('Failed to save entry', res.statusText);
    }
  };

  return (
    <Container>
      <Flex justify="left " align="left" my={6}>
        <Text fontSize="2xl" fontWeight="bold">Sign my guestbook</Text>
      </Flex>
      <Flex justify="space-between" mt={2} width="100%">
        {session ? (
          <>
            <Button onClick={handleOpen} bg={buttonBg}>Sign guestbook</Button>
            <Button onClick={() => signOut()} leftIcon={<MdExitToApp />} variant="ghost" _hover={{ bg: buttonBg }}>Sign out</Button>
          </>
        ) : (
          <Button onClick={() => signIn('github')} bg={buttonBg} leftIcon={<FaGithub />}>Sign in with GitHub</Button>
        )}
      </Flex>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign my guestbook</ModalHeader>
          <ModalBody>
            <form id="guestbook-form" onSubmit={handleSubmit(onSubmit)}>
              <Input 
                {...register('name', { required: 'Name is required' })} 
                placeholder="Your name" 
                mb={4} 
              />
              {errors.name && <Text color="red.500" mb={4}>{(errors.name as any).message}</Text>}
              
              <Textarea 
                {...register('message', { required: 'Message is required' })} 
                placeholder="Leave a message" 
                mb={4} 
              />
              {errors.message && <Text color="red.500" mb={4}>{(errors.message as any).message}</Text>}
              
              <Box border="1px solid" borderColor={borderColor}>
                <SignatureCanvas ref={sigCanvas} penColor={penColor} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
              </Box>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>Cancel</Button>
            <Button colorScheme="gray" type="submit" form="guestbook-form">Sign</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }} gap={6} mt={6}>
        {entries.map((entry, index) => (
          <Box key={index} p={4} borderWidth="1px" borderRadius="md" bg={bgColor} position="relative" height="180px">
            <Box display="flex" flexDirection="column" height="100%">
              <Text mb={2} flex="1">{entry.message}</Text>
              <Box mt="auto">
                <Text fontSize="sm" color="gray.500">{entry.name}</Text>
                <Text fontSize="xs" color="gray.400">{new Date(entry.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
              </Box>
            </Box>
            <Box position="absolute" bottom="8px" right="8px" width="50%" height="calc(100% - 16px)" p={2}>
              <Image src={entry.signature} alt="signature" layout="fill" objectFit="contain" style={{ filter: imgFilter }} />
            </Box>
          </Box>
        ))}
      </Grid>
    </Container>
  );
};

export default Guestbook;