import { Platform } from 'react-native';
const theme = {
    colors: {
        dark: {
            primary: '#fff',
            secondary: '#8442bd',
            primaryBackground: '#000',
            secondaryBackground: '#fff',
            secondaryText: '#000',
            primaryBorder: '#fff',
            primaryText: '#fff',
            errorNetwork: 'red',
            statusbar: '#000',
            primaryForeground: '#434343',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            underlayColor: 'rgba(255, 255,255, 0.1)',
            secondaryUnderlayColor: 'rgba(255, 255,255, 0.9)',
            placeholderTextColor: "#aaaaaa",
            buttonTextColor: '#000',
            hairline: '#222222',
            gray: "#cccc",
            gray2: "#767577",
            gray3: "#f4f3f4",
            gray4: "#3e3e3e",
            grey9: '#eaeaea',
            primaryStay: '#259745',
            icon: "#000",
            separator: "#f5f5f5",
            grayText: 'rgba(255,255,255,0.5)',
            shadowColor: 'rgba(255,255,255,0.5)',


        },
        light: {
            primary: 'green',
            secondary: '#8442bd',
            primaryBackground: '#ffff',
            secondaryBackground: '#000',
            primaryForeground: '#434343',
            primaryBorder: '#000',
            primaryText: '#000',
            secondaryText: '#fff',
            errorNetwork: 'red',
            statusbar: '#fff',
            // statusbar: '#000',
            hairline: '#e0e0e0',
            grey9: '#939393',

            overlayColor: 'rgba(255, 255,255, 0.5)',
            underlayColor: 'rgba(0, 0, 0, 0.1)',
            secondaryUnderlayColor: 'rgba(0, 0, 0, 0.85)',
            placeholderTextColor: "#aaaaaa",
            buttonTextColor: '#fff',
            gray: "#cccc",
            gray1: "#c5c5c5",
            gray2: "#767577",
            gray3: "#f4f3f4",
            gray4: "#3e3e3e",
            primaryStay: '#259745',
            icon: "#000",
            separator: "#f5f5f5",
            grayText: 'rgba(0,0,0,0.5)',
            shadowColor: 'rgba(0,0,0,0.5)',
        },
    },
    fontStyle: {
        montserrat: {
            bold: {
                fontFamily: Platform.OS === 'android' ? 'Montserrat-Bold' : 'Arial',
            },
            semiBold: {
                fontFamily: Platform.OS === 'android' ? 'Montserrat-SemiBold' : 'Arial',
            },
            regular: {
                fontFamily: Platform.OS === 'android' ? 'Montserrat-Regular' : 'Arial',
            },
            italic: {
                fontFamily: Platform.OS === 'android' ? 'Montserrat-Italic' : 'Arial',
            },
        },
    },
    icons: {
    },
    images: {
    },
    dims: {
        iconsSignInUp: 18,
        goBack: 25,
        iconDrawer: 25,
    }
};

export default theme;
