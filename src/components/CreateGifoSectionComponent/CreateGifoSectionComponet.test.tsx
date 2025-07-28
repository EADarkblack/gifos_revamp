import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

import CreateGifoSectionComponet from "./CreateGifoSectionComponet";

describe("Create Gifo Section Component", () => {
  test("Renders correctly", () => {
    render(
      <Provider store={store}>
        <CreateGifoSectionComponet />
      </Provider>
    );

    const headingElement = screen.getByRole("heading");

    expect(headingElement).toBeInTheDocument();

    const paragraphElements = screen.getAllByRole("paragraph");

    expect(paragraphElements).toHaveLength(2);

    const backgroundImageElements = screen.getAllByRole("img");

    expect(backgroundImageElements).toHaveLength(4);

    const listElement = screen.getByRole("list");

    expect(listElement).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");

    expect(listItems).toHaveLength(3);

    const buttonElement = screen.getByRole("button");

    expect(buttonElement).toBeInTheDocument();
  });
});
