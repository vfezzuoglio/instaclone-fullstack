FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["InstaClone.Api/InstaClone.Api.csproj", "InstaClone.Api/"]
RUN dotnet restore "InstaClone.Api/InstaClone.Api.csproj"

COPY . .
WORKDIR "/src/InstaClone.Api"
RUN dotnet publish "InstaClone.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "InstaClone.Api.dll"]
