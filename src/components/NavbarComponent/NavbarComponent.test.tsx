import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { ThemeProvider } from "next-themes";

import NavbarComponent from "./NavbarComponent";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
});

describe("Navbar Component", () => {
  test("Renders correctly", () => {
    render(<NavbarComponent />);

    const logoElements = screen.getAllByRole("img");

    expect(logoElements).toHaveLength(2);

    const listElements = screen.getAllByRole("list");

    expect(listElements).toHaveLength(2);

    const listItems = screen.getAllByRole("listitem");

    expect(listItems).toHaveLength(8);

    const buttonDarkModeElements = screen.getAllByRole("button", {
      name: "DARK MODE",
    });

    expect(buttonDarkModeElements).toHaveLength(2);
  });

  test("Open menu correctly", async () => {
    render(<NavbarComponent />);

    const openMenuButton = screen.getByRole("button", { name: /open/i });

    expect(openMenuButton).toBeInTheDocument();

    await userEvent.click(openMenuButton);

    const closeMenuButton = screen.getByRole("button", { name: /close/i });

    expect(closeMenuButton).toBeInTheDocument();

    await userEvent.click(closeMenuButton);

    expect(
      screen.queryByRole("button", { name: /close/i })
    ).not.toBeInTheDocument();

    expect(screen.getByRole("button", { name: /open/i })).toBeInTheDocument();
  });

  test("Change theme correctly", async () => {
    render(
      <ThemeProvider attribute="class">
        <NavbarComponent />
      </ThemeProvider>
    );

    const buttonDarkModeElements = screen.getAllByRole("button", {
      name: "DARK MODE",
    });

    await userEvent.click(buttonDarkModeElements[0]);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    const lightModeButtons = screen.getAllByRole("button", {
      name: "LIGHT MODE",
    });
    await userEvent.click(lightModeButtons[1]);
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    const darkModeButtons = screen.getAllByRole("button", {
      name: "DARK MODE",
    });
    await userEvent.click(darkModeButtons[1]);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
