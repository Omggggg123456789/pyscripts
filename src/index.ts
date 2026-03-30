import { type PluginContext } from "@lmstudio/sdk";
import { toolsProvider } from "./toolsProvider.js";

export async function main(context: PluginContext) {
  context.withToolsProvider(toolsProvider);
}
