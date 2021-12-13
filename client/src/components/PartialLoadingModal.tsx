import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import classes from './PartialLoadingModal.module.css';

interface LoadingModalProps {}

export const PartialLoadingModal: React.FC<LoadingModalProps> = () => {
    return ReactDOM.createPortal(
        <Box
            w='100%'
            h='100%'
            display='flex'
            justifyContent='center'
            alignItems='center'
            backdropBlur
            className={classes.backdrop}>
            <Spinner
                thickness='4px'
                speed='0.3s'
                color='brand.500'
                size='xl'
            />
        </Box>,
        document.getElementById('loading-root') as HTMLElement
    );
};
