// pages/index.tsx
import { Box, Heading } from '@chakra-ui/react';
import { Expandable } from '../components/expandable';
import IndexContent from './about-me.mdx';
import FooterContent from './about-footer.mdx';

const Home: React.FC = () => {
  return (
    <Box>
      <Heading as="h1" size="xl" mb={4}>
        Iver Finne
      </Heading>
      <IndexContent />
      <FooterContent />
      <Expandable title="Past Work">
        <Box fontSize="0.9em">
          As ABB&apos;s Technical Consultant since 2022 and Production Manager at Springbrettet, I&apos;ve been fusing technical expertise with strategic communication in Norway&apos;s business and educational sectors. My past roles as CEO of Coral Solutions AS and Creative Director for the Ygdrasyl Project and Emberlight VR honed my skills in leading innovation in engineering, sustainable design, and VR gaming. I&apos;ve also driven design and production at Dongjin Tableware, leveraging my proficiency in 3D modeling and graphic design to enhance product development and market presence.
        </Box>
      </Expandable>
    </Box>
  );
};

export default Home;