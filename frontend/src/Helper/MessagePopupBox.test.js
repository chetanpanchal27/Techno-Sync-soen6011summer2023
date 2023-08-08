import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MessagePopupBox from "./MessagePopupBox";

describe("MessagePopupBox", () => {
  test("renders with message and closes on click", () => {
    const setOpen = jest.fn();
    const props = {
      open: true,
      setOpen,
      severity: "success",
      message: "Test message",
    };

    render(<MessagePopupBox {...props} />);

    const messageElement = screen.getByText("Test message");
    expect(messageElement).toBeInTheDocument();

    const snackbarElement = screen.getByRole("alert");
    expect(snackbarElement).toHaveAttribute(
      "aria-describedby",
      "client-snackbar"
    );

    fireEvent.click(snackbarElement);

    expect(setOpen).toHaveBeenCalledWith(false);
  });

  test("does not render when open is false", () => {
    const setOpen = jest.fn();
    const props = {
      open: false,
      setOpen,
      severity: "error",
      message: "Another test message",
    };

    render(<MessagePopupBox {...props} />);

    const messageElement = screen.queryByText("Another test message");
    expect(messageElement).toBeNull();
  });
});
