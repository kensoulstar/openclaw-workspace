$skillsDir = "C:\Users\S2673S\AppData\Local\nvm\v22.22.1\node_global\node_modules\openclaw\skills"
$skills = Get-ChildItem $skillsDir -Directory | Select-Object -ExpandProperty Name

$results = @()

foreach ($skill in $skills) {
    $skillPath = Join-Path $skillsDir $skill
    $skillMdPath = Join-Path $skillPath "SKILL.md"
    $readmeMdPath = Join-Path $skillPath "README.md"
    $descPath = Join-Path $skillPath "description.md"
    
    $description = ""
    
    # Try SKILL.md first (frontmatter)
    if (Test-Path $skillMdPath) {
        $content = Get-Content $skillMdPath -Raw -Encoding UTF8
        if ($content -match 'description:\s*[''"]([^''"]+)[''"]') {
            $description = $matches[1]
        }
        elseif ($content -match 'description:\s*([^\n]+)') {
            $description = $matches[1].Trim()
        }
    }
    
    # Try README.md
    if (-not $description -and (Test-Path $readmeMdPath)) {
        $content = Get-Content $readmeMdPath -Raw -Encoding UTF8
        if ($content -match 'description:\s*[''"]([^''"]+)[''"]') {
            $description = $matches[1]
        }
    }
    
    # Try description.md
    if (-not $description -and (Test-Path $descPath)) {
        $content = Get-Content $descPath -Raw -Encoding UTF8
        $description = $content.Substring(0, [Math]::Min(200, $content.Length)).Trim()
    }
    
    # If still no description, try to get from _meta.json
    if (-not $description) {
        $metaPath = Join-Path $skillPath "_meta.json"
        if (Test-Path $metaPath) {
            try {
                $meta = Get-Content $metaPath -Raw | ConvertFrom-Json
                if ($meta.description) {
                    $description = $meta.description
                }
            } catch {}
        }
    }
    
    if (-not $description) {
        $description = "(无说明)"
    }
    
    # Truncate long descriptions
    if ($description.Length -gt 80) {
        $description = $description.Substring(0, 77) + "..."
    }
    
    $results += [PSCustomObject]@{
        SkillName = $skill
        Description = $description
    }
}

$results | Sort-Object SkillName | Format-Table -AutoSize