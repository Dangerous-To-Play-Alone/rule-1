# Backup & Restore Configuration Feature

## Overview

Users can now backup and restore their complete configuration including custom brackets, card categories, global bans, and all custom card lists. This allows users to:
- Save their customized settings
- Share configurations with others
- Migrate settings between devices/browsers
- Recover from accidental changes

## Implementation

### ConfigManager Methods

#### `exportBackup()`
Creates a backup object with metadata and current configuration.

**Returns:** Object containing:
```json
{
  "version": "1.0.0",
  "exportDate": "2026-01-25T03:25:00.000Z",
  "appName": "Rule Minus One",
  "config": {
    "brackets": { ... },
    "globalBans": [ ... ],
    "cardCategories": { ... }
  }
}
```

#### `downloadBackup(filename?: string)`
Downloads configuration as a timestamped JSON file.

**Parameters:**
- `filename` (optional): Custom filename (defaults to `rulezero-backup-YYYY-MM-DDTHH-mm.json`)

**Example:**
```javascript
configManager.downloadBackup();
// Downloads: rulezero-backup-2026-01-25T03-25-00.json
```

#### `importBackup(backup: Object, merge: boolean)`
Imports and applies a backup configuration.

**Parameters:**
- `backup`: Backup object to restore
- `merge`: If true, merges with existing config; if false, replaces entirely

**Validation:**
- Checks for valid backup structure
- Validates required fields (brackets, globalBans, cardCategories)
- Logs metadata (version, exportDate, appName)
- Throws descriptive errors for invalid backups

**Merge Behavior:**
- **Brackets**: Overwrites existing brackets with same ID, adds new ones
- **Global Bans**: Adds new bans to existing list (no duplicates)
- **Card Categories**: Adds new categories; for existing categories, merges card lists without duplicates

**Replace Behavior:**
- Completely replaces all configuration with backup data
- Previous settings are lost

#### `restoreFromFile(file: File, merge: boolean)`
Restores configuration from a JSON file.

**Parameters:**
- `file`: JSON file object from file input
- `merge`: If true, merges with existing config; if false, replaces entirely

**Returns:** Promise that resolves when restore is complete

**Error Handling:**
- Invalid JSON: "Failed to parse backup file: [error]"
- Missing/corrupt data: "Invalid backup: [specific issue]"
- File read errors: "Failed to read backup file"

### UI Components

#### Backup Button
- **Label**: "💾 Download Backup"
- **Action**: Triggers immediate download of timestamped JSON file
- **Feedback**: Alert on success/failure

#### Restore Button
- **Label**: "📂 Restore Backup"
- **Type**: File input styled as button
- **Accepts**: `.json` files only
- **Action**: Opens file picker, then:
  1. Prompts user to choose merge or replace mode
  2. Validates and imports backup
  3. Refreshes UI
  4. Shows success/error alert

#### User Prompts

**Merge vs Replace:**
```
Do you want to MERGE this backup with your current settings?

Click OK to merge (add new items, keep existing)
Click Cancel to REPLACE everything with the backup
```

**Success Messages:**
- Merge: "Configuration merged successfully!"
- Replace: "Configuration restored successfully!"
- Backup: "Configuration backed up successfully!"

**Error Messages:**
- Displayed below buttons in red
- Console logs full error for debugging

## User Experience

### Creating a Backup

1. User clicks "💾 Download Backup" button
2. Browser downloads JSON file with timestamp
3. Success alert appears
4. File can be shared, stored, or used for restore

**Example Filename:**
```
rulezero-backup-2026-01-25T03-25-00.json
```

### Restoring from Backup

1. User clicks "📂 Restore Backup" button
2. File picker opens (accepts only .json files)
3. User selects backup file
4. Prompt asks: Merge or Replace?
   - **Merge**: Adds new items, preserves existing ones
   - **Replace**: Completely overwrites current settings
5. Backup is validated and applied
6. Success message appears
7. All UI components refresh with new configuration

### Merge Example

**Current Config:**
- Brackets: 1, 2, 3, 4
- Global Bans: ["Card A", "Card B"]
- Categories: tutors (10 cards), customCategory (5 cards)

**Backup Config:**
- Brackets: 3 (modified), 5 (new)
- Global Bans: ["Card B", "Card C"]
- Categories: tutors (12 cards), newCategory (3 cards)

**After Merge:**
- Brackets: 1, 2, 3 (updated), 4, 5 (added)
- Global Bans: ["Card A", "Card B", "Card C"]
- Categories: tutors (merged, ~15-20 cards), customCategory (5 cards), newCategory (3 cards)

## Backup File Structure

```json
{
  "version": "1.0.0",
  "exportDate": "2026-01-25T03:25:00.000Z",
  "appName": "Rule Minus One",
  "config": {
    "brackets": {
      "1": {
        "name": "Bracket 1",
        "description": "...",
        "limits": { ... },
        "bannedCards": [ ... ]
      },
      ...
    },
    "globalBans": [
      "Ancestral Recall",
      "Black Lotus",
      ...
    ],
    "cardCategories": {
      "tutors": ["Demonic Tutor", ...],
      "twoCardCombos": [...],
      "gameChangers": [...],
      "landDenial": [...],
      "customCategory": [...]
    }
  }
}
```

## Use Cases

### Personal Backup
Save your carefully curated settings before making experimental changes:
```
1. Download backup before changes
2. Experiment with new settings
3. If unsatisfied, restore from backup (Replace mode)
```

### Sharing with Playgroup
Share standardized bracket definitions:
```
1. Pod leader creates and downloads backup
2. Shares JSON file with group
3. Members restore backup (Merge/Replace as needed)
4. Everyone uses same bracket definitions
```

### Multi-Device Sync
Keep settings consistent across devices:
```
1. Export backup on Device A
2. Transfer file (email, cloud storage, etc.)
3. Import backup on Device B
4. Both devices now have same configuration
```

### Configuration Templates
Create templates for different playgroups:
```
rulezero-backup-casual-pod.json
rulezero-backup-competitive-pod.json
rulezero-backup-budget-pod.json
```

## Error Handling

### Validation Errors
```javascript
// Invalid JSON
"Failed to parse backup file: Unexpected token..."

// Missing required fields
"Invalid backup: Missing config data"
"Invalid backup: Missing required config fields (brackets, globalBans, or cardCategories)"

// Wrong data type
"Invalid backup: Must be a valid object"
```

### Recovery
All errors are caught and displayed to user without breaking the app:
1. Error message shown below restore button
2. Full error logged to console for debugging
3. File input is reset
4. Current configuration remains unchanged

## Technical Details

### File Operations
- **Format**: JSON with 2-space indentation
- **MIME Type**: `application/json`
- **Encoding**: UTF-8
- **Max Size**: Effectively unlimited (localStorage limit is ~5-10MB)

### Browser Compatibility
- Uses `FileReader` API (supported in all modern browsers)
- Uses `Blob` and `URL.createObjectURL` for downloads
- Falls back gracefully if features unavailable

### Data Integrity
- Deep cloning prevents reference issues
- Validation before import prevents corruption
- Atomic operations (all-or-nothing)
- Original config preserved on error

## Future Enhancements

1. **Backup History**: Store last N backups in localStorage
2. **Auto-backup**: Periodic automatic backups
3. **Cloud Sync**: Optional cloud storage integration
4. **Backup Preview**: Show diff before restoring
5. **Partial Restore**: Choose specific sections to restore
6. **Backup Compression**: Reduce file size for large configs
7. **Version Migration**: Auto-upgrade old backup formats
8. **Export to Other Formats**: CSV, YAML, etc.

## Testing

### Manual Testing

**Test Backup:**
```
1. Add custom cards/categories
2. Click "Download Backup"
3. Verify JSON file downloads
4. Open file, verify structure and data
```

**Test Restore (Replace):**
```
1. Note current settings
2. Restore from backup (Cancel on prompt)
3. Verify settings match backup
4. Verify all custom data present
```

**Test Restore (Merge):**
```
1. Create backup A (with items X, Y)
2. Modify settings (add items Z)
3. Restore backup A (OK on prompt)
4. Verify X, Y, Z all present
```

**Test Error Handling:**
```
1. Try restoring invalid JSON
2. Try restoring JSON with missing fields
3. Try restoring non-JSON file
4. Verify error messages display
```

## Security Considerations

- Backups are plain JSON (not encrypted)
- Contains all configuration data
- Should be treated as sensitive if custom data includes private information
- File is downloaded, not uploaded to any server
- All operations are local (browser only)
