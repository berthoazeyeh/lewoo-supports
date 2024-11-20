import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const currentStateValueUp = createSelector(
  (state) => state.atend,
  (atend) => atend.attendencesSyncingUp,
);
const currentStateValueDown = createSelector(
  (state) => state.atend,
  (atend) => atend.attendencesSyncingDown,
);

const currentMessage = createSelector(
  (state) => state.atend,
  (atend) => atend.attendencesbannerMessage,
);
const currentSyncingVal = createSelector(
  (state) => state.atend,
  (atend) => atend.syncingAttendences,
);
const currentIsSyncing = createSelector(
  (state) => state.atend,
  (atend) => atend.isSyncing,
);



export const useSynAttendencesStateUp = () => useSelector(currentStateValueUp);
export const useSynAttendencesStateDown = () => useSelector(currentStateValueDown);
export const useAttendencesBannerMessage = () => useSelector(currentMessage);
export const useSyncingAttendences = () => useSelector(currentSyncingVal);
export const useIsAllReadySyncing = () => useSelector(currentIsSyncing);

