import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const selectThemeValue = createSelector(
  (state) => state.theme,
  (theme) => theme.theme,
);
const selectModeValue = createSelector(
  (state) => state.theme,
  (theme) => theme.isDarkMode,
);

export const useTheme = () => useSelector(selectThemeValue);
export const isDarkMode = () => useSelector(selectModeValue);
