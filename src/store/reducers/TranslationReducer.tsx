import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { TranslationActionTypes } from '@store/actions';
import { NativeModules, Platform } from 'react-native';
import { languages } from 'utils';

interface TranslationState {
  language: string;
}

const getDeviceLanguage = () => {
  if (Platform.OS === 'ios') {
    return NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]; // Langue iOS
  } else {
    return NativeModules.I18nManager.localeIdentifier; // Langue Android
  }
};
const deviceLanguage = getDeviceLanguage()?.substring(0, 2)
const initialState: TranslationState = {
  language: languages.includes(deviceLanguage) ? deviceLanguage : 'en', // Langue par défaut
};


const TranslationReducer = createReducer(initialState, builder => {
  builder
    .addCase(TranslationActionTypes.CHANGE_LANGUAGE, (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    })
    .addCase(PURGE, () => {
      return {
        ...initialState,
      };
    });
});

export {
  TranslationReducer
}