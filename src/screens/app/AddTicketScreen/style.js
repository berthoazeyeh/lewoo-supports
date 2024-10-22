import { StyleSheet } from 'react-native';
import { BLACK, PRIMARY } from 'utils/constants/colors';
import Theme from "theme"

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: theme.primaryBackground,
        },
        content: {
            flex: 1,
            padding: 16,

            width: "100%",
            backgroundColor: theme.primaryBackground,
        },
        search: {
            backgroundColor: theme.gray3,
            height: 50, marginVertical: 5,
        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.primary,
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
            backgroundColor: theme.primaryBackground,
            ...Theme.fontStyle.montserrat.bold,

        },
        title: {
            fontSize: 18,
            marginTop: 20,
            marginBottom: 10,
            color: theme.primaryText,
            textAlign: "left",
            ...Theme.fontStyle.montserrat.bold,
            fontWeight: 'bold',
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
        button: {
            width: "90%",
            margin: 7,
            padding: 13,
            flexDirection: "row",
            alignItems: "center"
        },
        primaryText: {
            fontSize: 15,
            letterSpacing: 1,
            fontWeight: "500",
            ...Theme.fontStyle.montserrat.semiBold,
            color: theme.primaryText
        },
        icon: {
            width: 32,
            height: 32,
            // width: 40,
            // height: 40,
            marginRight: 10,
            color: theme.primary,
            resizeMode: "center"
        },
        input: {
            flex: 1,
            height: 50,
            fontSize: 18,
            color: theme.primaryText,
            backgroundColor: theme.primaryBackground,
            ...Theme.fontStyle.montserrat.semiBold,

        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.gray,
            marginVertical: 5,
            borderRadius: 10,
            paddingHorizontal: 10,
            padding: 2,
            width: '100%',
        },
        picker: {
            height: 50,
            width: '80%',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
        },
        pickerLabels: {
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
        textdanger1: {
            margin: 2,
            color: 'red',
            ...Theme.fontStyle.montserrat.italic,
            fontSize: 10,
            marginLeft: 10,
        },
        sexeItem: {
            flexDirection: "row",
            alignItems: "center",
        },
        sexeContent: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around"
        },
        textField: {
            ...Theme.fontStyle.montserrat.semiBold,
            color: theme.primaryText
        },
        titleText: {
            ...Theme.fontStyle.montserrat.bold,
            fontSize: 18,
            color: theme.primaryText
        },
        sexeContainer: {
            padding: 10,
        },
        search: {
            backgroundColor: theme.gray3,
            height: 50, marginVertical: 5,
        },
        item: {
            padding: 15,
            marginVertical: 10,
            borderRadius: 10,
            backgroundColor: '#f9f9f9',
        },

        selectedClasses: {
            marginVertical: 5,
            backgroundColor: theme.gray3,
            borderRadius: 10,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
        },
        subtitle: {
            fontSize: 14,
            color: 'gray',
        },
    });
};

export default dynamicStyles;
