import { extendTheme, theme as baseTheme, ThemeConfig, withDefaultColorScheme, withDefaultVariant } from '@chakra-ui/react';

import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};
const theme = extendTheme(
    {
        config,
        colors: {
            brand: {
                50: '#f5fee5',
                100: '#e1fbb2',
                200: '#cdf781',
                300: '#b8ee56',
                400: '#a2e032',
                500: '#8ac919',
                600: '#71ab09',
                700: '#578602',
                800: '#3c5e00',
                900: '#203300',
            },
        },
        fonts: {
            heading: `Montserrat, ${baseTheme.fonts.heading}`,
            body: `Inter, ${baseTheme.fonts.body}`,
        },
        components: {
            Button: {
                variants: {
                    primary: (props: any) => ({
                        rounded: 'none',
                        _focus: {
                            ring: 2,
                            ringColor: 'brand.500',
                        },
                        color: mode('white', 'gray.800')(props),
                        backgroundColor: mode('brand.500', 'brand.200')(props),
                        _hover: {
                            backgroundColor: mode(
                                'brand.600',
                                'brand.300'
                            )(props),
                        },
                        _active: {
                            backgroundColor: mode(
                                'brand.700',
                                'brand.400'
                            )(props),
                        },
                    }),
                },
            },

            Input: {
                variants: {
                    filled: {
                        field: {
                            _focus: {
                                borderColor: 'brand.500',
                            },
                        },
                    },
                },
                // sizes: {
                //     md: {
                //         field: {
                //             borderRadius: 'none',
                //         },
                //     },
                // },
            },
            Select: {
                variants: {
                    filled: {
                        field: {
                            _focus: {
                                borderColor: 'brand.500',
                            },
                        },
                    },
                },
                // sizes: {
                //     md: {
                //         field: {
                //             borderRadius: 'none',
                //         },
                //     },
                // },
            },
            Checkbox: {
                baseStyle: {
                    control: {
                        _focus: {
                            ring: 2,
                            ringColor: 'brand.500',
                        },
                    },
                },
            },
        },
    },
    withDefaultColorScheme({
        colorScheme: 'brand',
        components: ['Checkbox'],
    }),
    withDefaultVariant({
        variant: 'filled',
        components: ['Input', 'Select'],
    })
);

export default theme;
