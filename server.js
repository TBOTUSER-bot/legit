const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Main route to capture user connections
app.get('/track-click', (req, res) => {
    // Extract the public IP address from request headers
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // This prints the IP directly to your Render Logs dashboard
    console.log([LOG] Link clicked! User IP address logged: ${userIp});
    
    // What the user sees on their screen when they click
    res.send('<h1>Thank you for clicking!</h1><p>Your visit has been successfully recorded.</p>');
});

app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
