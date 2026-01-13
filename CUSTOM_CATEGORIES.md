# Custom Categories Feature

## Overview

The system now supports creating custom card categories beyond the four built-in categories (Tutors, Two-Card Combos, Game Changers, Land Denial). This allows users to track and limit any type of card they want, such as:
- **Stax** (Static effects that lock down opponents)
- **Fast Mana** (Mana acceleration)
- **Extra Turns**
- **Mass Land Destruction**
- **Cards We Just Don't Like**
- ...anything you can think of!

## Key Features

### 1. Dynamic Category Support

Categories are no longer hardcoded - they're stored in configuration and can be added/removed dynamically.

**Built-in Categories** (cannot be deleted):
- `tutors`
- `twoCardCombos`
- `gameChangers`
- `landDenial`

**Custom Categories** (user-defined):
- Any category name you want
- Automatically added to all bracket limits
- Can be deleted when no longer needed

### 2. Category Management UI

New UI elements in the "🃏 Manage Cards" tab:

#### Add Category
1. Click "+ Add Category" button
2. Enter category name (e.g., "Stax", "Fast Mana")
3. System converts to camelCase (e.g., "stax", "fastMana")
4. Automatically added to all brackets with ∞ limit
5. Can immediately add cards to the new category

#### Remove Category
1. Select a custom category from dropdown
2. Click "Delete Category" button (only shows for custom categories)
3. Confirms deletion
4. Removes category and all its cards
5. Removes from all bracket limits

### 3. Bracket Limit Integration

Custom categories automatically appear in bracket limits:

**Before adding "stax" category:**
```json
{
  "limits": {
    "tutors": 2,
    "twoCardCombos": 0,
    "gameChangers": 1,
    "landDenial": 0
  }
}
```

**After adding "stax" category:**
```json
{
  "limits": {
    "tutors": 2,
    "twoCardCombos": 0,
    "gameChangers": 1,
    "landDenial": 0,
    "stax": Infinity  // Added automatically
  }
}
```

You can then edit each bracket to set appropriate limits for the new category.

## Usage Examples

### Example 1: Add "Stax" Category

```javascript
// Via UI: Click "+ Add Category", enter "Stax"
// Result: Category "stax" is created

// Now you can add cards:
// Search for "Winter Orb", add to stax
// Search for "Static Orb", add to stax
// Search for "Stasis", add to stax
```

### Example 2: Limit Stax in Brackets

After creating the "stax" category:
1. Go to "📊 Manage Brackets"
2. Edit Bracket 1: Set stax limit to 0 (no stax allowed)
3. Edit Bracket 2: Set stax limit to 1 (one stax piece)
4. Edit Bracket 3: Set stax limit to 3 (up to three)
5. Edit Bracket 4: Leave as ∞ (unlimited)

### Example 3: Track "Fast Mana"

```javascript
// Add category "Fast Mana"
// Add cards:
// - Sol Ring
// - Mana Crypt
// - Mana Vault
// - Chrome Mox
// - Mox Diamond

// Set limits:
// Bracket 1: 1 (Sol Ring only)
// Bracket 2: 2
// Bracket 3: 4
// Bracket 4: ∞
```

## Implementation Details

### CardCategory Domain Entity

Updated to support dynamic categories:

```javascript
// Built-in categories (always present)
CardCategory.BUILT_IN_CATEGORIES = [
  'tutors',
  'twoCardCombos',
  'gameChangers',
  'landDenial'
];

// Get all categories from config
CardCategory.getCategories(config); // Returns all category keys

// Check if category is valid
CardCategory.isValid('stax', config); // true if exists

// Check if category is built-in
CardCategory.isBuiltIn('tutors'); // true
CardCategory.isBuiltIn('stax'); // false
```

### BracketAnalyzer

Now analyzes ALL categories in the configuration:

```javascript
// Before: Only checked hardcoded categories
categorizeCards(cards, categories) {
  const counts = CardCategory.createEmptyCounts();
  // ...
}

// After: Checks all categories dynamically
categorizeCards(cards, categories, config) {
  const counts = {};
  Object.keys(categories).forEach(category => {
    counts[category] = 0;
  });
  // ...
}
```

### ConfigManager Methods

New methods for category management:

```javascript
// Add category
configManager.addCategory('Stax', 'Stax');
// Returns: 'stax' (camelCase ID)
// Effect: Adds to cardCategories, adds ∞ limit to all brackets

// Remove category
configManager.removeCategory('stax');
// Effect: Removes from cardCategories and all bracket limits
// Note: Cannot remove built-in categories

// Get display name
configManager.getCategoryName('fastMana');
// Returns: 'Fast Mana'
```

## Storage Format

### Configuration with Custom Categories

```json
{
  "cardCategories": {
    "tutors": [...],
    "twoCardCombos": [...],
    "gameChangers": [...],
    "landDenial": [...],
    "stax": [
      { "id": "abc123", "name": "Winter Orb" },
      { "id": "def456", "name": "Static Orb" }
    ],
    "fastMana": [
      { "id": "ghi789", "name": "Mana Crypt" },
      { "id": "jkl012", "name": "Sol Ring" }
    ]
  },
  "brackets": {
    "1": {
      "name": "Bracket 1",
      "limits": {
        "tutors": 0,
        "twoCardCombos": 0,
        "gameChangers": 0,
        "landDenial": 0,
        "stax": 0,
        "fastMana": 1
      }
    }
  }
}
```

## UI Elements

### Category Dropdown
Shows all categories with "(Custom)" indicator:
```
Tutors
Two Card Combos
Game Changers
Land Denial
Stax (Custom)          ← Can be deleted
Fast Mana (Custom)     ← Can be deleted
```

### Bracket Display
Shows all limits dynamically:
```
Bracket 2: Upgraded Casual
• Tutors: 2
• Two Card Combos: 0
• Game Changers: 1
• Land Denial: 0
• Stax: 1                ← Custom category
• Fast Mana: 2           ← Custom category
```

## Benefits

### 1. Flexibility
- Create categories for your specific playgroup
- Track any type of card you want
- Adapt to your meta

### 2. Customization
- Different playgroups have different concerns
- Some hate stax, others hate combo
- Customize your ruleset

### 3. Evolvability
- Add new categories as the game evolves
- Track new mechanics or strategies
- Don't wait for updates

### 4. Simplicity
- Easy to add/remove categories
- Automatic integration with brackets
- Clean UI

## Example Use Cases

### Playgroup 1: Casual
```
Custom categories:
- Fast Mana (limit: 2 in all brackets)
- Extra Turns (limit: 0 in brackets 1-2, 1 in bracket 3)
```

### Playgroup 2: Competitive
```
Custom categories:
- Stax (limit: 0 in bracket 1, unlimited in bracket 4)
- Free Spells (track but don't limit)
```

### Playgroup 3: Theme Police
```
Custom categories:
- Cards We Banned (house ban list)
- Overused Cards (cards we're sick of)
- Fun Police (anything that prevents fun)
```

## Backward Compatibility

Existing configurations without custom categories work perfectly:
- Built-in categories always present
- Old configs just have 4 categories
- New categories added as needed
- No migration required

## Future Enhancements

1. **Category Descriptions**: Add description field to categories
2. **Category Colors**: Visual color coding for different category types
3. **Category Icons**: Icons for each category type
4. **Import/Export**: Share category definitions with others
5. **Templates**: Pre-defined category sets (e.g., "cEDH", "Casual", "Stax-heavy")
6. **Category Groups**: Organize related categories

## Testing

### Test Adding Category
```bash
cd web
npm start
# 1. Go to "🃏 Manage Cards"
# 2. Click "+ Add Category"
# 3. Enter "Stax"
# 4. Should see "Stax (Custom)" in dropdown
# 5. Should be able to add cards to it
```

### Test Category Limits
```bash
# 1. Add "Stax" category
# 2. Add some cards to it
# 3. Go to "📊 Manage Brackets"
# 4. Should see "Stax: ∞" in all brackets
# 5. Edit bracket to change stax limit
# 6. Analyze a deck with stax cards
# 7. Should see stax count in results
```

### Test Removing Category
```bash
# 1. Select "Stax (Custom)" category
# 2. Click "Delete Category"
# 3. Confirm deletion
# 4. Category should be removed
# 5. Go to brackets - stax limit should be gone
```

## Architecture

This feature maintains CLEAN Architecture:

- **Domain**: `CardCategory` value object supports dynamic categories
- **Use Cases**: No changes needed (business logic unchanged)
- **Infrastructure**: `BracketAnalyzer` dynamically processes all categories
- **Presentation**: `CardCategoryManager` UI for category management

The system is extensible without modifying core business logic!

## Summary

Custom categories make the bracket system:
- ✅ Flexible (track anything)
- ✅ Customizable (your playgroup, your rules)
- ✅ Extensible (add categories anytime)
- ✅ Clean (no code changes needed)
- ✅ Powerful (limit any card type)

Perfect for playgroups with specific preferences or meta considerations!
