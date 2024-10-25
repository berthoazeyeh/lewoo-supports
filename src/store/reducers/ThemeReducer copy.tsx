import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { NativeModules, Platform, useColorScheme } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import { DarkTheme } from '@react-navigation/native';
import Theme from "theme"
import { ThemeActionTypes } from 'store/actions/ThemeAction';


const lightTheme = {
  ...DefaultTheme.colors,
  ...Theme.colors.light,
  font: Theme.fontStyle

};

const darkTheme = {
  ...DarkTheme.colors,
  ...Theme.colors.dark,
  font: Theme.fontStyle

};
const isDarkMode = false
interface TranslationState {
  theme: any;
  isDarkMode: Boolean
}


const initialState: TranslationState = {
  theme: isDarkMode ? darkTheme : lightTheme,
  isDarkMode: isDarkMode
  // Langue par défaut
};


const ThemeReducer = createReducer(initialState, builder => {
  builder
    .addCase(ThemeActionTypes.CHANGE_THEME, (state, action: PayloadAction<string>) => {
      state.isDarkMode = !state.isDarkMode;
      state.theme = state.isDarkMode ? darkTheme : lightTheme;

    })
    .addCase(ThemeActionTypes.SET_SYSTEM_THEME, (state, action: PayloadAction<string>) => {
      state.isDarkMode = action.payload === 'dark';
      state.theme = state.isDarkMode ? darkTheme : lightTheme;
    })
    .addCase(PURGE, () => {
      return {
        ...initialState,
      };
    });
});

export {
  ThemeReducer
}