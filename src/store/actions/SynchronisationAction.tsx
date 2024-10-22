import { createAction } from '@reduxjs/toolkit';

export const SynchronisationAction = {
  UPDATE_STATUS_UP: 'UPDATE_STATUS_UP',
  UPDATE_STATUS_DOWN: 'UPDATE_STATUS_DOWN',
  UPDATE_DATE: 'UPDATE_DATE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  UPDATE_SYNCING: 'UPDATE_SYNCING',
}

export const updateSynchronisationUPStateStored = createAction<any>(SynchronisationAction.UPDATE_STATUS_UP);
export const updateSynchronisationDOWNStateStored = createAction<any>(SynchronisationAction.UPDATE_STATUS_DOWN);
export const updateSynchronisationDateStored = createAction<any>(SynchronisationAction.UPDATE_DATE);
export const updateBannerMessage = createAction<any>(SynchronisationAction.UPDATE_MESSAGE);
export const updateSyncing = createAction<any>(SynchronisationAction.UPDATE_SYNCING);
