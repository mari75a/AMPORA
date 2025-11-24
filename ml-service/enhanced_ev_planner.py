# enhanced_ev_planner.py - Fixed version with all charging stations
import requests
import folium
import os
from geopy.distance import geodesic
from datetime import datetime


class EnhancedEVPlanner:
    def __init__(self):
        self.osrm_url = "http://router.project-osrm.org/route/v1/driving/"

        # Major cities in Sri Lanka
        self.cities = {
            'Colombo': (6.9271, 79.8612),
            'Kandy': (7.2906, 80.6337),
            'Galle': (6.0535, 80.2210),
            'Jaffna': (9.6615, 80.0255),
            'Anuradhapura': (8.3114, 80.4037),
            'Matara': (5.9480, 80.5353),
            'Trincomalee': (8.5874, 81.2152),
            'Negombo': (7.2086, 79.8357),
            'Kurunegala': (7.4865, 80.3649),
            'Ratnapura': (6.6804, 80.4026),
            'Badulla': (6.9895, 81.0557),
            'Nuwara Eliya': (6.9497, 80.7891),
            'Batticaloa': (7.7167, 81.7000),
            'Puttalam': (8.0333, 79.8333),
            'Kalutara': (6.5833, 79.9667),
            'Gampaha': (7.0917, 79.9997),
            'Kegalle': (7.2533, 80.3464),
            'Polonnaruwa': (7.9329, 81.0080),
            'Hambantota': (6.1248, 81.1185),
            'Ampara': (7.2975, 81.6820),
            'Monaragala': (6.8728, 81.3507),
            'Vavuniya': (8.7522, 80.4983),
            'Mannar': (8.9776, 79.9093),
            'Kilinochchi': (9.3802, 80.3990),
            'Mullaitivu': (9.2671, 80.8142)
        }

        # Charging stations - More comprehensive
        self.charging_stations = {
            'Colombo': [
                {'name': 'Colombo Central Charging Station', 'type': 'fast', 'power': '50kW', 'operator': 'CEB',
                 'lat': 6.9271, 'lon': 79.8612, 'city': 'Colombo'},
                {'name': 'Galle Road Charging Station', 'type': 'fast', 'power': '50kW',
                 'operator': 'Lanka Electricity',
                 'lat': 6.9105, 'lon': 79.8708, 'city': 'Colombo'},
                {'name': 'Bambalapitiya Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 6.9002, 'lon': 79.8594, 'city': 'Colombo'},
                {'name': 'Nugegoda Charging Station', 'type': 'fast', 'power': '50kW', 'operator': 'Dialog',
                 'lat': 6.8637, 'lon': 79.8996, 'city': 'Colombo'}
            ],
            'Kandy': [
                {'name': 'Kandy Central Charging Station', 'type': 'fast', 'power': '50kW', 'operator': 'CEB',
                 'lat': 7.2906, 'lon': 80.6337, 'city': 'Kandy'},
                {'name': 'Peradeniya University Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 7.2547, 'lon': 80.5972, 'city': 'Kandy'}
            ],
            'Galle': [
                {'name': 'Galle Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 6.0535, 'lon': 80.2210, 'city': 'Galle'},
                {'name': 'Hikkaduwa Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 6.0923, 'lon': 80.1662, 'city': 'Galle'}
            ],
            'Kurunegala': [
                {'name': 'Kurunegala Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 7.4865, 'lon': 80.3649, 'city': 'Kurunegala'}
            ],
            'Ratnapura': [
                {'name': 'Ratnapura Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 6.6804, 'lon': 80.4026, 'city': 'Ratnapura'}
            ],
            'Negombo': [
                {'name': 'Negombo Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 7.2086, 'lon': 79.8357, 'city': 'Negombo'}
            ],
            'Matara': [
                {'name': 'Matara Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 5.9480, 'lon': 80.5353, 'city': 'Matara'}
            ],
            'Anuradhapura': [
                {'name': 'Anuradhapura Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 8.3114, 'lon': 80.4037, 'city': 'Anuradhapura'}
            ],
            'Jaffna': [
                {'name': 'Jaffna Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 9.6615, 'lon': 80.0255, 'city': 'Jaffna'}
            ],
            'Badulla': [
                {'name': 'Badulla Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 6.9895, 'lon': 81.0557, 'city': 'Badulla'}
            ],
            'Nuwara Eliya': [
                {'name': 'Nuwara Eliya Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 6.9497, 'lon': 80.7891, 'city': 'Nuwara Eliya'}
            ],
            'Trincomalee': [
                {'name': 'Trincomalee Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 8.5874, 'lon': 81.2152, 'city': 'Trincomalee'}
            ],
            'Batticaloa': [
                {'name': 'Batticaloa Central Charging Station', 'type': 'medium', 'power': '22kW', 'operator': 'CEB',
                 'lat': 7.7167, 'lon': 81.7000, 'city': 'Batticaloa'}
            ]
        }

    def get_route_from_osrm(self, start_coords, end_coords, alternatives=3):
        """Get multiple route alternatives from OSRM API"""
        try:
            waypoints = f"{start_coords[1]},{start_coords[0]};{end_coords[1]},{end_coords[0]}"

            url = f"{self.osrm_url}{waypoints}"
            params = {
                "overview": "full",
                "geometries": "geojson",
                "steps": "true",
                "alternatives": "true"
            }

            print(f"🔗 Finding {alternatives} route alternatives...")
            response = requests.get(url, params=params, timeout=15)

            if response.status_code == 200:
                data = response.json()
                if data['code'] == 'Ok' and len(data['routes']) > 0:
                    routes = []
                    max_routes = min(alternatives, len(data['routes']))

                    print(f"✅ Found {len(data['routes'])} route(s)")

                    for i in range(max_routes):
                        route = data['routes'][i]

                        coordinates = [[coord[1], coord[0]] for coord in route['geometry']['coordinates']]

                        route_info = {
                            'route_number': i + 1,
                            'coordinates': coordinates,
                            'distance': route['distance'] / 1000,
                            'duration': route['duration'] / 60,
                        }

                        routes.append(route_info)
                        print(f"   Route {i + 1}: {route_info['distance']:.1f} km, {route_info['duration']:.1f} min")

                    routes.sort(key=lambda x: x['distance'])
                    return routes

            print("❌ Could not fetch routes from OSRM")
            return None

        except Exception as e:
            print(f"❌ OSRM error: {e}")
            return None

    def find_charging_stations_near_route(self, route_coords, max_distance_km=10):
        """Find charging stations near the route"""
        nearby_stations = []

        for city, stations in self.charging_stations.items():
            for station in stations:
                station_coords = (station['lat'], station['lon'])

                min_distance = float('inf')
                # Check sample points along the route for performance
                for i in range(0, len(route_coords), max(1, len(route_coords) // 50)):
                    route_point = route_coords[i]
                    point_coords = (route_point[0], route_point[1])
                    try:
                        distance = geodesic(station_coords, point_coords).kilometers
                        if distance < min_distance:
                            min_distance = distance
                    except:
                        continue

                if min_distance <= max_distance_km:
                    # Create a copy of the station with distance info
                    station_with_distance = station.copy()
                    station_with_distance['distance_to_route'] = round(min_distance, 2)
                    nearby_stations.append(station_with_distance)

        return nearby_stations

    # enhanced_ev_planner.py - Fixed version with ALL charging stations displayed
    def create_route_with_charging_map(self, start_city, end_city):
        """Create map with routes and ALL charging stations - FIXED VERSION"""
        if start_city not in self.cities or end_city not in self.cities:
            print("❌ Invalid city names")
            return None

        print(f"🗺️ Creating routes from {start_city} to {end_city}")

        # Get route alternatives
        start_coords = self.cities[start_city]
        end_coords = self.cities[end_city]

        routes_data = self.get_route_from_osrm(start_coords, end_coords, 3)

        if not routes_data:
            print("❌ No routes found")
            return None

        # Create map
        center_lat = (start_coords[0] + end_coords[0]) / 2
        center_lon = (start_coords[1] + end_coords[1]) / 2

        m = folium.Map(
            location=[center_lat, center_lon],
            zoom_start=8,
            tiles='OpenStreetMap'
        )

        # Colors for different routes
        route_colors = ['#3498db', '#e74c3c', '#2ecc71']

        # Draw all routes
        on_route_stations = set()

        for i, route in enumerate(routes_data):
            route_coords = route.get('coordinates', [])

            if len(route_coords) > 1:
                color = route_colors[i % len(route_colors)]
                folium.PolyLine(
                    route_coords,
                    color=color,
                    weight=6,
                    opacity=0.8,
                    popup=f"Route {i + 1}: {route.get('distance', 0):.1f} km, {route.get('duration', 0):.1f} min",
                    tooltip=f"Route {i + 1} - {route.get('distance', 0):.1f} km"
                ).add_to(m)

            # Find charging stations for shortest route only (for on-route classification)
            if i == 0:  # Only for shortest route
                charging_stations = self.find_charging_stations_near_route(route_coords)
                for station in charging_stations:
                    # Use tuple of (lat, lon) as unique identifier
                    on_route_stations.add((station['lat'], station['lon']))

        # Mark ALL charging stations - FIXED: Show ALL stations regardless of route
        total_stations = 0
        stations_on_route = 0

        print(f"🔍 Marking ALL charging stations on map...")

        # First, collect ALL stations from all cities
        all_stations = []
        for city, stations in self.charging_stations.items():
            all_stations.extend(stations)

        print(f"📊 Total stations in database: {len(all_stations)}")

        # Now mark ALL stations on the map
        for station in all_stations:
            total_stations += 1
            station_coords = (station['lat'], station['lon'])
            is_on_route = station_coords in on_route_stations

            if is_on_route:
                stations_on_route += 1

            # Determine color and popup text
            color = 'orange' if is_on_route else 'blue'
            popup_text = f"🔌 <b>{station['name']}</b><br>City: {station['city']}<br>Type: {station['type']}<br>Power: {station['power']}<br>Operator: {station['operator']}"

            if is_on_route:
                # Find the actual distance for this station
                for nearby_station in self.find_charging_stations_near_route(routes_data[0]['coordinates']):
                    if (nearby_station['lat'] == station['lat'] and
                            nearby_station['lon'] == station['lon']):
                        popup_text += f"<br>Distance from route: {nearby_station.get('distance_to_route', 'N/A')} km"
                        break

            # Always add the marker to the map - NO CONDITIONS
            folium.Marker(
                [station['lat'], station['lon']],
                popup=folium.Popup(popup_text, max_width=300),
                icon=folium.Icon(color=color, icon='bolt', prefix='fa'),
                tooltip=f"{station['name']} ({'On Route' if is_on_route else 'Other'})"
            ).add_to(m)

        # Mark start and end points
        folium.Marker(
            start_coords,
            popup=folium.Popup(f"🚗 <b>Start: {start_city}</b>", max_width=200),
            icon=folium.Icon(color='green', icon='play', prefix='fa'),
            tooltip=f"Start: {start_city}"
        ).add_to(m)

        folium.Marker(
            end_coords,
            popup=folium.Popup(f"🏁 <b>Destination: {end_city}</b>", max_width=200),
            icon=folium.Icon(color='red', icon='flag-checkered', prefix='fa'),
            tooltip=f"Destination: {end_city}"
        ).add_to(m)

        # Create legend HTML
        legend_html = f'''
        <div style="position: fixed; top: 10px; left: 50px; z-index: 1000; background-color: white; padding: 10px; border: 2px solid grey; border-radius: 5px;">
            <h4>Routes: {start_city} → {end_city}</h4>
        '''

        for i, route in enumerate(routes_data):
            color_circle = '🔵' if i == 0 else '🔴' if i == 1 else '🟢'
            legend_html += f'<p>{color_circle} Route {i + 1} {"(Shortest)" if i == 0 else ""} - {route["distance"]:.1f} km</p>'

        legend_html += f'''
            <p>⚡ Charging Stations: {stations_on_route} on route</p>
            <p>⚡ Total Stations: {total_stations}</p>
            <p><small>Orange = On Route | Blue = Other Stations</small></p>
        </div>
        '''

        m.get_root().html.add_child(folium.Element(legend_html))

        # Save map
        os.makedirs("maps", exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        map_filename = f"route_{start_city}_to_{end_city}_{timestamp}.html"
        map_filepath = os.path.join("maps", map_filename)
        m.save(map_filepath)

        print(f"✅ Map created: {map_filepath}")
        print(f"📊 Stations: {stations_on_route} on route, {total_stations} total")
        return map_filename