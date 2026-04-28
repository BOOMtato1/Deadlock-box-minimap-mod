#!/usr/bin/env python3
import binascii
import pathlib
import struct
from collections import defaultdict

SIGNATURE = 0x55AA1234
VERSION = 1
DIR_INDEX = 0x7FFF
ENTRY_TERM = 0xFFFF


def gather_files(root: pathlib.Path):
    files = []
    for p in sorted(root.rglob('*')):
      if p.is_file():
        rel = p.relative_to(root).as_posix()
        data = p.read_bytes()
        files.append((rel, data))
    return files


def split_path(rel_path: str):
    p = pathlib.PurePosixPath(rel_path)
    dirname = p.parent.as_posix()
    if dirname == '.':
        dirname = ' '
    stem = p.stem
    ext = p.suffix[1:] if p.suffix.startswith('.') else ''
    if ext == '':
        ext = ' '
    return ext, dirname, stem


def build_tree(files):
    tree = defaultdict(lambda: defaultdict(dict))
    for rel, data in files:
        ext, dirname, stem = split_path(rel)
        tree[ext][dirname][stem] = data
    return tree


def cstr(s: str):
    return s.encode('utf-8') + b'\x00'


def main():
    repo = pathlib.Path(__file__).resolve().parents[1]
    source_root = repo / 'dmm_package' / 'game' / 'citadel'
    out_file = repo / 'release' / 'pak01_dir.vpk'

    files = gather_files(source_root)
    if not files:
        raise SystemExit('No files found to package.')

    tree = build_tree(files)

    directory = bytearray()
    data_blobs = bytearray()
    data_offset = 0

    # Stable ordering
    for ext in sorted(tree.keys()):
        directory += cstr(ext)
        for dirname in sorted(tree[ext].keys()):
            directory += cstr(dirname)
            for stem in sorted(tree[ext][dirname].keys()):
                payload = tree[ext][dirname][stem]
                crc = binascii.crc32(payload) & 0xFFFFFFFF
                entry_len = len(payload)

                directory += cstr(stem)
                directory += struct.pack('<IHHIIH', crc, 0, DIR_INDEX, data_offset, entry_len, ENTRY_TERM)

                data_blobs += payload
                data_offset += entry_len
            directory += b'\x00'
        directory += b'\x00'
    directory += b'\x00'

    header = struct.pack('<III', SIGNATURE, VERSION, len(directory))

    out_file.parent.mkdir(parents=True, exist_ok=True)
    out_file.write_bytes(header + directory + data_blobs)

    print(f'Wrote {out_file} ({out_file.stat().st_size} bytes) with {len(files)} files.')


if __name__ == '__main__':
    main()
