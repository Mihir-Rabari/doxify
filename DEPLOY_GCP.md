# 🚀 Deploy Doxify to Google Cloud Platform (GCP)

**Most efficient and cost-effective deployment using Google Cloud Run + MongoDB Atlas**

---

## 📊 COST ESTIMATE

### **Cloud Run (Pay-per-use)**
- **Free tier:** 2 million requests/month
- **After free tier:** $0.00002400 per request
- **Idle services:** $0 (scales to zero!)
- **Expected cost:** $5-20/month for moderate traffic

### **MongoDB Atlas**
- **Free tier:** M0 Sandbox (512 MB storage)
- **Paid:** Starting at $9/month (M10 cluster)

### **Total Estimated Cost:** $0-30/month 💰

---

## 🎯 ARCHITECTURE

```
┌──────────────────────────────────────┐
│   Cloud Storage + Cloud CDN          │
│   (Frontend - React/Vite)            │
│   Cost: ~$0.02/GB/month              │
└────────────────┬─────────────────────┘
                 │
┌────────────────▼─────────────────────┐
│     API Gateway (Cloud Run)          │
│     https://api-xxx.run.app          │
│     Auto-scales | Pay-per-request    │
└────────────────┬─────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌──────▼───────┐
│ 9 Microservices (Cloud Run)    │
│ - Auth, Projects, Pages, etc.  │
│ - Each scales independently     │
│ - Scales to zero when idle      │
└────────────────────────────────┘
        │
┌───────▼──────────────────────┐
│   MongoDB Atlas (Managed)    │
│   - Global clusters          │
│   - Automatic backups        │
│   - Free tier available      │
└──────────────────────────────┘
```

---

## 📋 PREREQUISITES

1. **Google Cloud Account**
   - Create: https://console.cloud.google.com
   - Enable billing (required for Cloud Run)

2. **Google Cloud SDK (gcloud)**
   ```bash
   # Windows
   https://cloud.google.com/sdk/docs/install#windows
   
   # Verify installation
   gcloud --version
   ```

3. **MongoDB Atlas Account**
   - Sign up: https://www.mongodb.com/cloud/atlas/register
   - Create free M0 cluster

---

## 🚀 DEPLOYMENT STEPS

### **Step 1: Setup Google Cloud Project**

```bash
# Login to Google Cloud
gcloud auth login

# Create new project
gcloud projects create doxify-prod --name="Doxify Production"

# Set current project
gcloud config set project doxify-prod

# Enable billing (required)
# Go to: https://console.cloud.google.com/billing
```

### **Step 2: Setup MongoDB Atlas**

1. **Create Cluster:**
   - Go to https://cloud.mongodb.com/
   - Click "Build a Database"
   - Choose **M0 Free** tier
   - Select region (same as your GCP region for low latency)
   - Click "Create"

2. **Configure Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict to Cloud Run IPs

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `doxify`
   - Password: Generate strong password
   - Role: `Atlas admin`

4. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://doxify:PASSWORD@cluster0.xxxxx.mongodb.net/doxify?retryWrites=true&w=majority`

### **Step 3: Deploy to Cloud Run**

1. **Set environment variables:**
   ```bash
   export GCP_PROJECT_ID=doxify-prod
   export GCP_REGION=us-central1
   export MONGODB_URI="mongodb+srv://doxify:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/doxify?retryWrites=true&w=majority"
   export JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
   ```

2. **Run deployment script:**
   ```bash
   chmod +x deploy-gcp.sh
   ./deploy-gcp.sh
   ```

3. **Wait for deployment** (~10-15 minutes)

### **Step 4: Deploy Frontend**

1. **Build frontend:**
   ```bash
   cd apps/web
   
   # Update API URL in .env
   echo "VITE_API_URL=https://doxify-api-gateway-xxx.run.app" > .env.production
   
   # Build
   npm run build
   ```

2. **Create Cloud Storage bucket:**
   ```bash
   # Create bucket
   gsutil mb -p doxify-prod -c STANDARD -l us-central1 gs://doxify-frontend
   
   # Make bucket public
   gsutil iam ch allUsers:objectViewer gs://doxify-frontend
   
   # Enable website configuration
   gsutil web set -m index.html -e index.html gs://doxify-frontend
   ```

3. **Upload frontend:**
   ```bash
   # Upload build files
   gsutil -m rsync -r dist gs://doxify-frontend
   
   # Set cache headers
   gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://doxify-frontend/**
   ```

4. **Your frontend URL:**
   ```
   https://storage.googleapis.com/doxify-frontend/index.html
   ```

### **Step 5: (Optional) Setup Custom Domain**

1. **Map domain to Cloud Storage:**
   ```bash
   gcloud compute backend-buckets create doxify-backend \
     --gcs-bucket-name=doxify-frontend
   ```

2. **Setup Load Balancer + SSL:**
   - Go to Cloud Console → Network Services → Load Balancing
   - Create HTTPS Load Balancer
   - Add your domain
   - Google automatically provisions SSL certificate

---

## ⚡ OPTIMIZATION TIPS

### **1. Cost Optimization**
```bash
# Set min instances to 0 (scale to zero)
gcloud run services update doxify-api-gateway --min-instances=0

# Set max instances to limit spend
gcloud run services update doxify-api-gateway --max-instances=10

# Use smaller memory allocation
gcloud run services update doxify-api-gateway --memory=256Mi
```

### **2. Performance Optimization**
```bash
# Keep warm instances for API Gateway
gcloud run services update doxify-api-gateway --min-instances=1

# Increase memory for heavy services
gcloud run services update doxify-export-service --memory=1Gi

# Set max requests per container
gcloud run services update doxify-api-gateway --max-instances=10 \
  --concurrency=80
```

### **3. Enable Cloud CDN (Frontend)**
```bash
# Create CDN for frontend
gcloud compute backend-buckets update doxify-backend \
  --enable-cdn
```

---

## 📊 MONITORING & LOGS

### **View Logs:**
```bash
# All services
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# Specific service
gcloud logging read "resource.labels.service_name=doxify-api-gateway" --limit=50
```

### **View Metrics:**
```bash
# Dashboard
https://console.cloud.google.com/run

# Check service status
gcloud run services describe doxify-api-gateway
```

### **Set Up Alerts:**
1. Go to Cloud Console → Monitoring → Alerting
2. Create alert for:
   - High error rate
   - High latency
   - Budget exceeded

---

## 🔄 UPDATE/REDEPLOY

### **Update a single service:**
```bash
# Rebuild
gcloud builds submit --tag gcr.io/doxify-prod/doxify-api-gateway

# Deploy
gcloud run deploy doxify-api-gateway \
  --image gcr.io/doxify-prod/doxify-api-gateway \
  --platform managed \
  --region us-central1
```

### **Update all services:**
```bash
./deploy-gcp.sh
```

### **Rollback:**
```bash
# List revisions
gcloud run revisions list --service=doxify-api-gateway

# Rollback to previous
gcloud run services update-traffic doxify-api-gateway \
  --to-revisions=doxify-api-gateway-00001=100
```

---

## 🔒 SECURITY BEST PRACTICES

### **1. Use Secret Manager:**
```bash
# Create secrets
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
echo -n "mongodb-uri" | gcloud secrets create mongodb-uri --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Update service to use secret
gcloud run services update doxify-auth-service \
  --update-secrets=JWT_SECRET=jwt-secret:latest
```

### **2. Restrict Network Access:**
```bash
# Make service internal only
gcloud run services update doxify-auth-service \
  --ingress=internal

# API Gateway should be public
gcloud run services update doxify-api-gateway \
  --ingress=all
```

### **3. MongoDB Atlas IP Whitelist:**
- Get Cloud Run service IPs
- Add to MongoDB Atlas Network Access

---

## 💰 COST BREAKDOWN (Monthly)

### **Scenario 1: Hobby Project (Low Traffic)**
- Requests: 100K/month
- Cloud Run: **$0** (within free tier)
- MongoDB Atlas: **$0** (M0 free tier)
- Storage: **$0.02**
- **Total: $0.02/month**

### **Scenario 2: Growing Startup (Moderate Traffic)**
- Requests: 10M/month
- Cloud Run: **$15**
- MongoDB Atlas: **$9** (M10 cluster)
- Storage + CDN: **$2**
- **Total: $26/month**

### **Scenario 3: Production App (High Traffic)**
- Requests: 100M/month
- Cloud Run: **$150**
- MongoDB Atlas: **$57** (M20 cluster)
- Storage + CDN: **$10**
- **Total: $217/month**

---

## 🆚 ALTERNATIVE: SINGLE VM DEPLOYMENT

If you want simpler (but less scalable):

```bash
# Create VM
gcloud compute instances create doxify-vm \
  --image-family=cos-stable \
  --image-project=cos-cloud \
  --machine-type=e2-medium \
  --zone=us-central1-a

# SSH into VM
gcloud compute ssh doxify-vm

# Install Docker
sudo yum install -y docker
sudo systemctl start docker

# Clone & deploy
git clone https://github.com/your-repo/doxify.git
cd doxify
docker-compose -f docker-compose.production.yml up -d
```

**Cost:** ~$13/month for e2-medium VM

---

## 🎯 WHICH DEPLOYMENT TO CHOOSE?

| Factor | Cloud Run | Single VM |
|--------|-----------|-----------|
| **Cost (low traffic)** | ✅ $0-5/month | ❌ $13/month |
| **Cost (high traffic)** | ⚠️ Scales with usage | ✅ Fixed $13/month |
| **Scalability** | ✅ Auto-scales | ❌ Manual scaling |
| **Management** | ✅ Serverless | ❌ Manual updates |
| **Recommended for** | Production apps | Simple deployments |

**Recommendation:** Use **Cloud Run** for production - it's more efficient, scalable, and cost-effective for most use cases.

---

## 📞 SUPPORT

- **GCP Documentation:** https://cloud.google.com/run/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Issues:** Open an issue on GitHub

---

**Built with ❤️ by Mihir Rabari - Indie Developer**
