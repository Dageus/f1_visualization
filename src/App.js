import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import ScatterPlot from './components/ScatterPlot';
import f1Data from './data/f1_processed.json';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Preprocess data on load
    const processed = f1Data.map(d => ({
      ...d,
      positionDelta: d.grid - d.positionOrder
    }));
    setData(processed);
  }, []);

  return (
    <div className="app">
      <h1>F1 Visualization Dashboard</h1>
      <ScatterPlot data={data} width={800} height={500} />
    </div>
  );
}

export default App;
