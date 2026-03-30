# LM Studio Python Interpreter Plugin

## Windows 11 quick start

1. Install Node.js 20+, Python 3.10+, and LM Studio CLI (`lms`).
2. In this folder run:
   ```powershell
   npm install
   npm run build
   npm run dev
   ```
3. In LM Studio, enable this plugin and enable tools.
4. Ask the model to invoke `python_exec`.

## Common error fix

If `lms dev` says:

- `manifest.type: Invalid literal value, expected "plugin"`
- `manifest.runner: Required`

then ensure `manifest.json` includes:

```json
{
  "type": "plugin",
  "runner": "node"
}
```

## Security warning

`python_exec` is intentionally unrestricted and runs code with your local user permissions.
