# Render Deployment Guide for Tito Ride

## Prerequisites
- GitHub repository with your code
- Render account (https://render.com)

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push
```

### 2. Create Backend Service on Render

1. Go to Render Dashboard → New → Blueprint
2. Connect your GitHub repository
3. Render will detect `render.yaml` and create both services
4. Set environment variables for **tito-ride-api**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CLIENT_URL`: Your frontend URL (will be provided after frontend deploys)

### 3. Create Frontend Service

The frontend service will be created automatically from render.yaml.
Set environment variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://tito-ride-api.onrender.com/api`)

### 4. Update Socket.IO CORS

After getting your frontend URL, update `server/server.js`:
```javascript
const io = new Server(server, {
  cors: {
    origin: "https://your-frontend-url.onrender.com",
    methods: ["GET", "POST"],
  },
});
```

### 5. Update Environment Variables

**Backend (tito-ride-api):**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-frontend-url.onrender.com
```

**Frontend (tito-ride-client):**
```
VITE_API_URL=https://tito-ride-api.onrender.com/api
```

## Important Notes

- Free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Upload folder is ephemeral on free tier - consider using Cloudinary for production
- MongoDB Atlas free tier has connection limits

## After Deployment

1. Test registration with profile picture
2. Test creating rides
3. Test notifications (Socket.IO)
4. Test mobile responsiveness

## Troubleshooting

**Backend won't start:**
- Check environment variables are set correctly
- Check MongoDB connection string is correct
- Check build logs for errors

**Frontend can't connect to backend:**
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running

**Images not loading:**
- Use full URLs in production
- Consider migrating to Cloudinary for persistent storage
