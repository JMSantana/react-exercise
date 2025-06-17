import { useRef, useState } from "react";
import usePlanet from "../../hooks/usePlanet";
import Planet from "./Planet";
import css from "./PlanetList.module.scss";

const PlanetList = () => {
  const { data, loading, error, refresh, previous, next } = usePlanet();
  const [filteredData, setFilteredData] = useState(null);
  const [query, setQuery] = useState("");
  const filmsMap = useRef(new Map());

  const renderPlanetList = (dataToShow) => {
    return dataToShow?.results?.map((planet) => {
      return (
        <Planet planet={planet} filmsMap={filmsMap.current} key={planet.name} />
      );
    });
  };

  const handleSearch = (e, data) => {
    if (e.key === "Enter") {
      if (!query) {
        setFilteredData(null);
      } else {
        const newData = structuredClone(data);
        newData.results = data.results.filter((planet) =>
          planet.name.includes(query)
        );
        setFilteredData(newData);
      }
    }

    if (e.key === "Escape") {
      setQuery("");
      setFilteredData(null);
    }
  };

  // Replace with a proper loading component
  if (loading) {
    return;
  }

  // Replace with a proper error component
  if (error) {
    return <div>{error.message || "An error occured fetching people"}</div>;
  }

  let dataToShow = filteredData ? filteredData : data;

  return (
    <div>
      <h1>Star Wars Planets</h1>
      <div className={css.buttonContainer}>
        <span>Search </span>
        <input
          onKeyDown={(e) => handleSearch(e, data)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div>Press Enter to search or Esc to clear the query</div>
      </div>
      <div className={css.buttonContainer}>
        <button onClick={previous} disabled={!data?.previous}>
          Previous
        </button>
        <button onClick={next} disabled={!data?.next}>
          Next
        </button>
      </div>
      <div className={css.buttonContainer}>
        <button onClick={refresh}>Refresh</button>
      </div>
      {dataToShow && renderPlanetList(dataToShow)}
    </div>
  );
};

export default PlanetList;
