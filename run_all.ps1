# ==============================
# run_all.ps1  –  ONE‑CLICK SETUP &
#                 START FOR THE ML PROJECT
# ==============================
# Prerequisite: PowerShell 5+ (default on Windows)

# -------------------------------------------------
# 0️⃣  Basic configuration – password already filled in
# -------------------------------------------------
$mongoUser   = "24ce079_db_user"
# The '@' in the password must be URL-encoded as '%40' for the connection string to work.
$mongoPass   = "Drashtipatel%401410"
$mongoHost   = "cluster0.7fooquq.mongodb.net"
$mongoDBName = "phishguard"                 # Updated to match project database name

# Safely embed variables using ${}
$mongoURI = "mongodb+srv://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDBName}?retryWrites=true&w=majority"

# -------------------------------------------------
# 1️⃣  Create .env files
# -------------------------------------------------
# Backend .env (used by FastAPI)
$backendEnvPath = Join-Path $PSScriptRoot "backend\.env"
@"
MONGODB_URI=$mongoURI
PORT=8000
"@ | Set-Content -Path $backendEnvPath -Encoding UTF8

# Frontend .env (used by Vite – VITE_ prefix is required)
$frontendEnvPath = Join-Path $PSScriptRoot "frontend\.env"
@"
VITE_MONGODB_URI=$mongoURI
"@ | Set-Content -Path $frontendEnvPath -Encoding UTF8

Write-Host "`n[OK] .env files created."

# -------------------------------------------------
# 2️⃣  Install Frontend (Node) dependencies
# -------------------------------------------------
Set-Location (Join-Path $PSScriptRoot "frontend")
if (-not (Test-Path "node_modules")) {
    npm install
}
# Ensure `concurrently` is present (used later to run both servers)
if (-not (npm list concurrently --depth=0 2>$null)) {
    npm install concurrently --save-dev
}
Write-Host "`n[OK] Frontend dependencies installed."

# -------------------------------------------------
# 3️⃣  Set up Python virtual‑env for Backend
# -------------------------------------------------
Set-Location (Join-Path $PSScriptRoot "backend")
$venvPath = Join-Path $PSScriptRoot "backend\.venv"
if (-not (Test-Path $venvPath)) {
    python -m venv $venvPath
}
# Activate venv (PowerShell)
& "$venvPath\Scripts\Activate.ps1"

# Upgrade pip & install requirements
python -m pip install --upgrade pip
pip install -r ..\requirements.txt
Write-Host "`n[OK] Backend virtual-env ready and packages installed."

# -------------------------------------------------
# 4️⃣  Add a combined start script to the Frontend package.json
# -------------------------------------------------
Set-Location (Join-Path $PSScriptRoot "frontend")
$pkgJson = Get-Content -Raw -Path "package.json" | ConvertFrom-Json
if (-not $pkgJson.scripts.startAll) {
    $pkgJson.scripts | Add-Member -MemberType NoteProperty -Name "startAll" `
        -Value "concurrently `"npm run dev`" `"cd ..\\backend && .\\.venv\\Scripts\\activate && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload`""
    $pkgJson | ConvertTo-Json -Depth 10 | Set-Content -Path "package.json" -Encoding UTF8
    Write-Host "`n[OK] Added npm script `"startAll`" to frontend/package.json."
}
# (no else block needed)

# -------------------------------------------------
# 5️⃣  Run everything
# -------------------------------------------------
Write-Host "`n[START] Launching Full Stack Application..."
Set-Location (Join-Path $PSScriptRoot "frontend")
# Launch both frontend and backend concurrently in a separate process so the script can continue
Start-Process -FilePath "npm" -ArgumentList "run","startAll" -NoNewWindow
# Give servers a few seconds to start
Start-Sleep -Seconds 6
# Open the frontend UI (Vite) on the configured port 5174
Start-Process "http://localhost:5174"
# Open FastAPI docs (backend API)
Start-Process "http://localhost:8000/docs"
