import { useEffect, useState } from "react";
import css from "./Planet.module.scss";

const Planet = ({ planet, filmsMap }) => {
  const [films, setFilms] = useState(null);
  const [loadingFilms, setLoadingFilms] = useState(false);

  const renderFilms = () => {
    if (loadingFilms) {
      return <div>Loading films...</div>;
    }

    return (
      <ul>
        {films?.map((film) => {
          return (
            <li className={css.film} key={`${planet.name}-${film.title}`}>
              {film.title}
            </li>
          );
        })}
      </ul>
    );
  };

  const updateFilmsMap = (newEntries) => {
    for (const [key, value] of newEntries.entries()) {
      filmsMap?.set(key, value);
    }
  };

  useEffect(() => {
    if (!planet) {
      return;
    }

    const fetchFilmData = async () => {
      try {
        setLoadingFilms(true);
        const localFilmsMap = new Map();
        for (let film of planet?.films) {
          if (filmsMap.has(film)) {
            localFilmsMap.set(film, filmsMap.get(film));
          } else {
            const response = await fetch(film);

            if (!response.ok) {
              throw Error("Error fetching film data");
            }

            const json = await response.json();
            localFilmsMap.set(film, json);
          }
        }
        setFilms([...localFilmsMap.values()]);
        updateFilmsMap(localFilmsMap);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFilms(false);
      }
    };

    fetchFilmData();
  }, []);

  if (!planet) {
    return null;
  }

  return (
    <div className={css.card} data-testid="card">
      <div className={css.title}>Name</div>
      <div>{planet.name}</div>
      <div className={css.title}>Terrain</div>
      <div>{planet.terrain}</div>
      {planet.films && (
        <>
          <div className={css.title}>Films</div>
          <div>{renderFilms()}</div>
        </>
      )}
    </div>
  );
};

export default Planet;
