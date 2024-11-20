import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { TranslationActionTypes } from '@store/actions';
import { languages } from 'utils';

export interface TimingState {
  time: number;
  position: GeoLocationType | null
}

export type GeoLocationType = {
  latitude: any;
  longitude: any;
};
const initialState: TimingState = {
  time: 2, // Langue par défaut
  position: null
};
const TimingReducer = createReducer(initialState, builder => {
  builder
    .addCase(TranslationActionTypes.CHANGE_TIMING, (state, action: PayloadAction<number>) => {
      state.time = action.payload;
    })
    .addCase(TranslationActionTypes.CHANGE_POSITION, (state, action: PayloadAction<GeoLocationType>) => {
      state.position = action.payload;
    })
    .addCase(PURGE, () => {
      return {
        ...initialState,
      };
    });
});

export {
  TimingReducer
}