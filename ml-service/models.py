# ml-service/models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Station(db.Model):
    __tablename__ = "station"

    station_id = db.Column(db.String, primary_key=True)  # UUID stored as text
    name       = db.Column(db.String)
    address    = db.Column(db.String)
    latitude   = db.Column(db.Float)
    longitude  = db.Column(db.Float)

    chargers = db.relationship("Charger", backref="station", lazy=True)

    def to_dict_basic(self):
        return {
            "id": self.station_id,
            "name": self.name,
            "address": self.address,
            "lat": self.latitude,
            "lon": self.longitude,
            "chargers": len(self.chargers),
        }


class Charger(db.Model):
    __tablename__ = "charger"

    charger_id = db.Column(db.String, primary_key=True)  # UUID stored as text
    station_id = db.Column(db.String, db.ForeignKey("station.station_id"))
    type       = db.Column(db.String)     # e.g., "CCS", "CHAdeMO", "Type 2"
    power_kw   = db.Column(db.Float)      # e.g., 7, 22, 50, 120
    status     = db.Column(db.String)     # e.g., "Available", "Busy", "Offline"

    def to_dict_basic(self):
        return {
            "id": self.charger_id,
            "station_id": self.station_id,
            "type": self.type,
            "power_kw": self.power_kw,
            "status": self.status,
        }
