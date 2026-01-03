# Docker Hub Deployment Guide

## Overview

This project automatically builds and pushes Docker images to Docker Hub on every merge to the `main` branch using GitHub Actions.

## GitHub Actions Workflow

### Triggers

- **Branch:** `main` only
- **Event:** Push event (after merge or direct commit)

### Build Steps

1. Checkout repository code
2. Setup .NET 10 SDK with dependency caching
3. Restore NuGet dependencies
4. Build .NET project in Release configuration
5. Run tests (if any exist)
6. Setup Docker Buildx for optimized builds
7. Login to Docker Hub using stored credentials
8. Build and push Docker image with layer caching

### Image Information

- **Repository:** `freelyit/xml-formatter`
- **Tags:** `latest` (latest build from main)
- **Base Image:** `mcr.microsoft.com/dotnet/aspnet:10.0`
- **Port:** 8080

## Docker Hub Setup

### Prerequisites

1. Docker Hub Account (hub.docker.com)
2. Public or private repository: `freelyit/xml-formatter`

### Personal Access Token (Required)

1. Log in to Docker Hub at https://hub.docker.com
2. Go to **Account Settings** > **Security** > **Personal Access Tokens**
3. Click **Generate New Token**
4. Set token name (e.g., "github-actions")
5. Set permissions: **Read & Write**
6. Copy token (shown only once - save it securely)

### GitHub Repository Secrets

**Required for workflow to function:**

1. Navigate to: `https://github.com/jpbroeders/json-formatter/settings/secrets/actions`
2. Click **New repository secret**
3. Add first secret:
   - Name: `DOCKERHUB_USERNAME`
   - Value: Your Docker Hub username (e.g., `freelyit`)
4. Click **New repository secret** again
5. Add second secret:
   - Name: `DOCKERHUB_TOKEN`
   - Value: Your Docker Hub Personal Access Token (from previous step)

**Important:** Use Personal Access Token, NOT your Docker Hub password!

## Monitoring Builds

### View Workflow Status

1. Go to repository: https://github.com/jpbroeders/xml-formatter
2. Click on **Actions** tab
3. Select "Build and Push Docker Image to Docker Hub" workflow
4. View run history and logs for each execution

### Workflow Run Details

Each workflow run shows:
- Trigger information (commit SHA, author, message)
- Build duration
- Step-by-step execution logs
- Success/failure status
- Docker image tags pushed

## Using the Docker Image

### Pull Latest Image

```bash
docker pull freelyit/xml-formatter:latest
```

### Run Container Locally

```bash
# Run on port 8080
docker run -p 8080:8080 freelyit/xml-formatter:latest

# Run on custom port (e.g., 3000)
docker run -p 3000:8080 freelyit/xml-formatter:latest
```

### Test Application

```bash
# Open in browser
open http://localhost:8080

# Or test with curl
curl http://localhost:8080
```

## Troubleshooting

### Authentication Failures

**Symptom:** Workflow fails at "Login to Docker Hub" step

**Solutions:**
- Verify `DOCKERHUB_TOKEN` is a Personal Access Token, NOT your account password
- Check token has "Read & Write" permissions (not "Read Only")
- Verify `DOCKERHUB_USERNAME` matches your Docker Hub account exactly
- Ensure secrets are named correctly (case-sensitive)
- Check if token has expired (tokens can be set to expire)

### Build Failures

**Symptom:** Workflow fails during .NET build or Docker build steps

**Solutions:**
- Check .NET SDK is properly restored: run `dotnet restore` locally to verify
- Verify Dockerfile is valid: run `docker build .` locally to test
- Review build logs in GitHub Actions for specific error messages
- Ensure all required files are committed (not in .gitignore)

### Image Not Pushing to Docker Hub

**Symptom:** Build succeeds but image doesn't appear on Docker Hub

**Solutions:**
- Ensure Docker Hub repository exists (create it manually if needed)
- Verify repository is public or you have push permissions
- Check Docker Hub token hasn't expired
- Verify repository name in workflow matches Docker Hub exactly: `freelyit/xml-formatter`

### Workflow Not Triggering

**Symptom:** Pushing to main doesn't trigger the workflow

**Solutions:**
- Verify workflow file is in `.github/workflows/` directory
- Check workflow file has valid YAML syntax
- Ensure you're pushing to `main` branch (not `master` or feature branch)
- Verify GitHub Actions are enabled in repository settings

## Performance Optimization

### Docker Layer Caching

The workflow uses Docker registry-based caching to speed up builds:

- **First build:** ~2-3 minutes (full build from scratch)
- **Subsequent builds:** ~30-60 seconds (cached layers reused)

Caching is automatic and requires no manual intervention.

### .NET Dependency Caching

NuGet dependencies are cached between workflow runs using GitHub Actions cache:

- Dependencies only restored when `xml-formatter.csproj` changes
- Significantly reduces build time for unchanged dependencies

## Security Best Practices

1. **Personal Access Token:** Use a token with minimal required permissions ("Read & Write" only)
2. **Token Rotation:** Consider rotating tokens quarterly or when team members change
3. **Never Commit Credentials:** GitHub Secrets are encrypted and never exposed in logs
4. **Review Workflow Logs:** Docker Hub credentials are automatically masked in logs
5. **Repository Permissions:** Ensure only authorized users can modify GitHub Secrets

## Workflow File Location

The workflow configuration is located at:

```
.github/workflows/docker-build-push.yml
```

To modify the workflow:
1. Edit the YAML file
2. Commit and push changes
3. Changes take effect on next workflow run

## Additional Resources

- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [.NET Docker Images](https://hub.docker.com/_/microsoft-dotnet)
