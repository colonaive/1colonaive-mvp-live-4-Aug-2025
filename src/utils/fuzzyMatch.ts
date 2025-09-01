// /home/project/src/utils/fuzzyMatch.ts
// ✅ FULLY INTEGRATED VERSION — June 2025
// - Knowledge base externalized into sub-files for better organization.
// - Preserves all Perplexity logic, safety guardrails, and fuzzy matching tuning.
// - Supports multi-part responses.
// - Symptom detection uses fuzzy matching with fine-tuned thresholds.

import Fuse from 'fuse.js';
import nlp from 'compromise';

// Import knowledge segments from the new files
import { generalKnowledge } from './knowledge/general';
import { screeningKnowledge } from './knowledge/screening';
import { statisticsKnowledge } from './knowledge/statistics';
import { symptomEducationalKnowledge } from './knowledge/symptoms';

type FlexibleResponse = string | string[];

// Export the KnowledgeEntry interface so it can be imported by other knowledge files
export interface KnowledgeEntry {
  category: string;
  keywords: string[];
  intent: string;
  question: string;
  response: FlexibleResponse;
  links?: { text: string; url: string }[];
}

// --- KNOWLEDGE BASE (QA_KNOWLEDGE) ---
// Combine all knowledge segments into one array
export const QA_KNOWLEDGE: KnowledgeEntry[] = [
  ...generalKnowledge,
  ...screeningKnowledge,
  ...statisticsKnowledge,
  ...symptomEducationalKnowledge,
];

// Combine all keywords for Fuse.js
const fuseKeywords = QA_KNOWLEDGE.flatMap(entry => entry.keywords.map(kw => ({ keyword: kw, intent: entry.intent })));

// Fuse.js options for fuzzy matching across keywords
const fuseOptions = {
  keys: ['keyword'],
  threshold: 0.9, // Extremely permissive search (0.0 to 1.0)
  distance: 1000, // Allows matches across very long sentences
  ignoreLocation: true,
  includeScore: true,
};

const fuse = new Fuse(fuseKeywords, fuseOptions);


// --- Medical Guardrails and Triage ---
// This medical knowledge base remains here as it's part of the core safety logic,
// and its structure (with 'keywords' for fuzzy symptom detection) is specific to triage.
export const medicalKnowledgeBase = {
  symptoms: [
    {
      keyword: 'rectal bleeding',
      keywords: ['rectal bleeding', 'blood in stool', 'bloody stool', 'blood from anus', 'bleeding from anus', 'bleeding when wiping', 'fresh blood', 'dark blood', 'piles bleeding', 'bleeding piles', 'blood after poo', 'blood after bowel movement'],
      level: 'urgent',
      response: 'Rectal bleeding or blood in your stool can be a symptom of various conditions, some serious. It\'s important to consult a doctor promptly for proper evaluation.',
      links: [{ text: 'Find a GP', url: '/find-a-gp' }],
    },
    {
      keyword: 'abdominal pain',
      keywords: ['abdominal pain', 'stomach ache', 'stomach pain', 'tummy ache', 'cramps', 'pain in stomach', 'pain in abdomen', 'belly pain', 'gastrointestinal pain'],
      level: 'urgent', // Can be urgent depending on severity
      response: 'Abdominal pain can have various causes. If it\'s severe, persistent, or unusual for you, it\'s important to consult a doctor for a proper diagnosis.',
      links: [{ text: 'Find a GP', url: '/find-a-gp' }],
    },
    {
      keyword: 'painful defecation',
      keywords: ['painful defecation', 'pain during bowel movement', 'pain when pooing', 'pain when pooping', 'pain during poo pooing', 'hurts to poo', 'painful stool', 'poo pain', 'anal pain'],
      level: 'urgent',
      response: 'Pain during bowel movements can be a symptom of conditions like hemorrhoids, fissures, or other issues. It\'s best to get it checked by a doctor.',
      links: [{ text: 'Find a GP', url: '/find-a-gp' }],
    },
    {
      keyword: 'change in bowel habits',
      keywords: ['change in bowel habits', 'constipation', 'diarrhea', 'alternating constipation and diarrhea', 'narrow stool', 'pencil-thin stool', 'stools change', 'poo change', 'bowel changes', 'new bowel pattern'],
      level: 'urgent',
      response: 'A persistent change in bowel habits (e.g., new constipation or diarrhea, changes in stool consistency) warrants a doctor\'s visit for evaluation.',
      links: [{ text: 'Find a GP', url: '/find-a-gp' }],
    },
    {
      keyword: 'unexplained weight loss',
      keywords: ['unexplained weight loss', 'losing weight for no reason', 'sudden weight loss', 'weight loss without trying', 'unintentional weight loss'],
      level: 'urgent',
      response: 'Unexplained weight loss can be a sign of an underlying health issue. You should consult a doctor for a thorough check-up.',
      links: [{ text: 'Find a GP', url: '/find-a-gp' }],
    },
    {
      keyword: 'severe abdominal pain',
      keywords: ['severe abdominal pain', 'acute stomach pain', 'intense belly ache', 'bad tummy pain', 'excruciating abdominal pain', 'cramping severe'],
      level: 'emergency',
      response: 'Severe or sudden abdominal pain could indicate a serious condition. Please seek immediate medical attention.',
      links: [{ text: 'Call 995 for Ambulance (Singapore)', url: 'tel:995' }],
    },
    {
      keyword: 'chest pain',
      keywords: ['chest pain', 'heart attack symptoms', 'pain in chest', 'tightness in chest', 'crushing chest pain'],
      level: 'emergency',
      response: 'Chest pain can be a sign of a heart attack or other critical conditions. Please seek immediate medical attention.',
      links: [{ text: 'Call 995 for Ambulance (Singapore)', url: 'tel:995' }],
    },
    {
      keyword: 'difficulty breathing',
      keywords: ['difficulty breathing', 'shortness of breath', 'gasping for air', 'cannot breathe', 'breathless', 'struggling to breathe'],
      level: 'emergency',
      response: 'If you are experiencing difficulty breathing, please seek immediate medical attention.',
      links: [{ text: 'Call 995 for Ambulance (Singapore)', url: 'tel:995' }],
    },
    {
      keyword: 'unconscious',
      keywords: ['unconscious', 'unresponsive', 'passed out', 'fainted', 'collapsed', 'not awake'],
      level: 'emergency',
      response: 'If someone is unconscious or unresponsive, please call for immediate emergency medical assistance.',
      links: [{ text: 'Call 995 for Ambulance (Singapore)', url: 'tel:995' }],
    },
    {
      keyword: 'fever',
      keywords: ['fever', 'high temperature', 'feeling feverish', 'temp is high', 'high body temperature'],
      level: 'routine',
      response: 'Fever can be a symptom of many conditions. If it\'s high, persistent, or accompanied by other worrying symptoms, please consult a doctor.',
      links: [{ text: 'Find a GP', url: '/find-a-gp' }],
    },
  ],
  sensitiveTopics: [
    { keyword: 'diagnose', response: 'I cannot diagnose any medical conditions.' },
    { keyword: 'treat', response: 'I cannot provide treatment advice.' },
    { keyword: 'prescription', response: 'I cannot prescribe medication.' },
    { keyword: 'cancer stage', response: 'I cannot determine the stage of cancer.' },
    { keyword: 'personal medical advice', response: 'I cannot give personal medical advice.' },
    { keyword: 'my test results', response: 'I cannot interpret your personal test results.' },
    { keyword: 'what should I do', response: 'I cannot tell you what to do. Please consult a qualified doctor.' },
    { keyword: 'am i sick', response: 'I cannot tell you if you are sick.' },
    { keyword: 'do i have cancer', response: 'I cannot tell you if you have cancer.' },
    { keyword: 'what medication', response: 'I cannot recommend specific medications.' },
    { keyword: 'cure for cancer', response: 'I cannot provide advice on curing cancer.' },
  ],
};

// Create a separate Fuse.js instance for symptom matching
const symptomKeywordsFlat = medicalKnowledgeBase.symptoms.flatMap(entry => entry.keywords.map(kw => ({ keyword: kw, symptom: entry })));
const symptomFuse = new Fuse(symptomKeywordsFlat, {
    keys: ['keyword'],
    threshold: 0.9, // Extremely permissive for symptom search
    distance: 1000,
    ignoreLocation: true,
    includeScore: true,
});

// --- Age-Specific Responses ---
export const AGE_SPECIFIC_RESPONSES = {
  'under_45': "Based on your age, you're generally at lower risk for CRC, unless you have specific risk factors like a strong family history. If you have concerns, please consult a doctor to discuss your individual situation.",
  '45_to_50': "You're approaching the age when CRC screening is often recommended for average-risk individuals. It's an excellent time to start discussing screening options with your doctor.",
  'over_50': "At your age, regular CRC screening is strongly recommended in Singapore. The Ministry of Health advises screening from age 50 for average-risk individuals. Please consult your doctor to determine the best screening method for you.",
  'over_65': "Continued CRC screening is generally beneficial at your age, though the approach may vary based on your overall health and previous screening history. It's important to discuss this with your doctor to decide on the most suitable screening plan.",
};


// --- Synonym Normalization ---
const synonyms: Record<string, string> = {
  'poo test': 'fit test',
  'fecal test': 'fit test',
  'colon cancer': 'colorectal cancer',
  'blood in stool': 'rectal bleeding',
};

const normalizeWithSynonyms = (input: string): string => {
  let result = input.toLowerCase();
  for (const [key, value] of Object.entries(synonyms)) {
    result = result.replace(new RegExp(`\\b${key}\\b`, 'gi'), value);
  }
  return result;
};


// --- Emotion Detection ---
const emotionKeywords = {
  fear: ['scared', 'afraid', 'worried', 'fear', 'anxious', 'anxiety'],
  frustration: ['don’t know', 'confused', 'frustrated', 'angry', 'annoyed'],
  urgency: ['now', 'urgent', 'immediately', 'asap', 'pain', 'bleeding'],
};

const detectEmotion = (message: string): string | null => {
  const lower = message.toLowerCase();
  for (const [emotion, words] of Object.entries(emotionKeywords)) {
    if (words.some((w) => lower.includes(w))) return emotion;
  }
  return null;
};

// --- Helper Functions ---

export const detectAge = (userInput: string): number | null => {
  const doc = nlp(userInput);
  const numbers = doc.numbers().out('array');
  const ageKeywords = ['year', 'years', 'yr', 'yrs', 'old', 'age'];

  for (const num of numbers) {
    const numText = String(num);
    // Check if the number is close to an age keyword
    const sentence = doc.match(`${numText} (#Adjective|#Noun)? (#Unit)? (#Noun|${ageKeywords.join('|')})`).text();
    if (ageKeywords.some(keyword => sentence.includes(keyword)) ||
        userInput.toLowerCase().includes(`${numText} years old`) ||
        userInput.toLowerCase().includes(`${numText} yr old`)) {
      const parsedNum = parseInt(numText, 10);
      if (parsedNum > 0 && parsedNum < 120) { // Reasonable age range
        return parsedNum;
      }
    }
  }

  // Also check for direct numbers without explicit age keywords if they're the main focus
  // e.g., "I'm 43", "age 50"
  const ageMatch = userInput.match(/\b(i'm|im|my age is|am|me is|i am)\s+(\d{1,3})\b/i);
  if (ageMatch && ageMatch[2]) {
    const parsedNum = parseInt(ageMatch[2], 10);
    if (parsedNum > 0 && parsedNum < 120) {
      return parsedNum;
    }
  }

  return null;
};


export const detectMedicalSymptoms = (userInput: string): { level: string; response: string; links?: { text: string; url: string }[] } | null => {
  const normalizedInput = normalizeWithSynonyms(userInput.toLowerCase());
  const results = symptomFuse.search(normalizedInput);

  if (results.length > 0 && results[0].score < 0.7) { // More permissive for symptom acceptance
    return results[0].item.symptom;
  }
  return null;
};

export const checkSensitiveTopics = (userInput: string): string | null => {
  const normalizedInput = normalizeWithSynonyms(userInput.toLowerCase());
  for (const topic of medicalKnowledgeBase.sensitiveTopics) {
    if (normalizedInput.includes(topic.keyword)) {
      return topic.response;
    }
  }
  return null;
};


// --- Main Intent Classification Logic ---

interface MatchResult {
  intent: string;
  score: number;
  response: FlexibleResponse; // Supports multi-part
  links?: { text: string; url: string }[];
  category: string;
}

export const classifyUserIntent = (userInput: string): MatchResult | null => {
  const doc = nlp(userInput);
  const normalizedInput = doc.normalize().text(); // Normalize for better matching

  const results = fuse.search(normalizedInput);

  if (results.length > 0 && results[0].score < 0.6) { // Acceptance threshold for general knowledge (0.0 to 0.6)
    const bestMatch = results[0].item;
    const knowledgeEntry = QA_KNOWLEDGE.find(entry => entry.intent === bestMatch.intent);
    if (knowledgeEntry) {
      return {
        intent: knowledgeEntry.intent,
        score: results[0].score,
        response: knowledgeEntry.response,
        links: knowledgeEntry.links,
        category: knowledgeEntry.category,
      };
    }
  }

  return null;
};

// --- Chatbot Response Generator ---

interface ChatbotResponse {
  type: 'educational' | 'triage';
  response: FlexibleResponse; // Supports multi-part
  links?: { text: string; url: string }[];
  urgency?: 'emergency' | 'urgent' | 'routine';
  originalIntent?: string;
  originalScore?: number;
}

export const getChatbotResponse = async (userInput: string, previousMessages?: string[]): Promise<ChatbotResponse> => {
  const normalizedInput = normalizeWithSynonyms(userInput.toLowerCase());

  // 1. Check for explicit medical advice requests (highest priority guardrail)
  const sensitiveResponse = checkSensitiveTopics(normalizedInput);
  if (sensitiveResponse) {
    return {
      type: 'triage',
      response: sensitiveResponse + ' Always consult a qualified healthcare provider for personal medical advice.',
      urgency: 'routine',
    };
  }

  // 2. Check for emergency/urgent symptoms using fuzzy matching
  const symptomMatch = detectMedicalSymptoms(normalizedInput);
  if (symptomMatch && symptomMatch.level === 'emergency') {
    return {
      type: 'triage',
      response: `**Urgent Medical Alert!** ${symptomMatch.response} This requires immediate medical attention.`,
      links: symptomMatch.links,
      urgency: 'emergency',
    };
  }
  if (symptomMatch && symptomMatch.level === 'urgent') {
    return {
      type: 'triage',
      response: `${symptomMatch.response} It's important to consult a doctor soon for proper evaluation.`,
      links: symptomMatch.links,
      urgency: 'urgent',
    };
  }

  // 3. Detect Age for screening guidance
  const age = detectAge(userInput);
  let ageGuidance = '';
  if (age !== null) {
    if (age < 45) {
      ageGuidance = AGE_SPECIFIC_RESPONSES['under_45'];
    } else if (age >= 45 && age < 50) {
      ageGuidance = AGE_SPECIFIC_RESPONSES['45_to_50'];
    } else if (age >= 50 && age < 65) {
      ageGuidance = AGE_SPECIFIC_RESPONSES['over_50'];
    } else if (age >= 65) {
      ageGuidance = AGE_SPECIFIC_RESPONSES['over_65'];
    }

    if (ageGuidance) {
      return {
        type: 'educational',
        response: [ // Using multi-part response for age guidance
          ageGuidance,
          "For personalized advice, please book an appointment with a clinician from our website."
        ],
        links: [
          { text: 'Find a GP', url: '/find-a-gp' },
          { text: 'Find a Specialist', url: '/find-a-specialist' }
        ],
        urgency: 'routine',
      };
    }
  }

  // 4. Classify general intent using fuzzy matching
  const intentMatch = classifyUserIntent(userInput);
  if (intentMatch) {
    return {
      type: 'educational',
      response: intentMatch.response,
      links: intentMatch.links,
      urgency: 'routine',
      originalIntent: intentMatch.intent,
      originalScore: intentMatch.score,
    };
  }

  
  // 4.5 Emotion fallback handling
  const emotion = detectEmotion(normalizedInput);
  if (emotion === 'fear') {
    return {
      type: 'educational',
      response: [
        "It's normal to feel anxious — I'm here to help.",
        "You can ask about symptoms, prevention, or screening options.",
      ],
      urgency: 'urgent',
    };
  } else if (emotion === 'frustration') {
    return {
      type: 'educational',
      response: [
        "Let me try to explain things more clearly.",
        "Try asking about how CRC screening works or what the symptoms are.",
      ],
      urgency: 'routine',
    };
  } else if (emotion === 'urgency') {
    return {
      type: 'triage',
      response: [
        "If you're in discomfort or worried about symptoms like bleeding, it's best to consult a doctor soon.",
        "Would you like to know what symptoms to look out for?",
      ],
      urgency: 'urgent',
    };
  }

// 5. Fallback for unhandled queries (using multi-part and more conversational tone)
  return {
    type: 'educational',
    response: [
      "I'm your friendly CRC Health Assistant! 🧠",
      "I'm not sure I understand that query yet, but I'm learning more every day.",
      "You can try asking about symptoms, screening options, or how to prevent colorectal cancer.",
      "Remember, I provide educational information only and cannot offer medical advice."
    ],
    urgency: 'routine',
  };
};

export const checkTriage = (level: string): boolean => {
  return level === 'emergency' || level === 'urgent';
};
