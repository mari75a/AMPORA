import csv
import random

# Configuration
NUM_ROWS = 20000
OUTPUT_FILE = "ev_activity_data_v2.csv"

# Metadata
cities = ["Colombo", "Kandy", "Galle", "Negombo", "Katunayake", "Matara", "Kurunegala", "Anuradhapura"]
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November",
          "December"]
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def generate_label(charging_time, hour, is_festival, is_weekend):
    """
    ML Logic Engine: Probabilistic Rule-Based Labeling
    Gaps are removed by checking hour ranges continuously.
    """
    labels = []

    # Probability Factor for Overfitting Prevention (Noise)
    if random.random() < 0.05:
        return "none"

    # --- Rule 1: 15 Minutes ---
    if charging_time == 15:
        if is_festival or random.random() < 0.15:
            labels.append("shopping")
        else:
            labels.append("none")

    # --- Rule 2: 30 Minutes ---
    elif charging_time == 30:
        if (6 <= hour <= 9) or (15 <= hour <= 18) or (21 <= hour <= 23):
            labels.append("tea/coffee shop")
        if is_festival or (is_weekend and random.random() < 0.4):
            labels.append("shopping")
        if not labels: labels.append("none")

    # --- Rule 3: 45 Minutes ---
    elif charging_time == 45:
        if 7 <= hour <= 9:
            labels.append("breakfast")
        elif 12 <= hour <= 14:
            labels.append("lunch")
        elif 19 <= hour <= 21:
            labels.append("dinner")
        else:
            labels.append("tea/coffee shop")

        if is_festival or random.random() < 0.5:
            labels.append("shopping")

    # --- Rule 4: 60 Minutes ---
    elif charging_time == 60:
        if 7 <= hour <= 9:
            labels.append("breakfast")
        elif 12 <= hour <= 14:
            labels.append("lunch")
        elif 19 <= hour <= 21:
            labels.append("dinner")

        labels.append("shopping")  # High probability for shopping in 1 hour
        if is_weekend: labels.append("visit beautiful place")

    # --- Rule 5: 75 & 90 Minutes ---
    elif charging_time >= 75:
        # Meals are high priority
        if 7 <= hour <= 10:
            labels.append("breakfast")
        elif 11 <= hour <= 15:
            labels.append("lunch")
        elif 18 <= hour <= 22:
            labels.append("dinner")

        # Leisure activities
        if is_weekend or random.random() < 0.6:
            labels.append("visit beautiful place")

        labels.append("shopping")

    # Cleanup and format
    unique_labels = list(set(labels))
    if len(unique_labels) > 1 and "none" in unique_labels:
        unique_labels.remove("none")

    return ", ".join(unique_labels) if unique_labels else "none"


# --- Main Generation Loop ---
dataset = []
for _ in range(NUM_ROWS):
    city = random.choice(cities)
    month = random.choice(months)
    day = random.choice(days)
    charging_time = random.choice([15, 30, 45, 60, 75, 90])

    hour = random.randint(0, 23)
    minute = random.choice([0, 15, 30, 45])
    time_str = f"{hour:02d}:{minute:02d}"

    is_festival = 1 if month in ["April", "December"] else 0
    is_weekend = 1 if day in ["Saturday", "Sunday"] else 0

    label = generate_label(charging_time, hour, is_festival, is_weekend)

    dataset.append([charging_time, time_str, day, month, is_festival, is_weekend, city, label])

# --- Save to CSV ---
header = ["charging_time", "time", "day", "month", "is_festival", "is_weekend", "city", "label"]
with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(dataset)

print(f"Dataset generated successfully: {OUTPUT_FILE} (20,000 rows)")