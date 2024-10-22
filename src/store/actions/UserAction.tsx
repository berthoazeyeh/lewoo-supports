import { createAction } from '@reduxjs/toolkit';
import { Parent } from 'models';

export const UserActionTypes = {
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_USER: 'CLEAR_USER',
}

export const updateUserStored = createAction<Parent>(UserActionTypes.UPDATE_USER);
export const clearUserStored = createAction<any>(UserActionTypes.UPDATE_USER);
