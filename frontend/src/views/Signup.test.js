import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import SignupPage from "./SignupPage";
import { PopupContext } from "../App";
import axios from "axios";

const mockPopupContext = {
  open: false,
  severity: "",
  message: "",
};

const setPopupMock = jest.fn();

const mockAxiosPost = jest.fn();
jest.mock("axios", () => ({
  post: mockAxiosPost,
}));

beforeEach(() => {
  mockAxiosPost.mockResolvedValue({
    data: {
      token: "mockToken",
      type: "applicant",
    },
  });

  jest.clearAllMocks();
});

describe("SignupPage", () => {
  test("renders signup form", async () => {
    render(
      <PopupContext.Provider value={setPopupMock}>
        <SignupPage />
      </PopupContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Sign up")).toBeInTheDocument();
    });
  });

  test("submits applicant signup form", async () => {
    render(
      <PopupContext.Provider value={setPopupMock}>
        <SignupPage />
      </PopupContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Signup"));

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalled(); // Mocked axios POST request
      expect(setPopupMock).toHaveBeenCalledWith({
        open: true,
        severity: "success",
        message: "Logged in successfully",
      }); // Mocked setPopup context function
    });
  });

  test("submits recruiter signup form", async () => {
    render(
      <PopupContext.Provider value={setPopupMock}>
        <SignupPage />
      </PopupContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Jane Smith" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "securepass" },
    });
    fireEvent.click(screen.getByLabelText("Recruiter"));

    fireEvent.click(screen.getByText("Signup"));

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalled(); // Mocked axios POST request
      expect(setPopupMock).toHaveBeenCalledWith({
        open: true,
        severity: "success",
        message: "Logged in successfully",
      }); // Mocked setPopup context function
    });
  });

  // Add more tests for different scenarios

  test("displays error for incomplete form submission", async () => {
    render(
      <PopupContext.Provider value={setPopupMock}>
        <SignupPage />
      </PopupContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByText("Signup"));

    await waitFor(() => {
      expect(mockAxiosPost).not.toHaveBeenCalled();
      expect(setPopupMock).toHaveBeenCalledWith({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    });
  });

  // Add more tests for different error scenarios and form inputs
});
