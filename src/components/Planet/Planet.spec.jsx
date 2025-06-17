import { render, screen } from "@testing-library/react";
import Planet from "./Planet";

describe("Planet", () => {
  it("should render with empty state", () => {
    render(<Planet />);

    const planetCard = screen.queryByTestId("card");
    expect(planetCard).not.toBeInTheDocument();
  });

  it("should render with data", () => {
    const planet = {
      name: "Tatooine",
      terrain: "desert",
      films: [],
    };
    render(<Planet planet={planet} />);

    const planetCard = screen.queryByTestId("card");
    expect(planetCard).toBeInTheDocument();
    expect(planetCard.textContent).toBe("NameTatooineTerraindesertFilms");
  });
});
