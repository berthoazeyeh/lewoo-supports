import { StyleSheet } from 'react-native';
import Theme from "theme"

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.primaryBackground,
        },
        content: {
            padding: 10,
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
        eventName: {
            color: theme.secondaryText,
            fontSize: 22,
            textAlign: "center",
            ...Theme.fontStyle.montserrat.bold,
            fontWeight: "bold",
        },
        eventNameContent: {
            padding: 10,
            paddingVertical: 20,
            marginTop: 10,
            borderRadius: 20,
            backgroundColor: theme.primary,
        },
        eventDatecontainer: {
            gap: 10,
            padding: 5,
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        eventDateContent: {
            width: "48%",
            alignItems: "center",
            padding: 10,
            borderRadius: 10,
            backgroundColor: theme.gray,
        },
        title: {
            fontSize: 20,
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primaryText,
            fontWeight: "bold",

        },
        description: {
            marginTop: 10,
            fontSize: 16,
            color: theme.primaryText,

        },
        titleHeader: {
            fontSize: 20,
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primary,
            fontWeight: "bold",

        },
        titleHeaders: {
            fontSize: 16,
            ...Theme.fontStyle.montserrat.bold,
            color: "green",
            fontWeight: "bold",

        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 20,
            color: theme.secondaryText,
            backgroundColor: theme.primary
        },
        fab1: {
            position: 'absolute',
            margin: 16,
            left: 0,
            bottom: 20,
            color: theme.secondaryText,
            backgroundColor: theme.primary
        },
        dialog: {
            borderRadius: 15,
            paddingHorizontal: 1,
            backgroundColor: theme.primaryBackground,
        },
        closeButton: {
            width: 30,
            height: 30,
            alignSelf: "flex-end",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            position: "absolute",
            top: -15,
            right: 10,
            backgroundColor: theme.primaryText,
            ...Theme.fontStyle.montserrat.bold,
            fontWeight: "bold",

        },
        message: {
            height: 30,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            position: "absolute",
            top: -15,
            left: 10,
            fontSize: 12,
            color: theme.primary,
            ...Theme.fontStyle.montserrat.bold,
            fontWeight: "bold",

        },
        dialogContent: {
            marginTop: 20
        },
        dialogTitle: {
            ...Theme.fontStyle.montserrat.bold,
            fontWeight: "bold",

            color: theme.primaryText,
            fontSize: 18,
            paddingVertical: 10,
        },
        webview: {
            height: 200,
            width: '50%',
            borderWidth: 1,
            borderColor: 'gray',
        },
        subTitle: {
            paddingVertical: 5,
            fontSize: 16,
            ...Theme.fontStyle.montserrat.semiBold,
            color: theme.primaryText,
            fontWeight: "500",

        },
        eventDescriptioncontainer: {
            padding: 5,
            margin: 5,
            marginTop: 10,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.gray,
            borderRadius: 10,

        },
        eventMenbercontainer: {
            padding: 5,
            marginTop: 10,
            justifyContent: "center",
            backgroundColor: theme.gray,
            borderRadius: 10,

        },
        listContainer: {
            padding: 0,
        },
        itemContainer: {
            backgroundColor: '#f9f9f9',
            paddingVertical: 7,
            paddingHorizontal: 15,
            marginVertical: 8,
            marginHorizontal: 10,
            flex: 1,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
        },
        name: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.primaryText,

        },
        loginText: {
            color: theme.secondaryText,
            fontSize: 16,
            letterSpacing: 1.7,
            ...Theme.fontStyle.montserrat.bold,
            fontWeight: 'bold',

        },
        loginTexts: {
            color: theme.secondaryText,
            ...Theme.fontStyle.montserrat.bold,
            fontWeight: 'bold',

        },
        email: {
            fontSize: 16,
            flex: 1,
            color: '#555',
        },
        phone: {
            fontSize: 16,
            color: '#555',
        },
        state: {
            fontSize: 16,
            color: '#777',
        },
        containers: {
            padding: 20,
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
        },
        input: {
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 15,
            paddingLeft: 10,
        },
        buttonContainer: {
            marginTop: 20
        },

    });
};

export default dynamicStyles;
