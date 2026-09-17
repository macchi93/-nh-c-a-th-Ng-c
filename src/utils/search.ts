import { ChatBot } from '../types';
import { TAG_DESCRIPTIONS } from '../data/tags';

/**
 * Remove Vietnamese accents and convert to lowercase for easy search
 */
export function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/**
 * Generate acronyms and initials for a given phrase
 * Examples:
 * - "Slow Burn" -> ["sb"]
 * - "Trai Nga" -> ["tn"]
 * - "Trai Nhật" -> ["tn"]
 * - "Dark Romance" -> ["dr"]
 * - "Enemies to Lovers" -> ["etl", "el", "e2l"]
 * - "Slice of life" -> ["sol", "sl"]
 * - "Green Flag" -> ["gf"]
 * - "RomCom" -> ["rc"]
 * - "Nicolai Valeryevich Morozov" -> ["nvm", "nm"]
 * - "Ilya Alekseyevich Morozov" -> ["iam", "im"]
 * - "Thanh xuân vườn trường" -> ["txvt"]
 * - "Cha xứ" -> ["cx"]
 * - "Sếp Nga" -> ["sn"]
 */
export function getInitialsList(phrase: string): string[] {
  if (!phrase) return [];
  // Expand camelCase (e.g. RomCom -> Rom Com)
  const expanded = phrase.replace(/([a-z])([A-Z])/g, '$1 $2');
  const clean = removeAccents(expanded).toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const results = new Set<string>();

  // 1. First letter of each word (e.g. "Slow Burn" -> "sb", "Nicolai Valeryevich Morozov" -> "nvm")
  const allLetters = words.map((w) => w[0]).join('');
  if (allLetters) results.add(allLetters);

  // 2. Significant words (skip common prepositions/conjunctions)
  const stopWords = new Set(['to', 'of', 'and', 'the', 'a', 'in', 'va', 'la']);
  const sigWords = words.filter((w) => !stopWords.has(w));
  if (sigWords.length > 0 && sigWords.length !== words.length) {
    results.add(sigWords.map((w) => w[0]).join(''));
  }

  // 3. First and last word initials (for 3+ word names: "Nicolai Morozov" -> "nm")
  if (words.length >= 3) {
    results.add(words[0][0] + words[words.length - 1][0]);
  }

  // 4. Special number replacements (e.g. "Enemies to Lovers" -> "e2l")
  if (words.includes('to')) {
    results.add(words.map((w) => (w === 'to' ? '2' : w[0])).join(''));
  }

  // 5. If it's a single word that is an abbreviation (e.g., "txvt", "bdsm", "sfw", "nsfw")
  if (words.length === 1 && words[0].length <= 6) {
    results.add(words[0]);
  }

  return Array.from(results);
}

/**
 * Check if a single target string matches a search term:
 * Supports direct match, accent-free match, space-free match, or initialism/acronym match.
 */
export function matchesSearchTerm(term: string, target: string): boolean {
  if (!target || !term) return false;

  const cleanTerm = removeAccents(term).toLowerCase().replace(/^[#\s]+/, '').trim();
  if (!cleanTerm) return false;

  const cleanTarget = removeAccents(target).toLowerCase();

  // 1. Direct or accent-free substring match
  if (cleanTarget.includes(cleanTerm)) {
    return true;
  }

  // 2. Condensed match without spaces/punctuation (e.g. "slowburn" matches "Slow Burn", "trainga" matches "Trai Nga")
  const compactTarget = cleanTarget.replace(/[^a-z0-9]/g, '');
  const compactTerm = cleanTerm.replace(/[^a-z0-9]/g, '');
  if (compactTarget && compactTerm && compactTarget.includes(compactTerm)) {
    return true;
  }

  // 3. Initials / Acronym match (e.g. "sb" matches "Slow Burn", "tn" matches "Trai Nga")
  const initialsList = getInitialsList(target);
  for (const init of initialsList) {
    if (init === compactTerm || (compactTerm.length >= 2 && init.startsWith(compactTerm))) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a chatbot matches a single search term across all its attributes
 */
export function botMatchesTerm(bot: ChatBot, term: string): boolean {
  // Check bot name
  if (matchesSearchTerm(term, bot.name)) return true;

  // Check bot badge (e.g., "Cha xứ" -> "cx", "Sếp Nga" -> "sn")
  if (bot.badge && matchesSearchTerm(term, bot.badge)) return true;

  // Check bot tagline
  if (bot.tagline && matchesSearchTerm(term, bot.tagline)) return true;

  // Check tags and their descriptions/meanings
  if (bot.tags && bot.tags.length > 0) {
    for (const tag of bot.tags) {
      if (matchesSearchTerm(term, tag)) return true;
      const desc = TAG_DESCRIPTIONS[tag];
      if (desc && matchesSearchTerm(term, desc)) return true;
    }
  }

  return false;
}

/**
 * Main search function for a chatbot given a user query.
 * Matches if:
 * - The entire query matches as a single phrase/acronym; OR
 * - When multiple words/tokens are entered, each token matches some attribute of the bot.
 */
export function filterBotByQuery(bot: ChatBot, query: string): boolean {
  const trimmed = query.trim();
  if (!trimmed) return true;

  // Check whole query first
  if (botMatchesTerm(bot, trimmed)) return true;

  // Split query into terms (comma or space separated)
  const terms = trimmed
    .split(/[,+\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (terms.length > 1) {
    // Require every token to match something in this bot
    return terms.every((term) => botMatchesTerm(bot, term));
  }

  return false;
}
