import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showFullscreen: false,
  gifData: {},
};

const fullscreenModalSlice = createSlice({
  name: "fullscreenModal",
  initialState,
  reducers: {
    setShowFullscreen: (state, action) => {
      state.showFullscreen = action.payload;
    },
    setGifData: (state, action) => {
      state.gifData = action.payload;
    },
  },
});

export default fullscreenModalSlice.reducer;

export const { setShowFullscreen, setGifData } = fullscreenModalSlice.actions;
