/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { AppState, SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import { useSelector } from 'react-redux';
import { isDarkMode, selectLanguageValue, useTheme } from 'store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FlashMessage from 'react-native-flash-message';
import { I18n } from 'i18n';
import { SWRConfig } from 'swr';
import Geolocation from '@react-native-community/geolocation'

// @ts-ignore
import { AppStack } from '@navigation';
import { InitialStack } from 'navigation/stack/InitialStack';

navigator.geolocation = require('@react-native-community/geolocation')

const App = () => {

  const language = useSelector(selectLanguageValue);
  const themeColors = useTheme();
  I18n.locale = language;
  const scheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Définir le thème pour PaperProvider
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...themeColors
    },
  };
  return (<GestureHandlerRootView style={{ flex: 1 }}>
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer >
          <SWRConfig
            value={{
              provider: () => new Map(),
              isVisible: () => { return true },
              initFocus(callback) {
                let appState = AppState.currentState

                const onAppStateChange = (nextAppState: any) => {
                  /* Si l'application revient du mode arrière-plan ou d'inactif au mode actif */
                  if (appState.match(/inactive|background/) && nextAppState === 'active') {
                    callback()
                  }
                  appState = nextAppState
                }

                // Ecoute des événements de changement d'état de l'application
                const subscription = AppState.addEventListener('change', onAppStateChange)

                return () => {
                  subscription.remove()
                }
              }
            }}
          >
            <StatusBar
              backgroundColor={useTheme().statusbar}
              barStyle={!isDarkMode() ? 'dark-content' : 'light-content'}
            />
            <InitialStack />
            <FlashMessage position="center" />

          </SWRConfig>
        </NavigationContainer >
      </SafeAreaView>
    </PaperProvider>
  </GestureHandlerRootView>);
};











export default App;
