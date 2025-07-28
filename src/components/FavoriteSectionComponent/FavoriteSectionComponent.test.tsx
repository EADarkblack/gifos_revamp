import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

import FavoriteSectionComponent from "./FavoriteSectionComponent";

describe("Favorites Section Component", () => {
  test("Renders correctly", () => {
    render(
      <Provider store={store}>
        <FavoriteSectionComponent />
      </Provider>
    );

    const imageItems = screen.getAllByRole("img");

    expect(imageItems).toHaveLength(2);

    const headingElement = screen.getByRole("heading");

    expect(headingElement).toBeInTheDocument();

    const parragraphElement = screen.getByRole("paragraph");

    expect(parragraphElement).toBeInTheDocument();
  });
});
