**♻️ Plastic Waste Classifier Using Computer Vision**

A computer vision-based web application that detects whether an image contains plastic waste. The application combines a TensorFlow/Keras deep learning model with a Flask backend and a responsive web interface.

---

📌 Project Overview

Plastic Waste Classifier is an AI-powered web application developed to classify waste images into Plastic and Non-Plastic categories.

Users can upload an image or capture an image using their device camera. The application processes the image, sends it to the Flask backend, and uses a trained deep learning model to generate a prediction and confidence percentage.

This project is developed as an educational and demonstration project for understanding Computer Vision, Machine Learning, Flask, and Web Development.

---

✨ Features

- 📤 Upload a waste image
- 📷 Capture an image using the device camera
- 🤖 Detect plastic waste using an AI model
- 📊 Display prediction result
- 🎯 Display prediction confidence percentage
- 🔄 Try another image
- 📝 Store prediction history
- 🗂️ View prediction history
- 🗑️ Clear prediction history
- 📥 Export prediction history as CSV
- 📈 Dashboard statistics
  - Total predictions
  - Plastic waste detected
  - Non-plastic predictions
  - Average confidence
- 📱 Responsive interface for desktop and mobile devices

---

🛠️ Technologies Used

Frontend

- HTML5
- CSS3
- JavaScript

Backend

- Python
- Flask

Machine Learning

- TensorFlow
- Keras
- MobileNetV2
- NumPy
- Pillow

Development Tools

- Visual Studio Code
- Python Virtual Environment
- ChatGPT for development assistance

---

📂 Project Structure

plastic-waste-classifier/
│
├── app.py
├── train_model.py
├── requirements.txt
│
├── model/
│   └── plastic_classifier.keras
│
├── dataset/
│   ├── plastic/
│   └── non_plastic/
│
├── uploads/
│
├── history/
│   └── predictions.json
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js

---

🔄 How the Application Works

User
  ↓
Upload / Capture Image
  ↓
Web Interface
  ↓
Flask Backend
  ↓
Image Preprocessing
  ↓
TensorFlow / Keras Model
  ↓
Prediction
  ↓
Confidence Calculation
  ↓
Result Display
  ↓
Prediction History

Workflow

1. The user uploads an image or captures one using the camera.
2. The image is sent to the Flask backend.
3. The backend preprocesses the image.
4. The trained Keras model analyzes the image.
5. The model predicts the waste category.
6. The confidence percentage is calculated.
7. The prediction is displayed to the user.
8. The prediction is stored in the history file.
9. Dashboard statistics are updated.
10. The user can export prediction history as a CSV file.

---

⚙️ Installation & Setup

1. Install Python

Python 3.12 is recommended for this project.

Check your Python version:

python --version

---

2. Open the Project

Open the project folder in Visual Studio Code.

cd C:\plastic-waste-classifier

---

3. Create a Virtual Environment

Run:

py -3.12 -m venv venv

---

4. Activate the Virtual Environment

For Windows Command Prompt:

venv\Scripts\activate.bat

After activation, you should see:

(venv)

---

5. Install Dependencies

Install all required packages:

pip install -r requirements.txt

If the "requirements.txt" file is not available, install the main packages:

pip install flask tensorflow numpy pillow

---

🧠 Model Training

The training dataset should be organized as:

dataset/
├── plastic/
└── non_plastic/

Run the training script:

python train_model.py

After successful training, the model will be saved as:

model/plastic_classifier.keras

---

▶️ Run the Application

Make sure the virtual environment is activated.

Run:

python app.py

The Flask server will provide a local address similar to:

http://127.0.0.1:5000

Open this address in your web browser.

---

🔌 API Endpoints

Method| Endpoint| Description
GET| "/"| Opens the web application
POST| "/predict"| Predicts plastic/non-plastic waste
GET| "/history"| Retrieves prediction history
POST| "/clear-history"| Clears prediction history
GET| "/export-history"| Downloads history as CSV
GET| "/statistics"| Retrieves dashboard statistics

---

📊 Example Prediction

After uploading an image, the application may display:

Prediction Result

Plastic Waste Detected

Confidence: 85.32%

«The actual prediction and confidence depend on the trained model and the input image.»

---

📝 Prediction History

The application stores prediction information including:

- File name
- Prediction result
- Confidence percentage
- Date and time

The history is stored in:

history/predictions.json

---

📥 Export Prediction History

Users can select:

📥 Export History

The application generates:

prediction_history.csv

The CSV file contains:

File Name
Prediction
Confidence
Time

---

✅ Testing Checklist

- [x] Image upload
- [x] Camera capture
- [x] Image preview
- [x] Plastic waste prediction
- [x] Confidence display
- [x] Try another image
- [x] Prediction history
- [x] Clear history
- [x] Export history
- [x] Dashboard statistics
- [x] Responsive interface

---

⚠️ Limitations

This project is developed as an educational and demonstration prototype.

The model's performance depends on:

- Dataset size
- Dataset quality
- Image variety
- Training quality
- Input image quality

A small or limited dataset may result in unreliable predictions and confidence values.

For real-world applications, the model should be trained and evaluated using a larger and more diverse dataset.

---

🚀 Future Enhancements

Possible future improvements include:

- Use a larger and more diverse dataset
- Improve model accuracy
- Apply data augmentation
- Add model evaluation metrics
- Add more waste categories
  - Paper
  - Glass
  - Metal
  - Organic waste
- Add user authentication
- Store prediction history in a database
- Deploy the application online
- Add charts and visual analytics
- Improve image preprocessing
- Optimize the trained model

---

🎯 Project Objectives

The main objectives of this project are:

1. To develop a computer vision-based waste classification system.
2. To identify plastic waste from images.
3. To provide prediction confidence to users.
4. To demonstrate integration of AI with a web application.
5. To maintain prediction history.
6. To provide a simple and responsive user interface.

---

📚 Learning Outcomes

Through this project, the following concepts are demonstrated:

- Python programming
- Flask web development
- HTML, CSS and JavaScript
- Image processing
- Computer vision
- TensorFlow/Keras
- Deep learning
- Model training
- REST API integration
- JSON data handling
- CSV export
- Frontend-backend integration

---

🔐 Project Scope

This project focuses on classifying images into two categories:

Plastic Waste
       │
       ├── Plastic
       │
       └── Non-Plastic

The current version is intended for academic learning, project demonstration, and prototype development.

---

🏁 Conclusion

The Plastic Waste Classifier Using Computer Vision is a web-based AI prototype that combines a deep learning image classification model with a Flask backend and responsive frontend.

The application provides image upload and camera capture, AI-based prediction, confidence display, prediction history, CSV export, and dashboard statistics in a single platform.

This project demonstrates how Artificial Intelligence, Computer Vision, Machine Learning, and Web Development can be integrated to create a practical waste classification application.

---

👩‍💻 Author

Sanchita Sutar

Developed using:

- Python
- Flask
- TensorFlow/Keras
- HTML
- CSS
- JavaScript
- Visual Studio Code

---

📄 License

This project is created for educational purposes.
