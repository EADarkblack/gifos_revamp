import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";

import SearchSectionComponent from "./SearchSectionComponent";

import {
  useGetGifBySearchQuery,
  useGetTagsBySearchQuery,
  useGetTrendTagsQuery,
} from "@/redux/services/giphyApi";

// Mocks API hooks
jest.mock("../../redux/services/giphyApi.ts", () => ({
  useGetTrendTagsQuery: jest.fn(),
  useGetTagsBySearchQuery: jest.fn(),
  useGetGifBySearchQuery: jest.fn(),
}));

// Mock reducers
const mockSearchTermReducer = () => () => ({
  searchTerm: "",
});

const mockSearchResultGifReducer = () => () => ({
  searchResultGif: [],
});

const makeStore = () =>
  configureStore({
    reducer: {
      searchTerm: mockSearchTermReducer(),
      resultBySearch: mockSearchResultGifReducer(),
    },
  });

describe("Search Section Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useGetTrendTagsQuery as jest.Mock).mockReturnValue({
      data: ["funny", "cat", "dog", "wow", "fail"],
    });

    (useGetTagsBySearchQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
    });

    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
    });
  });

  test("Renders correctly", () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <SearchSectionComponent />
      </Provider>
    );

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(5);
  });

  test("Should search when a tag is clicked", async () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <SearchSectionComponent />
      </Provider>
    );

    const tagItems = screen.getAllByRole("listitem");
    const firstTag = tagItems[0];

    await userEvent.click(firstTag);

    expect(useGetGifBySearchQuery).toHaveBeenCalledWith("funny", {
      skip: false,
    });
  });
});
