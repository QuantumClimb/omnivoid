const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use(express.static('public'));

// Proxy endpoint for Mixcloud audio
app.get('/proxy/mixcloud', async (req, res) => {
  try {
    const mixcloudUrl = req.query.url;
    
    if (!mixcloudUrl) {
      return res.status(400).json({ error: 'Mixcloud URL required' });
    }
    
    console.log(`🎵 Proxying Mixcloud audio from: ${mixcloudUrl}`);
    
    // Fetch the audio stream from Mixcloud
    const response = await axios({
      method: 'GET',
      url: mixcloudUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.mixcloud.com/'
      }
    });
    
    // Set appropriate headers
    res.set({
      'Content-Type': response.headers['content-type'] || 'audio/mpeg',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    // Pipe the audio stream to response
    response.data.pipe(res);
    
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to proxy audio',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Audio Proxy Server' });
});

app.listen(PORT, () => {
  console.log(`🎵 Audio proxy server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🎵 Proxy endpoint: http://localhost:${PORT}/proxy/mixcloud?url=<mixcloud_url>`);
});

module.exports = app;
