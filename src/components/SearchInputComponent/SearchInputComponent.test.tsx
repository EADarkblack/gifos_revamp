import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import SearchInputComponent from "./SearchInputComponent";

//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  useGetTagsBySearchQuery,
  useGetGifBySearchQuery,
} from "@/redux/services/giphyApi";

//Slice
import { setSearchResultGif } from "@/redux/slices/searchResultGifSlice";

//Mocks Redux Store
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("../../redux/services/giphyApi", () => ({
  useGetTagsBySearchQuery: jest.fn(),
  useGetGifBySearchQuery: jest.fn(),
}));

describe("Search Input Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockReturnValue("");

    (useGetTagsBySearchQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
    });

    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
    });
  });

  test("Renders correctly", () => {
    render(<SearchInputComponent />);

    const inputElement = screen.getByRole("textbox");

    expect(inputElement).toBeInTheDocument();
  });

  test("Should dispatch action on typing", async () => {
    let mockSearchTerm = "";

    (useSelector as jest.Mock).mockImplementation(() => mockSearchTerm);

    (useGetTagsBySearchQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
    });

    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
    });

    const { rerender } = render(<SearchInputComponent />);

    const inputElement = screen.getByRole("textbox");

    await userEvent.type(inputElement, "cat");

    mockSearchTerm = "cat";
    rerender(<SearchInputComponent />);

    const searchTermActions = mockDispatch.mock.calls.filter(
      ([action]) => action.type === "searchTerm/setSearchTerm"
    );

    expect(searchTermActions).toHaveLength(3);
    expect(searchTermActions[0][0]).toEqual({
      type: "searchTerm/setSearchTerm",
      payload: "c",
    });
    expect(searchTermActions[1][0]).toEqual({
      type: "searchTerm/setSearchTerm",
      payload: "a",
    });
    expect(searchTermActions[2][0]).toEqual({
      type: "searchTerm/setSearchTerm",
      payload: "t",
    });

    expect(screen.getByRole("textbox")).toHaveValue("cat");
  });
  
  test("Should show tags when API returns results", async () => {
    let mockSearchTerm = "";

    (useSelector as jest.Mock).mockImplementation(() => mockSearchTerm);

    (useGetTagsBySearchQuery as jest.Mock).mockImplementation(() => {
      return {
        data: {
          data: [
            { id: "1", name: "cat1" },
            { id: "2", name: "cat2" },
          ],
        },
      };
    });

    render(<SearchInputComponent />);

    const inputElement = screen.getByRole("textbox");

    await userEvent.type(inputElement, "cat");

    mockSearchTerm = "cat";

    render(<SearchInputComponent />);

    expect(screen.getByText("cat1")).toBeInTheDocument();
    expect(screen.getByText("cat2")).toBeInTheDocument();
  });

  test("Should not show tags when API returns no results", async () => {
    let mockSearchTerm = "";

    (useSelector as jest.Mock).mockImplementation(() => mockSearchTerm);

    (useGetTagsBySearchQuery as jest.Mock).mockImplementation(() => ({
      data: { data: [] },
    }));

    render(<SearchInputComponent />);

    const inputElement = screen.getByRole("textbox");

    await userEvent.type(inputElement, "cat");

    mockSearchTerm = "cat";

    render(<SearchInputComponent />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("Should search when enter key is pressed", async () => {
    const searchTerm = "cat";

    (useSelector as jest.Mock).mockReturnValue(searchTerm);

    const mockGifData = {
      data: [
        { id: "1", title: "cat gif" },
        { id: "2", title: "funny cat" },
      ],
    };

    (useGetTagsBySearchQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
    });
    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: mockGifData,
    });

    render(<SearchInputComponent />);

    const inputElement = screen.getByRole("textbox");

    await userEvent.type(inputElement, "{enter}");

    expect(mockDispatch).toHaveBeenCalledWith(
      setSearchResultGif({ searchResultGif: mockGifData.data })
    );
  });

  test("Should search when a tag is clicked", async () => {
    let mockSearchTerm = "";

    (useSelector as jest.Mock).mockImplementation(() => mockSearchTerm);

    const mockGifData = {
      data: [{ id: "1", title: "Funny cat gif" }],
    };

    (useGetTagsBySearchQuery as jest.Mock).mockReturnValue({
      data: {
        data: [
          {
            id: "1",
            name: "cats",
          },
        ],
      },
    });

    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: mockGifData,
    });

    const { rerender } = render(<SearchInputComponent />);

    const inputElement = screen.getByRole("textbox");

    await userEvent.type(inputElement, "cat");

    mockSearchTerm = "cats";
    rerender(<SearchInputComponent />);

    const tagElement = await screen.findByText("cats");
    await userEvent.click(tagElement);

    expect(screen.getByRole("textbox")).toHaveValue("cats");

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "searchTerm/setSearchTerm",
      payload: "cats",
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setSearchResultGif({ searchResultGif: mockGifData.data })
    );
  });

  test("Should clear input when clear button is clicked", async () => {
    let mockSearchTerm = "cat";

    (useSelector as jest.Mock).mockImplementation(() => mockSearchTerm);

    (useGetTagsBySearchQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
    });

    (useGetGifBySearchQuery as jest.Mock).mockReturnValue({
      data: { data: [] },
    });

    const { rerender } = render(<SearchInputComponent />);

    const clearButton = screen.getByRole("button", { name: "Clear" });

    await userEvent.click(clearButton);

    mockSearchTerm = "";
    rerender(<SearchInputComponent />);

    expect(screen.getByRole("textbox")).toHaveValue("");

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "searchTerm/setSearchTerm",
      payload: "",
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setSearchResultGif({ searchResultGif: [] })
    );
  });
});
