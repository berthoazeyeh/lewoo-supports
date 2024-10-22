import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { AddTicketScreen, EventDetailsScreen, HomeScreen } from 'screens';
import HomeBottomTabNavigation from './bottom';

export type AppStackList = {
    HomeBottomTabNavigation: undefined;
    AddTicketScreen: undefined;
    EventDetailsScreen: undefined;
    LoginScreen: undefined;

};
const AppStack = createStackNavigator<AppStackList>()

const AppStacks = () => {
    return (
        <AppStack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
            }}
            initialRouteName="HomeBottomTabNavigation">

            <AppStack.Screen
                options={{ headerShown: false }}
                name="HomeBottomTabNavigation"
                component={HomeBottomTabNavigation}
            />
            <AppStack.Screen
                options={{ headerShown: false }}
                name="AddTicketScreen"
                component={AddTicketScreen}
            />
            <AppStack.Screen
                options={{ headerShown: false }}
                name="EventDetailsScreen"
                component={EventDetailsScreen}
            />
        </AppStack.Navigator>
    )
}



export default AppStacks