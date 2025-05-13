import pandas as pd

DATASET_PATH = 'src/assets/data/complete_dataset.csv'

df = pd.read_csv(DATASET_PATH)

# Save processed data for React
df.to_json('src/assets/data/f1_processed.json', orient='records')
