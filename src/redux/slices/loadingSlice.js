import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
	name: "loading",
	initialState: {
		active: false,
		backdropLoading: {},
	},
	reducers: {
		setActive: (state, action) => {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes
			state.active = action.payload;
		},

		setBackdropLoading: (state, action) => {
			state.backdropLoading = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setActive, setBackdropLoading } = loadingSlice.actions;
export const isActive = (state) => state.loading.active;
export const backdropLoading = (state) => state.loading.backdropLoading;

export const loadingReducer = loadingSlice.reducer;
