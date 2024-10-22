import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import de MaterialCommunityIcons
import { useTheme } from 'store';
import { AttendencesNFC, HomeScreen } from 'screens';

const Tab = createBottomTabNavigator();





const HomeBottomTabNavigation = () => {
    const theme = useTheme()
    return (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            tabBarPosition="bottom"
            screenOptions={{
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: theme.primaryText,
                tabBarGap: 10,
                tabBarIndicatorStyle: {
                    height: 0,
                },
                tabBarAndroidRipple: {
                    color: "#ffffff"
                },
                tabBarStyle: { backgroundColor: theme.primaryBackground, paddingBottom: 5, paddingTop: 5, },
            }}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon({ color, size }) {
                        iconName = 'home';
                        return <MaterialCommunityIcons style={iconStyle(color).icons} name={iconName} size={size} color={color} />;
                    },
                    tabBarLabel() {
                        return null;
                    },

                }}
            />

            <Tab.Screen name="AttendencesNFC" component={AttendencesNFC}
                options={{
                    headerShown: false,
                    tabBarIcon({ color, size }) {
                        iconName = 'barcode-scan';
                        return <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <MaterialCommunityIcons style={iconStyle(color).icons} name={iconName} size={size} color={color} />
                            <Text>Attendences</Text>
                        </View>
                    },
                    tabBarLabel() {
                        return null;
                    },
                }}
            />


        </Tab.Navigator >
    );
};
const iconStyle = (color) => StyleSheet.create({
    icons: {
        color: color,
        backgroundColor: color === "green" ? "#D0EDA4" : null,
        paddingHorizontal: 15,
        paddingVertical: 1,
        borderRadius: 17,
    }
})
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarLabel: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
});

export default HomeBottomTabNavigation;
