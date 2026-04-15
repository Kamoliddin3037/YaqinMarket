#!/bin/bash
# Mahalla Dukoni - Avtomatik Git Backup
# Ishlatish: ./backup.sh yoki cron orqali

cd /Users/kamoliddin/Documents/files

# O'zgarishlar bormi?
if git diff --quiet && git diff --staged --quiet; then
    echo "$(date '+%Y-%m-%d %H:%M') - O'zgarish yo'q, backup kerak emas."
    exit 0
fi

# Stage va commit
git add .
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
git commit -m "Auto backup: $TIMESTAMP"

# GitHub remote ulangan bo'lsa push qiladi
if git remote get-url origin &>/dev/null; then
    git push origin main && echo "$(date '+%Y-%m-%d %H:%M') - GitHub ga push qilindi."
else
    echo "$(date '+%Y-%m-%d %H:%M') - Lokal commit saqlandi (remote yo'q)."
fi
