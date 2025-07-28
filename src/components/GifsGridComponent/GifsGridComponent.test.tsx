import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import GifsGridComponent from "./GifsGridComponent";

//Redux - Services
import { useGetGifBySearchQuery } from "@/redux/services/giphyApi";

// Redux - Slice
import favoritesReducer from "@/redux/slices/favoritesSlice";
import myGifosReducer from "@/redux/slices/myGifosSlice";

//Mock Data
const mockGifsData = [
  {
    id: "1",
    title: "Test GIF",
    username: "tester",
    alt_text: "GIF",
    images: {
      downsized_medium: {
        url: "https://media.giphy.com/media/abc/giphy.gif",
      },
      original: {
        url: "https://media.giphy.com/media/abc/giphy.gif",
      },
    },
  },
];

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

describe("Gifs Grid Component", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders correctly", () => {
    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: {
        data: mockGifsData,
        pagination: {
          total_count: 30,
        },
      },
    });

    renderWithProvider(<GifsGridComponent searchTerm="cats" mode="search" />);

    const listElement = screen.getByRole("list", {
      name: "gif list",
    });

    expect(listElement).toBeInTheDocument();
  });

  test("Should render gif cards", () => {
    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: {
        data: mockGifsData,
        pagination: {
          total_count: 30,
        },
      },
    });

    renderWithProvider(<GifsGridComponent searchTerm="cats" mode="search" />);

    const gifCards = screen.getAllByTestId("gif-card");

    expect(gifCards).toHaveLength(mockGifsData.length);
  });

  test("Should get more gifs when user click on see more button", () => {
    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: {
        data: mockGifsData,
        pagination: {
          total_count: 30,
        },
      },
    });

    renderWithProvider(<GifsGridComponent searchTerm="cats" mode="search" />);

    const seeMoreButton = screen.getByRole("button", { name: "See more" });

    expect(seeMoreButton).toBeInTheDocument();
  });

  test("Should hide see more button when there are no more gifs", () => {
    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: {
        data: mockGifsData,
        pagination: {
          total_count: 1,
        },
      },
    });

    renderWithProvider(<GifsGridComponent searchTerm="cats" mode="search" />);

    const seeMoreButton = screen.queryByRole("button", { name: "See more" });

    expect(seeMoreButton).not.toBeInTheDocument();
  });
});
