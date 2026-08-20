const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

app.get('/', async (req, res) => {
  // Extract public IP address
  const userIp = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.socket.remoteAddress;

  try {
    // Fetch location details using ip-api.com
    const response = await fetch(http://ip-api.com/json/${userIp});
    const geo = await response.json();

    const city = geo.city || 'Unknown City';
    const region = geo.regionName || 'Unknown Region';
    const country = geo.country || 'Unknown Country';
    const mapsUrl = https://www.google.com/maps?q=${geo.lat},${geo.lon};

    // Log the IP and location to your Render console
    console.log([LOG] IP: ${userIp} | Location: ${city}, ${region}, ${country});

    // Send styled response with Google Maps location link
    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h1>Thank you for clicking!</h1>
        <p>Your visit has been successfully recorded.</p>
        <hr style="max-width: 400px; margin: 20px auto;" />
        <p><strong>Your IP:</strong> ${userIp}</p>
        <p><strong>Location:</strong> ${city}, ${region}, ${country}</p>
        <p><a href="${mapsUrl}" target="_blank" style="color: #0070f3;">View Location on Google Maps</a></p>
      </div>
    `);

  } catch (error) {
    console.error('Failed to fetch geolocation data:', error);
    res.send('<h1>Thank you for clicking!</h1><p>Your visit has been recorded.</p>');
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
