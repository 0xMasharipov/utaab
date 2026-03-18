

# Fix Translation JSON Editor

## Problem
The Translation Editor component likely has two issues:
1. After editing JSON and clicking "Apply Changes", the i18n change event doesn't force a re-render across the app — `i18n.addResourceBundle` alone may not trigger component updates reliably
2. The edits state resets when switching locales since it's only tracked in component state

## Changes

**File: `src/components/admin/TranslationEditor.tsx`**

1. **Force i18n language change event** after applying bundle — call `i18n.changeLanguage(selectedLocale)` after `addResourceBundle` to trigger re-renders in all components using `useTranslation`
2. **Add a key counter** to force Textarea re-mount when locale changes (prevents stale values)
3. **Add confirmation feedback** — show which sections were updated in the success toast

**Updated apply logic:**
```typescript
i18n.addResourceBundle(selectedLocale, 'translation', merged, true, true);
// Force re-render across app
i18n.changeLanguage(selectedLocale);
```

## Technical Details
- `addResourceBundle` updates internal resources but doesn't always emit the `languageChanged` event that triggers React re-renders
- Calling `changeLanguage` with the same language forces the event emission, causing all `useTranslation` hooks to re-read values
- Single file change, no database or backend modifications needed

