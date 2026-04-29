# Skill List Export

$skillsDir = "C:\Users\S2673S\AppData\Local\nvm\v22.22.1\node_global\node_modules\openclaw\skills"
$dirs = Get-ChildItem $skillsDir -Directory

$csvContent = "SkillName,Description,Example`n"

foreach ($dir in $dirs) {
    $skillName = $dir.Name
    $skillPath = Join-Path $skillsDir $skillName
    $skillMdPath = Join-Path $skillPath "SKILL.md"
    
    $description = ""
    $example = ""
    
    if (Test-Path $skillMdPath) {
        $content = Get-Content $skillMdPath -Raw -Encoding UTF8
        
        if ($content -match 'description:\s*[''"]([^''"]+)[''"]') {
            $description = $matches[1]
        }
        
        if ($content -match '```bash\s*\n(.+?)```') {
            $example = $matches[1].Trim()
            if ($example.Length -gt 150) {
                $example = $example.Substring(0, 147) + "..."
            }
        }
    }
    
    if (-not $description) { $description = "N/A" }
    if (-not $example) { $example = "N/A" }
    
    # Escape commas in CSV
    $descEsc = $description -replace ',', ';'
    $exEsc = $example -replace ',', ';' -replace '`n', ' '
    
    $csvContent += "`"$skillName`",`"$descEsc`",`"$exEsc`"`n"
}

$csvContent | Out-File -FilePath "C:\Users\S2673S\.openclaw\workspace\skills.csv" -Encoding UTF8
Write-Host "Exported to skills.csv"
Write-Host "Total skills: $($dirs.Count)"