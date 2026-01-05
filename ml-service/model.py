# model.py
from geopy.distance import geodesic

class NoBookingPredictor:
    """
    Simple heuristic predictor: ranks destinations by estimated travel time.
    Uses straight-line distance / avg_speed_kmph to approximate seconds.
    Replace with your real ML or OSRM table API when ready.
    """

    def __init__(self, avg_speed_kmph=50.0):
        self.speed = max(10.0, float(avg_speed_kmph))  # prevent zero/too small

    def get_best_destination(self, origin, destinations):
        """
        origin: (lat, lon)
        destinations: [(lat, lon), ...]
        returns: [{destination:(lat,lon), travel_time: seconds}, ...] sorted asc
        """
        results = []
        for d in destinations:
            km = geodesic(origin, d).km
            hours = km / self.speed
            seconds = hours * 3600.0
            results.append({"destination": d, "travel_time": seconds})
        results.sort(key=lambda x: x["travel_time"])
        return results
