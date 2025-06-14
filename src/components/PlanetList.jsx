import usePlanet from "../hooks/usePlanet";
import Planet from "./Planet";

const PlanetList = () => {
  const { data, loading, error, refresh, next, previous } = usePlanet();
  const results = data?.results;

  const renderPlanets = () => {
    return results?.map((planet) => {
      return <Planet planet={planet} key={planet.name} />;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message || "An error occurred"}</div>;
  }

  return (
    <div>
      <h1>Star Wars Planets</h1>
      <button onClick={refresh}>Refresh</button>
      <button onClick={previous} disabled={!data?.previous}>
        Previous
      </button>
      <button onClick={next} disabled={!data?.next}>
        Next
      </button>
      {renderPlanets()}
    </div>
  );
};

export default PlanetList;
