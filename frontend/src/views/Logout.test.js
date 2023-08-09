import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PopupContext } from "../App";
import Logout from "./Logout";

describe("Logout", () => {
  test("removes tokens from local storage and displays success popup", () => {
    const setPopup = jest.fn();
    const localStorageMock = {
      removeItem: jest.fn(),
    };
    global.localStorage = localStorageMock;

    render(
      <PopupContext.Provider value={setPopup}>
        <MemoryRouter>
          <Logout />
        </MemoryRouter>
      </PopupContext.Provider>
    );

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("type");
    expect(setPopup).toHaveBeenCalledWith({
      open: true,
      severity: "success",
      message: "Logged out successfully",
    });
  });
});
