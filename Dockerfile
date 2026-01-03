# Use the ASP.NET runtime as the base image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

# Use the .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["xml-formatter.csproj", "./"]
RUN dotnet restore "./xml-formatter.csproj"
COPY . .
RUN dotnet publish "xml-formatter.csproj" -c Release -o /app/publish

# Final stage: build the runtime image
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "xml-formatter.dll"]
