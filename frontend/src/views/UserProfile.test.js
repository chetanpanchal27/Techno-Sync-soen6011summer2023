import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import UserProfile from "./UserProfile";
import { PopupContext } from "../App";

const mockPopupContext = {
  open: false,
  severity: "",
  message: "",
};

const setPopupMock = jest.fn();

const mockAxiosGet = jest.fn();
jest.mock("axios", () => ({
  get: mockAxiosGet,
}));

beforeEach(() => {
  mockAxiosGet.mockResolvedValue({
    data: {
      name: "John Doe",
      education: [],
      skills: [],
      resume: "",
      profile: "",
    },
  });

  jest.clearAllMocks();
});

describe("UserProfile", () => {
  test("renders user profile details", async () => {
    render(
      <PopupContext.Provider value={setPopupMock}>
        <UserProfile />
      </PopupContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  test("updates user profile details", async () => {
    render(
      <PopupContext.Provider value={setPopupMock}>
        <UserProfile />
      </PopupContext.Provider>
    );

    fireEvent.click(screen.getByText("Update Details"));

    await waitFor(() => {
      expect(mockAxiosGet).toHaveBeenCalled(); // Mocked axios GET request
      expect(setPopupMock).toHaveBeenCalledWith({
        open: true,
        severity: "success",
        message: "Profile details updated successfully",
      }); // Mocked setPopup context function
    });
  });

  test("views uploaded resume", async () => {
    render(
      <PopupContext.Provider value={setPopupMock}>
        <UserProfile />
      </PopupContext.Provider>
    );

    fireEvent.click(screen.getByText("View Uploaded Resume"));

    await waitFor(() => {
      expect(mockAxiosGet).toHaveBeenCalled(); // Mocked axios GET request
    });
  });

});
