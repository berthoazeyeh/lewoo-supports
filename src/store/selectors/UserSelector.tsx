import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const currentUserValue = createSelector(
  (state) => state.user,
  (user) => user.user,
);
export const useCurrentUser = () => useSelector(currentUserValue);
