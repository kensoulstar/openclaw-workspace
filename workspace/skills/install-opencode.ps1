$source = "C:\Users\S2673S\Desktop\skills"
$target = "C:\Users\S2673S\AppData\Local\nvm\v22.22.1\node_global\node_modules\openclaw\skills\opencode-cn"

# List all files
$files = Get-ChildItem $source
foreach ($f in $files) {
    Write-Host $f.Name
}

# Find OpenCode zip - using wildcard
$openCodeZip = Get-ChildItem "$source\OpenCode*" | Select-Object -First 1
if ($openCodeZip) {
    Write-Host "Found: $($openCodeZip.Name)"
    Expand-Archive -Path $openCodeZip.FullName -DestinationPath $target -Force
    Write-Host "Extracted to $target"
} else {
    Write-Host "OpenCode zip not found"
}