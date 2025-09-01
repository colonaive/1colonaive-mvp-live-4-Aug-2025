import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, AlertTriangle, Heart, Shield, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChampionStore } from '../../store/championStore';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { findCorrection, generateCorrectionMessage } from '../../utils/fuzzyMatch';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  links?: { text: string; url: string }[];
  awaitingResponse?: boolean;
  awaitingCorrection?: boolean;
  awaitingDoctorChoice?: boolean;
  isUrgent?: boolean;
  isEmergency?: boolean;
  correction?: {
    original: string;
    corrected: string;
  };
}

const initialMessages = [
  {
    id: '1',
    text: 'Hi Champion! I\'m here to provide evidence-based information about colorectal cancer screening, symptoms, and prevention. How can I support your health journey today?\n\n⚕️ Please note: I provide educational information only and cannot replace professional medical advice.',
    sender: 'bot'
  }
];

// Medical Knowledge Base - Evidence-based information
const MEDICAL_KNOWLEDGE = {
  // Emergency symptoms requiring immediate medical attention
  EMERGENCY_SYMPTOMS: [
    'severe abdominal pain', 'severe pain', 'excruciating pain', 'unbearable pain',
    'massive bleeding', 'heavy bleeding', 'bleeding heavily', 'bleeding a lot',
    'can\'t stop bleeding', 'continuous bleeding', 'bleeding for hours',
    'severe constipation', 'complete obstruction', 'can\'t pass stool',
    'severe vomiting', 'vomiting blood', 'blood in vomit', 'hematemesis',
    'fainting', 'dizzy', 'lightheaded', 'passing out', 'unconscious',
    'fever with bleeding', 'high fever', 'severe fever',
    'sudden weight loss', 'rapid weight loss', 'losing weight fast',
    'severe weakness', 'can\'t stand', 'too weak'
  ],

  // Urgent symptoms requiring prompt medical evaluation (within days)
  URGENT_SYMPTOMS: [
    'rectal bleeding', 'blood in stool', 'bloody stool', 'blood when wiping',
    'black stool', 'tar-like stool', 'melena', 'dark stool',
    'persistent abdominal pain', 'ongoing pain', 'chronic pain',
    'change in bowel habits', 'bowel habit change', 'different bowel movements',
    'persistent constipation', 'chronic constipation', 'ongoing constipation',
    'persistent diarrhea', 'chronic diarrhea', 'ongoing diarrhea',
    'alternating constipation diarrhea', 'constipation and diarrhea',
    'narrow stool', 'thin stool', 'pencil-thin stool', 'ribbon stool',
    'incomplete evacuation', 'feel like not empty', 'tenesmus',
    'unexplained weight loss', 'losing weight', 'weight loss',
    'fatigue', 'tired', 'exhausted', 'weakness', 'low energy',
    'iron deficiency', 'anemia', 'low iron', 'pale',
    'abdominal mass', 'lump in abdomen', 'abdominal lump'
  ],

  // Common non-urgent symptoms
  COMMON_SYMPTOMS: [
    'hemorrhoids', 'piles', 'anal fissure', 'fissure',
    'occasional bleeding', 'sometimes bleeding', 'minor bleeding',
    'gas', 'bloating', 'flatulence', 'wind',
    'mild constipation', 'occasional constipation',
    'mild diarrhea', 'occasional diarrhea'
  ],

  // Risk factors
  RISK_FACTORS: {
    AGE: 'Age is the most significant risk factor. Risk increases substantially after age 45, with 90% of cases occurring in people over 50.',
    FAMILY_HISTORY: 'Having a first-degree relative (parent, sibling, child) with CRC increases your risk by 2-3 times. Multiple affected relatives or early-onset disease in family members increases risk further.',
    GENETIC_SYNDROMES: 'Lynch syndrome (HNPCC) and Familial Adenomatous Polyposis (FAP) are hereditary conditions that significantly increase CRC risk.',
    INFLAMMATORY_BOWEL_DISEASE: 'Crohn\'s disease and ulcerative colitis increase CRC risk, particularly with longer disease duration and more extensive inflammation.',
    LIFESTYLE_FACTORS: 'Red and processed meat consumption, smoking, excessive alcohol, obesity, sedentary lifestyle, and low fiber diet increase risk.',
    DIABETES: 'Type 2 diabetes is associated with increased CRC risk and poorer outcomes.',
    PREVIOUS_POLYPS: 'History of adenomatous polyps or previous colorectal cancer increases future risk.'
  },

  // Screening guidelines
  SCREENING: {
    AVERAGE_RISK: 'Average-risk individuals should begin screening at age 45-50 (varies by guidelines). Options include FIT/FOBT annually, flexible sigmoidoscopy every 5 years, or colonoscopy every 10 years.',
    HIGH_RISK: 'High-risk individuals may need earlier and more frequent screening. Family history of CRC may warrant screening 10 years before the youngest affected relative\'s diagnosis or at age 40, whichever is earlier.',
    VERY_HIGH_RISK: 'Individuals with Lynch syndrome or FAP require specialized screening protocols, often starting in their 20s with annual colonoscopy.'
  },

  // Prevention strategies
  PREVENTION: {
    DIET: 'High-fiber diet rich in fruits, vegetables, and whole grains. Limit red meat (<3 servings/week) and avoid processed meats. Adequate calcium and vitamin D intake may be protective.',
    LIFESTYLE: 'Regular physical activity (at least 150 minutes moderate exercise weekly), maintain healthy weight (BMI 18.5-24.9), avoid smoking, limit alcohol consumption.',
    MEDICATIONS: 'Aspirin may reduce CRC risk in certain individuals, but should only be used under medical supervision due to bleeding risks.'
  },

  // Treatment overview
  TREATMENT: {
    EARLY_STAGE: 'Early-stage CRC is highly curable with surgery alone. 5-year survival rates exceed 90% for localized disease.',
    ADVANCED_STAGE: 'Advanced disease may require multimodal treatment including surgery, chemotherapy, radiation therapy, and targeted therapies.',
    POLYP_REMOVAL: 'Colonoscopic polypectomy can prevent cancer by removing precancerous adenomas. This is both diagnostic and therapeutic.'
  }
};

// Response templates with medical accuracy
const RESPONSES = {
  EMERGENCY: `🚨 **URGENT MEDICAL ATTENTION NEEDED**

Champion, based on what you've described, you need immediate medical evaluation. Please:

• **Go to the Emergency Department NOW** or call emergency services
• **Do not delay** - these symptoms require prompt assessment
• Bring a list of your medications and medical history

⚠️ **Important**: This is educational information only. Trust your instincts - if you feel something is seriously wrong, seek immediate medical care.

I'm here to provide information, but a medical emergency requires real medical professionals. Please prioritize your safety.`,

  URGENT: `⚠️ **Prompt Medical Evaluation Recommended**

Champion, the symptoms you've mentioned warrant medical evaluation within the next few days. Here's why this matters:

**Why it's important:**
• Early detection significantly improves outcomes
• These symptoms can have various causes that need proper evaluation
• Professional examination and appropriate tests can provide clarity

**Next steps:**
• Schedule an appointment with your GP or gastroenterologist
• Keep a symptom diary (timing, severity, associated factors)
• Don't delay - early evaluation is key

Remember: Many conditions causing these symptoms are treatable, especially when caught early.`,

  SCREENING_INFO: `🛡️ **Colorectal Cancer Screening - Your Shield Against CRC**

**Why screening saves lives:**
• CRC often develops slowly from precancerous polyps over 10-15 years
• Early detection can prevent cancer entirely by removing polyps
• When caught early, CRC has a >90% cure rate

**Screening options:**
• **Colonoscopy**: Gold standard, every 10 years (average risk)
• **FIT/FOBT**: Stool-based test, annually
• **CT Colonography**: Virtual colonoscopy, every 5 years
• **Blood-based tests**: Like ColonAiQ®, emerging technology

**When to start:**
• Age 45-50 for average risk (guidelines vary)
• Earlier if family history or high-risk factors
• Your doctor will personalize recommendations

**ColonAiQ® availability:**
Currently available in CE IVDD regions, China (NMPA approved), and Singapore (HSA cleared). Patients from neighboring countries can access testing in Singapore.`,

  SYMPTOMS_EDUCATION: `📚 **Understanding CRC Symptoms**

**Key symptoms to know:**
• **Rectal bleeding**: Most common early symptom
• **Change in bowel habits**: New constipation, diarrhea, or alternating pattern
• **Abdominal pain**: Persistent cramping or discomfort
• **Unexplained weight loss**: Unintentional loss of >5% body weight
• **Fatigue/weakness**: Often due to iron deficiency anemia

**Important context:**
• Many symptoms have benign causes (hemorrhoids, IBS, etc.)
• **However**: New or persistent symptoms warrant evaluation
• **Don't ignore**: Bleeding, even if you think it's "just hemorrhoids"

**Red flags requiring urgent attention:**
• Heavy bleeding or bleeding with clots
• Severe abdominal pain
• Complete inability to pass stool or gas
• Fever with bleeding
• Severe weakness or fainting

Remember: Early symptoms are often subtle. Don't wait for severe symptoms to seek evaluation.`,

  RISK_FACTORS: `⚖️ **Understanding Your CRC Risk**

**Major risk factors:**

**Age (Most Important):**
• Risk increases significantly after 45
• 90% of cases occur in people >50

**Family History:**
• First-degree relative with CRC: 2-3x increased risk
• Multiple relatives or early-onset: Higher risk
• May warrant earlier screening (often 10 years before youngest affected relative's age)

**Medical History:**
• Previous polyps or CRC
• Inflammatory bowel disease (Crohn's, UC)
• Type 2 diabetes
• Genetic syndromes (Lynch, FAP)

**Lifestyle Factors:**
• High red/processed meat consumption
• Smoking and excessive alcohol
• Obesity and sedentary lifestyle
• Low fiber diet

**Protective factors:**
• High-fiber diet rich in fruits/vegetables
• Regular physical activity
• Maintaining healthy weight
• Avoiding smoking and excessive alcohol

**Action steps:**
• Discuss your risk profile with your doctor
• Consider genetic counseling if strong family history
• Adopt healthy lifestyle habits
• Follow appropriate screening guidelines`,

  PREVENTION: `🌟 **Preventing Colorectal Cancer**

**Evidence-based prevention strategies:**

**🥗 Dietary Modifications:**
• **Increase**: Fiber-rich foods, fruits, vegetables, whole grains
• **Limit**: Red meat (<3 servings/week), avoid processed meats
• **Consider**: Adequate calcium and vitamin D

**🏃 Lifestyle Changes:**
• **Exercise**: ≥150 minutes moderate activity weekly
• **Weight**: Maintain BMI 18.5-24.9
• **No smoking**: Significantly reduces risk
• **Alcohol**: Limit to moderate consumption

**💊 Medical Considerations:**
• **Aspirin**: May reduce risk but requires medical supervision
• **Screening**: Most effective prevention through early detection
• **Manage**: Diabetes and inflammatory conditions

**🧬 Genetic Factors:**
• Family history assessment
• Genetic counseling if indicated
• Enhanced screening protocols for high-risk individuals

**Key message**: Prevention is multifaceted. Screening remains the most effective intervention, complemented by healthy lifestyle choices.`,

  FAMILY_HISTORY: `👨‍👩‍👧‍👦 **Family History and CRC Risk**

**Understanding inherited risk:**

**First-degree relatives** (parents, siblings, children):
• 1 affected relative: 2-3x increased risk
• 2+ affected relatives: 3-4x increased risk
• Early-onset in relative (<50): Higher risk

**Screening implications:**
• Start screening 10 years before youngest affected relative's diagnosis
• **OR** age 40, whichever is earlier
• May need more frequent screening (every 5 years vs 10)

**Hereditary syndromes** (5-10% of CRC):
• **Lynch syndrome**: 50-80% lifetime CRC risk
• **FAP**: Nearly 100% risk without prophylactic surgery
• **Other**: MAP, Peutz-Jeghers, juvenile polyposis

**Red flags for hereditary CRC:**
• Multiple family members with CRC/endometrial cancer
• Early-onset CRC (<50 years)
• Multiple primary cancers in one person
• Characteristic patterns (Lynch: endometrial, ovarian, gastric cancers)

**Action steps:**
• Create detailed family history (3 generations)
• Share with your healthcare provider
• Consider genetic counseling if high-risk features
• Follow enhanced screening recommendations`,

  TREATMENT_OVERVIEW: `🏥 **CRC Treatment: Understanding Your Options**

**Treatment depends on stage at diagnosis:**

**Early Stage (I-II):**
• **Surgery**: Often curative (>90% 5-year survival)
• **Minimally invasive**: Laparoscopic or robotic techniques
• **Recovery**: Usually 2-6 weeks

**Locally Advanced (III):**
• **Surgery + Chemotherapy**: Standard approach
• **Survival**: 60-80% 5-year survival with treatment

**Advanced/Metastatic (IV):**
• **Multimodal approach**: Surgery, chemotherapy, radiation
• **Targeted therapy**: Based on tumor genetics
• **Immunotherapy**: For specific tumor types
• **Palliative care**: Focus on quality of life

**Treatment team:**
• Colorectal surgeon
• Medical oncologist
• Radiation oncologist
• Pathologist, radiologist
• Support services

**Key points:**
• Treatment is highly individualized
• Second opinions are encouraged
• Clinical trials may offer additional options
• Survivorship care is important

**Hope**: Even advanced CRC has treatment options, and outcomes continue to improve with new therapies.`,

  POLYPS_INFO: `🔍 **Understanding Polyps: The CRC Prevention Opportunity**

**What are polyps?**
• Small growths on the colon/rectal wall
• Most are benign but some can become cancerous
• **Adenomatous polyps**: Precancerous, ~10-15 year progression to cancer

**Types of polyps:**
• **Hyperplastic**: Usually benign, small
• **Adenomatous**: Precancerous potential
• **Serrated**: Some have cancer potential
• **Advanced adenomas**: Large size (≥1cm), high-grade dysplasia

**Why removal matters:**
• **Prevention**: Removing polyps prevents cancer
• **Therapeutic**: Colonoscopy is both diagnostic and treatment
• **Surveillance**: Determines future screening intervals

**After polyp removal:**
• **Small adenomas**: Next colonoscopy in 7-10 years
• **Advanced adenomas**: Next colonoscopy in 3 years
• **High-risk features**: More frequent surveillance

**Lifestyle after polyps:**
• Continue healthy diet and exercise
• Follow surveillance recommendations
• Some may benefit from aspirin (medical supervision)

**Key message**: Finding and removing polyps is one of medicine's greatest prevention success stories!`,

  BLOOD_TESTS: `🩸 **Blood-Based CRC Screening: The Future of Early Detection**

**ColonAiQ® Technology:**
• AI-powered blood test for CRC screening
• Detects circulating tumor DNA and other biomarkers
• Non-invasive alternative to traditional screening

**Advantages:**
• **Convenience**: Simple blood draw
• **No preparation**: No bowel prep required
• **Patient acceptance**: Higher compliance rates
• **Early detection**: Can detect cancer before symptoms

**Current availability:**
• CE IVDD certified regions
• China (NMPA approved)
• Singapore (HSA cleared)
• Neighboring countries can access via Singapore

**Important considerations:**
• **Not diagnostic**: Positive results require colonoscopy confirmation
• **Screening tool**: Part of comprehensive screening strategy
• **Medical guidance**: Should be ordered by healthcare provider

**Other blood markers:**
• CEA: Used for monitoring, not screening
• FIT: Fecal test, not blood
• Emerging technologies: Multi-target stool DNA tests

**The future**: Blood-based screening represents a major advancement in making CRC screening more accessible and acceptable to patients.`
};

// Keyword matching system with medical accuracy
const KEYWORD_PATTERNS = {
  EMERGENCY: [
    /severe.*pain|excruciating|unbearable.*pain/i,
    /massive.*bleed|heavy.*bleed|bleeding.*heavily|continuous.*bleed/i,
    /can't.*stop.*bleed|won't.*stop.*bleed/i,
    /vomit.*blood|blood.*vomit|hematemesis/i,
    /faint|dizzy|lightheaded|passing.*out|unconscious/i,
    /fever.*bleed|high.*fever|severe.*fever/i,
    /sudden.*weight.*loss|rapid.*weight.*loss/i,
    /severe.*weak|can't.*stand|too.*weak/i,
    /complete.*obstruct|can't.*pass.*stool|severe.*constipat/i
  ],

  URGENT: [
    /rectal.*bleed|blood.*stool|bloody.*stool|blood.*wip/i,
    /black.*stool|tar.*stool|melena|dark.*stool/i,
    /change.*bowel|bowel.*habit.*change|different.*bowel/i,
    /persistent.*pain|ongoing.*pain|chronic.*pain/i,
    /persistent.*constipat|chronic.*constipat/i,
    /persistent.*diarrhea|chronic.*diarrhea/i,
    /narrow.*stool|thin.*stool|pencil.*stool|ribbon.*stool/i,
    /weight.*loss|losing.*weight|unexplained.*weight/i,
    /fatigue|tired|exhausted|weakness|low.*energy/i,
    /iron.*defic|anemia|low.*iron|pale/i,
    /abdominal.*mass|lump.*abdomen/i,
    /incomplete.*evacuat|tenesmus|feel.*not.*empty/i
  ],

  SCREENING: [
    /screen|test|check|colon.*exam|colonoscopy/i,
    /prevent|early.*detect|when.*should/i,
    /colonaiq|blood.*test|fit.*test|fobt/i,
    /how.*often|frequency|regular.*check/i
  ],

  SYMPTOMS: [
    /symptom|sign|what.*look.*for/i,
    /how.*know|recogniz|identif/i,
    /early.*stage|warning.*sign/i
  ],

  RISK_FACTORS: [
    /risk.*factor|what.*caus|more.*likely/i,
    /family.*history|genetic|inherit/i,
    /age|lifestyle|diet|smoking/i
  ],

  PREVENTION: [
    /prevent|avoid|reduce.*risk|lower.*risk/i,
    /diet|exercise|lifestyle|healthy/i,
    /what.*can.*do|how.*prevent/i
  ],

  TREATMENT: [
    /treatment|therapy|cure|surgery/i,
    /chemotherapy|radiation|outcome|survival/i,
    /what.*happen|prognosis/i
  ],

  FAMILY_HISTORY: [
    /family.*history|relative.*cancer|parent.*cancer/i,
    /genetic.*test|inherit.*risk|lynch.*syndrome/i,
    /brother.*sister.*cancer|family.*member/i
  ],

  POLYPS: [
    /polyp|growth|precancer|adenoma/i,
    /removal|found.*polyp|after.*polyp/i
  ],

  BLOOD_TESTS: [
    /blood.*test|colonaiq|liquid.*biopsy/i,
    /circulating.*dna|biomarker|non.*invasive/i
  ]
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [showPrivacyNote, setShowPrivacyNote] = useState(true);
  const [awaitingSymptomDuration, setAwaitingSymptomDuration] = useState(false);
  const [awaitingCorrectionConfirmation, setAwaitingCorrectionConfirmation] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState<string>('');
  const [pendingCorrection, setPendingCorrection] = useState<{ original: string; corrected: string } | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [followUpOffered, setFollowUpOffered] = useState(false);
  const [lastUserActivity, setLastUserActivity] = useState(Date.now());
  const [sessionActive, setSessionActive] = useState(true);
  const [timeoutMessageSent, setTimeoutMessageSent] = useState(false);
  const [finalTimeoutMessageSent, setFinalTimeoutMessageSent] = useState(false);
  const [awaitingDoctorChoice, setAwaitingDoctorChoice] = useState(false);
  const [doctorChoiceTimeout, setDoctorChoiceTimeout] = useState<NodeJS.Timeout>();
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const finalTimeoutRef = useRef<NodeJS.Timeout>();
  const { firstName } = useChampionStore();

  // Medical response classifier
  const classifyUserInput = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Check for emergency keywords first
    if (KEYWORD_PATTERNS.EMERGENCY.some(pattern => pattern.test(lowerInput))) {
      return 'EMERGENCY';
    }
    
    // Check for urgent symptoms
    if (KEYWORD_PATTERNS.URGENT.some(pattern => pattern.test(lowerInput))) {
      return 'URGENT';
    }
    
    // Check other categories
    if (KEYWORD_PATTERNS.SCREENING.some(pattern => pattern.test(lowerInput))) {
      return 'SCREENING';
    }
    
    if (KEYWORD_PATTERNS.SYMPTOMS.some(pattern => pattern.test(lowerInput))) {
      return 'SYMPTOMS';
    }
    
    if (KEYWORD_PATTERNS.RISK_FACTORS.some(pattern => pattern.test(lowerInput))) {
      return 'RISK_FACTORS';
    }
    
    if (KEYWORD_PATTERNS.PREVENTION.some(pattern => pattern.test(lowerInput))) {
      return 'PREVENTION';
    }
    
    if (KEYWORD_PATTERNS.TREATMENT.some(pattern => pattern.test(lowerInput))) {
      return 'TREATMENT';
    }
    
    if (KEYWORD_PATTERNS.FAMILY_HISTORY.some(pattern => pattern.test(lowerInput))) {
      return 'FAMILY_HISTORY';
    }
    
    if (KEYWORD_PATTERNS.POLYPS.some(pattern => pattern.test(lowerInput))) {
      return 'POLYPS';
    }
    
    if (KEYWORD_PATTERNS.BLOOD_TESTS.some(pattern => pattern.test(lowerInput))) {
      return 'BLOOD_TESTS';
    }
    
    return 'GENERAL';
  };

  const resetActivityTimer = () => {
    setLastUserActivity(Date.now());
    setTimeoutMessageSent(false);
    setFinalTimeoutMessageSent(false);
    setSessionActive(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (finalTimeoutRef.current) {
      clearTimeout(finalTimeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!timeoutMessageSent) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "Hi Champion, just checking in 🌟 — If you're still around and have any more questions about colorectal health, I'm here to support you with evidence-based information.",
          sender: 'bot'
        }]);
        setTimeoutMessageSent(true);
      }
    }, 3 * 60 * 1000);

    finalTimeoutRef.current = setTimeout(() => {
      if (!finalTimeoutMessageSent) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "Champion, no worries if you had to step away. 🕊️\n\nRemember: For any health concerns, don't hesitate to consult your healthcare provider. You can always return here for educational information.\n\nStay strong and stay healthy! 💙",
          sender: 'bot'
        }]);
        setFinalTimeoutMessageSent(true);
        setSessionActive(false);
      }
    }, 6 * 60 * 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (finalTimeoutRef.current) {
        clearTimeout(finalTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetActivityTimer();
    }
  }, [isOpen, input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && firstName && messages.length === 1) {
      setMessages([
        {
          id: '1',
          text: `Hi Champion ${firstName}! I'm here to provide evidence-based information about colorectal cancer screening, symptoms, and prevention. How can I support your health journey today?\n\n⚕️ Please note: I provide educational information only and cannot replace professional medical advice.`,
          sender: 'bot'
        }
      ]);
    }
  }, [isOpen, firstName]);

  const generateMedicalResponse = (classification: string, userInput: string): Message => {
    const baseId = Date.now().toString();
    
    switch (classification) {
      case 'EMERGENCY':
        return {
          id: baseId,
          text: RESPONSES.EMERGENCY,
          sender: 'bot',
          isEmergency: true,
          links: [
            { text: '🚨 Find Emergency Care', url: '/emergency-care' },
            { text: '📞 Emergency Numbers', url: '/emergency-contacts' }
          ]
        };

      case 'URGENT':
        return {
          id: baseId,
          text: RESPONSES.URGENT,
          sender: 'bot',
          isUrgent: true,
          links: [
            { text: 'Find a GP', url: '/clinics' },
            { text: 'Find a Specialist', url: '/clinics' },
            { text: 'Symptom Tracker', url: '/symptom-tracker' }
          ]
        };

      case 'SCREENING':
        return {
          id: baseId,
          text: RESPONSES.SCREENING_INFO,
          sender: 'bot',
          links: [
            { text: 'Learn About Screening', url: '/choose-screening' },
            { text: 'Find Screening Centers', url: '/clinics' },
            { text: 'ColonAiQ® Information', url: '/colonaiq' }
          ]
        };

      case 'SYMPTOMS':
        return {
          id: baseId,
          text: RESPONSES.SYMPTOMS_EDUCATION,
          sender: 'bot',
          links: [
            { text: 'Symptom Checker', url: '/symptoms' },
            { text: 'When to See a Doctor', url: '/when-to-see-doctor' },
            { text: 'Find a Healthcare Provider', url: '/clinics' }
          ]
        };

      case 'RISK_FACTORS':
        return {
          id: baseId,
          text: RESPONSES.RISK_FACTORS,
          sender: 'bot',
          links: [
            { text: 'Risk Assessment Tool', url: '/risk-assessment' },
            { text: 'Family History Guide', url: '/family-history' },
            { text: 'Genetic Counseling', url: '/genetic-counseling' }
          ]
        };

      case 'PREVENTION':
        return {
          id: baseId,
          text: RESPONSES.PREVENTION,
          sender: 'bot',
          links: [
            { text: 'Prevention Guidelines', url: '/prevention' },
            { text: 'Healthy Lifestyle Tips', url: '/lifestyle' },
            { text: 'Nutrition Guide', url: '/nutrition' }
          ]
        };

      case 'TREATMENT':
        return {
          id: baseId,
          text: RESPONSES.TREATMENT_OVERVIEW,
          sender: 'bot',
          links: [
            { text: 'Treatment Options', url: '/treatment' },
            { text: 'Find Oncologists', url: '/clinics' },
            { text: 'Support Resources', url: '/support' }
          ]
        };

      case 'FAMILY_HISTORY':
        return {
          id: baseId,
          text: RESPONSES.FAMILY_HISTORY,
          sender: 'bot',
          links: [
            { text: 'Family History Tool', url: '/family-history' },
            { text: 'Genetic Testing Info', url: '/genetic-testing' },
            { text: 'Find Genetic Counselor', url: '/genetic-counseling' }
          ]
        };

      case 'POLYPS':
        return {
          id: baseId,
          text: RESPONSES.POLYPS_INFO,
          sender: 'bot',
          links: [
            { text: 'Polyp Information', url: '/polyps' },
            { text: 'Post-Polypectomy Care', url: '/post-procedure' },
            { text: 'Surveillance Guidelines', url: '/surveillance' }
          ]
        };

      case 'BLOOD_TESTS':
        return {
          id: baseId,
          text: RESPONSES.BLOOD_TESTS,
          sender: 'bot',
          links: [
            { text: 'ColonAiQ® Details', url: '/colonaiq' },
            { text: 'Screening Options', url: '/choose-screening' },
            { text: 'Find Testing Centers', url: '/clinics' }
          ]
        };

      default:
        return {
          id: baseId,
          text: `I'm here to help you with colorectal cancer information, Champion! I can provide evidence-based information about:

🔍 **Screening & Prevention**
🩺 **Symptoms & When to Seek Care**
⚕️ **Risk Factors & Family History**
🏥 **Treatment Options**
🩸 **Blood-Based Testing (ColonAiQ®)**

What specific aspect would you like to learn about? Remember, while I provide educational information, always consult healthcare professionals for personalized medical advice.`,
          sender: 'bot',
          links: [
            { text: 'Learn About Screening', url: '/choose-screening' },
            { text: 'Find a Healthcare Provider', url: '/clinics' },
            { text: 'CRC Education Hub', url: '/education/patients' }
          ]
        };
    }
  };

  const handleFollowUp = () => {
    if (messageCount >= 4 && !followUpOffered) {
      setFollowUpOffered(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: `Champion, you've been asking great questions about colorectal health! 🌟

Based on our conversation, would you like me to help you take the next step toward protecting your health?

**I can help you:**
• Find screening centers near you
• Connect with healthcare providers
• Access risk assessment tools
• Get personalized screening recommendations

Your proactive approach to learning about CRC prevention is truly commendable!`,
          sender: 'bot',
          links: [
            { text: 'Find Screening Centers', url: '/clinics' },
            { text: 'Risk Assessment', url: '/risk-assessment' },
            { text: 'Book Consultation', url: '/book-consultation' }
          ]
        }]);
      }, 1500);
    }
  };

  const handleDoctorChoice = (hasDoctor: boolean) => {
    if (doctorChoiceTimeout) {
      clearTimeout(doctorChoiceTimeout);
    }

    setTimeout(() => {
      if (hasDoctor) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "That's wonderful, Champion! Having a trusted healthcare provider is invaluable. Please reach out to them about your concerns - they know your medical history best and can provide personalized guidance. 🩺\n\nDon't hesitate to be specific about your symptoms and ask about appropriate screening recommendations.",
          sender: 'bot'
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "No problem at all, Champion! Finding the right healthcare provider is an important step. I can help you locate qualified professionals who specialize in colorectal health. 🌟\n\nLook for providers who:\n• Have experience with CRC screening\n• Accept your insurance\n• Are conveniently located\n• Make you feel comfortable discussing health concerns",
          sender: 'bot',
          links: [
            { text: 'Find a GP', url: '/clinics' },
            { text: 'Find a Gastroenterologist', url: '/clinics' },
            { text: 'Prepare for Your Visit', url: '/appointment-prep' }
          ]
        }]);
      }
    }, 1000);

    setAwaitingDoctorChoice(false);
  };

  const askAboutDoctor = () => {
    setAwaitingDoctorChoice(true);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: "Champion, given what you've shared, medical evaluation is important. Before I provide more guidance:\n\n🩺 **Do you currently have a trusted healthcare provider?**\n\n• A family doctor or GP you regularly see?\n• A gastroenterologist or specialist you've consulted before?\n\nIf you already have a trusted provider, I'd recommend reaching out to them first - they know your medical history and can provide the most personalized care.\n\nIf you don't have a regular provider, I'm here to help you find qualified professionals in your area who can properly evaluate your concerns. 🛡️",
      sender: 'bot',
      awaitingDoctorChoice: true
    }]);

    const timeout = setTimeout(() => {
      if (awaitingDoctorChoice) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "Take your time, Champion. Whether through your existing healthcare provider or someone new, the key is getting proper medical evaluation when you have concerns. Professional assessment is always the right choice for symptoms that worry you. 💙",
          sender: 'bot'
        }]);
      }
    }, 45000);

    setDoctorChoiceTimeout(timeout);
  };

  const handleSend = () => {
    if (!input.trim() || !sessionActive) return;

    resetActivityTimer();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageCount(prev => prev + 1);
    setConversationContext(prev => [...prev.slice(-4), input.toLowerCase()]);
    
    const lowerInput = input.toLowerCase();
    setInput('');

    if (followUpOffered) {
      const isPositive = lowerInput.includes('yes') || 
                        lowerInput.includes('okay') || 
                        lowerInput.includes('sure') ||
                        lowerInput.includes('help');
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: isPositive ? 
            "Excellent choice, Champion! Taking proactive steps toward your health is what true champions do. 🏆\n\nI'm here to support you through this journey - whether it's finding the right healthcare provider, understanding screening options, or answering any other questions you might have." :
            "That's perfectly okay, Champion. The information is here whenever you need it. Remember, even small steps toward better health awareness make a big difference. 💙\n\nIf you have any other questions about colorectal health, I'm always here to help!",
          sender: 'bot'
        }]);
      }, 1000);
      return;
    }

    if (awaitingCorrectionConfirmation && pendingCorrection) {
      const isConfirming = lowerInput.includes('yes') || lowerInput.includes('correct') || lowerInput.includes('right');
      
      if (isConfirming) {
        setAwaitingCorrectionConfirmation(false);
        setPendingCorrection(null);
        processUserInput(pendingCorrection.corrected);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: "No worries at all, Champion. Please feel free to rephrase your question or concern - I'm here to provide the most helpful and accurate information possible. 🌟",
            sender: 'bot'
          }]);
        }, 1000);
        setAwaitingCorrectionConfirmation(false);
        setPendingCorrection(null);
      }
      return;
    }

    // Check for spelling corrections
    const correction = findCorrection(lowerInput);
    if (correction) {
      setAwaitingCorrectionConfirmation(true);
      setPendingCorrection({
        original: lowerInput,
        corrected: correction.correction
      });
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: generateCorrectionMessage(correction),
          sender: 'bot',
          awaitingCorrection: true
        }]);
      }, 1000);
      return;
    }

    processUserInput(lowerInput);
    handleFollowUp();
  };

  const processUserInput = (input: string) => {
    if (awaitingDoctorChoice) {
      const isPositive = input.includes('yes') || 
                        input.includes('have') ||
                        input.includes('doctor') ||
                        input.includes('provider');
      handleDoctorChoice(isPositive);
      return;
    }

    // Classify the input and generate appropriate response
    const classification = classifyUserInput(input);
    
    // For emergency symptoms, ask about doctor first
    if (classification === 'EMERGENCY') {
      setTimeout(() => {
        const emergencyResponse = generateMedicalResponse(classification, input);
        setMessages(prev => [...prev, emergencyResponse]);
        
        // Follow up with doctor question after emergency response
        setTimeout(() => {
          askAboutDoctor();
        }, 2000);
      }, 1000);
      return;
    }

    // For urgent symptoms, provide response then ask about doctor
    if (classification === 'URGENT') {
      setTimeout(() => {
        const urgentResponse = generateMedicalResponse(classification, input);
        setMessages(prev => [...prev, urgentResponse]);
        
        // Follow up with doctor question
        setTimeout(() => {
          askAboutDoctor();
        }, 2000);
      }, 1000);
      return;
    }

    // For other classifications, provide the appropriate medical response
    setTimeout(() => {
      const response = generateMedicalResponse(classification, input);
      setMessages(prev => [...prev, response]);

      // Add a follow-up educational message for certain topics
      if (['SCREENING', 'PREVENTION', 'RISK_FACTORS'].includes(classification)) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            text: "Remember, Champion: Knowledge is power when it comes to preventing colorectal cancer. Early detection through screening can prevent cancer entirely or catch it at its most treatable stage. 💪\n\nIs there anything specific about CRC prevention or screening you'd like to explore further?",
            sender: 'bot'
          }]);
        }, 2500);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50"
          >
            <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <h3 className="font-semibold">CRC Health Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <AnimatePresence>
              {showPrivacyNote && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 p-4 text-sm text-blue-800 border-b"
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Medical Disclaimer</p>
                      <p className="text-xs">This chatbot provides evidence-based educational information only. It cannot diagnose, treat, or replace professional medical consultation. For medical concerns, please consult qualified healthcare providers.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPrivacyNote(false)}
                    className="text-blue-600 hover:text-blue-800 mt-2 text-sm font-medium"
                  >
                    I understand
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : `bg-gray-100 text-gray-800 ${
                            message.isEmergency ? 'border-l-4 border-red-500' :
                            message.isUrgent ? 'border-l-4 border-orange-500' : ''
                          }`
                    }`}
                  >
                    {message.isEmergency && (
                      <div className="flex items-center space-x-2 mb-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-bold">URGENT MEDICAL ATTENTION</span>
                      </div>
                    )}
                    {message.isUrgent && (
                      <div className="flex items-center space-x-2 mb-2 text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-bold">PROMPT EVALUATION NEEDED</span>
                      </div>
                    )}
                    <div className="whitespace-pre-line">{message.text}</div>
                    {message.awaitingDoctorChoice && (
                      <div className="mt-3 space-y-2">
                        <button
                          onClick={() => handleDoctorChoice(true)}
                          className="w-full text-left px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Heart className="h-4 w-4" />
                          <span>I have a trusted healthcare provider</span>
                        </button>
                        <button
                          onClick={() => handleDoctorChoice(false)}
                          className="w-full text-left px-3 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors flex items-center space-x-2"
                        >
                          <Shield className="h-4 w-4" />
                          <span>Help me find a healthcare provider</span>
                        </button>
                      </div>
                    )}
                    {message.links && message.links.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.links.map((link, index) => (
                          <Link
                            key={index}
                            to={link.url}
                            className="block text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {link.text} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 text-center border-t">
              <div className="flex items-center justify-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Project COLONAiVE™ — Evidence-based CRC education & screening</span>
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    resetActivityTimer();
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={sessionActive ? "Ask about CRC symptoms, screening, prevention..." : "Chat session ended. Click the chat icon to start a new conversation."}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={!sessionActive}
                />
                <Button
                  onClick={handleSend}
                  className="px-4 py-2"
                  disabled={!input.trim() || !sessionActive}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              {!sessionActive && (
                <div className="text-center mt-2 text-sm text-gray-500 flex items-center justify-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>Ready to support your health journey anytime, Champion! 💙</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSessionActive(true);
            setTimeoutMessageSent(false);
            setFinalTimeoutMessageSent(false);
            resetActivityTimer();
          }
        }}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="h-6 w-6" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          <Heart className="h-3 w-3" />
        </div>
      </motion.button>
    </>
  );
};