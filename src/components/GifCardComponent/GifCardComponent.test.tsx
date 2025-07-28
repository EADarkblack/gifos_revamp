import { ReactElement } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import GifCardComponent from "./GifCardComponent";

//Redux - Slice
import fullscreenModalReducer from "@/redux/slices/fullscreenModalSlice";
import favoritesReducer from "@/redux/slices/favoritesSlice";

const mockedGifData = {
  id: "1",
  alt_text: "Test image",
  username: "Test user",
  title: "Test",
  images: {
    downsized_medium: {
      url: "https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy.gif",
    },
    original: {
      url: "https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy.gif",
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
        showFullscreen: false,
        gifData: {},
      },
      favorites: {
        favorites: [],
      },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
};

beforeEach(() => {
  jest
    .spyOn(window.localStorage.__proto__, "setItem")
    .mockImplementation(() => {});
  jest
    .spyOn(window.localStorage.__proto__, "removeItem")
    .mockImplementation(() => {});
  window.open = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Gif Card Component", () => {
  test("renders correctly", () => {
    renderWithProviders(<GifCardComponent gifData={mockedGifData} />);

    const image = screen.getByAltText("Test image");
    expect(image).toBeInTheDocument();

    const heading = screen.getByText("Test");
    const paragraph = screen.getByText("Test user");

    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  test("should save to localstorage when click on add to favorites", async () => {
    renderWithProviders(<GifCardComponent gifData={mockedGifData} />);

    const favBtn = screen.getByRole("button", {
      name: "Add to favorites",
    });

    await userEvent.click(favBtn);

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  test("should remove from localstorage when click again on add to favorites button", async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

    renderWithProviders(<GifCardComponent gifData={mockedGifData} />);

    const favBtn = screen.getByRole("button", {
      name: "Add to favorites",
    });

    await userEvent.click(favBtn);
    await userEvent.click(favBtn);

    expect(setItemSpy).toHaveBeenCalledTimes(2);
  });

  test("should download gif when click on download button", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () =>
          Promise.resolve(new Blob(["gif data"], { type: "image/gif" })),
      })
    ) as jest.Mock;

    global.URL.createObjectURL = jest.fn(
      () => "blob:http://localhost/fake-blob-url"
    );

    const anchor = document.createElement("a");
    const clickMock = jest.fn();
    anchor.click = clickMock;

    const originalCreateElement = document.createElement.bind(document);

    jest
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        if (tagName === "a") return anchor;
        return originalCreateElement(tagName);
      });

    renderWithProviders(<GifCardComponent gifData={mockedGifData} />);

    const downloadBtn = screen.getByRole("button", {
      name: "Download",
    });

    await userEvent.click(downloadBtn);

    expect(clickMock).toHaveBeenCalled();
  });

  test("should expand gif when click on fullscreen button (dispatch only)", async () => {
    renderWithProviders(<GifCardComponent gifData={mockedGifData} />);

    const expandBtn = screen.getByRole("button", {
      name: "Fullscreen",
    });

    await userEvent.click(expandBtn);

    expect(expandBtn).toBeInTheDocument();
  });
});
