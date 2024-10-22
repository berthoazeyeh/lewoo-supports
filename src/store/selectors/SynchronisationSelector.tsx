import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const currentStateValueUp = createSelector(
  (state) => state.sync,
  (sync) => sync.isSynchronisedUp,
);
const currentStateValueDown = createSelector(
  (state) => state.sync,
  (sync) => sync.isSynchronisedDown,
);
const currentDataValue = createSelector(
  (state) => state.sync,
  (sync) => sync.lastSuccessSynchronisedTime,
);
const currentMessage = createSelector(
  (state) => state.sync,
  (sync) => sync.bannerMessage,
);
const currentSyncingVal = createSelector(
  (state) => state.sync,
  (sync) => sync.isSyncing,
);


export const useCurrentSynchronisedStateUp = () => useSelector(currentStateValueUp);
export const useCurrentSynchronisedStateDown = () => useSelector(currentStateValueDown);
export const useCurrentLastSuccessSynchronisedTime = () => useSelector(currentDataValue);
export const useCurrentBannerMessage = () => useSelector(currentMessage);
export const useIsSyncing = () => useSelector(currentSyncingVal);
