import { Box, Button, Center, HStack, Stack, StackDivider, useDisclosure } from '@chakra-ui/react';
import * as React from 'react';
import { HiOutlineMenu, HiX } from 'react-icons/hi';
import { NavLink } from './NavLink';
import { NavItemTransition, NavListTransition } from './Transition';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';

const links = [
  { label: 'Home', href: '/' },
  { label: 'A link', href: '#' },
  { label: 'Another link', href: '#' },
  { label: 'Third link', href: '#' },
];

function MobileNavContent(props) {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Box {...props}>
      <Center as='button' p='2' fontSize='2xl' color='gray.700' onClick={onToggle}>
        {isOpen ? <HiX /> : <HiOutlineMenu />}
      </Center>
      <NavListTransition
        pos='absolute'
        insetX='0'
        bg='blue.600'
        top='64px'
        animate={isOpen ? 'enter' : 'exit'}
      >
        <Stack spacing='0' divider={<StackDivider borderColor='whiteAlpha.200' />}>
          {links.map((link, index) => (
            <NavItemTransition key={index}>
              <NavLink.Mobile href={link.href}>{link.label}</NavLink.Mobile>
            </NavItemTransition>
          ))}
          <NavItemTransition style={{ flex: '1' }}>
            <NavLink.Mobile href='#'>Get started</NavLink.Mobile>
          </NavItemTransition>
        </Stack>
      </NavListTransition>
    </Box>
  );
}

function DesktopNavContent(props) {
  return <>
    <HStack spacing='8' align='stretch' {...props}>
      {links.map((link, index) => (
        <NavLink.Desktop key={index} href={link.href}>
          {link.label}
        </NavLink.Desktop>
      ))}
    </HStack>

    <Box ml="auto" mr={15}>
      <ColorModeSwitcher />
    </Box>
  </>
}

export const NavContent = {
  Mobile: MobileNavContent,
  Desktop: DesktopNavContent,
};
