# Doxify Deployment Guide - GCP Mumbai Region

## Pre-Deployment Checklist

✅ **Completed:**
- GCP CLI installed and authenticated
- Project configured: `doxify-prod`
- Project ID: `454635015199`
- Account: mihirrabari2604@gmail.com
- Target Region: `asia-south1` (Mumbai)
- Deployment script updated for Mumbai region
- Billing enabled
- Firestore database created (NATIVE mode, Mumbai region)
- Public internet access configured (--allow-unauthenticated)

## Deployment Steps

### 1. Set Required Environment Variables

```powershell
# Set JWT Secret (REQUIRED for security)
$env:JWT_SECRET = "your-secure-random-jwt-secret-key-min-32-chars"

# Optional: Override project or region if needed
# $env:GCP_PROJECT_ID = "doxify-prod"
# $env:GCP_REGION = "asia-south1"
```

**⚠️ IMPORTANT:** Generate a strong JWT secret before deployment:
```powershell
# Generate a random 64-character secret
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### 2. Enable Required GCP APIs

The deployment script will automatically enable:
- Cloud Run API
- Cloud Build API
- Container Registry API
- Firestore API

### 3. Run Deployment

```powershell
# Execute the deployment script
.\deploy-gcp.ps1
```

## What the Deployment Does

1. **Enables GCP APIs** - Activates required Google Cloud services
2. **Builds Docker Images** - Uses Cloud Build to create container images for all 9 services
3. **Pushes to Container Registry** - Stores images in GCR (`gcr.io/doxify-prod/...`)
4. **Deploys to Cloud Run** - Deploys each service in this order:
   - Parser Service (4004)
   - Auth Service (4001)
   - Projects Service (4002)
   - Theme Service (4005)
   - Export Service (4006)
   - Viewer Service (4007)
   - MCP Service (4008)
   - Pages Service (4003) - depends on Parser URL
   - API Gateway (4000) - depends on all service URLs

## Service Configuration

Each service will be deployed with:
- **Platform:** Cloud Run (fully managed)
- **Region:** asia-south1 (Mumbai)
- **Access:** Unauthenticated (public)
- **Max Instances:** 10-20 (auto-scaling)
- **Memory:** 512Mi
- **Environment:** Production

## Expected Deployment Time

- **Image Building:** ~10-15 minutes
- **Service Deployment:** ~5-10 minutes
- **Total:** ~15-25 minutes

## Post-Deployment

After successful deployment, you'll receive:
- ✅ API Gateway URL (main entry point)
- ✅ Individual service URLs
- ✅ Next steps for frontend deployment

## Firestore Setup

Firestore will be automatically initialized in Native mode for the project.

## Cost Estimation (Mumbai Region)

- **Cloud Run:** Pay-per-use (free tier: 2M requests/month)
- **Cloud Build:** 120 free build-minutes/day
- **Container Registry:** First 0.5GB free
- **Firestore:** 1GB storage + 50K reads free/day

## Troubleshooting

### If deployment fails:

1. **Check permissions:**
   ```powershell
   gcloud projects get-iam-policy doxify-prod
   ```

2. **Verify APIs are enabled:**
   ```powershell
   gcloud services list --enabled
   ```

3. **Check build logs:**
   ```powershell
   gcloud builds list --limit=5
   ```

4. **View service logs:**
   ```powershell
   gcloud run services logs read SERVICE_NAME --region=asia-south1
   ```

## Security Recommendations

After deployment:
1. ✅ Change JWT_SECRET to a strong random value
2. ✅ Configure Firestore security rules
3. ✅ Set up Cloud Armor (WAF) for DDoS protection
4. ✅ Enable Cloud Monitoring and alerts
5. ✅ Configure custom domain with HTTPS
6. ✅ Implement API rate limiting
7. ✅ Review and restrict service permissions

## Rollback

To rollback to a previous revision:
```powershell
gcloud run services update-traffic SERVICE_NAME --to-revisions=REVISION=100 --region=asia-south1
```

---

**Ready to Deploy?** Make sure you've set the JWT_SECRET environment variable, then run:
```powershell
.\deploy-gcp.ps1
```
