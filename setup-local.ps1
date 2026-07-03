# Setup proyek Bank Sumut Corporate Secretary ke D:\workshopai
# Jalankan di PowerShell (Run as Administrator jika perlu):
#   Set-ExecutionPolicy -Scope Process Bypass -Force; .\setup-local.ps1

$TargetPath = "D:\workshopai"
$RepoUrl = "https://github.com/kelompok8ai/repo-day1-a.git"
$Branch = "cursor/corporate-secretary-landing-18ee"

Write-Host "=== Setup Bank Sumut Corporate Secretary ===" -ForegroundColor Green
Write-Host "Target: $TargetPath"

if (-not (Test-Path "D:\")) {
    Write-Host "ERROR: Drive D: tidak ditemukan." -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path $TargetPath | Out-Null

if (Test-Path "$TargetPath\.git") {
    Write-Host "Folder sudah ada. Melakukan git pull..." -ForegroundColor Yellow
    Set-Location $TargetPath
    git fetch origin
    git checkout $Branch
    git pull origin $Branch
} else {
    if ((Get-ChildItem $TargetPath -Force | Measure-Object).Count -gt 0) {
        Write-Host "Folder $TargetPath tidak kosong. Clone ke subfolder sementara..." -ForegroundColor Yellow
        $TempClone = "$env:TEMP\repo-day1-a-clone"
        if (Test-Path $TempClone) { Remove-Item $TempClone -Recurse -Force }
        git clone -b $Branch $RepoUrl $TempClone
        Copy-Item -Path "$TempClone\*" -Destination $TargetPath -Recurse -Force
        Copy-Item -Path "$TempClone\.gitignore" -Destination $TargetPath -Force -ErrorAction SilentlyContinue
        Remove-Item $TempClone -Recurse -Force
    } else {
        Write-Host "Cloning dari GitHub..." -ForegroundColor Cyan
        git clone -b $Branch $RepoUrl $TargetPath
        Set-Location $TargetPath
    }
}

Set-Location $TargetPath

if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "Menginstall dependencies..." -ForegroundColor Cyan
    npm install
    Write-Host ""
    Write-Host "Selesai! Jalankan dengan:" -ForegroundColor Green
    Write-Host "  cd D:\workshopai" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
} else {
    Write-Host "Node.js/npm belum terinstall. Install Node.js dulu, lalu jalankan:" -ForegroundColor Yellow
    Write-Host "  cd D:\workshopai" -ForegroundColor White
    Write-Host "  npm install && npm run dev" -ForegroundColor White
}
