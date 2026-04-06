 eas login          # Task 17, Step 2
  eas init           # Task 17, Step 3 — writes real projectId into app.json

  # Then test in Expo Go:
  npx expo start --clear   # Scan QR, verify two tabs appear

  # Final publish:
  eas update --channel production --message "Initial skeleton"

  After eas init runs, update app.json → updates.url with the real project ID it prints.