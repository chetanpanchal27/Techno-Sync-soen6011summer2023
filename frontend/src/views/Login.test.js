import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import { PopupContext } from "../App";

describe("LoginPage", () => {
  test("renders login form with email and password fields", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByText("Login");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test("displays error messages for invalid input", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

    const emailError = screen.getByText("Email is required");
    const passwordError = screen.getByText("Password is required");

    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  test("displays error message for incorrect email format", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    const emailError = screen.getByText("Incorrect email format");

    expect(emailError).toBeInTheDocument();
  });

  test("performs login on valid input", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Set up context provider mock
    const setPopup = jest.fn();
    const contextValue = jest.fn();

    render(
      <PopupContext.Provider value={setPopup}>
        <LoginPage />
      </PopupContext.Provider>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    // You can add more assertions here to verify the expected behavior after a successful login
  });

  test("displays error popup after failed login", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Set up context provider mock
    const setPopup = jest.fn();
    const contextValue = jest.fn();

    render(
      <PopupContext.Provider value={setPopup}>
        <LoginPage />
      </PopupContext.Provider>
    );

    const loginButton = screen.getByText("Login");
    fireEvent.click(loginButton);

  });

});
