# Environment Variables

## Local Development
Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

The `.env.example` file is provided as a template.

---

## Production / CI/CD Deployment (GitHub Secrets)

> **Important:** Since Vite is a client-side Single Page Application (SPA), all `VITE_*` variables are baked into the static JavaScript bundle at **build time** (`npm run build`). Setting environment variables directly in Google Cloud Run at runtime will **not** affect client-side Vite builds.

For production builds and automated deployments via GitHub Actions:

1. Navigate to your repository on GitHub.
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Under **Repository secrets**, ensure the following secrets are configured and kept up to date:
   - `VITE_API_BASE_URL` - Production API backend URL.
   - `VITE_GOOGLE_MAPS_API_KEY` - Production Google Maps API key (with Maps JavaScript API and Geocoding API enabled).
   - `GCLOUD_PROJECT_ID` - Google Cloud Project ID.
   - `GCLOUD_SERVICE_KEY` - Service account key JSON for GCP authentication.
   - `REGION` - Google Cloud Run deployment region.

---

## Notes
- Vite requires the `VITE_` prefix for any environment variable to be exposed to the browser/client.
- Restart the local development server (`npm run dev`) after modifying the `.env` file.
- After updating secrets in GitHub, re-run the deployment workflow in the **Actions** tab to produce a new build with the updated keys.
