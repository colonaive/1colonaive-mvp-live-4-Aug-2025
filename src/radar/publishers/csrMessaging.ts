/**
 * CSR Messaging Engine — generates corporate social responsibility messages from research signals
 */

export interface CSRMessage {
  message_type: 'awareness' | 'corporate' | 'community';
  message_text: string;
  signal_title: string;
}

const AWARENESS_TEMPLATES = [
  'Recent research highlights the importance of early colorectal cancer detection. {finding} This underscores why screening programmes remain vital for public health.',
  'Science continues to advance in colorectal cancer screening. {finding} Early detection through proven screening methods saves lives.',
  'New evidence strengthens the case for population-wide colorectal cancer screening. {finding} Every step towards early detection is a step towards saving lives.',
];

const CORPORATE_TEMPLATES = [
  'As part of our commitment to employee wellness, we share the latest in colorectal cancer research. {finding} Consider discussing screening options with your healthcare provider.',
  'Workplace health matters. {finding} Colorectal cancer screening is recommended for adults aged 45 and above. Speak to your doctor about your options.',
];

export function generateCSRMessages(
  signals: Array<{
    title: string;
    key_finding?: string;
    public_summary?: string;
    radar_score: number;
  }>
): CSRMessage[] {
  const messages: CSRMessage[] = [];

  // Use top-scoring signals only
  const topSignals = signals
    .filter((s) => s.radar_score >= 8)
    .sort((a, b) => b.radar_score - a.radar_score)
    .slice(0, 3);

  for (const signal of topSignals) {
    const finding = signal.public_summary || signal.key_finding || signal.title;

    // Awareness message
    const awareTemplate = AWARENESS_TEMPLATES[messages.length % AWARENESS_TEMPLATES.length];
    messages.push({
      message_type: 'awareness',
      message_text: awareTemplate.replace('{finding}', finding),
      signal_title: signal.title,
    });

    // Corporate message
    const corpTemplate = CORPORATE_TEMPLATES[messages.length % CORPORATE_TEMPLATES.length];
    messages.push({
      message_type: 'corporate',
      message_text: corpTemplate.replace('{finding}', finding),
      signal_title: signal.title,
    });
  }

  return messages;
}
