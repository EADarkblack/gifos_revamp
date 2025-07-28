import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import SearchResultComponent from "./SearchResultComponent";

// Redux - Slice
import favoritesReducer from "@/redux/slices/favoritesSlice";
import myGifosReducer from "@/redux/slices/myGifosSlice";

//Redux - Services
import { useGetGifBySearchQuery } from "@/redux/services/giphyApi";

//Mock API
jest.mock("../../redux/services/giphyApi", () => ({
  __esModule: true,
  useGetGifBySearchQuery: jest.fn(),
  giphyApi: {
    reducerPath: "giphyApi",
    reducer: () => ({}),
    middleware:
      () =>
      (next: (action: { type: string; payload: string }) => void) =>
      (action: { type: string; payload: string }) =>
        next(action),
  },
}));

//Mock Store
const mockStore = configureStore({
  reducer: {
    favorites: favoritesReducer,
    myGifos: myGifosReducer,
    giphyApi: () => ({}),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(() => (next) => (action) => next(action)),
});

const renderWithProvider = (ui: React.ReactElement) =>
  render(<Provider store={mockStore}>{ui}</Provider>);

describe("Search Result Component", () => {
  test("Renders correctly", () => {
    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: {
        data: [],
        pagination: {
          total_count: 0,
        },
      },
    });

    renderWithProvider(<SearchResultComponent dataLength={0} title="cats" />);

    const headingElement = screen.getByRole("heading", {
      level: 1,
    });

    expect(headingElement).toBeInTheDocument();
  });

  test("Should render no results", () => {
    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: {
        data: [],
        pagination: {
          total_count: 0,
        },
      },
    });

    renderWithProvider(<SearchResultComponent dataLength={0} title="cats" />);

    const headingElement = screen.getByRole("heading", {
      level: 2,
    });

    expect(headingElement).toBeInTheDocument();
  });

  test("Should hide no results when data is available", () => {
    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: {
        data: [],
        pagination: {
          total_count: 1,
        },
      },
    });

    renderWithProvider(<SearchResultComponent dataLength={1} title="cats" />);

    const headingElement = screen.queryByRole("heading", {
      level: 2,
    });

    expect(headingElement).not.toBeInTheDocument();
  });
});
