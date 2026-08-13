import React from "react";
import { render, screen } from "@testing-library/react";
import { SingleShimmer } from "./components/tables/shimmers";

test("test shimmer", () => {
  render(<SingleShimmer />);
  const shimmerElement = screen.getByRole("div");
  expect(typeof shimmerElement).toBe("object");
});
