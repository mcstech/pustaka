// Deno script to run all document generation scripts with summary
// Requirements: deno run --allow-read --allow-write --allow-run scripts/prepare-docs.ts

interface ScriptResult {
  name: string;
  duration: number;
  success: boolean;
  error?: string;
}

async function runScript(name: string, scriptPath: string): Promise<ScriptResult> {
  const startTime = performance.now();
  
  try {
    const command = new Deno.Command("deno", {
      args: ["run", "--allow-read", "--allow-write", "--allow-net", scriptPath],
      stdout: "inherit",
      stderr: "inherit",
    });
    
    const { success } = await command.output();
    const duration = performance.now() - startTime;
    
    return {
      name,
      duration,
      success,
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    return {
      name,
      duration,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

async function main() {
  const base = new URL("../", import.meta.url);
  const documentsPath = new URL("./data/documents.json", base);
  
  console.log("🚀 Starting document generation...\n");
  
  const scripts = [
    { name: "Quran", path: "./scripts/generate-documents.ts" },
    { name: "Bible", path: "./scripts/generate-bible-documents.ts" },
    { name: "Wejangan", path: "./scripts/generate-wejangan-documents.ts" },
  ];
  
  const results: ScriptResult[] = [];
  const totalStartTime = performance.now();
  
  for (const script of scripts) {
    console.log(`📝 Processing ${script.name}...`);
    const scriptUrl = new URL(script.path, base);
    const result = await runScript(script.name, scriptUrl.pathname);
    results.push(result);
    console.log("");
  }
  
  const totalDuration = performance.now() - totalStartTime;
  
  // Get file stats
  let fileSize = 0;
  let recordCount = 0;
  
  try {
    const fileInfo = await Deno.stat(documentsPath);
    fileSize = fileInfo.size;
    
    const content = await Deno.readTextFile(documentsPath);
    const documents = JSON.parse(content);
    recordCount = Array.isArray(documents) ? documents.length : 0;
  } catch (error) {
    console.error("⚠️  Error reading documents.json:", error);
  }
  
  // Print summary
  console.log("=" .repeat(60));
  console.log("📊 GENERATION SUMMARY");
  console.log("=".repeat(60));
  console.log("");
  
  // Individual script results
  for (const result of results) {
    const status = result.success ? "✅" : "❌";
    const duration = formatDuration(result.duration);
    console.log(`${status} ${result.name.padEnd(15)} - ${duration}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }
  
  console.log("");
  console.log("-".repeat(60));
  console.log(`⏱️  Total Time:        ${formatDuration(totalDuration)}`);
  console.log(`📄 File Size:         ${formatFileSize(fileSize)}`);
  console.log(`📚 Total Records:     ${recordCount.toLocaleString()}`);
  console.log("-".repeat(60));
  console.log("");
  
  const allSuccessful = results.every(r => r.success);
  if (allSuccessful) {
    console.log("✨ All documents generated successfully!");
  } else {
    console.log("⚠️  Some scripts failed. Please check the errors above.");
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main().catch((err) => {
    console.error("💥 Fatal error:", err);
    Deno.exit(1);
  });
}
