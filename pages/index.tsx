import { FC, useState, useCallback, useRef } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import useInterval from "../hooks/useInterval";

const numRows = 35;
const numCols = 35;

// Directions: N, S, E, W, NE, NW, SE, SW
const operations = [
  [0, 1], // right
  [0, -1], // left
  [1, -1], // top left
  [-1, 1], // top right
  [1, 1], // top
  [-1, -1], // bottom
  [1, 0], // bottom right
  [-1, 0], // bottom left
];

const generateEmptyGrid = (): number[][] => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const randomTiles = (): number[][] => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0)));
  }
  return rows;
};

const Home: FC = () => {

  const [grid, setGrid] = useState(() => {
    return randomTiles();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback((grid) => {
    if (!runningRef.current) {
      return;
    }

    let gridCopy = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = 0;

        operations.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;

          if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
            neighbors += grid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridCopy[i][j] = 1;
        }
      }
    }

    setGrid(gridCopy);
  }, []);

  useInterval(() => {
    runSimulation(grid);
  }, 150);

  return (
    <div id={styles.container}>
      <h1 id={styles.title}>Conway's Game Of Life</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                let newGrid = JSON.parse(JSON.stringify(grid));
                newGrid[i][k] = grid[i][k] ? 0 : 1;
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "var(--cell-color)" : undefined,
                border: "1px solid var(--grid-color)",
              }}
              id={styles.cell}
            ></div>
          ))
        )}
      </div>

      <div id={styles.buttonContainer}>
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>

        <button
          onClick={() => {
            setGrid(randomTiles());
          }}
        >
          Random
        </button>

        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Home;
