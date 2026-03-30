import { tool, type Tool, type ToolsProviderController } from "@lmstudio/sdk";
import { spawn } from "node:child_process";
import { z } from "zod";

type RunPythonParams = {
  code: string;
  python_bin?: string;
  cwd?: string;
  timeout_seconds?: number;
};

function runPython({
  code,
  python_bin = "python3",
  cwd,
  timeout_seconds = 60,
}: RunPythonParams): Promise<string> {
  return new Promise((resolve) => {
    const args = ["-c", code];
    const proc = spawn(python_bin, args, {
      cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let done = false;

    const finish = (msg: string) => {
      if (!done) {
        done = true;
        resolve(msg);
      }
    };

    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
      finish(
        JSON.stringify({
          ok: false,
          error: `Execution timed out after ${timeout_seconds} seconds.`,
          stdout,
          stderr,
        }),
      );
    }, Math.max(1, timeout_seconds) * 1000);

    proc.stdout.setEncoding("utf8");
    proc.stderr.setEncoding("utf8");

    proc.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });

    proc.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    proc.on("error", (error) => {
      clearTimeout(timer);
      finish(
        JSON.stringify({
          ok: false,
          error: error.message,
          stdout,
          stderr,
        }),
      );
    });

    proc.on("close", (codeValue, signalValue) => {
      clearTimeout(timer);
      finish(
        JSON.stringify({
          ok: codeValue === 0,
          exit_code: codeValue,
          signal: signalValue,
          stdout,
          stderr,
        }),
      );
    });
  });
}

export async function toolsProvider(ctl: ToolsProviderController): Promise<Tool[]> {
  const runPythonTool = tool({
    name: "python_exec",
    description:
      "Run Python code directly on the host machine with full local access. This is not sandboxed.",
    parameters: {
      code: z
        .string()
        .min(1)
        .describe("Python code to run via `python3 -c` or another selected interpreter."),
      python_bin: z
        .string()
        .optional()
        .describe("Python executable, for example `python3`, `python`, or a venv binary path."),
      cwd: z
        .string()
        .optional()
        .describe("Working directory for execution. Defaults to the LM Studio working directory."),
      timeout_seconds: z
        .number()
        .int()
        .positive()
        .max(1800)
        .optional()
        .describe("Time limit in seconds before the process is terminated."),
    },
    implementation: async ({ code, python_bin, cwd, timeout_seconds }) => {
      const effectiveCwd = cwd ?? ctl.getWorkingDirectory();
      return runPython({
        code,
        python_bin,
        cwd: effectiveCwd,
        timeout_seconds,
      });
    },
  });

  return [runPythonTool];
}
