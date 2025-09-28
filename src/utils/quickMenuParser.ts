import type { ParsedQuickMenuContent } from "../types";

export function parseQuickMenuContent(content: string): ParsedQuickMenuContent | null {
  try {
    const parsed = JSON.parse(content);

    // 基本结构验证
    if (typeof parsed.name !== 'object' || parsed.name === null || typeof parsed.message !== 'object' || parsed.message === null) {
      return null;
    }

    // 确保语言字段存在
    const name = {
      zh: String(parsed.name.zh || ''),
      en: String(parsed.name.en || ''),
      ja: String(parsed.name.ja || ''),
    };

    const message = {
      zh: String(parsed.message.zh || ''),
      en: String(parsed.message.en || ''),
      ja: String(parsed.message.ja || ''),
    };
    
    // 如果所有name都为空，则认为无效
    if (!name.zh && !name.en && !name.ja) {
        return null;
    }

    return { name, message };
  } catch (error) {
    console.error('Failed to parse quick menu content:', error);
    return null;
  }
}
