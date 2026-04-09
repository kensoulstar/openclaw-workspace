$sourceDir = "C:\Users\S2673S\Desktop\skills"
$targetDir = "C:\Users\S2673S\AppData\Local\nvm\v22.22.1\node_global\node_modules\openclaw\skills"
$zipFiles = Get-ChildItem "$sourceDir\*.zip"
$installedDirs = Get-ChildItem $targetDir -Directory | Select-Object -ExpandProperty Name

Write-Host "=== Desktop skills (Total: $($zipFiles.Count)) ==="
$skillsMap = @{}
foreach ($file in $zipFiles) {
    $name = $file.Name -replace '-[\d.]+\.zip$',''
    $skillsMap[$name] = $file.Name
    Write-Host "  $name"
}

Write-Host ""
Write-Host "=== Installed skills (Total: $($installedDirs.Count)) ==="
foreach ($d in $installedDirs) {
    Write-Host "  $d"
}

Write-Host ""
Write-Host "=== Skills to install ==="
$toInstall = @()
foreach ($skill in $skillsMap.Keys) {
    $found = $false
    foreach ($installed in $installedDirs) {
        if ($skill -eq $installed -or $skill -like "*$installed*" -or $installed -like "*$skill*") {
            $found = $true
            break
        }
    }
    if (-not $found) {
        $toInstall += $skill
        Write-Host "  [NEW] $($skillsMap[$skill])"
    }
}

Write-Host ""
Write-Host "Total to install: $($toInstall.Count)"