import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import { Parent } from 'models';
import { UserActionTypes } from 'store/actions/UserAction';

interface UserState {
  user: Parent | null;
}

const initialState: UserState = {
  user: null,
};


const UserReducer = createReducer(initialState, builder => {
  builder
    .addCase(UserActionTypes.UPDATE_USER, (state, action: PayloadAction<Parent>) => {
      state.user = action.payload;
    })
    .addCase(UserActionTypes.CLEAR_USER, (state, action: PayloadAction<any>) => {
      state.user = null;
    })
    .addCase(PURGE, () => {
      return {
        ...initialState,
      };
    });
});

export {
  UserReducer
}