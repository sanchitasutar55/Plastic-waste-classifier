// ==========================================
// Plastic Waste Classifier
// ==========================================


// ==========================================
// HTML Elements
// ==========================================

const imageInput =
    document.getElementById("imageInput");


const preview =
    document.getElementById("preview");


const previewSection =
    document.getElementById("previewSection");


const cameraBtn =
    document.getElementById("cameraBtn");


const cameraSection =
    document.getElementById("cameraSection");


const video =
    document.getElementById("video");


const takePhotoBtn =
    document.getElementById("takePhotoBtn");


const closeCameraBtn =
    document.getElementById("closeCameraBtn");


const predictBtn =
    document.getElementById("predictBtn");


const resultSection =
    document.getElementById("resultSection");


const result =
    document.getElementById("result");


const confidence =
    document.getElementById("confidence");


const confidenceFill =
    document.getElementById("confidenceFill");


const tryAnotherBtn =
    document.getElementById("tryAnotherBtn");


const historyList =
    document.getElementById("historyList");


const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");


const exportHistoryBtn =
    document.getElementById("exportHistoryBtn");



// ==========================================
// Variables
// ==========================================

let selectedFile = null;

let cameraStream = null;



// ==========================================
// Upload Image
// ==========================================

imageInput.addEventListener(
    "change",
    function () {

        const file = this.files[0];


        if (!file) {

            return;

        }


        selectedFile = file;


        const imageURL =
            URL.createObjectURL(file);


        preview.src =
            imageURL;


        previewSection.style.display =
            "block";


        resultSection.style.display =
            "none";


        tryAnotherBtn.style.display =
            "none";


        confidenceFill.style.width =
            "0%";

    }
);



// ==========================================
// Open Camera
// ==========================================

cameraBtn.addEventListener(
    "click",
    async function () {

        try {

            cameraStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true
                });


            video.srcObject =
                cameraStream;


            cameraSection.style.display =
                "block";

        }

        catch (error) {

            console.error(error);


            alert(
                "Camera permission was not given."
            );

        }

    }
);



// ==========================================
// Take Photo
// ==========================================

takePhotoBtn.addEventListener(
    "click",
    function () {

        if (!video.videoWidth) {

            alert(
                "Camera is not ready yet."
            );

            return;

        }


        const canvas =
            document.createElement("canvas");


        canvas.width =
            video.videoWidth;


        canvas.height =
            video.videoHeight;


        const context =
            canvas.getContext("2d");


        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        canvas.toBlob(
            function (blob) {

                selectedFile =
                    new File(
                        [blob],
                        "camera-image.jpg",
                        {
                            type: "image/jpeg"
                        }
                    );


                preview.src =
                    URL.createObjectURL(blob);


                previewSection.style.display =
                    "block";


                resultSection.style.display =
                    "none";


                tryAnotherBtn.style.display =
                    "none";


                confidenceFill.style.width =
                    "0%";


                closeCamera();

            },
            "image/jpeg"
        );

    }
);



// ==========================================
// Close Camera
// ==========================================

closeCameraBtn.addEventListener(
    "click",
    function () {

        closeCamera();

    }
);


function closeCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );


        cameraStream = null;

    }


    video.srcObject =
        null;


    cameraSection.style.display =
        "none";

}



// ==========================================
// AI Prediction
// ==========================================

predictBtn.addEventListener(
    "click",
    async function () {

        if (!selectedFile) {

            alert(
                "Please upload or capture an image first."
            );

            return;

        }


        const formData =
            new FormData();


        formData.append(
            "image",
            selectedFile
        );


        resultSection.style.display =
            "block";


        result.innerText =
            "Predicting...";


        confidence.innerText =
            "Please wait...";


        confidenceFill.style.width =
            "0%";


        try {

            const response =
                await fetch(
                    "/predict",
                    {
                        method: "POST",

                        body: formData
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                result.innerText =
                    data.result;


                confidence.innerText =
                    "Confidence: " +
                    data.confidence +
                    "%";


                confidenceFill.style.width =
                    data.confidence +
                    "%";


                tryAnotherBtn.style.display =
                    "inline-block";


                // Refresh history

                loadHistory();


                // Refresh statistics

                loadStatistics();

            }

            else {

                result.innerText =
                    "-";


                confidence.innerText =
                    "Confidence: -";


                confidenceFill.style.width =
                    "0%";


                alert(
                    data.message
                );

            }

        }

        catch (error) {

            console.error(error);


            result.innerText =
                "-";


            confidence.innerText =
                "Confidence: -";


            confidenceFill.style.width =
                "0%";


            alert(
                "Prediction failed. Check that Flask server is running."
            );

        }

    }
);



// ==========================================
// Try Another Image
// ==========================================

tryAnotherBtn.addEventListener(
    "click",
    function () {

        imageInput.value =
            "";


        selectedFile =
            null;


        preview.src =
            "";


        previewSection.style.display =
            "none";


        resultSection.style.display =
            "none";


        tryAnotherBtn.style.display =
            "none";


        confidence.innerText =
            "Confidence: -";


        confidenceFill.style.width =
            "0%";

    }
);



// ==========================================
// Add History Item
// ==========================================

function addHistory(
    fileName,
    prediction,
    confidenceValue,
    time
) {

    const item =
        document.createElement("div");


    item.className =
        "history-item";


    const fileNameElement =
        document.createElement("strong");


    fileNameElement.innerText =
        fileName;


    const resultElement =
        document.createElement("div");


    resultElement.innerText =
        "Result: " +
        prediction;


    const confidenceElement =
        document.createElement("div");


    confidenceElement.innerText =
        "Confidence: " +
        confidenceValue +
        "%";


    const timeElement =
        document.createElement("div");


    timeElement.innerText =
        "Time: " +
        time;



    item.appendChild(
        fileNameElement
    );


    item.appendChild(
        resultElement
    );


    item.appendChild(
        confidenceElement
    );


    item.appendChild(
        timeElement
    );


    historyList.appendChild(
        item
    );

}



// ==========================================
// Load History
// ==========================================

async function loadHistory() {

    try {

        const response =
            await fetch("/history");


        const data =
            await response.json();


        historyList.innerHTML =
            "";


        if (
            !data.success ||
            !data.history ||
            data.history.length === 0
        ) {

            historyList.innerHTML =
                "<p>No predictions yet.</p>";

            return;

        }


        const history =
            [...data.history].reverse();


        history.forEach(
            function (item) {

                addHistory(
                    item.filename,
                    item.prediction,
                    item.confidence,
                    item.time
                );

            }
        );

    }

    catch (error) {

        console.error(
            "History loading failed:",
            error
        );

    }

}



// ==========================================
// Clear History
// ==========================================

clearHistoryBtn.addEventListener(
    "click",
    async function () {

        const confirmClear =
            confirm(
                "Are you sure you want to clear all prediction history?"
            );


        if (!confirmClear) {

            return;

        }


        try {

            const response =
                await fetch(
                    "/clear-history",
                    {
                        method: "POST"
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                historyList.innerHTML =
                    "<p>No predictions yet.</p>";


                alert(
                    "Prediction history cleared successfully."
                );


                // Refresh statistics

                loadStatistics();

            }

            else {

                alert(
                    data.message
                );

            }

        }

        catch (error) {

            console.error(error);


            alert(
                "Failed to clear prediction history."
            );

        }

    }
);



// ==========================================
// Export Prediction History
// ==========================================

exportHistoryBtn.addEventListener(
    "click",
    function () {

        window.location.href =
            "/export-history";

    }
);



// ==========================================
// Load Statistics
// ==========================================

async function loadStatistics() {

    try {

        const response =
            await fetch(
                "/statistics"
            );


        const data =
            await response.json();


        if (data.success) {

            document.getElementById(
                "totalPredictions"
            ).innerText =
                data.total_predictions;


            document.getElementById(
                "plasticCount"
            ).innerText =
                data.plastic_count;


            document.getElementById(
                "nonPlasticCount"
            ).innerText =
                data.non_plastic_count;


            document.getElementById(
                "averageConfidence"
            ).innerText =
                data.average_confidence +
                "%";

        }

    }

    catch (error) {

        console.error(
            "Statistics loading failed:",
            error
        );

    }

}



// ==========================================
// Load Data When Page Opens
// ==========================================

loadHistory();

loadStatistics();