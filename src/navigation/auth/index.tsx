import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { LoginScreen, SignInScreen, WelcomeScreen } from 'screens';

export type AuthStackList = {
    Welcome: undefined;
    LoginOtp: undefined;
    SignInScreen: undefined;
    LoginScreen: undefined;

};
const AuthStack = createStackNavigator<AuthStackList>()

const AuthStacks = () => {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
            }}
            initialRouteName="Welcome">
            <AuthStack.Screen
                options={{ headerShown: false }}
                name="Welcome"
                component={WelcomeScreen}
            />
            <AuthStack.Screen
                options={{ headerShown: false }}
                name="LoginScreen"
                component={LoginScreen}
            />
            <AuthStack.Screen
                options={{ headerShown: false }}
                name="SignInScreen"
                component={SignInScreen}
            />

        </AuthStack.Navigator>
    )
}



export default AuthStacks
