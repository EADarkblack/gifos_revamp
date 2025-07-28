import { createSlice } from "@reduxjs/toolkit";

//Types
import { GifData } from "@/components/FullScreenGifViewComponent/FullScreenGifViewComponent.types";

const initialState: { favorites: GifData[] } = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const gifData = action.payload;

      const isFavorite = state.favorites.some(
        (favorite: { id: string }) => favorite.id === gifData.id
      );

      if (isFavorite) {
        state.favorites = state.favorites.filter(
          (favorite: { id: string }) => favorite.id !== gifData.id
        );
      } else {
        state.favorites = [...state.favorites, gifData];
      }

      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
  },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
