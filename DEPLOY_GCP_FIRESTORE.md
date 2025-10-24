# 🚀 Deploy Doxify to Google Cloud Platform (GCP) with Firestore

**Complete deployment guide using Cloud Run + Firestore (No MongoDB required!)**

---

## 📊 COST ESTIMATE

### **Cloud Run (Pay-per-use)**
- **Free tier:** 2 million requests/month
- **After free tier:** $0.00002400 per request
- **Idle services:** $0 (scales to zero!)
- **Expected cost:** $5-20/month for moderate traffic

### **Firestore (Native GCP Database)**
- **Free tier:** 1GB storage, 50K reads/day, 20K writes/day
- **After free tier:** $0.18/GB/month storage, $0.06 per 100K reads
- **Expected cost:** $0-10/month for moderate usage

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
│   Google Cloud Firestore     │
│   - Native GCP NoSQL DB      │
│   - Auto-scaling             │
│   - Strong consistency       │
│   - Free tier available      │
└──────────────────────────────┘
```

---

## 📋 PREREQUISITES

1. **Google Cloud Account**
   - Create: https://console.cloud.google.com
   - Enable billing (required for Cloud Run)

2. **Google Cloud SDK (gcloud)**
   ```powershell
   # Windows - Already installed! ✅
   gcloud --version
   
   # Verify authentication
   gcloud auth login
   ```

3. **Node.js & npm**
   - Version 18+ required

---

## 🚀 DEPLOYMENT STEPS

### **Step 1: Setup Google Cloud Project**

```powershell
# Login to Google Cloud (if not already)
gcloud auth login

# Create new project
gcloud projects create doxify-prod --name="Doxify Production"

# Set current project
gcloud config set project doxify-prod

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable firestore.googleapis.com

# Enable billing
# Go to: https://console.cloud.google.com/billing
```

### **Step 2: Initialize Firestore**

```powershell
# Create Firestore database in Native mode
gcloud firestore databases create --location=us-central1

# Note: Choose a location close to your users
# Available locations: us-central1, us-east1, europe-west1, asia-northeast1, etc.
```

### **Step 3: Install Dependencies**

```powershell
# Run the migration script to install Firestore SDK
.\migrate-firestore.ps1

# Or manually for each service:
cd services/auth-service
npm install
cd ../..
```

### **Step 4: Set Environment Variables**

```powershell
# Set your GCP Project ID
$env:GCP_PROJECT_ID="doxify-prod"
$env:GCP_REGION="us-central1"
$env:JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long"
```

### **Step 5: Deploy to Cloud Run**

```powershell
# Run deployment script
.\deploy-gcp.ps1

# Or use bash script
# bash deploy-gcp.sh
```

Wait ~10-15 minutes for deployment to complete.

### **Step 6: Deploy Frontend**

```powershell
cd apps/web

# Update API URL in .env.production
$API_URL = gcloud run services describe doxify-api-gateway --platform managed --region us-central1 --format 'value(status.url)'
echo "VITE_API_URL=$API_URL" | Out-File -FilePath .env.production

# Build frontend
npm run build

# Create Cloud Storage bucket
gsutil mb -p doxify-prod -c STANDARD -l us-central1 gs://doxify-frontend

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://doxify-frontend

# Enable website configuration
gsutil web set -m index.html -e index.html gs://doxify-frontend

# Upload build files
gsutil -m rsync -r dist gs://doxify-frontend

# Set cache headers
gsutil -m setmeta -h "Cache-Control:public, max-age=3600" gs://doxify-frontend/**
```

Your app is now live at:
```
https://storage.googleapis.com/doxify-frontend/index.html
```

---

## 📊 FIRESTORE ADVANTAGES

### ✅ Compared to MongoDB Atlas

| Feature | Firestore | MongoDB Atlas |
|---------|-----------|---------------|
| **GCP Native** | ✅ Yes | ❌ Third-party |
| **Code Changes** | ✅ Done (refactored) | ❌ Required Mongoose |
| **Setup Time** | 1 command | 5+ steps |
| **Free Tier** | 1GB + 50K reads | 512MB |
| **Auto-scaling** | ✅ Built-in | Manual |
| **Backups** | ✅ Automatic | Manual setup |
| **IAM Integration** | ✅ Yes | ❌ No |

### ✅ Benefits

1. **No External Dependencies** - Everything within GCP
2. **Better Integration** - Works seamlessly with Cloud Run
3. **Automatic Backups** - Point-in-time recovery included
4. **IAM Security** - Fine-grained access control
5. **Real-time Updates** - Built-in change listeners
6. **Global Distribution** - Multi-region replication available

---

## 🔐 SECURITY BEST PRACTICES

### **1. Use Service Accounts**

Each Cloud Run service automatically gets a service account with Firestore access. No additional configuration needed!

### **2. Firestore Security Rules**

Create security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read: if resource.data.publishSettings.isPublished == true 
                  || request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == resource.data.userId;
    }
    
    // Pages collection
    match /pages/{pageId} {
      allow read: if true; // Public read
      allow write: if request.auth != null;
    }
  }
}
```

### **3. Environment Variables via Secret Manager**

```powershell
# Create secrets
echo "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-

# Grant access to Cloud Run service account
$PROJECT_NUMBER = gcloud projects describe doxify-prod --format="value(projectNumber)"
gcloud secrets add-iam-policy-binding jwt-secret `
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor"

# Update service to use secret
gcloud run services update doxify-auth-service `
  --update-secrets=JWT_SECRET=jwt-secret:latest `
  --region=us-central1
```

---

## 📊 MONITORING & LOGS

### **View Logs:**
```powershell
# All services
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# Specific service
gcloud logging read "resource.labels.service_name=doxify-api-gateway" --limit=50

# Firestore operations
gcloud logging read "resource.type=cloud_firestore_database" --limit=50
```

### **View Metrics:**
- Cloud Run: https://console.cloud.google.com/run
- Firestore: https://console.cloud.google.com/firestore

---

## 🔄 UPDATE/REDEPLOY

### **Update a single service:**
```powershell
# Rebuild and deploy
gcloud builds submit --tag gcr.io/doxify-prod/doxify-auth-service services/auth-service

gcloud run deploy doxify-auth-service `
  --image gcr.io/doxify-prod/doxify-auth-service `
  --platform managed `
  --region us-central1
```

### **Update all services:**
```powershell
.\deploy-gcp.ps1
```

---

## 💰 COST BREAKDOWN (Monthly)

### **Scenario 1: Personal Project (Low Traffic)**
- Requests: 100K/month
- Cloud Run: **$0** (within free tier)
- Firestore: **$0** (within free tier)
- Storage: **$0.02**
- **Total: $0.02/month** 🎉

### **Scenario 2: Growing Startup (Moderate Traffic)**
- Requests: 10M/month
- Cloud Run: **$15**
- Firestore: **$5** (500K reads, 200K writes)
- Storage + CDN: **$2**
- **Total: $22/month**

### **Scenario 3: Production App (High Traffic)**
- Requests: 100M/month
- Cloud Run: **$150**
- Firestore: **$25** (5M reads, 2M writes)
- Storage + CDN: **$10**
- **Total: $185/month**

---

## 🎯 FIRESTORE INDEXES

Firestore will auto-create simple indexes. For complex queries, create composite indexes:

```powershell
# Example: Index for pages by project and section
gcloud firestore indexes composite create `
  --collection-group=pages `
  --field-config field-path=projectId,order=ASCENDING `
  --field-config field-path=section,order=ASCENDING `
  --field-config field-path=order,order=ASCENDING
```

---

## 🧪 LOCAL DEVELOPMENT

### **Using Firestore Emulator:**

```powershell
# Install emulator
gcloud components install firestore-emulator

# Start emulator
gcloud emulators firestore start

# In another terminal, set environment variable
$env:FIRESTORE_EMULATOR_HOST="localhost:8080"

# Run your services
npm run dev
```

---

## 📞 SUPPORT

- **GCP Documentation:** https://cloud.google.com/run/docs
- **Firestore Docs:** https://cloud.google.com/firestore/docs
- **Issues:** Open an issue on GitHub

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] GCP project created
- [ ] Billing enabled
- [ ] Firestore initialized
- [ ] Dependencies installed (`migrate-firestore.ps1`)
- [ ] Environment variables set
- [ ] Services deployed (`deploy-gcp.ps1`)
- [ ] Frontend deployed to Cloud Storage
- [ ] Custom domain configured (optional)
- [ ] Firestore security rules configured
- [ ] Monitoring alerts set up

---

**Built with ❤️ using GCP Firestore - No MongoDB required!**

**Migration Date:** October 24, 2025
