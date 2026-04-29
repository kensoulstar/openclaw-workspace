$skillsDir = "C:\Users\S2673S\AppData\Local\nvm\v22.22.1\node_global\node_modules\openclaw\skills"
$dirs = Get-ChildItem $skillsDir -Directory
$skillNames = @()
foreach ($d in $dirs) {
    $skillNames += $d.Name
}
Write-Output ($skillNames -join "`n")