import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useField } from 'formik';
import { Box, Text, VStack, Image } from '@chakra-ui/react';

export interface UploadFiles extends File {
    preview: string;
    name: string;
}

export const DropZone = ({ name }: { name: string }) => {
    const [_, __, helpers] = useField(name);
    const [files, setFiles] = useState<UploadFiles[]>([]);
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
    });

    const thumbs = files.map((file) => (
        <Box
            as='div'
            display='inline-flex'
            borderRadius='2px'
            border='1px solid #eaeaea'
            mb='0.5'
            mr='0.5'
            width='100px'
            height='100px'
            padding='0.25'
            boxSizing='border-box'
            key={file.name}>
            <Box as='div' display='flex' minW='0' overflow='hidden'>
                <Image
                    src={file.preview}
                    display='block'
                    width='auto'
                    height='100%'
                    alt='uploaded'
                />
            </Box>
        </Box>
    ));

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );
    useEffect(() => {
        helpers.setValue(files);
    }, [files]);

    return (
        <>
            {files.length === 0 && (
                <Box
                    {...getRootProps()}
                    as='div'
                    h={['xs', 'xs']}
                    w='full'
                    border={'dashed 1px'}
                    borderRadius={'5px'}
                    borderWidth={1}>
                    <input name={name} {...getInputProps()} />
                    <VStack
                        w='full'
                        h='full'
                        display='flex'
                        direction='row'
                        justifyContent='center'>
                        <Text color='brand.300'>
                            Drag 'n' drop image here, or click to select image
                        </Text>
                    </VStack>
                </Box>
            )}
            <Box
                display='flex'
                flexDirection='row'
                flexWrap='wrap'
                marginTop='16px'
                alignItems={['center', 'flex-start']}
                h='full'
                w='full'>
                {thumbs}
            </Box>
        </>
    );
};
