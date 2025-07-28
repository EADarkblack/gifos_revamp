import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

//Reducers
import searchTermReducer from "./slices/searchTermSlice";
import searchResultGifReducer from "./slices/searchResultGifSlice";
import fullscreenModalReducer from "./slices/fullscreenModalSlice";
import favoritesReducer from "./slices/favoritesSlice";
import myGifosReducer from "./slices/myGifosSlice";

//Services
import { giphyApi } from "./services/giphyApi";

const rootReducer = combineReducers({
  searchTerm: searchTermReducer,
  resultBySearch: searchResultGifReducer,
  fullscreenModal: fullscreenModalReducer,
  favorites: favoritesReducer,
  myGifos: myGifosReducer,
  [giphyApi.reducerPath]: giphyApi.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["favorites", "myGifos"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(giphyApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
