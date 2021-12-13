import React, { useState, useContext } from 'react';
import {
    GridItem,
    FormControl,
    Select,
    Button,
    SimpleGrid,
    VStack,
    ButtonProps,
    Text,
    Box,
} from '@chakra-ui/react';
import { DropZone } from './DropZone';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Formik, Form } from 'formik';
import AppContext from './../context/AppContext';
import { PartialLoadingModal } from './PartialLoadingModal';
import { ClipboardCopy } from './ClipboardCopy';
interface UploadTabProps {}

const MotionButton = motion<ButtonProps>(Button);
export const UploadTab: React.FC<UploadTabProps> = () => {
    const { state } = useContext(AppContext);
    const [data, setData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean | null>(null);

    if (isLoading) {
        return <PartialLoadingModal />;
    }

    return (
        <Formik
            initialValues={{ lang: 'eng', file: [] }}
            onSubmit={async (values) => {
                setIsLoading(true);
                // if no files are uploaded
                if (values.file.length === 0) {
                    setIsLoading(false);
                    return;
                }

                const formData = new FormData();
                for (let i = 0; i < values.file.length; i++) {
                    formData.append('file', values.file[i]);
                }
                formData.append('lang', values.lang);
                const resp = await axios.post(
                    'http://localhost:4000/upload',
                    formData,
                    {
                        headers: {
                            'x-auth-token': state.user.token,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                console.log(resp);
                setData(resp.data);
                setIsLoading(false);
            }}>
            {({ values, errors, isValid, isSubmitting, handleChange }) => (
                <Form>
                    <VStack spacing={4}>
                        <DropZone name='file' />
                        <SimpleGrid
                            columns={2}
                            columnGap={3}
                            rowGap={6}
                            w='full'>
                            <GridItem colSpan={1}>
                                <FormControl>
                                    <Select
                                        value={values.lang}
                                        onChange={handleChange}
                                        name='lang'
                                        id='lang'>
                                        <option value='eng'>English</option>
                                        <option value='tel'>Telugu</option>
                                        <option value='hin'>Hindi</option>
                                    </Select>
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormControl>
                                    <MotionButton
                                        type='submit'
                                        variant='primary'
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        w={['full', 'auto']}>
                                        Get Text
                                    </MotionButton>
                                </FormControl>
                            </GridItem>
                            {data && (
                                <GridItem colSpan={2}>
                                    <Box as='div' p='4' borderRadius='3px'>
                                        <Text fontSize='xl'>{data}</Text>
                                    </Box>
                                </GridItem>
                            )}
                            {data && (
                                <GridItem colSpan={2}>
                                    <Box as='div' p='4' borderRadius='3px'>
                                        <ClipboardCopy text={data} />
                                    </Box>
                                </GridItem>
                            )}
                        </SimpleGrid>
                    </VStack>
                </Form>
            )}
        </Formik>
    );
};
