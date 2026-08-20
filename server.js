const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

// Changed '/track-click' to '/'
app.get('/', (req, res) => {
    const userIp = req.headers['x-forwarded-for'] 
        ? req.headers['x-forwarded-for'].split(',')[0].trim() 
        : req.socket.remoteAddress;

    console.log("[LOG] Link clicked! User IP address logged: " + userIp);

    res.send('<h1>Thank you for clicking!</h1><p>Your visit has been successfully recorded.</p>');
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
