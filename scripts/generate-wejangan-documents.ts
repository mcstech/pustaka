// Deno script to append wejangan markdown files to data/documents.json
// Requirements: deno run --allow-read --allow-write scripts/generate-wejangan-documents.ts

interface Document {
  title: string;
  category: string;
  href: string;
  body: string;
  keywords: string[];
}

async function* walkMarkdownFiles(dir: string): AsyncGenerator<{ path: string; year: string; filename: string }> {
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isDirectory && /^\d{4}$/.test(entry.name)) {
      // Year folder (e.g., 2023, 2024, etc.)
      const yearPath = `${dir}/${entry.name}`;
      for await (const file of Deno.readDir(yearPath)) {
        if (file.isFile && file.name.endsWith('.md')) {
          yield {
            path: `${yearPath}/${file.name}`,
            year: entry.name,
            filename: file.name,
          };
        }
      }
    }
  }
}

function extractTitleFromMarkdown(content: string, fallback: string): string {
  // Try to extract title from frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*["']?([^"'\n]+)["']?/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
  }
  
  // Try to extract from first H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  return fallback;
}

function extractKeywordsFromMarkdown(content: string, year: string, filename: string): string[] {
  const keywords: string[] = [year];
  
  // Try to extract keywords from frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const keywordsMatch = frontmatterMatch[1].match(/keywords:\s*\[([^\]]+)\]/);
    if (keywordsMatch) {
      const fmKeywords = keywordsMatch[1].split(',').map(k => k.trim().replace(/['"]/g, ''));
      keywords.push(...fmKeywords);
    }
  }
  
  // Add filename without extension as keyword
  const nameWithoutExt = filename.replace(/\.md$/, '');
  keywords.push(nameWithoutExt);
  
  return keywords;
}

function stripMarkdown(content: string): string {
  // Remove frontmatter
  let text = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Remove markdown formatting but keep the text
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1'); // Images
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links
  text = text.replace(/^#+\s+/gm, ''); // Headers
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1'); // Bold
  text = text.replace(/\*([^*]+)\*/g, '$1'); // Italic
  text = text.replace(/`([^`]+)`/g, '$1'); // Inline code
  text = text.replace(/^```[\s\S]*?```$/gm, ''); // Code blocks
  
  return text.trim();
}

async function main() {
  const base = new URL("file:///Users/mcsdev/Documents/e-bacaan/");
  const wejanganDir = new URL("./data/wejangan", base).pathname;
  const documentsPathUrl = new URL("./data/documents.json", base);

  // Read existing documents
  let existingDocuments: Document[] = [];
  try {
    const existingText = await Deno.readTextFile(documentsPathUrl);
    existingDocuments = JSON.parse(existingText);
  } catch (error) {
    console.warn("No existing documents.json found, will create new one.");
  }

  const wejanganDocuments: Document[] = [];

  for await (const { path, year, filename } of walkMarkdownFiles(wejanganDir)) {
    const content = await Deno.readTextFile(path);
    const nameWithoutExt = filename.replace(/\.md$/, '');
    
    const title = extractTitleFromMarkdown(content, nameWithoutExt);
    const keywords = extractKeywordsFromMarkdown(content, year, filename);
    const body = stripMarkdown(content);
    
    wejanganDocuments.push({
      title,
      category: "wejangan",
      href: `/wejangan/${year}/${nameWithoutExt}`,
      body,
      keywords,
    });
  }

  // Combine documents (remove existing wejangan entries first to avoid duplicates)
  const filteredDocuments = existingDocuments.filter(doc => doc.category !== "wejangan");
  const allDocuments = [...filteredDocuments, ...wejanganDocuments];

  await Deno.writeTextFile(documentsPathUrl, JSON.stringify(allDocuments, null, 2));
  console.log(`Added ${wejanganDocuments.length} wejangan entries to ${documentsPathUrl.pathname}`);
  console.log(`Total documents: ${allDocuments.length}`);
}

if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    Deno.exit(1);
  });
}
