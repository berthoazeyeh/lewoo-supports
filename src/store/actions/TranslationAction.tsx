// actions/TranslationActionTypes.ts
import { createAction } from '@reduxjs/toolkit';
import { GeoLocationType } from 'store/reducers/TimingReducer';

export const TranslationActionTypes = {
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
  CHANGE_TIMING: 'CHANGE_TIMING',
  CHANGE_POSITION: 'CHANGE_POSITION',
}

export const changeLanguage = createAction<string>(TranslationActionTypes.CHANGE_LANGUAGE);
export const updateStoredtTiming = createAction<number>(TranslationActionTypes.CHANGE_TIMING);
export const updateStoredtPosition = createAction<GeoLocationType>(TranslationActionTypes.CHANGE_POSITION);
