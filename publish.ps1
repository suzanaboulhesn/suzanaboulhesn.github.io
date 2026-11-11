# Publishes this folder to https://suzanaboulhesn.github.io
#
# Before running:
#   1. The GitHub account "suzanaboulhesn" exists (sign up at https://github.com/signup).
#   2. The GitHub CLI has a login for that account (it can sit alongside your own):
#        gh auth login --web      (approve it while signed in to github.com as suzanaboulhesn)
#      The script switches gh to her account for the publish and switches back afterwards.
#
# Then run from this folder:   ./publish.ps1
# Re-run it any time you change the site; it commits and pushes, and GitHub rebuilds automatically.

$User = 'suzanaboulhesn'
$Repo = "$User.github.io"
Set-Location $PSScriptRoot

function Fail($msg) { Write-Host "`n$msg" -ForegroundColor Red; exit 1 }

# 1. Make sure gh has Suzan's account, and use it just for this run
gh auth token --user $User *> $null
if ($LASTEXITCODE -ne 0) { Fail "The GitHub CLI has no login for '$User'. Run: gh auth login   (while signed in to github.com as $User)" }
$previous = gh api user --jq .login 2>$null
if ($previous -ne $User) { gh auth switch --user $User | Out-Null }

# Push with gh's credentials for this command only (leaves your global git credential setup untouched)
$gh = (Get-Command gh).Source -replace '\\', '/'
$helper = "credential.helper=!'$gh' auth git-credential"

try {
$id = gh api user --jq .id

# 2. Commit the site
if (-not (Test-Path .git)) { git init -b main | Out-Null }
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  $message = @"
Publish portfolio

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
"@
  git -c user.name="Suzan Aboul Hesn" -c user.email="$id+$User@users.noreply.github.com" commit -q -m $message
  if ($LASTEXITCODE -ne 0) { Fail "git commit failed." }
} else {
  Write-Host "No changes to commit."
}

# 3. Create the repository on first run
gh repo view "$User/$Repo" *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Creating repository $User/$Repo ..."
  gh repo create $Repo --public --description "Architecture portfolio of Suzan Aboul Hesn" --homepage "https://$Repo"
  if ($LASTEXITCODE -ne 0) { Fail "Could not create the repository." }
}

# 4. Turn on GitHub Pages, built by the included GitHub Actions workflow
gh api "repos/$User/$Repo/pages" *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Enabling GitHub Pages ..."
  gh api -X POST "repos/$User/$Repo/pages" -f build_type=workflow | Out-Null
  if ($LASTEXITCODE -ne 0) { Fail "Could not enable GitHub Pages. Enable it manually: repo Settings > Pages > Source: GitHub Actions." }
}

# 5. Push
git remote get-url origin *> $null
if ($LASTEXITCODE -ne 0) { git remote add origin "https://github.com/$User/$Repo.git" }
git -c credential.helper= -c $helper push -u origin main
if ($LASTEXITCODE -ne 0) { Fail "git push failed." }

Write-Host "`nPushed. The site builds in about a minute:" -ForegroundColor Green
Write-Host "  Progress:  https://github.com/$User/$Repo/actions"
Write-Host "  Live at:   https://$Repo"
}
finally {
  # Hand the GitHub CLI back to whichever account was active before
  if ($previous -and $previous -ne $User) { gh auth switch --user $previous | Out-Null }
}
