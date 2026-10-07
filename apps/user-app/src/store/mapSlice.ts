import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface MapState {
  origin: { lat: number; lon: number } | null;
  destination: { lat: number; lon: number } | null;
}

const initialState: MapState = {
  origin: null,
  destination: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setOrigin(state, action: PayloadAction<{ lat: number; lon: number }>) {
      state.origin = action.payload;
    },
    setDestination(state, action: PayloadAction<{ lat: number; lon: number }>) {
      state.destination = action.payload;
    },
  },
});

export const { setOrigin, setDestination } = mapSlice.actions;
export default mapSlice.reducer;
