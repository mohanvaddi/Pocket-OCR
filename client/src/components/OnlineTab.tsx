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
    Input,
    useBreakpointValue,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import axios from 'axios';
import { Formik, Form } from 'formik';
interface OnlineTabProps {}

const MotionButton = motion<ButtonProps>(Button);
export const OnlineTab: React.FC<OnlineTabProps> = () => {
    const colspan = useBreakpointValue({ base: 2, md: 1 });
    const [data, setData] = useState<string | null>(null);

    return (
        <Formik
            initialValues={{ lang: 'eng', imgLink: '' }}
            onSubmit={async (values) => {
                if (values.imgLink.trim().length === 0) {
                    return;
                }
                console.log(values);

                const resp = await axios.post(
                    'http://localhost:4000/usingLink',
                    {
                        lang: values.lang,
                        imgLink: values.imgLink,
                    }
                );
                console.log(resp);
                setData(resp.data);
            }}>
            {({ values, errors, isValid, isSubmitting, handleChange }) => (
                <Form>
                    <VStack spacing={4}>
                        <SimpleGrid
                            columns={2}
                            columnGap={3}
                            rowGap={6}
                            w='full'>
                            <GridItem colSpan={colspan}>
                                <FormControl>
                                    <Input
                                        placeholder='Paste Image link here..'
                                        value={values.imgLink}
                                        onChange={handleChange}
                                        name='imgLink'
                                        id='imgLink'
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem colSpan={colspan}>
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
