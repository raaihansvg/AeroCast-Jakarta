from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
import requests
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  


MODEL_PATH = os.path.join(os.path.dirname(__file__), "xgbModel.pkl")
model = None
try:
    model = joblib.load(MODEL_PATH)
    print("model berhasil bos")
except Exception as e:
    print(f"model nya mana mpruy: {e}")

COLUMNS_ORDER = [
    'is_holiday_nasional', 'is_weekend', 'is_off_day', 'jumlah_penduduk',
    'pm10', 'pm25', 'so2', 'co', 'o3', 'no2', 'stasiun',
    'tahun', 'bulan', 'hari', 'pm25_avail',
    'temp_mean', 'precip_sum', 'precip_hours', 'wind_speed_mean',
    'radiation_sum', 'humidity_mean'
]

WAQI_TOKEN = "waqi token"

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})

@app.route("/api/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model tidak tersedia. Pastikan xgbModel.pkl ada di folder yang sama."}), 500

    data = request.get_json()
    if not data:
        return jsonify({"error": "Data tidak valid."}), 400

    try:
        input_df = pd.DataFrame([data], columns=COLUMNS_ORDER)
        predicted_class = int(model.predict(input_df)[0])
        try:
            proba = model.predict_proba(input_df)[0].tolist()
        except Exception:
            proba = [0.0, 0.0, 0.0, 0.0]
            proba[predicted_class] = 1.0

        return jsonify({
            "predicted_class": predicted_class,
            "probabilities": proba
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/realtime", methods=["GET"])
def realtime():
    stasiun = request.args.get("stasiun", "DKI1")

    url = f"https://api.waqi.info/feed/jakarta/?token={WAQI_TOKEN}"
    try:
        res = requests.get(url, timeout=10)
        res_json = res.json()
        if res_json.get("status") != "ok":
            return jsonify({"error": "Gagal mengambil data WAQI."}), 502

        data = res_json["data"]
        iaqi = data.get("iaqi", {})
        today = datetime.today()
        is_weekend = 1 if today.weekday() >= 5 else 0

        result = {
            "station_name": data.get("city", {}).get("name", "Jakarta"),
            "time": data.get("time", {}).get("s", ""),
            "inputs": {
                "is_holiday_nasional": 0,
                "is_weekend": is_weekend,
                "is_off_day": is_weekend,
                "jumlah_penduduk": 10562088,
                "pm10": float(iaqi.get("pm10", {}).get("v", 48.0)),
                "pm25": float(iaqi.get("pm25", {}).get("v", 32.0)),
                "so2": float(iaqi.get("so2", {}).get("v", 18.0)),
                "co": float(iaqi.get("co", {}).get("v", 10.0)),
                "o3": float(iaqi.get("o3", {}).get("v", 42.0)),
                "no2": float(iaqi.get("no2", {}).get("v", 16.0)),
                "stasiun": stasiun,  # <-- pakai stasiun dari user
                "tahun": today.year,
                "bulan": today.month,
                "hari": today.day,
                "pm25_avail": 1,
                "temp_mean": float(iaqi.get("t", {}).get("v", 28.2)),
                "precip_sum": 0.0,
                "precip_hours": 0.0,
                "wind_speed_mean": float(iaqi.get("w", {}).get("v", 2.2)),
                "radiation_sum": 15.0,
                "humidity_mean": float(iaqi.get("h", {}).get("v", 75.0)),
            }
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)