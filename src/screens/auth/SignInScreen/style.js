import { StyleSheet } from 'react-native';
import { BLACK, PRIMARY } from 'utils/constants/colors';
import Theme from "theme"

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.primaryBackground,
            padding: 16,
        },
        title: {
            fontSize: 24,
            marginBottom: 30,
            color: theme.primaryText,
            textAlign: "center",
            ...Theme.fontStyle.montserrat.bold,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.gray,
            marginBottom: 15,
            borderRadius: 10,
            paddingHorizontal: 10,
            padding: 2,
            width: '100%',
        },
        icon: {
            marginRight: 10,
            color: theme.primaryText,
        },
        textdanger1: {
            margin: 2,
            color: 'red',
            ...Theme.fontStyle.montserrat.italic,
            fontSize: 10,
            marginLeft: 10,
        },
        icon1: {
            marginLeft: 5,
            color: theme.primaryText,
        },
        input: {
            flex: 1,
            height: 50,
            fontSize: 18,
            color: theme.primaryText,
            color: theme.primaryBackground,
            backgroundColor: theme.primaryBackground,
            ...Theme.fontStyle.montserrat.bold,

        },
        button: {
            marginTop: 30,
            backgroundColor: theme.primary,
            paddingVertical: 10,
            paddingHorizontal: 30,
            borderRadius: 15,
        },
        buttonText: {
            textAlign: 'center',
            fontWeight: 'bold',
            color: theme.secondaryText,
            fontSize: 18,
            fontWeight: 'bold',
        },

    });
};

export default dynamicStyles;
