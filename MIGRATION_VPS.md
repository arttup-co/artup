# VPS Migration Guide: Fix Image Upload 404 Issue

This guide will help you migrate your existing uploaded files from the old `public/uploads/` directory to the new persistent `uploads/` directory after deploying the fix for the image 404 issue.

## What Changed?

**Before:**
- Images saved to: `public/uploads/avatars/` and `public/uploads/covers/`
- Served via Next.js static file handler from `public/` directory
- **Problem:** In standalone builds, files uploaded after deployment weren't accessible

**After:**
- Images saved to: `uploads/avatars/` and `uploads/covers/` (persistent directory outside `.next/`)
- Served via API route: `/api/uploads/[...path]`
- **Result:** Works in both dev and production, survives rebuilds

## Migration Steps on VPS

### 1. Pull Latest Code and Rebuild

```bash
# SSH into your VPS
ssh your-vps

# Navigate to your app directory
cd /path/to/artup

# Pull the latest changes
git pull origin main

# Install dependencies (if needed)
npm install

# Rebuild the application
npm run build
```

### 2. Create New Uploads Directory Structure

The directory structure should already exist from git (with `.gitkeep` files), but let's ensure it's there:

```bash
# Verify directories exist
ls -la uploads/
ls -la uploads/avatars/
ls -la uploads/covers/

# If they don't exist, create them
mkdir -p uploads/avatars
mkdir -p uploads/covers
```

### 3. Move Existing Uploaded Files

**Important:** Only run these commands if you have existing uploaded files.

```bash
# Check if old upload directories exist and have files
if [ -d "public/uploads/avatars" ] && [ "$(ls -A public/uploads/avatars)" ]; then
  echo "Moving avatar files..."
  mv public/uploads/avatars/* uploads/avatars/ 2>/dev/null
  echo "Avatar files moved successfully"
else
  echo "No avatar files to move"
fi

if [ -d "public/uploads/covers" ] && [ "$(ls -A public/uploads/covers)" ]; then
  echo "Moving cover files..."
  mv public/uploads/covers/* uploads/covers/ 2>/dev/null
  echo "Cover files moved successfully"
else
  echo "No cover files to move"
fi

# Verify files were moved
echo "Files in uploads/avatars/:"
ls -lh uploads/avatars/

echo "Files in uploads/covers/:"
ls -lh uploads/covers/
```

### 4. Clean Up Old Upload Directory

After verifying files are moved and working:

```bash
# Remove the old uploads directory
rm -rf public/uploads/

# Verify it's gone
ls -la public/ | grep uploads
# Should return nothing
```

### 5. Restart Your Application

Depending on how you're running your app:

**If using PM2:**
```bash
pm2 restart artup
# or
pm2 restart all
```

**If using systemd:**
```bash
sudo systemctl restart artup
```

**If running directly:**
```bash
# Stop the current process (Ctrl+C if in terminal, or kill the PID)
# Then start again
npm start
```

### 6. Verify Everything Works

**Test image upload:**
1. Go to your admin settings: `https://annouri.site/admin/settings`
2. Upload a new avatar image
3. Verify it displays correctly
4. Check the URL in browser DevTools - it should be `/api/uploads/avatars/...`

**Test existing images (if you had any):**
1. Check your homepage or author page
2. Verify old images still display (they should now be served via `/api/uploads/...`)

**Check filesystem:**
```bash
# New uploads should appear here
ls -lh uploads/avatars/
ls -lh uploads/covers/

# Old directory should be empty/gone
ls -lh public/uploads/ 2>/dev/null || echo "Old directory removed"
```

## Important Notes

### File Permissions

Ensure your app user has read/write permissions on the uploads directory:

```bash
# Check current permissions
ls -ld uploads/

# If needed, set proper ownership
sudo chown -R your-app-user:your-app-user uploads/

# Verify
ls -ld uploads/
# Should show your-app-user as owner
```

### Database URLs

**New uploads** will automatically get URLs like `/api/uploads/avatars/...` from the updated upload routes.

**Old uploads** in the database might still have URLs like `/uploads/avatars/...`. These will NOT work because:
1. The files were moved from `public/uploads/` to `uploads/`
2. Old URLs reference the old path served by Next.js static handler
3. New serving route expects `/api/uploads/...` URLs

**Solutions:**

**Option A: Update database URLs (Recommended)**

If you have existing uploads in your database, update them:

```bash
# Connect to your database
npx prisma studio
# or use SQLite CLI
sqlite3 prisma/dev.db

# Update User avatarUrl fields
UPDATE User
SET avatarUrl = REPLACE(avatarUrl, '/uploads/', '/api/uploads/')
WHERE avatarUrl LIKE '/uploads/%';

# Update Post coverImageUrl fields
UPDATE Post
SET coverImageUrl = REPLACE(coverImageUrl, '/uploads/', '/api/uploads/')
WHERE coverImageUrl LIKE '/uploads/%';

# Verify changes
SELECT id, name, avatarUrl FROM User WHERE avatarUrl IS NOT NULL;
SELECT id, title, coverImageUrl FROM Post WHERE coverImageUrl IS NOT NULL;
```

**Option B: Manual re-upload (If you only have a few images)**

Simply re-upload the avatar/cover images through the admin interface. The old files will remain on disk but won't be used.

### Backup Before Migration

It's always good practice to backup before making changes:

```bash
# Backup uploaded files
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz public/uploads/ 2>/dev/null || echo "No files to backup"

# Backup database
cp prisma/dev.db prisma/dev.db.backup-$(date +%Y%m%d)

# List backups
ls -lh uploads-backup-*.tar.gz
ls -lh prisma/dev.db.backup-*
```

## Troubleshooting

### Images still return 404

**Check 1: File exists?**
```bash
ls -lh uploads/avatars/avatar-1789557163020-e7sokhl9vcu.jpeg
```

**Check 2: URL format correct?**
- Old format: `/uploads/avatars/...` ❌
- New format: `/api/uploads/avatars/...` ✅

**Check 3: App restarted?**
```bash
pm2 list
# or
ps aux | grep node
```

**Check 4: Check logs**
```bash
pm2 logs artup
# or check your app logs
```

### Permission denied errors

```bash
# Fix ownership
sudo chown -R your-app-user:your-app-user uploads/

# Fix permissions
chmod -R 755 uploads/
```

### Files moved but images don't load

Check if database URLs need updating (see "Database URLs" section above).

### New uploads work but old images don't

Database URLs likely still reference old paths. Update them using Option A in "Database URLs" section.

## Testing Checklist

After migration, verify:

- [ ] Old avatar images display correctly (if any existed)
- [ ] Old cover images display correctly (if any existed)
- [ ] New avatar upload works
- [ ] New cover image upload works
- [ ] Uploaded files persist after `npm run build` (don't rebuild until after testing!)
- [ ] Browser DevTools shows images loading from `/api/uploads/...`
- [ ] No 404 errors in browser console
- [ ] Files exist in `uploads/avatars/` and `uploads/covers/`
- [ ] Old `public/uploads/` directory is removed

## Questions?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the logs: `pm2 logs artup` or your system logs
3. Verify file permissions and ownership
4. Check database URLs are in the correct format

## Summary

The key points:
- Files now stored in `uploads/` (outside `public/`)
- Served via `/api/uploads/[...path]` API route
- Old files must be moved from `public/uploads/` to `uploads/`
- Database URLs should use `/api/uploads/...` format
- Works identically in dev and production
- Survives rebuilds and redeployments
