export async function checkMediaPermissions() {
  const results: Record<string, PermissionState> = { mic: 'prompt', cam: 'prompt' };

  try {
    const mic = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    const cam = await navigator.permissions.query({ name: 'camera' as PermissionName });

    results.mic = mic.state;
    results.cam = cam.state;
  } catch (e) {
    console.warn('Permissions API not supported or failed:', e);
  }

  return results;
}