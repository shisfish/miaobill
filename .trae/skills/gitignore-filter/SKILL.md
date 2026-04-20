---
name: "gitignore-filter"
description: "Filters out files matching .gitignore patterns when scanning. Invoke on every search/scan operation to exclude node_modules, unpackage, logs, IDE folders, and other ignored items."
---

# GitIgnore Filter

This skill ensures all file scans respect `.gitignore` patterns.

## When to Invoke

Invoke this skill **before every search operation** to automatically filter out ignored files.

## Gitignore Patterns to Exclude

Always skip these patterns when scanning:

| Pattern | Type |
|---------|------|
| `node_modules/` | directory |
| `unpackage/` | directory |
| `dist/` | directory |
| `build/` | directory |
| `coverage/` | directory |
| `.idea/` | directory |
| `.vscode/` | directory |
| `.claude/` | directory |
| `.qider/` | directory |
| `*.log` | file |
| `*.local` | file |
| `*.tsbuildinfo` | file |
| `.DS_Store` | file |
| `Thumbs.db` | file |
| `.env` | file |
| `.env.local` | file |
| `.env.*.local` | file |
| `.prod.env` | file |

## How to Apply

When using search tools (`Grep`, `Glob`, `SearchCodebase`, `LS`), specify these directories/files in the `ignore` parameter or exclude them from results:

```javascript
// Example: Using Glob with ignores
ignore: ["node_modules", "unpackage", "dist", ".idea", ".vscode", ".claude", ".trae", ".qider", "*.log", "*.local"]
```

## Quick Reference

- `node_modules/` - npm/yarn dependencies
- `unpackage/` - WeChat mini program build output
- `dist/`, `build/` - build output directories
- `.idea/`, `.vscode/` - IDE settings
- `.claude/`, `.trae/`, `.qider/` - AI IDE data folders
- `*.log` - log files
- `.DS_Store`, `Thumbs.db` - OS files

**Always remember to exclude these patterns when scanning the codebase.**
