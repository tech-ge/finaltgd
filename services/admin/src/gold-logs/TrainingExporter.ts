import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { ScoredLog } from './QualityScorer.js';

export interface ExportOptions {
  outputDir: string;
  fileName: string;
}

export async function exportJsonl(
  logs: ScoredLog[],
  options: ExportOptions,
): Promise<string> {
  const filePath = join(options.outputDir, options.fileName);
  const content = logs.map((l) => JSON.stringify(l)).join('\n') + (logs.length > 0 ? '\n' : '');
  await writeFile(filePath, content, 'utf8');
  return filePath;
}
