import csv
import random
from datetime import datetime, timedelta

# ------------------------------------------------------------
# 1. STATION DATA (131 Stations from the original list)
# ------------------------------------------------------------
stations = [
    ("Station A", "Colombo"),
    ("Station B", "Colombo"),
    ("Station C", "Kandy"),
    ("CCC Fast Charge", "Colombo"),
    ("Liberty Plaza AC", "Colombo"),
    ("Shangri La DC", "Colombo"),
    ("Dutch Hospital", "Colombo"),
    ("Bambalapitiya RZ", "Bambalapitiya"),
    ("Nugegoda High Level", "Nugegoda"),
    ("Maharagama City", "Maharagama"),
    ("Kottawa Interchange", "Kottawa"),
    ("Homagama Center", "Homagama"),
    ("Kadawatha Highway", "Kadawatha"),
    ("Negombo Beach Road", "Negombo"),
    ("Katunayake Airport", "Katunayake"),
    ("Gampaha Town", "Gampaha"),
    ("Wattala K Zone", "Wattala"),
    ("Kalutara South", "Kalutara"),
    ("Panadura Depot", "Panadura"),
    ("Moratuwa Junction", "Moratuwa"),
    ("Dehiwala Junction", "Dehiwala"),
    ("Rajagiriya Flyover", "Rajagiriya"),
    ("Piliyandala Town", "Piliyandala"),
    ("Homagama Godagama", "Homagama"),
    ("Veyangoda Station", "Veyangoda"),
    ("Horana Town", "Horana"),
    ("Avissawella Center", "Avissawella"),
    ("Kosgama DC", "Kosgama"),
    ("Hanwella AC", "Hanwella"),
    ("Padukka Center", "Padukka"),
    ("Beruwala Beach", "Beruwala"),
    ("Aluthgama Bridge", "Aluthgama"),
    ("Thalahena DC", "Thalahena"),
    ("Biyagama Factory", "Biyagama"),
    ("Pannipitiya Station", "Pannipitiya"),
    ("Ratmalana DC", "Ratmalana"),
    ("Kandana DC", "Kandana"),
    ("Kandy City Center", "Kandy"),
    ("Kandy Gatambe", "Kandy"),
    ("Peradeniya Junction", "Peradeniya"),
    ("Matale Town", "Matale"),
    ("Nuwara Eliya Grand", "Nuwara Eliya"),
    ("Hatton Bus Stand", "Hatton"),
    ("Talawakele DC", "Talawakele"),
    ("Nawalapitiya Town", "Nawalapitiya"),
    ("Gampola Center", "Gampola"),
    ("Rambukkana DC", "Rambukkana"),
    ("Pussellawa AC", "Pussellawa"),
    ("Digana DC", "Digana"),
    ("Teldeniya AC", "Teldeniya"),
    ("Kadugannawa AC", "Kadugannawa"),
    ("Maskeliya Town", "Maskeliya"),
    ("Galle Bus Stand", "Galle"),
    ("Galle Fort AC", "Galle"),
    ("Matara Town Hall", "Matara"),
    ("Mirissa Beach", "Mirissa"),
    ("Hikkaduwa AC", "Hikkaduwa"),
    ("Unawatuna DC", "Unawatuna"),
    ("Weligama Bay", "Weligama"),
    ("Tangalle Town", "Tangalle"),
    ("Hambantota Port", "Hambantota"),
    ("Tissamaharama DC", "Tissamaharama"),
    ("Kataragama Center", "Kataragama"),
    ("Ambalangoda DC", "Ambalangoda"),
    ("Beliatta Highway", "Beliatta"),
    ("Deniyaya AC", "Deniyaya"),
    ("Akuressa Center", "Akuressa"),
    ("Dickwella DC", "Dickwella"),
    ("Godakawela AC", "Godakawela"),
    ("Ahangama AC", "Ahangama"),
    ("Kurunegala Lake Rd", "Kurunegala"),
    ("Kurunegala Town", "Kurunegala"),
    ("Puttalam Lagoon", "Puttalam"),
    ("Chilaw City", "Chilaw"),
    ("Wennappuwa DC", "Wennappuwa"),
    ("Kuliyapitiya Center", "Kuliyapitiya"),
    ("Nikaweratiya AC", "Nikaweratiya"),
    ("Anamaduwa DC", "Anamaduwa"),
    ("Maho Station", "Maho"),
    ("Marawila AC", "Marawila"),
    ("Anuradhapura DC", "Anuradhapura"),
    ("Anuradhapura New Town", "Anuradhapura"),
    ("Polonnaruwa Center", "Polonnaruwa"),
    ("Dambulla DC", "Dambulla"),
    ("Sigiriya Jn", "Sigiriya"),
    ("Habarana DC", "Habarana"),
    ("Kekirawa AC", "Kekirawa"),
    ("Mihintale AC", "Mihintale"),
    ("Tambuttegama DC", "Tambuttegama"),
    ("Galenbindunuwewa AC", "Galenbindunuwewa"),
    ("Trincomalee Town", "Trincomalee"),
    ("Batticaloa City", "Batticaloa"),
    ("Ampara DC", "Ampara"),
    ("Kattankudy AC", "Kattankudy"),
    ("Kalmunai Center", "Kalmunai"),
    ("Pottuvil DC", "Pottuvil"),
    ("Arugam Bay AC", "Arugam Bay"),
    ("Kinniya AC", "Kinniya"),
    ("Muttur DC", "Muttur"),
    ("Mahiyanganaya AC", "Mahiyanganaya"),
    ("Ratnapura DC", "Ratnapura"),
    ("Kegalle Town", "Kegalle"),
    ("Balangoda AC", "Balangoda"),
    ("Embilipitiya DC", "Embilipitiya"),
    ("Warakapola AC", "Warakapola"),
    ("Ruwanwella AC", "Ruwanwella"),
    ("Eheliyagoda DC", "Eheliyagoda"),
    ("Nivitigala AC", "Nivitigala"),
    ("Badulla Main DC", "Badulla"),
    ("Bandarawela Town", "Bandarawela"),
    ("Monaragala DC", "Monaragala"),
    ("Wellawaya AC", "Wellawaya"),
    ("Ella Station", "Ella"),
    ("Haputale View", "Haputale"),
    ("Passara DC", "Passara"),
    ("Tanamalwila AC", "Tanamalwila"),
    ("Jaffna Central DC", "Jaffna"),
    ("Jaffna Library AC", "Jaffna"),
    ("Vavuniya Town DC", "Vavuniya"),
    ("Kilinochchi Center", "Kilinochchi"),
    ("Mannar AC", "Mannar"),
    ("Mullaitivu DC", "Mullaitivu"),
    ("Chavakachcheri AC", "Chavakachcheri"),
    ("Point Pedro DC", "Point Pedro"),
    ("Nedunkeni AC", "Nedunkeni"),
    ("Poonakary AC", "Poonakary")
]

# ------------------------------------------------------------
# 2. RULES DEFINITIONS
# ------------------------------------------------------------
# Film start times and corresponding arrival times (30 minutes before)
film_start_times = ["12:15", "14:30", "17:00", "19:30", "22:00"]
film_arrival_times = ["11:45", "14:00", "16:30", "19:00", "21:30"]


def is_film_time(time_str):
    """Check if time is within 30 minutes before a film"""
    return time_str in film_arrival_times


def get_time_period(time_str):
    """Get time period: breakfast, lunch, dinner, or other"""
    time_obj = datetime.strptime(time_str, "%H:%M")
    hour = time_obj.hour

    if 7 <= hour < 9:
        return "breakfast"
    elif 11 <= hour < 15:
        return "lunch"
    elif 19 <= hour < 22:
        return "dinner"
    else:
        return "other"


def is_tea_coffee_time(time_str):
    """Check if time is valid for tea/coffee shop"""
    time_obj = datetime.strptime(time_str, "%H:%M")
    hour = time_obj.hour
    minute = time_obj.minute
    total_minutes = hour * 60 + minute

    # Morning: 6:00-7:00
    # Afternoon: 15:00-18:00
    # Night: 22:00-5:00 (next day)
    return ((6 <= hour < 7) or
            (15 <= hour < 18) or
            (22 <= hour <= 23) or
            (0 <= hour < 5))


def generate_label(free_time, time_str):
    """Generate label based on rules"""
    time_period = get_time_period(time_str)

    # RULE 1: Less than 15 minutes
    if free_time < 0.25:
        return "none"

    # RULE 2: 30 minutes (0.5 hours)
    elif free_time == 0.5:
        if is_tea_coffee_time(time_str):
            return "tea/coffee shop"
        else:
            return "none"  # Shouldn't happen if we generate properly

    # RULE 3: 45 minutes (0.75 hours)
    elif free_time == 0.75:
        if time_period == "breakfast":
            return "breakfast, tea/coffee shop"
        elif time_period == "lunch":
            return "lunch"
        elif time_period == "dinner":
            return "dinner"
        else:
            return "shopping"

    # RULE 4: 1.0, 1.5, 2.0 hours
    elif free_time in [1.0, 1.5, 2.0]:
        if time_period == "breakfast":
            return "breakfast"
        elif time_period == "lunch":
            return "lunch"
        elif time_period == "dinner":
            return "dinner"
        else:
            return "shopping"

    # RULE 5: 2.5, 3.0 hours
    elif free_time in [2.5, 3.0]:
        if time_period == "dinner":
            return "dinner, shopping"
        elif time_period == "lunch":
            return "lunch, shopping"
        elif is_film_time(time_str):
            return "watch film"
        else:
            return "visit beautiful place"

    # RULE 6: 2.75 hours
    elif free_time == 2.75:
        if time_period == "breakfast":
            return "breakfast, visit beautiful place"
        elif time_period == "lunch":
            return "lunch, visit beautiful place"
        else:
            return "visit beautiful place"

    # RULE 7: More than 3.0 hours
    elif free_time > 3.0:
        if is_film_time(time_str):
            return "watch film, visit beautiful place"
        else:
            return "visit beautiful place"

    return "none"


def generate_time_for_free_time(free_time):
    """Generate appropriate time for given free_time"""
    hour = random.randint(5, 22)  # 5 AM to 10 PM
    minute = random.choice([0, 15, 30, 45])

    # Adjust time based on rules
    if free_time == 0.5:  # Tea/coffee shop times
        time_options = [
            (6, random.randint(0, 59)),  # 6:00-7:00
            (random.randint(15, 17), random.randint(0, 59)),  # 15:00-18:00
            (22, random.randint(0, 59)),  # 22:00-23:00
            (random.randint(0, 4), random.randint(0, 59))  # 00:00-05:00
        ]
        hour, minute = random.choice(time_options)

    elif free_time == 0.75:  # 45 minutes
        if random.random() < 0.25:  # breakfast
            hour = random.randint(7, 8)
        elif random.random() < 0.5:  # lunch
            hour = random.randint(11, 14)
        elif random.random() < 0.75:  # dinner
            hour = random.randint(19, 21)
        else:  # shopping
            hour = random.choice([5, 9, 10, 15, 16, 17, 18, 22])

    elif free_time in [1.0, 1.5, 2.0]:
        if random.random() < 0.33:  # breakfast
            hour = random.randint(7, 8)
        elif random.random() < 0.66:  # lunch
            hour = random.randint(11, 14)
        else:  # dinner or shopping
            if random.random() < 0.5:
                hour = random.randint(19, 21)
            else:
                hour = random.choice([5, 6, 9, 10, 15, 16, 17, 18, 22])

    elif free_time in [2.5, 3.0]:
        rand_val = random.random()
        if rand_val < 0.25:  # dinner + shopping
            hour = random.randint(19, 21)
        elif rand_val < 0.5:  # lunch + shopping
            hour = random.randint(11, 14)
        elif rand_val < 0.75:  # film time
            return random.choice(film_arrival_times)
        else:  # visit beautiful place
            hour = random.choice([5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 22])

    elif free_time == 2.75:
        if random.random() < 0.33:  # breakfast + visit
            hour = random.randint(7, 8)
        elif random.random() < 0.66:  # lunch + visit
            hour = random.randint(11, 14)
        else:  # just visit
            hour = random.choice([5, 6, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22])

    elif free_time > 3.0:
        if random.random() < 0.3:  # film time
            return random.choice(film_arrival_times)
        else:  # visit beautiful place
            hour = random.randint(5, 22)

    # Format time as HH:MM
    return f"{hour:02d}:{minute:02d}"


# ------------------------------------------------------------
# 3. GENERATE DATASET
# ------------------------------------------------------------
def generate_dataset(num_rows=2000):
    """Generate the dataset with specified number of rows"""
    dataset = []
    free_time_options = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 2.5, 2.75, 3.0, 3.5, 4.0, 4.5, 5.0]

    for i in range(num_rows):
        # Select random station
        station_name, city = random.choice(stations)

        # Select free_time with weighted distribution
        free_time = random.choices(
            free_time_options,
            weights=[0.05, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.10, 0.05, 0.05, 0.025, 0.025]
        )[0]

        # Generate appropriate time
        time_str = generate_time_for_free_time(free_time)

        # Generate label based on rules
        label = generate_label(free_time, time_str)

        dataset.append({
            "free_time": free_time,
            "station_name": station_name,
            "time": time_str,
            "city": city,
            "label(s)": label
        })

    return dataset


# ------------------------------------------------------------
# 4. SAVE TO CSV
# ------------------------------------------------------------
def save_to_csv(dataset, filename="ev_charging_activities.csv"):
    """Save dataset to CSV file"""
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['free_time', 'station_name', 'time', 'city', 'label(s)']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for row in dataset:
            writer.writerow(row)

    print(f"✅ Dataset saved to {filename}")
    print(f"📊 Total rows: {len(dataset)}")
    print(f"📁 File ready for download")


# ------------------------------------------------------------
# 5. MAIN EXECUTION
# ------------------------------------------------------------
if __name__ == "__main__":
    print("🚗 Generating EV Charging Activities Dataset...")
    print("📝 Rules applied:")
    print("   1. <0.25h: none")
    print("   2. 0.5h: tea/coffee shop (specific times)")
    print("   3. 0.75h: breakfast+tea/coffee, lunch, dinner, or shopping")
    print("   4. 1.0-2.0h: breakfast, lunch, dinner, or shopping")
    print("   5. 2.5-3.0h: dinner+shopping, lunch+shopping, watch film, or visit place")
    print("   6. 2.75h: breakfast+visit, lunch+visit, or visit")
    print("   7. >3.0h: watch film+visit or visit")
    print("")

    # Generate dataset
    dataset = generate_dataset(2000)

    # Save to CSV
    save_to_csv(dataset, "ml_model/ev_charging_dataset_2000_rules_applied.csv")

    # Show sample
    print("\n📋 Sample rows:")
    for i in range(5):
        row = dataset[i]
        print(
            f"Row {i + 1}: {row['free_time']}h at {row['station_name']}, {row['time']}, {row['city']} → {row['label(s)']}")