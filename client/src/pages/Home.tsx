import {
    Container,
    Heading,
    VStack,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Stack,
    SimpleGrid,
    useBreakpointValue,
    GridItem,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import AppContext from './../context/AppContext';
import { Redirect } from 'react-router-dom';
import { Layout } from '../layout/Layout';
import { UploadTab } from '../components/UploadTab';

interface StudentHomeProps {}

export const Home: React.FC<StudentHomeProps> = () => {
    const { state } = useContext(AppContext);

    if (state.user.isLoggedIn === false) {
        return <Redirect to='/' />;
    } else {
        return (
            <Layout>
                <Container maxW='container.xl' p={0}>
                    <VStack padding={[5, 8, 12]} minH={'100vh'}>
                        <Stack width='full' h='full'>
                            <Tabs isLazy>
                                <TabList>
                                    <Tab _selected={{ color: 'brand.500' }}>
                                        Upload
                                    </Tab>
                                    <Tab _selected={{ color: 'brand.500' }}>
                                        Online
                                    </Tab>
                                </TabList>

                                <TabPanels>
                                    <TabPanel>
                                        <UploadTab />
                                    </TabPanel>
                                    <TabPanel>
                                        <p>two!</p>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Stack>
                    </VStack>
                </Container>
            </Layout>
        );
    }
};
