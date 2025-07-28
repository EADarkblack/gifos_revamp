import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import TrendSectionComponent from "./TrendSectionComponent";

//Redux - Services
import { useGetTrendGifsQuery } from "@/redux/services/giphyApi";

jest.mock("../../redux/services/giphyApi.ts", () => ({
  useGetTrendGifsQuery: jest.fn(),
}));

const MockCarousel = () => (
  <div data-testid="mock-carousel">Mocked Carousel</div>
);

jest.mock("../EmblaCarousel/EmblaCarousel.tsx", () => () => MockCarousel);

const makeStore = () =>
  configureStore({
    reducer: {
      searchTerm: () => ({}),
      resultBySearch: () => ({}),
      favorites: () => ({
        favorites: [],
      }),
    },
  });

describe("Trend Section Component", () => {
  beforeEach(() => {
    (useGetTrendGifsQuery as jest.Mock).mockReturnValue({
      data: {
        data: [
          {
            id: "1",
            title: "Funny Cat",
            username: "funny cat",
            alt_text: "GIF",
            images: {
              downsized_medium: {
                url: "https://media.giphy.com/media/funnycat/giphy.gif",
              },
              original: {
                url: "https://media.giphy.com/media/funnycat/giphy.gif",
              },
            },
          },
        ],
      },
      isLoading: false,
    });
  });

  test("Renders correctly", () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <TrendSectionComponent />
      </Provider>
    );

    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();

    const paragraphElement = screen.getByText(
      "Check out the latest GIFOS from our community."
    );
    expect(paragraphElement).toBeInTheDocument();
  });
});
