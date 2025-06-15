import css from "./Planet.module.scss";

const Planet = ({ planet }) => {
  if (!planet) {
    return null;
  }

  return (
    <div
      className={css.card}
      data-testid="planet-card"
      aria-label={`Planet card ${planet.name}`}
    >
      <div className={css.title}>Name</div>
      <div>{planet.name}</div>
      <div className={css.title}>Terrain</div>
      <div>{planet.terrain}</div>
    </div>
  );
};

export default Planet;
