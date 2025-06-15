import Planet from "./Planet";
import { render, screen } from "@testing-library/react";

describe("Planet", () => {
  it("should render the component properly when empty", () => {
    render(<Planet />);

    const planetCard = screen.queryByTestId("planet-card");

    expect(planetCard).toBe(null);
  });

  it("should render the component when there is data", () => {
    const planet = {
      title: "Tatooine",
      terrain: "Desert",
    };
    render(<Planet planet={planet} />);

    const planetCard = screen.getByTestId("planet-card");

    expect(planetCard).toBeInTheDocument();
  });
});
