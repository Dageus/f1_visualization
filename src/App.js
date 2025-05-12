import F1_DATA from '../assets/data/f1_processed.json';

function App() {
	const [data, setData] = useState([]);

	useEffect(() => {
		// Optional: Fetch if using API
		setData(F1_DATA);
	}, []);
}
