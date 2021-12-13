import { UserInterface } from '../context/AppContext';
import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    InputGroup,
    InputLeftElement,
    ButtonProps,
    Heading,
    HStack,
    Spacer,
    Text,
    InputRightElement,
    Link,
} from '@chakra-ui/react';
import { Link as reactlink } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { EmailIcon, UnlockIcon, CheckIcon } from '@chakra-ui/icons';
import { FaUserCircle } from 'react-icons/fa';
import React, {
    useRef,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';
import { motion } from 'framer-motion';
import axios, { AxiosResponse } from 'axios';
import AppContext from '../context/AppContext';
import { LoadingModal } from '../components/LoadingModal';
import { isElementAccessExpression } from 'typescript';
const MotionButton = motion<ButtonProps>(Button);

interface LoginResponseInterface extends AxiosResponse {
    data: {
        token: string;
        user: UserInterface;
    };
}
interface isValidTokenResponseInterface {
    isValid: boolean;
    user: UserInterface;
}
interface isValidTokenInterface extends isValidTokenResponseInterface {
    token: string;
}

export const Signup: React.FC = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [passwdCheckFailed, setPasswdCheckFailed] = useState(false);

    // for passwd validation
    const [passwd, setPasswd] = useState('');
    const [cnfPasswd, setCnfPasswd] = useState('');
    const [passwdIsValid, setPasswdIsValid] = useState(false);
    const [cnfPasswdIsValid, setCnfPasswdIsValid] = useState(false);

    const [emailIsValid, setEmailIsValid] = useState(false);
    const [nameIsValid, setNameIsValid] = useState(false);

    const ctx = useContext(AppContext);

    const isTokenValid = useCallback(async (): Promise<
        isValidTokenInterface | false
    > => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const isValidResp: AxiosResponse<isValidTokenResponseInterface> =
                await axios.get('http://localhost:4000/api/auth', {
                    headers: {
                        'x-auth-token': `${accessToken}`,
                    },
                });
            return { ...isValidResp.data, token: accessToken };
        }
        return false;
    }, []);

    useEffect(() => {
        (async function () {
            setIsLoading(true);
            const isValidToken = await isTokenValid();
            if (isValidToken) {
                const payload = {
                    ...isValidToken.user,
                    token: isValidToken.token,
                    isLoggedIn: true,
                };
                console.log(payload);
                ctx.dispatch({
                    type: 'SET_USER',
                    payload: payload,
                });
                setIsLoading(false);
            } else {
                ctx.dispatch({
                    type: 'SET_LOGGEDIN',
                    payload: false,
                });
                setIsLoading(false);
            }
        })();
    }, [isTokenValid]);

    const onLoginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = nameRef.current?.value.trim();
        const email = emailRef.current?.value.trim();

        //Validating the form
        if (name === '') {
            return;
        }
        if (email === '') {
            return;
        }
        if (passwd === '') {
            return;
        }

        if (passwd !== cnfPasswd) {
            return;
        }

        const data = {
            name,
            email,
            password: passwd,
        };

        try {
            const response: LoginResponseInterface = await axios.post(
                'http://localhost:4000/api/users',
                {
                    ...data,
                }
            );
            console.log(response);
            if (response.status === 200) {
                localStorage.setItem('accessToken', response.data.token);
                ctx.dispatch({
                    type: 'SET_USER',
                    payload: {
                        ...response.data.user,
                        token: response.data.token,
                        isLoggedIn: true,
                    },
                });
            } else {
                console.log('Authentication failed');
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (isLoading) {
        return <LoadingModal />;
    }

    if (ctx.state.user.isLoggedIn && ctx.state.user.role === 'normal') {
        return <Redirect to='/home' />;
    } else if (ctx.state.user.isLoggedIn && ctx.state.user.role === 'premium') {
        return <Redirect to='/premium' />;
    } else {
        return (
            <Flex minH={'100vh'} align={'flex-start'} justify={'center'}>
                <form onSubmit={onLoginHandler}>
                    <Stack spacing={4} marginTop={24} w='sm'>
                        <Stack w='full' align='center'>
                            <Heading fontSize='2xl' color='brand.300'>
                                Signup to Pocket OCR
                            </Heading>
                        </Stack>
                        <FormControl id='name'>
                            <FormLabel>Name</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<FaUserCircle />} />
                                <Input
                                    ref={nameRef}
                                    onChange={(e) => {
                                        if (e.target.value.trim().length >= 3) {
                                            setNameIsValid(true);
                                        } else {
                                            setNameIsValid(false);
                                        }
                                    }}
                                    type='text'
                                    isRequired
                                />
                                {nameIsValid && (
                                    <InputRightElement
                                        children={
                                            <CheckIcon color='green.500' />
                                        }
                                    />
                                )}
                            </InputGroup>
                        </FormControl>
                        <FormControl id='email'>
                            <FormLabel>Email</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<EmailIcon />} />
                                <Input
                                    ref={emailRef}
                                    onChange={(e) => {
                                        const emailRegex =
                                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

                                        if (e.target.value.match(emailRegex)) {
                                            setEmailIsValid(true);
                                        } else {
                                            setEmailIsValid(false);
                                        }
                                    }}
                                    type='email'
                                    isRequired
                                />
                                {emailIsValid && (
                                    <InputRightElement
                                        children={
                                            <CheckIcon color='green.500' />
                                        }
                                    />
                                )}
                            </InputGroup>
                        </FormControl>
                        <FormControl id='password'>
                            <FormLabel>New Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<UnlockIcon />} />
                                <Input
                                    type='password'
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        setPasswd(e.target.value);
                                        if (e.target.value.trim().length >= 8) {
                                            setPasswdIsValid(true);
                                        } else {
                                            setPasswdIsValid(false);
                                        }
                                    }}
                                    value={passwd}
                                    isRequired
                                />
                                {passwdIsValid && (
                                    <InputRightElement
                                        children={
                                            <CheckIcon color='green.500' />
                                        }
                                    />
                                )}
                            </InputGroup>
                        </FormControl>
                        <FormControl id='cnfPasswd'>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<UnlockIcon />} />
                                <Input
                                    onChange={(e) => {
                                        console.log(e.target.value);
                                        setCnfPasswd(e.target.value);
                                        if (e.target.value === passwd) {
                                            setCnfPasswdIsValid(true);
                                        } else {
                                            setCnfPasswdIsValid(false);
                                        }
                                    }}
                                    type='password'
                                    value={cnfPasswd}
                                    isRequired
                                />
                                {cnfPasswdIsValid && (
                                    <InputRightElement
                                        children={
                                            <CheckIcon color='green.500' />
                                        }
                                    />
                                )}
                            </InputGroup>
                        </FormControl>

                        {/* <HStack w='full' alignContent={'center'}>
                            <Text w='full' align={'center'} color='red.300'>
                                Passwords doesn't match
                            </Text>
                        </HStack> */}

                        <HStack w='full'>
                            <Spacer />
                            <Text>
                                Registered User? &nbsp;
                                <Button
                                    as={reactlink}
                                    to='/'
                                    color='brand.200'
                                    variant='link'>
                                    Login
                                </Button>
                            </Text>
                        </HStack>
                        <MotionButton
                            type='submit'
                            variant='primary'
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}>
                            Signup
                        </MotionButton>
                    </Stack>
                </form>
            </Flex>
        );
    }
};
