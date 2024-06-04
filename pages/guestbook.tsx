import { useState, useRef, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Container, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Input, Box, Flex, Text, useColorModeValue, Grid } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';

const Guestbook = () => {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const sigCanvas = useRef(null);
  const bgColor = useColorModeValue('white', '#121212');
  const textColor = useColorModeValue('gray.800', 'white');
  const buttonBg = useColorModeValue('gray.200', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const penColor = useColorModeValue('black', 'white');

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
      <Flex justify="space-between" align="center" my={6}>
        <Text fontSize="2xl" fontWeight="bold">Sign my guestbook</Text>
        {session ? (
          <Button onClick={handleOpen} bg={buttonBg} leftIcon={<FaGithub />}>Sign guestbook</Button>
        ) : (
          <Button onClick={() => signIn('github')} bg={buttonBg} leftIcon={<FaGithub />}>Sign in with GitHub</Button>
        )}
        {session && <Button onClick={() => signOut()} bg={buttonBg}>Sign out</Button>}
      </Flex>
      
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign my guestbook</ModalHeader>
          <ModalBody>
            <form id="guestbook-form" onSubmit={handleSubmit(onSubmit)}>
              <Input {...register('name')} placeholder="Your name" mb={4} />
              <Textarea {...register('message')} placeholder="Leave a message" mb={4} />
              <Box border="1px solid" borderColor={borderColor}>
                <SignatureCanvas ref={sigCanvas} penColor={penColor} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
              </Box>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>Cancel</Button>
            <Button colorScheme="blue" type="submit" form="guestbook-form">Sign</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mt={6}>
        {entries.map((entry, index) => (
          <Box key={index} p={4} borderWidth="1px" borderRadius="md" bg={bgColor} color={textColor}>
            <Text mb={2}>{entry.message}</Text>
            <Text fontSize="sm" color="gray.500">{entry.name}</Text>
            <Text fontSize="xs" color="gray.400">{new Date(entry.createdAt).toLocaleString()}</Text>
            <Box mt={2}>
              <img src={entry.signature} alt="signature" style={{ width: '100%', height: '100px', objectFit: 'contain' }} />
            </Box>
          </Box>
        ))}
      </Grid>
    </Container>
  );
};

export default Guestbook;