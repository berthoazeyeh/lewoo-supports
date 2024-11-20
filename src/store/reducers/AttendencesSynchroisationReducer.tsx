import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { AttendencesSynchronisationAction } from 'store/actions';

interface AttendencesState {
  attendencesSyncingUp: boolean;
  attendencesSyncingDown: boolean;
  syncingAttendences: boolean;
  isSyncing: boolean;
  attendencesbannerMessage: string
}

const initialState: AttendencesState = {
  attendencesSyncingUp: false,
  attendencesSyncingDown: false,
  isSyncing: false,
  attendencesbannerMessage: "Synchronisation des données en cours",
  syncingAttendences: false,
};


const AttendencesSynchroisationReducer = createReducer(initialState, builder => {
  builder
    .addCase(AttendencesSynchronisationAction.UPDATE_STATUS_UP, (state, action: PayloadAction<any>) => {
      state.attendencesSyncingUp = action.payload;
    })
    .addCase(AttendencesSynchronisationAction.UPDATE_STATUS_DOWN, (state, action: PayloadAction<any>) => {
      state.attendencesSyncingDown = action.payload;
    })

    .addCase(AttendencesSynchronisationAction.UPDATE_MESSAGE, (state, action: PayloadAction<any>) => {
      state.attendencesbannerMessage = action.payload;
    })
    .addCase(AttendencesSynchronisationAction.UPDATE_SYNCING, (state, action: PayloadAction<any>) => {
      state.syncingAttendences = action.payload;
    })
    .addCase(AttendencesSynchronisationAction.UPDATE_IS_SYNCING, (state, action: PayloadAction<any>) => {
      state.isSyncing = action.payload;
    })
    .addCase(PURGE, () => {
      return {
        ...initialState,
      };
    });
});

export {
  AttendencesSynchroisationReducer
}