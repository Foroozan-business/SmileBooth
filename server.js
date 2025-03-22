const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to handle JSON
app.use(express.json());

// Smile detection endpoint
app.post('/detect-smile', async (req, res) => {
    const secretApi = process.env.SECRETAPI;
    const keyApi = process.env.KEYAPI;

    try {
        const imageUrl = req.body.imageUrl; // Get image URL from request body

        const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', null, {
            params: {
                api_key: keyApi,
                api_secret: secretApi,
                image_url: imageUrl,
                return_attributes: "smile"
            }
        });

        if (response.data.faces.length > 0) {
            const smileValue = response.data.faces[0].attributes.smile.value;
            const message = smileValue > 50 ? "Such a beautiful smile!" : "Wanna try to smile?";
            res.json({ message });
        } else {
            res.json({ message: "No face detected." });
        }

    } catch (error) {
        res.status(500).json({ error: "Error detecting smile" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
