import { useEffect, useState } from 'react';
import './App.css'
import * as d3 from 'd3'

import ScatterPlot from './components/charts/OvertakingScatterPlot.tsx';

function App() {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    d3.csv("/data/f1_visualization.csv").then((d) => {
      setData(d)

      setLoading(false);
    });
    // or
    // d3.json("").then((d) => {
    //   setData(d)
    //
    //   setLoading(false);
    // });

    return () => undefined;
  }, [])

  return (
    <>
      <h1>F1 Visualization</h1>
      {loading && <div>loading</div>}
      {!loading && <ScatterPlot width={500} height={500} data={data} />}
    </>
  )
}

export default App
