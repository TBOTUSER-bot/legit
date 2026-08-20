const express = require('express');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

app.get('/', (req, res) => {
  // Extract public IP address
  const userIp = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.socket.remoteAddress;

  // Query ip-api.com using Node's native http module
  http.get(http://ip-api.com/json/${userIp}, (apiRes) => {
    let data = '';

    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    apiRes.on('end', () => {
      try {
        const geo = JSON.parse(data);
        const city = geo.city || 'Unknown City';
        const region = geo.regionName || 'Unknown Region';
        const country = geo.country || 'Unknown Country';
        const mapsUrl = https://www.google.com/maps?q=${geo.lat},${geo.lon};

        console.log([LOG] IP: ${userIp} | Location: ${city}, ${region}, ${country});

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
      } catch (err) {
        console.error('JSON parse error:', err);
        res.send('<h1>Thank you for clicking!</h1>');
      }
    });

  }).on('error', (err) => {
    console.error('Geolocation request failed:', err.message);
    res.send('<h1>Thank you for clicking!</h1>');
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
