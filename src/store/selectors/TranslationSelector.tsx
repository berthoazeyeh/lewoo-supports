import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { TimingState } from 'store/reducers/TimingReducer';

// Sélecteur pour obtenir la langue de la traduction
export const selectLanguageValue = createSelector(
  (state) => state.translation,
  (translation) => translation.language,
);
const currentTiming = createSelector(
  (state) => state.time,
  (time: TimingState) => time.time,
);
const currentPosition = createSelector(
  (state) => state.time,
  (time: TimingState) => time.position,
);

export const userCurrentTiming = () => useSelector(currentTiming);
export const userCurrentPosition = () => useSelector(currentPosition);
