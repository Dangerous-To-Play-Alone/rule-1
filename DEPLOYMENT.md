# Deployment Guide

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages on every push to the `main` branch.

### Setup Steps

The deployment is already configured, but if you need to set it up on a new repository, follow these steps:

#### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **GitHub Actions**

#### 2. Workflow Configuration

The deployment workflow is defined in `.github/workflows/deploy.yml` and will:
- Trigger on every push to `main`
- Install dependencies with npm workspaces
- Build the web app with production settings
- Deploy to GitHub Pages automatically

#### 3. Access Your Site

Once deployed, your site will be available at:
```
https://dangerous-to-play-alone.github.io/rule-1/
```

### Manual Deployment (Alternative)

If you prefer manual deployment, you can use the legacy gh-pages command:

```bash
cd web
npm run deploy
```

This will build and deploy to the `gh-pages` branch.

### Environment Variables

The GitHub Actions workflow sets:
- `PUBLIC_URL=/rule-1` - Ensures correct asset paths
- `CI=false` - Treats warnings as warnings (not errors)

### Troubleshooting

#### Build Fails
- Check the Actions tab for detailed error logs
- Ensure all dependencies are properly listed in `package.json`
- Verify the workspace configuration is correct

#### Site Not Updating
- Check that the workflow completed successfully in Actions tab
- Clear your browser cache
- Wait a few minutes for GitHub's CDN to update

#### 404 Errors on Refresh
This is expected for client-side routing. GitHub Pages doesn't natively support SPA routing.

**Solution**: The app uses hash routing which works on GitHub Pages. If you see issues:
1. Ensure you're using the correct URL with the base path
2. Check that `homepage` in `web/package.json` matches your repo name

### Workflow Status

Check the deployment status:
1. Go to the **Actions** tab in your GitHub repository
2. Look for the "Deploy to GitHub Pages" workflow
3. Click on any run to see detailed logs

### Local Preview of Production Build

To preview the production build locally:

```bash
# Build the app
npm run web:build

# Serve the build folder
cd web/build
python -m http.server 8000
# Visit http://localhost:8000
```

### Configuration Files

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `web/package.json` - Homepage setting for correct paths
- `web/public/manifest.json` - PWA configuration

### Deployment Frequency

- **Automatic**: On every push to `main`
- **Manual**: Run `npm run deploy` from the web directory

### Notes

- The build process uses npm workspaces to handle the shared core library
- Assets are optimized and minified for production
- The deployment includes the PWA manifest for installable web app
