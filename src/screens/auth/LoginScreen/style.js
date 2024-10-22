import { StyleSheet } from 'react-native';
import { BLACK, PRIMARY } from 'utils/constants/colors';
import Theme from "theme"

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container1: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.primaryBackground,
        },
        logo: {
            resizeMode: "cover",
            position: "relative",
            width: "100%",
            height: "100%",
            flex: 1,
            backgroundColor: "#F5F5F5",

        },
        loader: {
            marginVertical: 20,
        },
        text: {
            color: '#0C0C0C',
            fontSize: 16,
        },
        subText: {
            color: '#3700FF',
            fontSize: 18,
        },
        boxContainer: {
            flex: 1,
            position: "absolute",
            alignItems: "center",
            backgroundColor: theme.primaryBackground,
            borderRadius: 15,
            width: '80%',
            paddingHorizontal: 20,
            paddingVertical: 30,
            paddingTop: 15,
            gap: 20,
            borderColor: theme.primary,
            borderWidth: 1
        },
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: 'center',
            backgroundColor: theme.primaryBackground
        },
        scrollView: {
            flex: 1,
        },
        languageContainer: {
            width: "100%",
            backgroundColor: "#EBF5EE",
            justifyContent: "space-around",
            alignContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            borderRadius: 30,
            flexDirection: "row",
            // paddingVertical: 5
        },

        fieldText: {
            paddingVertical: 3,
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primaryText,
        },
        viewInputContent: {
            borderWidth: 1,
            borderColor: "gray",
            alignSelf: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            paddingHorizontal: 15,
        },
        inputContainer: {
            backgroundColor: theme.primaryBackground,
            color: theme.primaryText,
            flex: 1,
            padding: 15,
            borderRadius: 5,
            letterSpacing: 1,
            color: theme.primaryText,
            ...Theme.fontStyle.montserrat.semiBold,
        },
        textdanger1: {
            margin: 2,
            color: 'red',
            ...Theme.fontStyle.montserrat.italic,
            fontSize: 10
        },
        textlangauge: {
            margin: 2,
            color: theme.primaryText,
            ...Theme.fontStyle.montserrat.italic,
            fontSize: 12
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
        },
        buttonLabel: {
            color: theme.secondaryText,
            fontSize: 20,
            ...Theme.fontStyle.montserrat.semiBold,
        },
        loginText: {
            color: theme.secondaryText,
            fontSize: 16,
            letterSpacing: 1.7,
            ...Theme.fontStyle.montserrat.bold,

        },
    });
};

export default dynamicStyles;
