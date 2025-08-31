# 🎵 OMNIVOID Audio Proxy System

## Overview
The audio proxy system solves CORS (Cross-Origin Resource Sharing) issues when trying to capture audio from Mixcloud iframes. Instead of directly accessing Mixcloud audio (which browsers block), we proxy the audio through our own server.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Navigate to your project directory
cd "K:\F DRIVE\OMNIVOID\Bruno\LABS"

# Install proxy server dependencies
npm install --prefix . express cors axios
```

### 2. Start the Audio Proxy Server
```bash
# Start the proxy server on port 3001
node proxy.js
```

You should see:
```
🎵 Audio proxy server running on port 3001
🌐 Health check: http://localhost:3001/health
🎵 Proxy endpoint: http://localhost:3001/proxy/mixcloud?url=<mixcloud_url>
```

### 3. Test the Proxy
Visit: `http://localhost:3001/health`
Should return: `{"status":"OK","service":"Audio Proxy Server"}`

## 🔧 How It Works

### **Before (CORS Error)**
```
Browser → Mixcloud iframe → ❌ CORS blocked
```

### **After (Proxy Solution)**
```
Browser → Your Proxy Server → Mixcloud → ✅ Audio captured
```

### **Audio Flow**
1. **Mixcloud iframe** plays music
2. **Proxy server** fetches audio stream from Mixcloud
3. **Your app** gets audio from proxy (same domain = no CORS)
4. **Visual effects** respond to audio data

## 📁 Files

- **`proxy.js`** - Main proxy server
- **`proxy-package.json`** - Dependencies for proxy server
- **`src/AppMobile.js`** - Updated with audio proxy integration

## 🎮 Usage

### **In Your App**
1. **Open Radio window**
2. **Click "🎵 Start Audio Proxy"**
3. **Watch debug panel** for proxy status
4. **Visual effects** should respond to audio

### **Debug Panel Shows**
- ✅ Audio Proxy: Active
- ✅ Proxy Context: Active  
- ✅ Proxy Analyser: Active
- ✅ Proxy Audio: Loaded

## 🔄 Development Workflow

### **Local Testing**
```bash
# Terminal 1: Start main app
python -m http.server 8000

# Terminal 2: Start audio proxy
node proxy.js
```

### **Production**
- Deploy proxy server to your hosting
- Update `getProxyAudioUrl()` with production proxy URL
- Remove local MP3 fallback

## 🐛 Troubleshooting

### **Proxy Server Won't Start**
- Check if port 3001 is available
- Install dependencies: `npm install`
- Check Node.js version: `node --version`

### **Audio Still Not Working**
- Check proxy server is running: `http://localhost:3001/health`
- Check browser console for errors
- Verify debug panel shows proxy as "Active"

### **CORS Still Happening**
- Ensure proxy server is running
- Check proxy server logs for errors
- Verify proxy URL in `getProxyAudioUrl()`

## 🎯 Next Steps

1. **Test with local MP3** (current setup)
2. **Get Mixcloud stream URL** from their API
3. **Update proxy** to use real Mixcloud stream
4. **Deploy proxy** to production server

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

**Note**: This proxy system is for development/testing. For production, you'll need to deploy the proxy server to your hosting provider and update the URLs accordingly.
