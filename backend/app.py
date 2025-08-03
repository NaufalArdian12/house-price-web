from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model saat server dijalankan
model = joblib.load('model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # contoh fitur input dari user (ubah sesuai fitur yang kamu pake)
    luas_tanah = data.get('luas_tanah')
    jumlah_kamar = data.get('jumlah_kamar')
    lokasi = data.get('lokasi')  # kalau lokasi kategorikal, nanti kita encode dulu

    # susun dalam bentuk array 2D [ [x1, x2, ...] ]
    fitur = np.array([[luas_tanah, jumlah_kamar, lokasi]])

    hasil = model.predict(fitur)[0]

    return jsonify({
        'prediction': float(hasil)
    })

if __name__ == '__main__':
    app.run(debug=True)
