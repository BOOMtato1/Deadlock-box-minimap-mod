# Packaging notes

This repo stores a text-safe VPK artifact:

- `release/pak01_dir.vpk.b64`

## Restore a binary VPK from text

```bash
bash tools/restore_vpk.sh
```

## Rebuild from payload source

If you edit payload files under `dmm_package/game/citadel/...`, rebuild with:

```bash
python tools/build_vpk.py
base64 -w 76 release/pak01_dir.vpk > release/pak01_dir.vpk.b64
```

You can then choose whether to commit only `.b64` (text) or both `.b64` and `.vpk`.
