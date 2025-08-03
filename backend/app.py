from flask import Flask, request, jsonify
from flask_cors import CORS        # <--- import
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)                          # <--- tambahkan ini

# Load model saat server dijalankan
model = joblib.load('model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    try:
        bedrooms = float(data.get('bedrooms'))
        bathrooms = float(data.get('bathrooms'))
        sqft_living = float(data.get('sqft_living'))
        sqft_lot = float(data.get('sqft_lot'))
        floors = float(data.get('floors'))
        waterfront = int(data.get('waterfront'))
        view = int(data.get('view'))
        condition = int(data.get('condition'))
        sqft_above = float(data.get('sqft_above'))
        sqft_basement = float(data.get('sqft_basement'))
        yr_built = int(data.get('yr_built'))

        fitur = np.array([[bedrooms, bathrooms, sqft_living, sqft_lot, floors,
                           waterfront, view, condition, sqft_above,
                           sqft_basement, yr_built]])

        prediction = model.predict(fitur)[0]

        return jsonify({"prediction": float(prediction)})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
