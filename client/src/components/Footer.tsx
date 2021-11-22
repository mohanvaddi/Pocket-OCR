import {
    Box,
    Container,
    Stack,
    Text,
    Link,
    useColorModeValue,
    chakra,
    VisuallyHidden,
} from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { Link as ReachLink } from 'react-router-dom';
import { ReactNode } from 'react';

const SocialButton = ({
    children,
    label,
    href,
}: {
    children: ReactNode;
    label: string;
    href: string;
}) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}>
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

export const Footer = () => {
    return (
        <Box color={useColorModeValue('gray700', 'gray.200')}>
            <Container
                as={Stack}
                maxW={'6xl'}
                px={0}
                py={4}
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify={{ base: 'center', md: 'space-between' }}
                align={{ base: 'center', md: 'center' }}>
                <Stack direction={'row'} spacing={6}>
                    <Link as={ReachLink} to={'/'}>
                        Home
                    </Link>
                    <Link as={ReachLink} to={'/about'}>
                        About
                    </Link>
                    <Link as={ReachLink} to={'/login'}>
                        Login
                    </Link>
                    <Link as={ReachLink} to={'/contact'}>
                        Contact
                    </Link>
                </Stack>
                <Stack direction={'row'} spacing={6}>
                    <SocialButton label={'Github'} href={'#'}>
                        <FaGithub />
                    </SocialButton>
                </Stack>
                <Text>©2021 Made by Mohan vaddi.</Text>
            </Container>
        </Box>
    );
};
