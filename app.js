const secretApi = process.env.SECRETAPI;
const keyApi = process.env.KEYAPI;

// Import necessary modules
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/detect-smile', async (req, res) => {
    try {
        const imageUrl = req.body.imageUrl;
        
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
