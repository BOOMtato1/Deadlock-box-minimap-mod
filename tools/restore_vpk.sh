#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
base64 -d release/pak01_dir.vpk.b64 > release/pak01_dir.vpk
echo "Restored release/pak01_dir.vpk from base64 source."
