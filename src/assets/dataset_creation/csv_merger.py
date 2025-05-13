import pandas as pd

# Load datasets
results = pd.read_csv('results.csv')
drivers = pd.read_csv('drivers.csv')
races = pd.read_csv('races.csv')
constructors = pd.read_csv('constructors.csv')
circuits = pd.read_csv('circuits.csv')
status = pd.read_csv('status.csv')

# Clean up drivers and merge
drivers.drop(columns=['code', 'number', 'code', 'url'], axis=1, inplace=True)
drivers.rename(columns={'nationality': 'driverNationality'}, inplace=True)

df = results.merge(drivers, on='driverId').drop(columns='driverId')

# Clean up constructors and merge
constructors.drop(columns=['constructorRef', 'url'], axis=1, inplace=True)
constructors.rename(columns={'nationality': 'constructorNationality', 'name': 'constructorName'}, inplace=True)

df = df.merge(constructors, on='constructorId').drop(columns='constructorId')

# Clean up races and merge
races.drop(columns=['round', 'url', 'year', 'fp1_date', 'fp1_time', 'fp2_date', 'fp2_time', 'fp3_date', 'fp3_time', 'quali_date', 'quali_time', 'sprint_date', 'sprint_time'], axis=1, inplace=True)
races.rename(columns={'name': 'raceName', 'date': 'raceDate', 'time': 'raceTime'}, inplace=True)
print(races.head())

df = df.merge(races, on='raceId').drop(columns='raceId')

# Clean up circuits and merge
circuits.drop(columns=['circuitRef', 'lat', 'lng', 'alt', 'url'], axis=1, inplace=True)
circuits.rename(columns={'name': 'circuitName'}, inplace=True)

df = df.merge(circuits, on='circuitId').drop(columns='circuitId')

# Clean up status and merge
df = df.merge(status, on='statusId').drop(columns='statusId')
df.drop(columns='position', axis=1, inplace=True)

# for readability
df.rename(columns={'number': 'carNumber'}, inplace=True)

# Save to new CSV
df.to_csv('complete_dataset.csv', index=False)
print("Merged dataset saved")
