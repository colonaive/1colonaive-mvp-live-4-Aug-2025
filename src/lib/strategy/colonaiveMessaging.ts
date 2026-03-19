/**
 * COLONAiVE Strategic DNA — Messaging Layer
 *
 * Ensures all generated LinkedIn content aligns with COLONAiVE strategic doctrine.
 * Based on the Master Strategic Doctrine (COLONAiVE_MASTER_DNA.md).
 */

export const coreMessages = [
  'Low screening uptake is the primary barrier to early colorectal cancer detection.',
  'Early screening enables timely colonoscopy and life-saving intervention.',
  'Improving screening uptake is the key to reducing CRC mortality.',
] as const;

export const pathwayMessage =
  'Screening \u2192 risk identification \u2192 colonoscopy \u2192 early intervention.';

export const movementMessage =
  'Project COLONAiVE\u2122 is building a national movement to increase screening uptake and improve early detection.';

export const productPositioning =
  'Modern blood-based screening options such as the HSA-cleared ColonAiQ\u00AE can support improved screening participation.';

/**
 * Inject strategic messaging into generated content.
 *
 * Rules:
 * - Always ensures screening narrative is present
 * - Adds pathway reinforcement
 * - Randomly includes movement message (~50%) and product positioning (~30%)
 * - Appends movement CTA
 * - Never uses hard-sell language; never undermines colonoscopy
 */
export function injectStrategicLayer(content: string): string {
  let enriched = content.trimEnd();

  // Ensure core screening message appears if not already present
  if (!content.toLowerCase().includes('screening')) {
    enriched +=
      '\n\nImproving screening uptake remains one of the most critical challenges in colorectal cancer prevention.';
  }

  // Pathway reinforcement
  enriched += '\n\nEarly screening enables timely colonoscopy and intervention.';

  // Movement message — ~50% probability
  if (Math.random() < 0.5) {
    enriched += `\n\n${movementMessage}`;
  }

  // Product positioning — ~30% probability
  if (Math.random() < 0.3) {
    enriched += `\n\n${productPositioning}`;
  }

  // Movement CTA
  enriched += '\n\nLearn more about the movement: https://www.colonaive.ai';

  return enriched;
}
