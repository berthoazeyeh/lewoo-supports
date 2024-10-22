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
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
        etiquettesItem: {
            borderEndEndRadius: 20,
            borderTopEndRadius: 20,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundColor: theme.primary,
            width: 22,
            height: 22,
            position: "absolute",
            alignContent: "center",
            alignItems: "center"
        },
        itemContainer: {
            zIndex: 1,
            marginBottom: 5,
            margin: 10,
            elevation: 1,
            backgroundColor: theme.gray3,
            borderEndEndRadius: 10,
            borderTopEndRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
        },
        logo: {
            position: "relative",
            flex: 1,
            width: "100%"

        },
        emptyDataText: {
            fontSize: 14,
            paddingVertical: 3,
            ...Theme.fontStyle.montserrat.semiBold,
            color: theme.primaryText,
        },
        emptyData: {
            padding: 20,
            alignItems: "center"
        },
        title: {
            fontSize: 26,
            ...Theme.fontStyle.montserrat.bold,
            color: theme.secondaryText,
        },
        title1: {
            overflow: "hidden",
            fontSize: 20,
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primaryText,
        },
        subTitle: {
            fontSize: 16,
            ...Theme.fontStyle.montserrat.semiBold,
            color: theme.secondaryText,
        },
        name: {
            fontSize: 14,
            color: theme.primaryText,
            ...Theme.fontStyle.montserrat.regular,
        },
        stage: {
            fontSize: 20,
            color: theme.primary,
            ...Theme.fontStyle.montserrat.regular,

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
            padding: 5,
            borderRadius: 10,
            backgroundColor: theme.gray,
        },
        titles: {
            fontSize: 16,
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primaryText,
            fontWeight: "bold",

        },
        titleHeader: {
            fontSize: 16,
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primary,
            fontWeight: "bold",

        },
        date: {
            fontSize: 14,
            color: '#666',
        },
        liveTrackButtom: {
            marginTop: 7,
            backgroundColor: theme.primary,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 0
        },
        liveTrackButtomText: {
            color: theme.secondaryText,
            ...Theme.fontStyle.montserrat.semiBold,
        },
        TitleContainer: {
            marginTop: 10,
            marginLeft: 20,
            marginRight: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 5
        },
        etiquettesItemText: {
            ...Theme.fontStyle.montserrat.semiBold,
            color: theme.secondaryText,
        },
        fieldText: {
            fontSize: 16,
            paddingVertical: 3,
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primaryText,
        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.primary,
        },
    });
};

export default dynamicStyles;

