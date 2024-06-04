// components/layout.tsx
import { Container, VStack, Text, Flex, Box, HStack, Menu, MenuButton, IconButton, MenuList, MenuItem, Icon, MenuGroup, useColorModeValue, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { FiMenu } from "react-icons/fi";

function Navigation({ link, children, isExternal }: { link: string; children: string; isExternal?: boolean }) {
  const router = useRouter();
  const isActive = link === "/" ? router.asPath === link : router.asPath.includes(link);
  const activeColor = useColorModeValue("black", "#fafafa");
  const inactiveColor = useColorModeValue("gray.600", "rgba(255, 255, 255, 0.50)");
  return (
    <Link href={link} passHref>
      <Text as="a" target={isExternal ? "_blank" : "_self"} fontSize="lg" color={isActive ? activeColor : inactiveColor} _hover={{ color: activeColor }}>
        {children}
      </Text>
    </Link>
  );
}

function Layout({ children }: PropsWithChildren<{}>) {
  const bgColor = useColorModeValue("white", "#0a0a0a");
  const displayBooksLink = useBreakpointValue({ base: 'none', lg: 'block' });
  return (
    <Container position="relative" mt={{ base: 16, md: 20 }} pb={{ base: 8, md: "10em" }} maxW={{ base: "100%", xl: "container.md" }} px={{ base: 8, xl: 12 }}>
      <Flex justify="space-between" position="fixed" top={0} display="flex" height={12} zIndex={50} left={0} width="100%" align="center" borderBottom="1px solid" borderBottomColor="gray.200" bg={bgColor}>
        <HStack spacing={4} pl={4} pr={8}>
          <Navigation link="/">Home</Navigation>
          <Navigation link="/writing">Blog</Navigation>
          <Navigation link="/projects">Build Log</Navigation>
        </HStack>
        <Menu>
          <MenuButton as={IconButton} aria-label="Options" icon={<Icon as={FiMenu} boxSize={4} />} variant="outline" size="sm" />
          <MenuList bg={bgColor}>
            <MenuGroup title="NAVIGATION">
              <VStack align="flex-start" px={4} spacing={3} mb={4}>
                <Navigation link="/">Home</Navigation>
                <Navigation link="/writing">Blog</Navigation>
                <Navigation link="/books">Books</Navigation>
                <Navigation link="/projects">Build Log</Navigation>
              </VStack>
            </MenuGroup>
            <MenuGroup title="FIND ME ON">
              <VStack align="flex-start" px={4} spacing={3} mb={2}>
                <Navigation link="https://twitter.com/amitoser" isExternal>Twitter</Navigation>
                <Navigation link="https://github.com/lukketsvane" isExternal>GitHub</Navigation>
              </VStack>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Flex>
      {children}
    </Container>
  );
}

export default Layout;
