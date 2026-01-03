# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Build
dotnet build

# Run locally (serves on http://localhost:5000)
dotnet run

# Build for production
dotnet publish -c Release -o ./publish

# Docker build and run
docker build -t xml-formatter .
docker run -p 8080:8080 xml-formatter
```

## Architecture

This is a minimal ASP.NET Core 10 static file server for a client-side XML formatter. There is no backend processing - all XML formatting happens in the browser via JavaScript.

**Program.cs**: Configures the web host to serve static files from `wwwroot/` with `index.html` as the default document.

**wwwroot/script.js**: Contains the XML formatting logic using `DOMParser` to parse XML and a recursive `domToString()` function to pretty-print with indentation. Handles text nodes, elements, CDATA, and comments.

## CI/CD

On push to `main`, GitHub Actions builds the .NET project and pushes a Docker image to `freelyit/xml-formatter:latest` on Docker Hub. See `.github/workflows/docker-build-push.yml`.
