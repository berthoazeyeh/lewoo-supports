import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import { DARK_MODE, PRIMARY } from 'utils';
import AuthStacks from 'navigation/auth';
import AppStacks from 'navigation/app';
import { useDispatch } from 'react-redux';
import AttendencesStack from 'navigation/attend';
import { AppStack } from './AppStack';


export type AppStackStackList = {
  ApplicationStacks: undefined;
  AttendencesStack: undefined;

};

const Stack = createStackNavigator<AppStackStackList>();

export function InitialStack() {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch()


  return (
    <Stack.Navigator
      initialRouteName='AttendencesStack'
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: isDarkMode ? DARK_MODE : "white",
        },
        headerTintColor: isDarkMode ? "white" : PRIMARY,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >

      <Stack.Screen

        name="AttendencesStack"

        component={AttendencesStack} />
      <Stack.Screen

        name="ApplicationStacks"

        component={AppStack} />


    </Stack.Navigator>
  );
}
