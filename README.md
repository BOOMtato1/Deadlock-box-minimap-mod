# Deadlock Box + Golden Statue Minimap Mod

This repo stores the mod package in **text form** for easier review:

- `release/pak01_dir.vpk.b64` (base64-encoded VPK)

## Restore the real `.vpk` file

Run:

```bash
bash tools/restore_vpk.sh
```

This creates:

- `release/pak01_dir.vpk`

## Install with Deadlock Mod Manager

1. Restore `release/pak01_dir.vpk` using the script above.
2. Open Deadlock Mod Manager.
3. Add/import `release/pak01_dir.vpk` as a local mod (or copy to `Deadlock/game/citadel/addons`).
4. Enable it in **My Mods**.
5. Click **Launch Modded**.

## Included payload source

- `dmm_package/game/citadel/...` (the files used to build the VPK)
