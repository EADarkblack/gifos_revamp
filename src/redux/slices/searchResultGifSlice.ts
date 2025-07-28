import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchResultGif: [],
};

const searchResultGifSlice = createSlice({
  name: "searchResultGif",
  initialState,
  reducers: {
    setSearchResultGif: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSearchResultGif } = searchResultGifSlice.actions;
export default searchResultGifSlice.reducer;
