// state.js
import { atom } from 'recoil';

export const userTokenState = atom({
  key: 'userTokenState',
  default: null,
});
export const userRole = atom({
  key: 'userRole',
  default: null,
});

export const loadingState = atom({
  key: 'loadingState',
  default: false,
});

export const errorState = atom({
  key: 'errorState',
  default: '',
});

export const cartState = atom({
  key: 'cartState', // unique ID for the atom
  default: [], // initial state: empty cart
});

export const customerState = atom({
  key: "customerState", 
  default: null, // Initially no customer is selected
});

