import React, { useState } from 'react';
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
interface UploadTabProps {}

const MotionButton = motion<ButtonProps>(Button);
export const UploadTab: React.FC<UploadTabProps> = () => {
    const [data, setData] = useState<string | null>(null);

    return (
        <Formik
            initialValues={{ lang: 'eng', file: [] }}
            onSubmit={async (values) => {
                // if no files are uploaded
                if (values.file.length === 0) {
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
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                console.log(resp);
                setData(resp.data);
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
                        </SimpleGrid>
                    </VStack>
                </Form>
            )}
        </Formik>
    );
};
