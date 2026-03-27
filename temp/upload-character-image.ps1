param(
    [string]$characterId,
    [string]$filePath
)

$uri = "http://localhost:8081/api/characters/$characterId/image"
$fileContent = Get-Content -Path $filePath -Encoding Byte
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"$(Split-Path $filePath -Leaf)`"",
    "Content-Type: image/png",
    "",
    [System.Text.Encoding]::ASCII.GetString($fileContent),
    "--$boundary--"
)

$body = $bodyLines -join $LF

Invoke-WebRequest -Uri $uri -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $body -UseBasicParsing
