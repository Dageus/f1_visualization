# F1 Information Visualization Demo

## To run the demonstration, run:

### `npm run start`

Inside the root directory of the project.

It will run the server in [http://localhost:3000](http://localhost:3000).

## FILESYSTEM

src/
├── components/
│   ├── charts/
│   │   ├── ScatterPlot.jsx   # Task 1: Overtaking analysis (grid vs positionOrder)
│   │   ├── Heatmap.jsx       # Task 2: Nationality bias (driverNationality vs country)
│   │   └── Reliability.jsx   # Task 3: Team trends (constructorName vs status)
│   ├── controls/
│   │   ├── YearFilter.jsx    # Filter by year range
│   │   └── TeamSelector.jsx  # Multi-select constructors
│   └── Layout.jsx           # Responsive grid layout
├── hooks/
│   ├── useResponsive.js      # Window size tracking
│   └── useD3Data.js         # Data preprocessing
├── utils/
│   ├── d3Helpers.js         # D3 scale/formatters
│   └── constants.js         # Color schemes, DNF categories
├── assets/
│   └── data/
│       └── f1_processed.json
└── App.js                   # Main entry
