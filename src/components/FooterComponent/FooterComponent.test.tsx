import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import FooterComponent from "./FooterComponent";

describe("Footer Component", () => {
  test("Renders correctly", () => {
    render(<FooterComponent />);

    const paragraphElements = screen.getAllByRole("paragraph");

    expect(paragraphElements).toHaveLength(2);

    const socialMediaList = screen.getByRole("list");

    expect(socialMediaList).toBeInTheDocument();

    const socialMediaListItems = screen.getAllByRole("listitem");

    expect(socialMediaListItems).toHaveLength(3);
  });
});
