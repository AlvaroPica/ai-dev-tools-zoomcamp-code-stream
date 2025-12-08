import { render, screen } from "@testing-library/react";
import App from "../src/App";

describe("App", () => {
  test("renders the home page", () => {
    render(<App />);
    expect(screen.getByText(/CodeCollab/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Collaborative/i)).toBeInTheDocument();
  });
});

