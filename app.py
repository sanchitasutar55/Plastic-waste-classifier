from flask import Flask, render_template, request, jsonify, send_file
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array

import numpy as np
import os
import json
import csv

from io import StringIO, BytesIO
from datetime import datetime
from werkzeug.utils import secure_filename


# ==========================================
# Create Flask App
# ==========================================

app = Flask(__name__)


# ==========================================
# Paths
# ==========================================

UPLOAD_FOLDER = "uploads"

MODEL_PATH = "model/plastic_classifier.keras"

HISTORY_FILE = "history/predictions.json"


# ==========================================
# Create Required Folders
# ==========================================

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

os.makedirs("history", exist_ok=True)


# ==========================================
# Load AI Model
# ==========================================

model = load_model(MODEL_PATH)

print("AI model loaded successfully!")


# ==========================================
# Home Page
# ==========================================

@app.route("/")
def home():

    return render_template("index.html")


# ==========================================
# Predict Plastic Waste
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:

        return jsonify({
            "success": False,
            "message": "No image uploaded"
        })


    file = request.files["image"]


    if file.filename == "":

        return jsonify({
            "success": False,
            "message": "No image selected"
        })


    # Secure filename

    filename = secure_filename(
        file.filename
    )


    # Save image

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(filepath)


    # ======================================
    # Prepare Image
    # ======================================

    image = load_img(
        filepath,
        target_size=(224, 224)
    )


    image_array = img_to_array(image)

    image_array = image_array / 255.0


    image_array = np.expand_dims(
        image_array,
        axis=0
    )


    # ======================================
    # AI Prediction
    # ======================================

    prediction = model.predict(
        image_array,
        verbose=0
    )


    probability = float(
        prediction[0][0]
    )


    # ======================================
    # Determine Result
    # ======================================

    if probability >= 0.5:

        result = "Plastic Waste Detected"

        confidence_value = probability

    else:

        result = "Non-Plastic Waste"

        confidence_value = 1 - probability


    confidence_percent = round(
        confidence_value * 100,
        2
    )


    # ======================================
    # Load Existing History
    # ======================================

    history_data = []


    if os.path.exists(HISTORY_FILE):

        try:

            with open(
                HISTORY_FILE,
                "r"
            ) as history_file:

                history_data = json.load(
                    history_file
                )

        except:

            history_data = []


    # ======================================
    # Add Prediction to History
    # ======================================

    history_data.append({

        "filename": filename,

        "prediction": result,

        "confidence": confidence_percent,

        "time": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

    })


    # ======================================
    # Save History
    # ======================================

    with open(
        HISTORY_FILE,
        "w"
    ) as history_file:

        json.dump(
            history_data,
            history_file,
            indent=4
        )


    # ======================================
    # Send Result
    # ======================================

    return jsonify({

        "success": True,

        "result": result,

        "confidence": confidence_percent

    })


# ==========================================
# Get Prediction History
# ==========================================

@app.route("/history", methods=["GET"])
def get_history():

    history_data = []


    if os.path.exists(HISTORY_FILE):

        try:

            with open(
                HISTORY_FILE,
                "r"
            ) as history_file:

                history_data = json.load(
                    history_file
                )

        except:

            history_data = []


    return jsonify({

        "success": True,

        "history": history_data

    })


# ==========================================
# Clear Prediction History
# ==========================================

@app.route("/clear-history", methods=["POST"])
def clear_history():

    try:

        with open(
            HISTORY_FILE,
            "w"
        ) as history_file:

            json.dump(
                [],
                history_file
            )


        return jsonify({

            "success": True,

            "message":
                "Prediction history cleared"

        })


    except Exception as error:

        return jsonify({

            "success": False,

            "message": str(error)

        })


# ==========================================
# Export Prediction History
# ==========================================

@app.route("/export-history", methods=["GET"])
def export_history():

    history_data = []

    if os.path.exists(HISTORY_FILE):

        try:

            with open(
                HISTORY_FILE,
                "r"
            ) as history_file:

                history_data = json.load(
                    history_file
                )

        except:

            history_data = []


    # Create CSV in text memory
    output = StringIO()

    writer = csv.writer(output)


    # CSV headings
    writer.writerow([
        "File Name",
        "Prediction",
        "Confidence",
        "Time"
    ])


    # Add records
    for item in history_data:

        writer.writerow([
            item.get("filename", ""),
            item.get("prediction", ""),
            item.get("confidence", ""),
            item.get("time", "")
        ])


    # Convert CSV text to binary
    csv_data = output.getvalue().encode("utf-8")

    csv_file = BytesIO(csv_data)

    csv_file.seek(0)


    return send_file(
        csv_file,
        mimetype="text/csv",
        as_attachment=True,
        download_name="prediction_history.csv"
    )

# ==========================================
# Dashboard Statistics
# ==========================================

@app.route("/statistics", methods=["GET"])
def statistics():

    history_data = []


    # Load history

    if os.path.exists(HISTORY_FILE):

        try:

            with open(
                HISTORY_FILE,
                "r"
            ) as history_file:

                history_data = json.load(
                    history_file
                )

        except:

            history_data = []


    # ======================================
    # Calculate Statistics
    # ======================================

    total_predictions = len(
        history_data
    )


    plastic_count = 0

    non_plastic_count = 0

    total_confidence = 0


    for item in history_data:

        prediction = item.get(
            "prediction",
            ""
        )


        confidence_value = float(
            item.get(
                "confidence",
                0
            )
        )


        total_confidence += \
            confidence_value


        if prediction == \
                "Plastic Waste Detected":

            plastic_count += 1


        elif prediction == \
                "Non-Plastic Waste":

            non_plastic_count += 1


    # ======================================
    # Average Confidence
    # ======================================

    if total_predictions > 0:

        average_confidence = round(
            total_confidence /
            total_predictions,
            2
        )

    else:

        average_confidence = 0


    # ======================================
    # Send Statistics
    # ======================================

    return jsonify({

        "success": True,

        "total_predictions":
            total_predictions,

        "plastic_count":
            plastic_count,

        "non_plastic_count":
            non_plastic_count,

        "average_confidence":
            average_confidence

    })


# ==========================================
# Run Flask Application
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True
    )