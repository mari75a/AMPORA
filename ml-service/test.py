import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import matplotlib.pyplot as plt
import seaborn as sns


# 1. Data Generation Function
def generate_ev_charging_data():
    np.random.seed(42)

    # Create 20 electric station names
    stations = [
        "VoltHub Downtown", "EcoCharge Central", "PowerPort East", "SparkStation West",
        "ChargePoint North", "ElectroBay South", "GreenPlug Plaza", "MegaWatt Mall",
        "QuickCharge Express", "EcoPower Terminal", "VoltZone Commercial", "PowerGrid Hub",
        "ElectroPlex Center", "ChargeNation Station", "EcoVolt Square", "PowerFlow Depot",
        "SparkCharge Junction", "MegaCharge Point", "QuickVolt Center", "GreenEnergy Terminal"
    ]

    # Station status (5 busy, 10 normal, 5 not busy)
    station_status = {}
    busy_stations = stations[:5]
    normal_stations = stations[5:15]
    not_busy_stations = stations[15:]

    for station in stations:
        if station in busy_stations:
            station_status[station] = "busy"
        elif station in normal_stations:
            station_status[station] = "normal"
        else:
            station_status[station] = "not_busy"

    # Generate date range (last 60 days for more data)
    start_date = datetime.now() - timedelta(days=60)
    dates = [start_date + timedelta(days=x) for x in range(60)]

    data = []
    for date in dates:
        for station in stations:
            # Generate multiple time slots per day
            for hour in [6, 8, 10, 12, 14, 16, 18, 20, 22]:  # More time slots
                time_slot = date.replace(hour=hour, minute=0, second=0)
                day_of_week = time_slot.strftime('%A')

                # Determine queue based on day (high on Saturday and Sunday)
                if day_of_week in ['Saturday', 'Sunday']:
                    if station_status[station] == "busy":
                        queue = np.random.randint(8, 16)
                    elif station_status[station] == "normal":
                        queue = np.random.randint(4, 12)
                    else:
                        queue = np.random.randint(1, 8)
                else:
                    if station_status[station] == "busy":
                        queue = np.random.randint(4, 12)
                    elif station_status[station] == "normal":
                        queue = np.random.randint(2, 9)
                    else:
                        queue = np.random.randint(0, 5)

                # Determine traffic (high on weekdays)
                if day_of_week in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']:
                    traffic = np.random.randint(6, 10)  # High traffic
                else:
                    traffic = np.random.randint(2, 6)  # Low traffic

                # Calculate time_to_full_charge based on features
                base_charge_time = 45  # minutes

                # Adjust based on station status
                if station_status[station] == "busy":
                    status_multiplier = 1.4
                elif station_status[station] == "normal":
                    status_multiplier = 1.1
                else:
                    status_multiplier = 0.9

                # Adjust based on queue
                queue_effect = queue * 2.5

                # Adjust based on traffic
                traffic_effect = traffic * 1.2

                # Adjust based on time of day
                if hour in [16, 17, 18, 19]:  # Evening peak hours
                    time_effect = 20
                elif hour in [7, 8, 9]:  # Morning peak
                    time_effect = 15
                elif hour == 12:  # Noon
                    time_effect = 8
                else:  # Other times
                    time_effect = 5

                # Calculate final charge time
                time_to_full_charge = int(
                    base_charge_time * status_multiplier + queue_effect + traffic_effect + time_effect + np.random.randint(
                        -8, 8))

                # Ensure minimum charge time
                time_to_full_charge = max(25, time_to_full_charge)

                data.append({
                    'timestamp': time_slot,
                    'date': time_slot.date(),
                    'time': time_slot.time(),
                    'day_of_week': day_of_week,
                    'queue': queue,
                    'traffic': traffic,
                    'electric_station_name': station,
                    'station_status': station_status[station],
                    'time_to_full_charge': time_to_full_charge
                })

    return pd.DataFrame(data)


# 2. Generate Dataset
print("Generating EV Charging Dataset...")
df = generate_ev_charging_data()
print(f"Dataset created with {len(df)} records")
print(f"Columns: {df.columns.tolist()}")


# 3. Data Preprocessing and Feature Engineering
def preprocess_data(df):
    data = df.copy()

    # Convert time to numerical features
    data['hour'] = data['time'].apply(lambda x: x.hour)
    data['minute'] = data['time'].apply(lambda x: x.minute)
    data['time_of_day'] = data['hour'] + data['minute'] / 60

    # Date features
    data['day_of_week_num'] = data['timestamp'].dt.dayofweek
    data['is_weekend'] = (data['day_of_week_num'] >= 5).astype(int)
    data['month'] = data['timestamp'].dt.month
    data['day_of_month'] = data['timestamp'].dt.day

    # Time-based features
    data['is_morning_peak'] = ((data['hour'] >= 7) & (data['hour'] <= 9)).astype(int)
    data['is_evening_peak'] = ((data['hour'] >= 16) & (data['hour'] <= 19)).astype(int)
    data['is_night'] = ((data['hour'] >= 20) | (data['hour'] <= 5)).astype(int)

    # Encode categorical variables
    le_station = LabelEncoder()
    le_day = LabelEncoder()
    le_status = LabelEncoder()

    data['station_encoded'] = le_station.fit_transform(data['electric_station_name'])
    data['day_encoded'] = le_day.fit_transform(data['day_of_week'])
    data['status_encoded'] = le_status.fit_transform(data['station_status'])

    # Interaction features
    data['queue_traffic_interaction'] = data['queue'] * data['traffic']
    data['busy_peak_interaction'] = data['status_encoded'] * data['is_evening_peak']

    return data, le_station, le_day, le_status


# 4. Preprocess the data
print("\nPreprocessing data...")
df_processed, le_station, le_day, le_status = preprocess_data(df)

# 5. Define features and target
features = [
    'hour', 'queue', 'traffic', 'station_encoded', 'day_encoded',
    'status_encoded', 'is_weekend', 'is_morning_peak', 'is_evening_peak',
    'is_night', 'queue_traffic_interaction', 'busy_peak_interaction'
]

target = 'time_to_full_charge'

X = df_processed[features]
y = df_processed[target]

print(f"\nFeatures used: {features}")
print(f"Target variable: {target}")
print(f"Feature matrix shape: {X.shape}")

# 6. Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=df_processed['station_encoded']
)

print(f"\nTraining set: {X_train.shape[0]} samples")
print(f"Testing set: {X_test.shape[0]} samples")

# 7. Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 8. XGBoost Model Training
print("\nTraining XGBoost Model...")
model = xgb.XGBRegressor(
    n_estimators=1000,
    learning_rate=0.1,
    max_depth=8,
    min_child_weight=3,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=0.1,
    random_state=42,
    eval_metric='rmse'
)

# Train with early stopping
model.fit(
    X_train_scaled,
    y_train,

)

# 9. Predictions
y_pred = model.predict(X_test_scaled)

# 10. Model Evaluation
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("\n" + "=" * 50)
print("MODEL EVALUATION RESULTS")
print("=" * 50)
print(f"Mean Absolute Error (MAE): {mae:.2f} minutes")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f} minutes")
print(f"R² Score: {r2:.4f}")
print("=" * 50)

# 11. Feature Importance
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(feature_importance)



# 13. Prediction Examples
print("\nPREDICTION EXAMPLES:")
print("=" * 40)
sample_indices = np.random.choice(len(X_test), 5, replace=False)
for i, idx in enumerate(sample_indices):
    actual = y_test.iloc[idx]
    predicted = y_pred[idx]
    error = abs(actual - predicted)

    print(f"Example {i + 1}:")
    print(f"  Actual charging time: {actual:.1f} minutes")
    print(f"  Predicted charging time: {predicted:.1f} minutes")
    print(f"  Error: {error:.1f} minutes")
    print("-" * 20)

# 14. Save the model and preprocessors
import joblib

model_data = {
    'model': model,
    'scaler': scaler,
    'label_encoders': {
        'station': le_station,
        'day': le_day,
        'status': le_status
    },
    'features': features
}

joblib.dump(model_data, 'ev_charging_model.pkl')
print("\nModel saved as 'ev_charging_model.pkl'")


# 15. Prediction Function for New Data
def predict_charging_time(station_name, day_of_week, hour, queue, traffic, station_status):
    """
    Predict charging time for new data
    """
    # Load model
    model_data = joblib.load('ev_charging_model.pkl')
    model = model_data['model']
    scaler = model_data['scaler']
    le_station = model_data['label_encoders']['station']
    le_day = model_data['label_encoders']['day']
    le_status = model_data['label_encoders']['status']
    features = model_data['features']

    # Preprocess input
    input_data = {
        'hour': hour,
        'queue': queue,
        'traffic': traffic,
        'station_encoded': le_station.transform([station_name])[0],
        'day_encoded': le_day.transform([day_of_week])[0],
        'status_encoded': le_status.transform([station_status])[0],
        'is_weekend': 1 if day_of_week in ['Saturday', 'Sunday'] else 0,
        'is_morning_peak': 1 if 7 <= hour <= 9 else 0,
        'is_evening_peak': 1 if 16 <= hour <= 19 else 0,
        'is_night': 1 if hour >= 20 or hour <= 5 else 0,
        'queue_traffic_interaction': queue * traffic,
        'busy_peak_interaction': le_status.transform([station_status])[0] * (1 if 16 <= hour <= 19 else 0)
    }

    # Create feature array
    feature_array = np.array([[input_data[feature] for feature in features]])

    # Scale features
    feature_array_scaled = scaler.transform(feature_array)

    # Predict
    prediction = model.predict(feature_array_scaled)[0]

    return prediction


# Example usage of prediction function
print("\nPREDICTION FUNCTION TEST:")
print("=" * 40)
test_prediction = predict_charging_time(
    station_name="VoltHub Downtown",
    day_of_week="Saturday",
    hour=18,
    queue=12,
    traffic=4,
    station_status="busy"
)
print(f"Predicted charging time: {test_prediction:.1f} minutes")

print("\nModel training completed successfully!")
print("=== BASIC ACCURACY METRICS ===")
print(f"1. Mean Absolute Error (MAE): {mae:.2f} minutes")
print(f"2. Root Mean Squared Error (RMSE): {rmse:.2f} minutes")
print(f"3. R² Score: {r2:.4f}")
print(f"4. R² Score as Percentage: {r2 * 100:.2f}%")