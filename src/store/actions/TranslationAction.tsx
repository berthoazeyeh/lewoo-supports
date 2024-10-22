// actions/TranslationActionTypes.ts
import { createAction } from '@reduxjs/toolkit';

export const TranslationActionTypes = {
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
}

export const changeLanguage = createAction<string>(TranslationActionTypes.CHANGE_LANGUAGE);
