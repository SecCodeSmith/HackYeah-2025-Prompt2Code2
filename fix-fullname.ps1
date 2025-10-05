# Fix User.FullName references in messaging handlers
$files = @(
    'c:\Users\Kuba\Desktop\HackYeah 2025\Backend\Backend.Application\Features\Messages\Handlers\GetMessageByIdQueryHandler.cs',
    'c:\Users\Kuba\Desktop\HackYeah 2025\Backend\Backend.Application\Features\Messages\Handlers\SendMessageCommandHandler.cs',
    'c:\Users\Kuba\Desktop\HackYeah 2025\Backend\Backend.Application\Features\Messages\Handlers\ReplyToMessageCommandHandler.cs',
    'c:\Users\Kuba\Desktop\HackYeah 2025\Backend\Backend.Application\Features\Messages\Handlers\GetSentMessagesQueryHandler.cs',
    'c:\Users\Kuba\Desktop\HackYeah 2025\Backend\Backend.Application\Features\Messages\Handlers\GetInboxMessagesQueryHandler.cs',
    'c:\Users\Kuba\Desktop\HackYeah 2025\Backend\Backend.Application\Features\Messages\Handlers\GetMessageThreadQueryHandler.cs'
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    $content = $content -replace '\.Sender\?\.FullName', '.Sender != null ? $"{$0.FirstName} {$0.LastName}" : null' -replace '\$0', 'message.Sender'
    $content = $content -replace '\.Recipient\?\.FullName', '.Recipient != null ? $"{$0.FirstName} {$0.LastName}" : null' -replace '\$0', 'message.Recipient'
    $content = $content -replace 'message\.Sender\?\.FullName \?\? "Unknown"', 'message.Sender != null ? $"{message.Sender.FirstName} {message.Sender.LastName}" : "Unknown"'
    $content = $content -replace 'message\.Recipient\?\.FullName', 'message.Recipient != null ? $"{message.Recipient.FirstName} {message.Recipient.LastName}" : null'
    $content = $content -replace 'm\.Sender\?\.FullName \?\? "Unknown"', 'm.Sender != null ? $"{m.Sender.FirstName} {m.Sender.LastName}" : "Unknown"'
    $content = $content -replace 'm\.Recipient\?\.FullName', 'm.Recipient != null ? $"{m.Recipient.FirstName} {m.Recipient.LastName}" : null'
    $content = $content -replace 'createdReply\.Sender\?\.FullName \?\? "Unknown"', 'createdReply.Sender != null ? $"{createdReply.Sender.FirstName} {createdReply.Sender.LastName}" : "Unknown"'
    $content = $content -replace 'createdReply\.Recipient\?\.FullName', 'createdReply.Recipient != null ? $"{createdReply.Recipient.FirstName} {createdReply.Recipient.LastName}" : null'
    Set-Content $file -Value $content -NoNewline
}

Write-Host 'Fixed User.FullName references in all handlers'
