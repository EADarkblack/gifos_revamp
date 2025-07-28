import { ReactElement } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

//Redux - Slice
import fullscreenModalReducer from "@/redux/slices/fullscreenModalSlice";
import favoritesReducer from "@/redux/slices/favoritesSlice";

import FullScreenGifViewComponent from "./FullScreenGifViewComponent";

const mockGifData = {
  id: "123",
  title: "Test Gif",
  username: "TestUser",
  alt_text: "GIF Alt",
  images: {
    downsized_medium: {
      url: "https://media.giphy.com/media/test-downsized.gif",
    },
    original: {
      url: "https://media.giphy.com/media/test-original.gif",
    },
  },
};

const renderWithProviders = (ui: ReactElement) => {
  const store = configureStore({
    reducer: {
      fullscreenModal: fullscreenModalReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      fullscreenModal: {
        showFullscreen: true,
        gifData: mockGifData,
      },
      favorites: {
        favorites: [],
      },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
};

describe("FullScreenGifView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    renderWithProviders(<FullScreenGifViewComponent />);

    const image = screen.getByAltText("GIF Alt");
    expect(image).toBeInTheDocument();

    const username = screen.getByText("TestUser");
    const title = screen.getByRole("heading", { name: "Test Gif" });
    expect(username).toBeInTheDocument();
    expect(title).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  test("closes on click close button", async () => {
    renderWithProviders(<FullScreenGifViewComponent />);
    const closeButton = screen.getByTitle("close");

    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTitle("close")).not.toBeInTheDocument();
    });
  });

  test("adds to favorites", async () => {
    renderWithProviders(<FullScreenGifViewComponent />);
    const favBtn = screen.getByTitle("Add to favorites");

    await userEvent.click(favBtn);

    const filledHeart = screen.getByRole("img", { hidden: true });
    expect(filledHeart).toBeInTheDocument();
  });

  test("downloads gif", async () => {
    // Mock fetch & blob
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () =>
          Promise.resolve(new Blob(["gif data"], { type: "image/gif" })),
      })
    ) as jest.Mock;

    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(
      () => "blob:http://localhost/fake-blob-url"
    );

    const anchor = document.createElement("a");
    const clickMock = jest.fn();
    anchor.click = clickMock;

    const originalCreateElement = document.createElement;

    jest
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        if (tagName === "a") return anchor;
        return originalCreateElement.call(document, tagName);
      });

    renderWithProviders(<FullScreenGifViewComponent />);

    const downloadBtn = screen.getByTitle("Download");

    await userEvent.click(downloadBtn);

    expect(clickMock).toHaveBeenCalled();
  });
});
