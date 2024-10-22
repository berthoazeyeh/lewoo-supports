import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { SynchronisationAction } from 'store/actions';

interface SynchroisationState {
  isSynchronisedUp: boolean;
  isSynchronisedDown: boolean;
  isSyncing: boolean;
  lastSuccessSynchronisedTime: string | null
  bannerMessage: string
}

const initialState: SynchroisationState = {
  isSynchronisedUp: false,
  isSynchronisedDown: false,
  lastSuccessSynchronisedTime: (new Date()).toString(),
  bannerMessage: "Synchronisation des données en cours",
  isSyncing: false,
};


const SynchroisationReducer = createReducer(initialState, builder => {
  builder
    .addCase(SynchronisationAction.UPDATE_STATUS_UP, (state, action: PayloadAction<any>) => {
      state.isSynchronisedUp = action.payload;
    })
    .addCase(SynchronisationAction.UPDATE_STATUS_DOWN, (state, action: PayloadAction<any>) => {
      state.isSynchronisedDown = action.payload;
    })
    .addCase(SynchronisationAction.UPDATE_DATE, (state, action: PayloadAction<any>) => {
      state.lastSuccessSynchronisedTime = action.payload;
    })
    .addCase(SynchronisationAction.UPDATE_MESSAGE, (state, action: PayloadAction<any>) => {
      state.bannerMessage = action.payload;
    })
    .addCase(SynchronisationAction.UPDATE_SYNCING, (state, action: PayloadAction<any>) => {
      state.isSyncing = action.payload;
    })
    .addCase(PURGE, () => {
      return {
        ...initialState,
      };
    });
});

export {
  SynchroisationReducer
}