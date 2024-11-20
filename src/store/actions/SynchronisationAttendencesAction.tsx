import { createAction } from '@reduxjs/toolkit';

export const AttendencesSynchronisationAction = {
  UPDATE_STATUS_UP: 'UPDATE_STATUS_UP',
  UPDATE_STATUS_DOWN: 'UPDATE_STATUS_DOWN',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  UPDATE_SYNCING: 'UPDATE_SYNCING',
  UPDATE_IS_SYNCING: 'UPDATE_IS_SYNCING',
}

export const updateSynAttendencesUP = createAction<any>(AttendencesSynchronisationAction.UPDATE_STATUS_UP);
export const updateIsSyncing = createAction<any>(AttendencesSynchronisationAction.UPDATE_IS_SYNCING);
export const updateSynAttendencesDOWN = createAction<any>(AttendencesSynchronisationAction.UPDATE_STATUS_DOWN);
export const updateAttendencesBannerMessage = createAction<any>(AttendencesSynchronisationAction.UPDATE_MESSAGE);
export const updateSyncingAttendences = createAction<any>(AttendencesSynchronisationAction.UPDATE_SYNCING);
