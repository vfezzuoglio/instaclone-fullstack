# Instagram Clone

Full-stack Instagram clone with:
- Backend API: ASP.NET Core 9 + Entity Framework Core + MySQL
- Mobile/Web app: Expo (React Native + Expo Router)
- Auth: Firebase Authentication tokens validated by the API

## Project Structure

- `instagram-clone/InstaClone.Api` - ASP.NET Core backend
- `instagram-clone-front` - Expo frontend

## Prerequisites

- .NET SDK 9.0+
- Node.js 18+
- npm
- MySQL 8+
- Firebase project with Email/Password auth enabled

## 1) Backend Setup (API)

Open a terminal in `instagram-clone/InstaClone.Api`.

### Configure appsettings

Edit `appsettings.json` and confirm these values:

- `ConnectionStrings:Default`
- `Firebase:ProjectId`
- `Jwt` section (used as fallback if Firebase ProjectId is not set)

Current default API URL is:
- `http://localhost:5042`

### Install and restore

```bash
dotnet restore
```

### Apply database migrations

```bash
dotnet ef database update
```

If `dotnet ef` is not installed:

```bash
dotnet tool install --global dotnet-ef
```

### Run backend

```bash
dotnet run
```

Swagger UI is available in development once the app starts.

## 2) Frontend Setup (Expo)

Open a terminal in `instagram-clone-front`.

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy `.env.example` to `.env` and fill in values:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5042
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Device URL notes:
- Android emulator: `http://10.0.2.2:5042`
- Physical device: use your machine LAN IP, for example `http://192.168.1.20:5042`

### Run frontend

```bash
npm start
```

Useful alternatives:

```bash
npm run android
npm run ios
npm run web
```

## Typical Local Run Order

1. Start MySQL.
2. Run API from `instagram-clone/InstaClone.Api`.
3. Run Expo app from `instagram-clone-front`.
4. Open Expo Go/emulator/browser and test login/feed/create post flows.

## Docker Setup (Recommended for Azure)

Containerization is a good fit for your backend if you plan to deploy to Azure soon.

### Files added

- `instagram-clone/InstaClone.Api/Dockerfile` (multi-stage .NET 9 image)
- `instagram-clone/docker-compose.yml` (API + MySQL local stack)
- `instagram-clone/.dockerignore`

### Run with Docker Compose

From `instagram-clone`:

```bash
docker compose up --build -d
```

API will be available at:
- `http://localhost:5042`

MySQL runs inside Docker and is reachable by the API using service host `db` on port `3306`.

By default, MySQL is not published to your Windows host to avoid conflicts with any local MySQL install already using port `3306`.

If you need host access (for a DB GUI), temporarily publish another host port in `docker-compose.yml`, for example:

```yaml
ports:
  - "3307:3306"
```

To stop:

```bash
docker compose down
```

To stop and remove DB volume data:

```bash
docker compose down -v
```

### EF Core migrations when containerized

Apply migrations before first use (or after model changes):

```bash
cd instagram-clone/InstaClone.Api
dotnet ef database update
```

The API container uses `ConnectionStrings__Default` so it connects to the `db` service inside Compose.

### Azure path

This setup is compatible with an Azure container workflow.

- Build and push image to Azure Container Registry (ACR).
- Deploy to Azure App Service for Containers or Azure Container Apps.
- Set environment variables in Azure (especially `ConnectionStrings__Default`, `Firebase__ProjectId`, and any JWT fallback settings if needed).
- Use Azure Database for MySQL in production instead of the local Compose MySQL container.

## Troubleshooting

- 401 Unauthorized from API:
  - Check `Authorization: Bearer <firebase-id-token>` is being sent.
  - Verify backend `Firebase:ProjectId` matches the same Firebase project used by frontend.
- Cannot connect from phone/emulator:
  - Update `EXPO_PUBLIC_API_BASE_URL` to the correct host for your device type.
- Database errors on startup:
  - Confirm MySQL is running and connection string credentials are valid.
  - Run `dotnet ef database update` again.

## Notes

- Backend uses CORS policy intended for development (`AllowAnyOrigin`).
- Rate limiting is enabled in the API for auth, read, and write endpoints.
- Post images are uploaded through the API and stored locally in `instagram-clone/InstaClone.Api/wwwroot/uploads`.
- The upload path is behind `IImageStorageService`, so you can swap local disk storage for cloud storage later without changing the create-post screen.
