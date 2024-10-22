// actions/TranslationActionTypes.ts
import { createAction } from '@reduxjs/toolkit';

export const ThemeActionTypes = {
  CHANGE_THEME: 'CHANGE_THEME',
  SET_SYSTEM_THEME: 'SET_SYSTEM_THEME',
}

export const changeTheme = createAction<string>(ThemeActionTypes.CHANGE_THEME);
