import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
};

const searchTermSlice = createSlice({
  name: "searchTerm",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSearchTerm } = searchTermSlice.actions;
export default searchTermSlice.reducer;
