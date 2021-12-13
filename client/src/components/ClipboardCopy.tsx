import React from 'react';
import { useClipboard, Flex, Input, Button } from '@chakra-ui/react';

interface ClipboardCopyProps {
    text: string;
}

export const ClipboardCopy: React.FC<ClipboardCopyProps> = ({ text }) => {
    const { hasCopied, onCopy } = useClipboard(text);

    return (
        <Flex mb={2}>
            <Input value={text} isReadOnly  size={'auto'} height={'auto'}/>
            <Button onClick={onCopy} ml={2}>
                {hasCopied ? 'Copied' : 'Copy'}
            </Button>
        </Flex>
    );
};
