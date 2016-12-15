# roulette
## Setup SteamAUTH
1. Open /client/templates/chat/chat.html
2. Insert: "{{> loginButtons}}", on the second line. (Without Quotes)
3. Fill in your preferred settings
4. Press: "Save Configuration"
5. Remove "{{> loginButtons}}"

## Setup First-Admin
1. Open 2_Connect_MongoDB.bat
2. Copy/Type: "db.users.update({"profile.id": "YourSteamId64"}, {$set: {"profile.group": "superadmin"}})" and press enter