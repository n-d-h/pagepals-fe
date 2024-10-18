import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    REVENUE_SHARE: 10,
    TOKEN_PRICE: 1,
    DOLLAR_EXCHANGE_RATE: 24000,
  },
  reducers: {
    setRevenueShare: (state, action) => {
      state.REVENUE_SHARE = action.payload;
    },

    setTokenPrice: (state, action) => {
      state.TOKEN_PRICE = action.payload;
    },

    setDollarExchangeRate: (state, action) => {
      state.DOLLAR_EXCHANGE_RATE = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRevenueShare, setTokenPrice, setDollarExchangeRate } = settingsSlice.actions;
export const selectRevenueShare = (state) => state.settings.REVENUE_SHARE;
export const selectTokenPrice = (state) => state.settings.TOKEN_PRICE;
export const selectDollarExchangeRate = (state) => state.settings.DOLLAR_EXCHANGE_RATE;

export const settingReducer = settingsSlice.reducer;
