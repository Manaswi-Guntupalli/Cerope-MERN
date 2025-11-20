# Deployment Guide

This guide explains how to deploy the Cerope MERN application to production.

## 🚀 Deployment Options

### Option 1: Deploy to Render (Recommended for MERN)

Render offers free hosting for full-stack applications.

#### Backend Deployment (Render)

1. **Prepare the backend**:

   - Ensure `package.json` has a start script:
     ```json
     "scripts": {
       "start": "node server.js"
     }
     ```

2. **Create a Render account**:

   - Go to https://render.com
   - Sign up with GitHub

3. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder (or use Root Directory: `backend`)
4. **Configure the service**:

   - Name: `cerope-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

5. **Set Environment Variables**:

   - Add the following in Render dashboard:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secure_random_string_here
     JWT_EXPIRE=7d
     NODE_ENV=production
     ```

6. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note the URL: `https://cerope-backend.onrender.com`

#### Frontend Deployment (Render)

1. **Update API URL**:

   - In `frontend/.env`:
     ```
     VITE_API_URL=https://cerope-backend.onrender.com/api
     ```

2. **Create a new Static Site**:

   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Root Directory: `frontend`

3. **Configure the build**:

   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

4. **Deploy**:
   - Click "Create Static Site"
   - Your app will be available at: `https://cerope-app.onrender.com`

---

### Option 2: Deploy to Vercel (Frontend) + Render (Backend)

#### Backend on Render (Same as above)

#### Frontend on Vercel

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Update API URL**:

   - Create `frontend/.env.production`:
     ```
     VITE_API_URL=https://cerope-backend.onrender.com/api
     ```

3. **Deploy**:

   ```bash
   cd frontend
   vercel
   ```

4. **Configure**:
   - Follow the prompts
   - Choose the frontend directory
   - Add environment variables in Vercel dashboard

---

### Option 3: Deploy to Railway

1. **Create Railway account**: https://railway.app

2. **Deploy Backend**:

   - New Project → Deploy from GitHub
   - Select your repo
   - Add environment variables
   - Railway auto-detects Node.js

3. **Deploy Frontend**:
   - Add new service
   - Deploy frontend
   - Configure build settings

---

### Option 4: Self-Hosted (VPS)

#### Prerequisites

- Ubuntu/Debian VPS (DigitalOcean, Linode, etc.)
- Domain name (optional)

#### Steps

1. **Connect to VPS**:

   ```bash
   ssh root@your_server_ip
   ```

2. **Install Node.js**:

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install MongoDB**:

   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

4. **Clone repository**:

   ```bash
   git clone https://github.com/yourusername/MERN-APPLICATION.git
   cd MERN-APPLICATION
   ```

5. **Setup Backend**:

   ```bash
   cd backend
   npm install
   # Create .env with production values
   nano .env
   ```

6. **Setup Frontend**:

   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

7. **Install PM2** (Process Manager):

   ```bash
   sudo npm install -g pm2
   ```

8. **Start Backend with PM2**:

   ```bash
   cd backend
   pm2 start server.js --name cerope-backend
   pm2 save
   pm2 startup
   ```

9. **Install Nginx**:

   ```bash
   sudo apt-get install nginx
   ```

10. **Configure Nginx**:

    ```bash
    sudo nano /etc/nginx/sites-available/cerope
    ```

    Add:

    ```nginx
    server {
        listen 80;
        server_name your_domain.com;

        # Frontend
        location / {
            root /path/to/MERN-APPLICATION/frontend/dist;
            try_files $uri $uri/ /index.html;
        }

        # Backend API
        location /api {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

11. **Enable site**:

    ```bash
    sudo ln -s /etc/nginx/sites-available/cerope /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

12. **Setup SSL with Let's Encrypt**:
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d your_domain.com
    ```

---

## 📋 Pre-Deployment Checklist

### Security

- [ ] Changed JWT_SECRET to a strong random string
- [ ] Set NODE_ENV to "production"
- [ ] MongoDB URI uses secure connection string
- [ ] CORS configured for production domain
- [ ] Removed all console.log statements
- [ ] Environment variables are secure

### Database

- [ ] Using MongoDB Atlas for production
- [ ] Database has proper indexes
- [ ] Backup strategy in place
- [ ] IP whitelist configured

### Code

- [ ] All features tested
- [ ] No hardcoded URLs
- [ ] Error handling in place
- [ ] Build process works correctly
- [ ] Dependencies updated

### Configuration

- [ ] Production environment variables set
- [ ] API URLs point to production
- [ ] CORS allows production domain
- [ ] Rate limiting configured (optional)

---

## 🔐 Production Environment Variables

### Backend (.env)

```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cerope?retryWrites=true&w=majority
JWT_SECRET=super_secure_random_string_change_this_immediately_xyz123
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env.production)

```bash
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🧪 Testing Production Build Locally

### Test Backend

```bash
cd backend
NODE_ENV=production npm start
```

### Test Frontend Build

```bash
cd frontend
npm run build
npm run preview
```

---

## 📊 Monitoring & Maintenance

### Monitor Application

- Use Render/Vercel dashboards for logs
- Set up error tracking (Sentry, LogRocket)
- Monitor MongoDB Atlas metrics

### Regular Maintenance

- Update dependencies regularly
- Monitor error logs
- Check database performance
- Review security advisories

---

## 🐛 Troubleshooting Production Issues

### API Not Responding

- Check backend logs
- Verify environment variables
- Test database connection
- Check CORS settings

### Frontend Can't Connect to Backend

- Verify VITE_API_URL is correct
- Check CORS configuration
- Test API endpoints directly
- Check network/firewall

### Database Connection Issues

- Verify MongoDB Atlas connection string
- Check IP whitelist (allow 0.0.0.0/0 for cloud)
- Test connection from backend
- Check MongoDB cluster status

### Authentication Issues

- Verify JWT_SECRET is set
- Check token expiry settings
- Test login flow
- Verify cookies/localStorage

---

## 🎯 Post-Deployment Checklist

- [ ] Application is accessible
- [ ] Registration works
- [ ] Login works
- [ ] Profile setup works
- [ ] Profile page works
- [ ] Logout works
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] API endpoints respond
- [ ] Database saves data
- [ ] SSL certificate active (if using HTTPS)

---

## 📈 Scaling Considerations

If your application grows:

1. **Database**:

   - Upgrade MongoDB Atlas tier
   - Add indexes for performance
   - Consider database sharding

2. **Backend**:

   - Use load balancer
   - Add caching (Redis)
   - Implement rate limiting
   - Use CDN for static assets

3. **Frontend**:
   - Enable CDN
   - Optimize images
   - Implement lazy loading
   - Use code splitting

---

## 🆘 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Nginx Docs**: https://nginx.org/en/docs/

---

**Ready for Production!** 🚀

Choose your deployment platform and follow the steps above. Good luck!
