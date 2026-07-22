/**
 * Autonomous AI Interview Agent Service
 */

export const AI_AGENT_PERSONAS = [
  {
    id: 'partner_saboor',
    name: 'Saboor Ahmad',
    role: 'Senior Audit Partner (Big 4)',
    avatar: 'SA',
    color: 'from-emerald-500 to-teal-700',
    accentColor: 'text-emerald-400',
    description: 'Focuses on ISA/IFRS technical precision, ethics under ICAP code, partner-level composure & problem solving.',
    systemPrompt: 'You are Saboor Ahmad, a Senior Audit Partner at a Big 4 firm in Pakistan.',
    strictness: 'Strict & Demanding',
    initialGreeting: "Assalamu Alaikum. I'm Saboor Ahmad, Audit Partner. Let's begin your final partner round interview."
  }
];

export async function generateAgentResponse({ personaId, targetRole, round, conversationHistory, userAnswer }) {
  await new Promise(r => setTimeout(r, 600));
  return {
    thinkingTrace: ["Analyzing candidate response..."],
    agentThinkingLog: "[AGENT LOGIC]: Evaluating candidate answer...",
    agentReply: "Thank you. Let's proceed to the next technical question.",
    turnScore: 8.5,
    feedbackPoint: "Good response."
  };
}

export function generateAgentScorecard(conversationHistory = [], personaId = 'partner_saboor') {
  return {
    personaName: 'Saboor Ahmad',
    personaRole: 'Senior Audit Partner (Big 4)',
    overallScore: '8.8',
    maxScore: '10.0',
    verdict: 'RECOMMENDED FOR ARTICLESHIP CONTRACT',
    metrics: [
      { category: 'Technical Accuracy & Knowledge', score: '90%' },
      { category: 'Communication & Speech Clarity', score: '88%' }
    ],
    agentSummary: 'Candidate demonstrated strong technical awareness.',
    recommendations: ['Further sharpen ISA 330 practical scenario case studies.']
  };
}
