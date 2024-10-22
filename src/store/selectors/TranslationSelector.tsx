import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// Sélecteur pour obtenir la langue de la traduction
export const selectLanguageValue = createSelector(
  (state) => state.translation,
  (translation) => translation.language,
);

