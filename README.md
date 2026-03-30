# Python Interpreter (LM Studio Plugin)

This plugin exposes a `python_exec` tool in LM Studio.

## What it does

- Executes Python code with `python -c "..."` (or another interpreter you provide).
- Runs directly on your host machine (no container/sandbox).
- Can access files and anything that the LM Studio process user can access.

## Windows 11 quick start

1. Install prerequisites:
   - **Node.js 20+**
   - **Python 3.10+** (ensure `python` works in PowerShell)
   - **LM Studio** with CLI installed (`lms` command)
2. Open PowerShell in this project folder.
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Build the plugin:
   ```powershell
   npm run build
   ```
5. Run plugin dev mode:
   ```powershell
   npm run dev
   ```
6. In LM Studio, start a chat with tool use enabled and ensure this plugin is active.
7. Ask the model to call `python_exec`.

## Example tool call payload

```json
{
  "code": "import os; print(os.getcwd())",
  "python_bin": "python",
  "cwd": "C:\\Users\\you\\Desktop",
  "timeout_seconds": 30
}
```

## Files

- `src/index.ts` - plugin entrypoint.
- `src/toolsProvider.ts` - tool definition and Python execution logic.
- `manifest.json` - LM Studio plugin metadata.

## NPM scripts

- `npm run build` - compile TypeScript into `dist/`.
- `npm run dev` - run plugin with `lms dev`.
- `npm run push` - publish/update plugin with `lms push`.

## Tool schema

`python_exec` takes:

- `code` (string, required): Python source to execute.
- `python_bin` (string, optional): Python executable path/name.
- `cwd` (string, optional): working directory for execution.
- `timeout_seconds` (number, optional): kill process after timeout.

## Security warning

This plugin is intentionally unrestricted. Any model/tool call using `python_exec` can run arbitrary code with your user permissions.

## Troubleshooting on Windows

- If `python` is not found, install Python from python.org and re-open PowerShell.
- If `lms` is not found, reinstall LM Studio CLI or open a terminal where LM Studio added CLI to PATH.
- If npm install fails behind a proxy, set npm proxy config or use a network without registry restrictions.
