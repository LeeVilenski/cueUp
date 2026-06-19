# Google Play Deployment Guide for CueUp

## Prerequisites

- [x] Expo project with EAS Build configured
- [x] Android package name set (`com.cueup.app`)
- [x] Adaptive icons configured
- [x] EAS production build profile configured (AAB format)
- [ ] Google Play Developer account
- [ ] Google Play Console app listing created
- [ ] Google Cloud service account key for automated submission

---

## Step 1: Create the App in Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in:
   - **App name**: CueUp
   - **Default language**: English (or your preference)
   - **App or game**: App
   - **Free or paid**: Free (or Paid)
4. Accept the declarations and click **Create app**

## Step 2: Complete the Store Listing

In the Google Play Console, navigate to **Grow > Store presence > Main store listing**:

- **Short description** (max 80 chars): Track your snooker practice, log breaks, and improve your game.
- **Full description** (max 4000 chars): Write a detailed description of CueUp's features.
- **Screenshots**: You need at least 2 screenshots for phone. Recommended sizes:
  - Phone: 1080x1920 or 1440x2560 (minimum 2, up to 8)
  - 7-inch tablet: 1200x1920 (optional but recommended)
  - 10-inch tablet: 1600x2560 (optional but recommended)
- **Feature graphic**: 1024x500 PNG or JPEG
- **App icon**: 512x512 (auto-generated from your build, but may need a hi-res version)

### Taking Screenshots

Run the app on an Android emulator or device, then capture screenshots:

```bash
# Start the dev server
cd app
npx expo start --android

# Take screenshots using adb
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ./store-assets/
```

## Step 3: Set Up Google Cloud Service Account (for EAS Submit)

This lets `eas submit` upload builds to Google Play automatically.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select or create a project
3. Enable the **Google Play Android Developer API**:
   - Go to **APIs & Services > Library**
   - Search for "Google Play Android Developer API"
   - Click **Enable**
4. Create a service account:
   - Go to **APIs & Services > Credentials**
   - Click **Create Credentials > Service Account**
   - Name: `eas-submit` (or similar)
   - Click **Done**
5. Create a key:
   - Click on the service account you just created
   - Go to the **Keys** tab
   - Click **Add Key > Create new key > JSON**
   - Download the JSON file
6. Save the JSON file as `app/google-service-account.json` (this file is gitignored)
7. Grant access in Google Play Console:
   - Go to **Users and permissions** in Google Play Console
   - Click **Invite new users**
   - Enter the service account email (from the JSON file, the `client_email` field)
   - Under **App permissions**, select CueUp
   - Grant these permissions: **Releases**, **Store presence**
   - Click **Invite user**
   - **Important**: Wait ~24 hours for permissions to propagate before first submission

## Step 4: Complete Required Google Play Policies

Before you can publish, complete these sections in Google Play Console:

1. **App content** (Policy > App content):
   - **Privacy policy**: You must provide a privacy policy URL. Since CueUp stores data locally only, a simple privacy policy stating no data is collected/shared may suffice. Host it on a free service like GitHub Pages.
   - **Ads**: Declare whether the app contains ads (it doesn't)
   - **App access**: If any features require login (they don't)
   - **Content ratings**: Complete the IARC questionnaire
   - **Target audience**: Select 18+ (avoids extra requirements for children)
   - **News app**: No
   - **Data safety**: Declare what data is collected (CueUp stores all data locally on-device, no data transmitted to servers)

2. **Data safety** answers for CueUp:
   - Does your app collect or share any user data? **No** (all data is stored locally via SQLite)
   - Does your app use encryption? **Yes** (standard HTTPS for Expo updates, if applicable)

## Step 5: Build for Production

```bash
cd app

# Build the Android App Bundle (AAB) for Google Play
npx eas build --platform android --profile production
```

This will:
- Build an AAB (Android App Bundle) — required by Google Play
- Auto-increment the version code
- Sign the app with an EAS-managed keystore

## Step 6: Submit to Google Play

### Option A: Automated via EAS Submit

```bash
# Submit the latest production build
npx eas submit --platform android --profile production
```

This uses the service account key configured in `eas.json` to upload directly to the internal testing track.

### Option B: Manual Upload

1. After the build completes, download the AAB from the EAS dashboard
2. In Google Play Console, go to **Release > Testing > Internal testing**
3. Click **Create new release**
4. Upload the AAB file
5. Add release notes
6. Click **Review release**, then **Start rollout**

## Step 7: Testing Tracks (Recommended Path)

Google Play has several testing tracks. The recommended path to production:

1. **Internal testing** (up to 100 testers, immediate availability)
   - Add testers by email in Google Play Console
   - Great for your own testing
2. **Closed testing** (invite-only, up to larger groups)
   - Requires at least 12 testers who have opted in for 14+ days for production access
3. **Open testing** (anyone can join)
   - Shows up on Play Store as "Early Access"
4. **Production** (public release)

### Changing the Submit Track

Update the `track` in `eas.json` to change where builds are submitted:

```json
"submit": {
  "production": {
    "android": {
      "serviceAccountKeyPath": "./google-service-account.json",
      "track": "production"
    }
  }
}
```

Track options: `internal`, `alpha` (closed), `beta` (open), `production`

## Quick Reference Commands

```bash
# Build for Google Play
npx eas build --platform android --profile production

# Submit to Google Play (internal track)
npx eas submit --platform android --profile production

# Build and submit in one step
npx eas build --platform android --profile production --auto-submit

# Check build status
npx eas build:list --platform android

# Update app version
npx eas build:version:set --platform android
```

## Troubleshooting

- **"App not found"**: Make sure the package name `com.cueup.app` matches what you created in Google Play Console
- **"Permission denied"**: Ensure the service account has the correct permissions and wait 24h after granting
- **"Version code already exists"**: EAS auto-increment should handle this, but you can manually set it with `eas build:version:set`
- **Signing issues**: EAS manages signing keys automatically. If you need to upload the key to Play Console, run `eas credentials` to manage them
