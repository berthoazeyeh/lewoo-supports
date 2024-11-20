import { StyleSheet } from 'react-native';
import { BLACK, PRIMARY } from 'utils/constants/colors';
import Theme from "theme"

const dynamicStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
            paddingVertical: 10,
            paddingHorizontal: 15,
        },


    });
};

export default dynamicStyles;
