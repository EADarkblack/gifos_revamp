import { createSlice } from "@reduxjs/toolkit";

//Types
import { GifData } from "@/components/FullScreenGifViewComponent/FullScreenGifViewComponent.types";

const initialState: { myGifos: GifData[] } = {
  myGifos: [],
};

const myGifosSlice = createSlice({
  name: "myGifos",
  initialState,
  reducers: {
    deleteGifo: (state, action) => {
      const gifData = action.payload;

      const isOwnGifo = state.myGifos.some(
        (gifo: { id: string }) => gifo.id === gifData.id
      );

      if (isOwnGifo) {
        state.myGifos = state.myGifos.filter(
          (gifo: { id: string }) => gifo.id !== gifData.id
        );
      } else {
        state.myGifos = [...state.myGifos, gifData];
      }

      localStorage.setItem("my_gifos", JSON.stringify(state.myGifos));
    },
    setMyGifos: (state, action) => {
      state.myGifos = action.payload;
    },
  },
});

export const { deleteGifo, setMyGifos } = myGifosSlice.actions;
export default myGifosSlice.reducer;
