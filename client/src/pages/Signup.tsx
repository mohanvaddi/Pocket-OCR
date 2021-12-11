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
} from '@chakra-ui/react';
import { Redirect } from 'react-router-dom';
import { EmailIcon, UnlockIcon } from '@chakra-ui/icons';
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
    const passwdRef = useRef<HTMLInputElement>(null);
    const cnfPasswdRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState('');

    const ctx = useContext(AppContext);

    useEffect(() => {
        
    }, [notification])

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
        const passwd = passwdRef.current?.value.trim();
        const cnfPasswd = cnfPasswdRef.current?.value.trim();

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

        const data = {
            name,
            email,
            passwd,
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
                    <Stack spacing={5} marginTop={24} w='sm'>
                        <Stack w='full' align='center'>
                            <Heading fontSize='2xl' color='brand.300'>
                                Signup to Pocket OCR
                            </Heading>
                        </Stack>
                        <FormControl id='name'>
                            <FormLabel>Name</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<FaUserCircle />} />
                                <Input ref={nameRef} type='text' isRequired />
                            </InputGroup>
                        </FormControl>
                        <FormControl id='email'>
                            <FormLabel>Email</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<EmailIcon />} />
                                <Input ref={emailRef} type='email' isRequired />
                            </InputGroup>
                        </FormControl>
                        <FormControl id='password'>
                            <FormLabel>New Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<UnlockIcon />} />
                                <Input
                                    ref={passwdRef}
                                    type='password'
                                    isRequired
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl id='cnfPasswd'>
                            <FormLabel>Confirm Password</FormLabel>
                            <InputGroup>
                                <InputLeftElement children={<UnlockIcon />} />
                                <Input
                                    ref={cnfPasswdRef}
                                    type='password'
                                    isRequired
                                />
                            </InputGroup>
                        </FormControl>

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
