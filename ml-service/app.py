# app.py - Fixed version
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uvicorn
from datetime import datetime

# Import our route planner
from enhanced_ev_planner import EnhancedEVPlanner

app = FastAPI(
    title="Sri Lanka EV Route Planner",
    description="Find routes with charging stations",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route planner instance
planner = EnhancedEVPlanner()

# Static files directory
os.makedirs("static", exist_ok=True)
os.makedirs("maps", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


class RouteRequest(BaseModel):
    start: str
    end: str


class RouteResponse(BaseModel):
    success: bool
    routes: list = None
    error: str = None
    map_file: str = None
    charging_stations_count: int = 0


@app.get("/")
async def root():
    """Home Page"""
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sri Lanka EV Route Planner</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }

            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                overflow: hidden;
            }

            .header {
                background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
                color: white;
                padding: 25px;
                text-align: center;
            }

            .header h1 {
                font-size: 2.2em;
                margin-bottom: 10px;
            }

            .content {
                padding: 25px;
            }

            .form-group {
                margin-bottom: 20px;
            }

            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: #2c3e50;
            }

            select {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
            }

            select:focus {
                border-color: #3498db;
                outline: none;
            }

            button {
                width: 100%;
                padding: 15px;
                background: #e74c3c;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1.1em;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.3s;
            }

            button:hover {
                background: #c0392b;
            }

            .result {
                margin-top: 20px;
                padding: 20px;
                border-radius: 10px;
                display: none;
            }

            .success {
                background: #d4edda;
                border: 2px solid #c3e6cb;
                color: #155724;
            }

            .error {
                background: #f8d7da;
                border: 2px solid #f5c6cb;
                color: #721c24;
            }

            .loading {
                text-align: center;
                padding: 20px;
                display: none;
            }

            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .route-info {
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin: 10px 0;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            .map-button {
                display: inline-block;
                background: #3498db;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin: 10px 5px;
                transition: background 0.3s;
            }

            .map-button:hover {
                background: #2980b9;
            }

            .legend {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
            }

            .legend-item {
                display: flex;
                align-items: center;
                margin: 5px 0;
            }

            .legend-color {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                margin-right: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Sri Lanka EV Route Planner</h1>
                <p>Find routes with charging stations</p>
            </div>

            <div class="content">
                <form id="routeForm">
                    <div class="form-group">
                        <label for="start">Start Location:</label>
                        <select id="start" required>
                            <option value="">Select start city...</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="end">Destination:</label>
                        <select id="end" required>
                            <option value="">Select destination...</option>
                        </select>
                    </div>

                    <div class="legend">
                        <h4>Map Legend:</h4>
                        <div class="legend-item">
                            <div class="legend-color" style="background: green;"></div>
                            <span>Start Location</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: red;"></div>
                            <span>Destination</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: orange;"></div>
                            <span>Charging Stations on Route</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: blue;"></div>
                            <span>Other Charging Stations</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #3498db;"></div>
                            <span>Route 1 (Shortest)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #e74c3c;"></div>
                            <span>Route 2</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background: #2ecc71;"></div>
                            <span>Route 3</span>
                        </div>
                    </div>

                    <button type="submit">Find Routes</button>
                </form>

                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <div>Finding routes...</div>
                </div>

                <div id="result" class="result"></div>
            </div>
        </div>

        <script>
            // City list
            const cities = [
                'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura',
                'Matara', 'Negombo', 'Kurunegala', 'Ratnapura',
                'Badulla', 'Nuwara Eliya', 'Trincomalee', 'Batticaloa',
                'Puttalam', 'Kalutara', 'Gampaha', 'Kegalle', 'Polonnaruwa',
                'Hambantota', 'Ampara', 'Monaragala', 'Vavuniya', 
                'Mannar', 'Kilinochchi', 'Mullaitivu'
            ];

            // Populate Dropdowns
            function populateCities() {
                const startSelect = document.getElementById('start');
                const endSelect = document.getElementById('end');

                cities.forEach(city => {
                    startSelect.innerHTML += `<option value="${city}">${city}</option>`;
                    endSelect.innerHTML += `<option value="${city}">${city}</option>`;
                });
            }

            // Form submission
            document.getElementById('routeForm').addEventListener('submit', async function(e) {
                e.preventDefault();

                const start = document.getElementById('start').value;
                const end = document.getElementById('end').value;

                const resultDiv = document.getElementById('result');
                const loadingDiv = document.getElementById('loading');

                // Show loading display
                loadingDiv.style.display = 'block';
                resultDiv.style.display = 'none';
                resultDiv.className = 'result';
                resultDiv.innerHTML = '';

                try {
                    const response = await fetch('/api/route', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            start: start,
                            end: end
                        })
                    });

                    const data = await response.json();
                    loadingDiv.style.display = 'none';
                    resultDiv.style.display = 'block';

                    if (data.success) {
                        resultDiv.className = 'result success';
                        displayRouteResults(data, resultDiv);
                    } else {
                        resultDiv.className = 'result error';
                        resultDiv.innerHTML = `
                            <h3>Error</h3>
                            <p>${data.error}</p>
                        `;
                    }
                } catch (error) {
                    loadingDiv.style.display = 'none';
                    resultDiv.style.display = 'block';
                    resultDiv.className = 'result error';
                    resultDiv.innerHTML = `
                        <h3>Connection Error</h3>
                        <p>Service is unreachable. Please check your internet connection.</p>
                    `;
                }
            });

            // Display route results
            function displayRouteResults(data, resultDiv) {
                let html = `<h3>Routes Found!</h3>`;

                // Route information
                html += `<div class="route-info">`;
                html += `<h4>Route Summary</h4>`;
                html += `<p><strong>From:</strong> ${data.start_city}</p>`;
                html += `<p><strong>To:</strong> ${data.end_city}</p>`;
                html += `<p><strong>Total Charging Stations:</strong> ${data.charging_stations_count}</p>`;
                html += `</div>`;

                // Routes list
                html += `<div class="route-info">`;
                html += `<h4>Route Alternatives</h4>`;

                data.routes.forEach((route, index) => {
                    const colors = ['#3498db', '#e74c3c', '#2ecc71'];
                    const routeNumber = index + 1;
                    const isShortest = index === 0;

                    html += `
                        <div style="border-left: 4px solid ${colors[index]}; padding-left: 15px; margin: 10px 0;">
                            <h5>Route ${routeNumber} ${isShortest ? '(Shortest)' : ''}</h5>
                            <p><strong>Distance:</strong> ${route.distance.toFixed(1)} km</p>
                            <p><strong>Duration:</strong> ${route.duration.toFixed(0)} minutes</p>
                        </div>
                    `;
                });
                html += `</div>`;

                // Charging stations
                if (data.charging_stations && data.charging_stations.length > 0) {
                    html += `<div class="route-info">`;
                    html += `<h4>Charging Stations on Route</h4>`;

                    data.charging_stations.forEach(station => {
                        html += `
                            <div style="margin: 8px 0; padding: 8px; background: #fff3cd; border-radius: 5px;">
                                <strong>${station.name}</strong><br>
                                <small>Type: ${station.type} | Power: ${station.power}</small><br>
                                <small>Distance from route: ${station.distance_to_route} km</small>
                            </div>
                        `;
                    });
                    html += `</div>`;
                }

                // Map button
                if (data.map_file) {
                    html += `
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="/map/${data.map_file}" target="_blank" class="map-button">
                                View Map
                            </a>
                            <a href="/api/download/${data.map_file}" class="map-button" style="background: #27ae60;">
                                Download Map
                            </a>
                        </div>
                    `;
                }

                resultDiv.innerHTML = html;
            }

            // Initialize when the page loads
            document.addEventListener('DOMContentLoaded', function() {
                populateCities();
            });
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


@app.post("/api/route")
async def calculate_route(request: RouteRequest):
    """Calculate routes between two cities"""
    try:
        print(f"Finding routes: {request.start} → {request.end}")

        # Get routes
        routes_data = planner.get_route_from_osrm(
            planner.cities[request.start],
            planner.cities[request.end],
            3
        )

        if not routes_data:
            return {
                "success": False,
                "error": "No routes found between these cities. Please try different cities."
            }

        # Find charging stations for the shortest route
        shortest_route_coords = routes_data[0]['coordinates']
        charging_stations = planner.find_charging_stations_near_route(shortest_route_coords)

        # Create map
        map_file = planner.create_route_with_charging_map(request.start, request.end)

        # Count total stations
        total_stations = sum(len(stations) for stations in planner.charging_stations.values())

        return {
            "success": True,
            "routes": routes_data,
            "map_file": map_file,
            "charging_stations_count": len(charging_stations),
            "total_stations_count": total_stations,  # Add total count
            "start_city": request.start,
            "end_city": request.end,
            "charging_stations": charging_stations
        }

    except Exception as e:
        print(f"Route Error: {e}")
        return {
            "success": False,
            "error": f"Route calculation error: {str(e)}"
        }

@app.get("/map/{filename}")
async def get_map_file(filename: str):
    """Serves the map files"""
    filepath = f"maps/{filename}"
    if os.path.exists(filepath):
        return FileResponse(filepath)
    raise HTTPException(status_code=404, detail="Map file not found")


@app.get("/api/download/{filename}")
async def download_map(filename: str):
    """Downloads the map"""
    filepath = f"maps/{filename}"
    if os.path.exists(filepath):
        return FileResponse(
            filepath,
            media_type='text/html',
            filename=f"EV_ROUTE_{filename}"
        )
    raise HTTPException(status_code=404, detail="Map file not found")


@app.get("/api/charging-stations")
async def get_all_charging_stations():
    """Get all charging stations"""
    try:
        all_stations = []
        for city_stations in planner.charging_stations.values():
            all_stations.extend(city_stations)

        return {
            "success": True,
            "total_stations": len(all_stations),
            "stations": all_stations
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "EV Route Planner",
        "timestamp": datetime.now().isoformat(),
        "charging_stations": sum(len(stations) for stations in planner.charging_stations.values()),
        "cities": len(planner.cities)
    }


if __name__ == "__main__":
    print("🚗 Sri Lanka EV Route Planner")
    print("🌐 Web Interface: http://localhost:8000/")
    print(f"⚡ Charging Stations: {sum(len(stations) for stations in planner.charging_stations.values())}")
    print("🏙️ Cities: 25 major cities")

    uvicorn.run(app, host="127.0.0.1", port=8000)