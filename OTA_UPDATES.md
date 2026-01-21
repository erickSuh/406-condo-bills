# OTA Updates Configuration

This project is configured to receive Over-The-Air (OTA) updates from Expo's servers. Updates are checked automatically when the app launches.

## Setup

### What's Already Configured:

1. **app.json** - EAS updates URL and settings:
   - `enabled: true` - Updates are enabled
   - `checkAutomatically: "ON_APP_START"` - Check for updates when app launches
   - `fallbackToCacheTimeout: 30000` - Fall back to cached version if no response in 30 seconds
   - `url` - Pointing to your project's EAS update server

2. **App.tsx** - Uses the `useUpdateCheck` hook to check for updates on app launch

3. **useUpdateCheck hook** (`app/hooks/useUpdateCheck.ts`) - Handles:
   - Checking for available updates
   - Downloading new updates automatically
   - Logging status and errors

## How It Works

1. **App Launch** → Checks for new updates automatically
2. **Update Found** → Downloads the update in the background
3. **Update Downloaded** → Will be applied on next app restart
4. **No Update** → App continues normally

Updates won't force users to restart immediately - they'll be applied the next time the app is opened.

## Publishing Updates

To publish an update to the preview channel:

```bash
eas update --channel preview
```

You can also specify the branch:

```bash
eas update --channel preview --branch main
```

## Testing Updates Locally

1. Build the app with EAS:

   ```bash
   eas build --platform ios --channel preview
   ```

2. Install the build on your device/simulator

3. Make code changes

4. Publish an update:

   ```bash
   eas update --channel preview
   ```

5. Close and reopen the app - it should check for and download the update

## Manual Update Control

To manually reload the app with a fetched update, modify `useUpdateCheck.ts` and uncomment:

```typescript
await Updates.reloadAsync();
```

This will immediately restart the app with the new version.

## Configuration Options

See [Expo Updates Configuration](https://docs.expo.dev/guides/over-the-air-updates/) for more options like:

- `checkAutomatically` - Set when to check (ON_APP_START, ON_LOAD, etc.)
- `fallbackToCacheTimeout` - How long to wait before using cached version
- Channel-specific configurations

## Troubleshooting

If updates aren't being received:

1. Verify the app was built with `eas build` (not `expo run`)
2. Check that your project ID is correct in `app.json`
3. Ensure the code changes are compatible (no native module changes)
4. Check logs: `eas update --channel preview --auto` (for better error output)
