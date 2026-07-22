import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Bot,
  FileText,
  BookOpen,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Send,
  Star,
  Award,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  HelpCircle,
  BookMarked,
  Heart,
  RefreshCw,
  Zap,
  MapPin,
  Clock,
  DollarSign,
  Globe,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Pause,
  RotateCcw,
  Activity,
  Video,
  AlertCircle,
  BarChart3,
  UserCheck
} from 'lucide-react';

const INTERVIEW_QUESTION_BANKS = {
  'Audit Trainee': {
    'HR Screening': [
      {
        id: 1,
        question: "Assalamu Alaikum! Welcome to your initial HR screening. To start, please introduce yourself, state your qualification status, and explain why you chose Chartered Accountancy.",
        keywords: ['caf', 'acca', 'audit', 'icap', 'accounting', 'passion', 'articleship', 'career'],
        tip: "Keep it under 90 seconds. Focus on academic achievements, CAF papers cleared, and career motivation."
      },
      {
        id: 2,
        question: "Why are you specifically interested in completing your 3.5 years training contract with our firm?",
        keywords: ['learning', 'growth', 'reputation', 'clients', 'culture', 'professional', 'exposure'],
        tip: "Mention the firm's reputation, client portfolio, and structured training culture."
      },
      {
        id: 3,
        question: "How do you manage exam stress and heavy audit engagement deadlines simultaneously?",
        keywords: ['time management', 'prioritization', 'planning', 'resilience', 'schedule', 'focus'],
        tip: "Highlight work-life balance techniques, structured study plans, and staying calm under pressure."
      }
    ],
    'Technical Round': [
      {
        id: 1,
        question: "Welcome to the Technical Round! Can you explain the fundamental difference between Substantive Procedures and Tests of Controls under ISA 330?",
        keywords: ['substantive', 'test of controls', 'isa 330', 'misstatement', 'dollar amount', 'effectiveness', 'operating'],
        tip: "Tests of controls evaluate operating effectiveness of internal controls; Substantive procedures detect material misstatements at assertion level."
      },
      {
        id: 2,
        question: "Walk me through how you would audit inventory valuation under IAS 2 when a client has slow-moving stock.",
        keywords: ['nrv', 'net realizable value', 'cost', 'lower of cost and nrv', 'obsolete', 'provision', 'aging'],
        tip: "Inventory must be measured at lower of cost and NRV. Inspect post-year-end sales prices and calculate provision for slow-moving items."
      },
      {
        id: 3,
        question: "If management refuses to permit the audit team to send a direct bank confirmation request, how should you respond under ISA 505?",
        keywords: ['isa 505', 'inquire', 'reasonableness', 'alternative procedures', 'bank statement', 'reconciliation', 'implications'],
        tip: "Inquire about management's reasons, evaluate audit implications, and perform alternative procedures like inspecting bank reconciliations and statements."
      }
    ],
    'Partner Round': [
      {
        id: 1,
        question: "In this partner final round, tell me: how would you address a situation where a client CFO pressures you to ignore an uncorrected misstatement?",
        keywords: ['ethics', 'integrity', 'partner', 'manager', 'audit committee', 'independence', 'icap code of ethics'],
        tip: "Emphasize professional ethics, independence, reporting up to Audit Manager and Partner, and refusing to compromise integrity."
      },
      {
        id: 2,
        question: "With AI and automated audit software emerging fast, how do you see the role of a junior auditor changing over the next 3 years?",
        keywords: ['ai', 'data analytics', 'automation', 'judgment', 'critical thinking', 'value addition', 'efficiency'],
        tip: "AI will automate routine data testing, allowing auditors to focus on high-risk judgment areas and analytical evaluation."
      },
      {
        id: 3,
        question: "What unique strength or quality do you bring that makes you the top candidate for our firm this induction cycle?",
        keywords: ['dedication', 'hard work', 'analytical', 'teamwork', 'learning agility', 'commitment'],
        tip: "Summarize your problem-solving mindset, fast learning curve, and dedication to the firm's excellence."
      }
    ]
  },
  'Tax Assistant': {
    'HR Screening': [
      {
        id: 1,
        question: "Welcome! Please introduce yourself and explain what attracted you to specialize in Corporate Taxation and Tax Advisory.",
        keywords: ['tax', 'income tax', 'fbr', 'advisory', 'laws', 'compliance', 'finance'],
        tip: "Demonstrate interest in tax legislation, FBR regulations, and corporate compliance."
      },
      {
        id: 2,
        question: "Describe a time when you had to read complex tax regulations and explain them in simple terms.",
        keywords: ['communication', 'clarity', 'simplicity', 'client', 'guidance', 'understanding'],
        tip: "Emphasize breakdown of technical legal text into actionable client advice."
      }
    ],
    'Technical Round': [
      {
        id: 1,
        question: "Explain the concept of Input Tax Adjustment under the Sales Tax Act, 1990 and when input tax is disallowed.",
        keywords: ['sales tax', 'input tax', 'output tax', 'section 8', 'disallowed', 'tax invoice', 'active taxpayer'],
        tip: "Mention Section 8 disallowances, requirement of valid tax invoice, and active taxpayer list status."
      },
      {
        id: 2,
        question: "What is the difference between Tax Evasion, Tax Avoidance, and Tax Planning under Income Tax Ordinance 2001?",
        keywords: ['evasion', 'illegal', 'avoidance', 'loopholes', 'planning', 'legal', 'tax liability'],
        tip: "Tax Evasion is illegal fraud; Tax Avoidance uses legal loopholes against legislative intent; Tax Planning is legal optimization."
      }
    ],
    'Partner Round': [
      {
        id: 1,
        question: "How do you advise a client when FBR issues an unexpected high-value show-cause notice under Section 122?",
        keywords: ['appeal', 'commissioner', 'show cause', 'documentation', 'written reply', 'stay order'],
        tip: "Gather evidence, draft formal legal response, request stay if needed, and file appeal with CIR Appeals."
      }
    ]
  },
  'Advisory Consultant': {
    'HR Screening': [
      {
        id: 1,
        question: "Welcome! Tell us about your background in financial analysis, valuation, or business consulting.",
        keywords: ['modeling', 'valuation', 'excel', 'consulting', 'strategy', 'analysis'],
        tip: "Focus on problem-solving ability, financial analysis, and strategic thinking."
      }
    ],
    'Technical Round': [
      {
        id: 1,
        question: "How do you calculate WACC (Weighted Average Cost of Capital) and what factors influence the Discount Rate in DCF Valuation?",
        keywords: ['wacc', 'cost of equity', 'capm', 'beta', 'cost of debt', 'dcf', 'terminal value'],
        tip: "Detail Cost of Equity via CAPM, Cost of Debt post-tax, and weighting capital structure."
      }
    ],
    'Partner Round': [
      {
        id: 1,
        question: "If a prospective M&A target company's financial statements show aggressive EBITDA adjustments, how do you evaluate quality of earnings?",
        keywords: ['qoe', 'quality of earnings', 'ebitda', 'normalize', 'non recurring', 'working capital'],
        tip: "Perform QOE analysis, adjust non-recurring items, assess working capital trends, and challenge management assumptions."
      }
    ]
  }
};

export default function CareerTools() {
  const [activeSubTab, setActiveSubTab] = useState('directory');

  // Firm Directory State
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [directorySearch, setDirectorySearch] = useState('');

  // AI Mock Interview State
  const [interviewRole, setInterviewRole] = useState('Audit Trainee');
  const [interviewRound, setInterviewRound] = useState('Technical Round');
  const [userAnswer, setUserAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: "Welcome to the CA/ACCA AI Mock Interview Simulator! I'm your virtual Senior Audit Manager. Let's start with a technical question:\n\n*Can you explain the main difference between Substantive Procedures and Tests of Controls under ISA 330?*"
    }
  ]);
  const [evaluation, setEvaluation] = useState(null);

  // REAL-TIME INTERVIEW STUDIO STATE
  const [mockMode, setMockMode] = useState('studio'); // 'studio' | 'chat'
  const [isStudioActive, setIsStudioActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isMicListening, setIsMicListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [aiAudioEnabled, setAiAudioEnabled] = useState(true);
  const [timerRemaining, setTimerRemaining] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [answersHistory, setAnswersHistory] = useState([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [speechTimeElapsed, setSpeechTimeElapsed] = useState(0);

  const recognitionRef = useRef(null);

  // Setup Web Speech API for Real-Time Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setUserAnswer(currentTranscript);
        }
      };

      recognition.onerror = (event) => {
        if (event.error !== 'aborted' && event.error !== 'not-allowed') {
          console.warn("Speech recognition warning:", event.error);
        }
        setIsMicListening(false);
      };

      recognition.onend = () => {
        setIsMicListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Timer Countdown Effect for Real-time Interview
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => prev - 1);
        setSpeechTimeElapsed(prev => prev + 1);
      }, 1000);
    } else if (timerRemaining === 0 && isTimerActive) {
      setIsTimerActive(false);
      if (isMicListening && recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { }
        setIsMicListening(false);
      }
      handleRealtimeSubmitAnswer();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerRemaining, isMicListening]);

  // AI Speech Synthesis (Voice Output)
  const speakText = (text) => {
    if (!aiAudioEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Zira')));
    if (englishVoice) utterance.voice = englishVoice;

    setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Get Questions for current selection
  const getActiveQuestions = () => {
    const roleQuestions = INTERVIEW_QUESTION_BANKS[interviewRole] || INTERVIEW_QUESTION_BANKS['Audit Trainee'];
    return roleQuestions[interviewRound] || roleQuestions['Technical Round'] || roleQuestions[Object.keys(roleQuestions)[0]];
  };

  // Text Chat Mode Answer Submission & Correction Logic
  const handleSendInterviewAnswer = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const currentQuestions = getActiveQuestions();
    const currentQ = currentQuestions[currentQuestionIdx] || currentQuestions[0];
    const userText = userAnswer.trim();

    const newMessages = [...chatHistory, { sender: 'user', text: userText }];
    setChatHistory(newMessages);
    setUserAnswer('');

    // Evaluate answer keywords
    const lowerAns = userText.toLowerCase();
    const matchedKeywords = (currentQ.keywords || []).filter(k => lowerAns.includes(k.toLowerCase()));
    const isCorrect = matchedKeywords.length >= 1 && userText.split(' ').length > 3;

    setTimeout(() => {
      if (isCorrect) {
        // IF CORRECT: Praise & Move Forward
        const feedbackMsg = `✅ **Correct Answer!** Great job.\n\nYou accurately identified key concepts: **${matchedKeywords.join(', ')}**.\n\n💡 *Standard Focus:* ${currentQ.tip}`;

        const updatedChat = [...newMessages, { sender: 'ai', text: feedbackMsg, isCorrect: true }];

        if (currentQuestionIdx + 1 < currentQuestions.length) {
          const nextIdx = currentQuestionIdx + 1;
          const nextQ = currentQuestions[nextIdx];
          setCurrentQuestionIdx(nextIdx);
          updatedChat.push({
            sender: 'ai',
            text: `🎯 **Question ${nextIdx + 1} of ${currentQuestions.length}:**\n\n*${nextQ.question}*`
          });
        } else {
          updatedChat.push({
            sender: 'ai',
            text: "🎉 **Congratulations!** You answered all questions in this set successfully!"
          });
        }
        setChatHistory(updatedChat);

        setEvaluation({
          score: '9.2 / 10',
          technicalAccuracy: 'High (95%)',
          confidence: 'Strong',
          feedback: `Great technical accuracy! Correctly covered ${matchedKeywords.join(', ')}.`
        });

      } else {
        // IF INCORRECT: Give exact correct answer & explanation, then move to next
        const correctionMsg = `❌ **Incorrect / Incomplete Answer.**\n\n💡 **Here is the Correct Technical Explanation:**\n${currentQ.tip}\n\n*Essential Keywords to Include:* **${currentQ.keywords?.join(', ')}**`;

        const updatedChat = [...newMessages, { sender: 'ai', text: correctionMsg, isIncorrect: true }];

        if (currentQuestionIdx + 1 < currentQuestions.length) {
          const nextIdx = currentQuestionIdx + 1;
          const nextQ = currentQuestions[nextIdx];
          setCurrentQuestionIdx(nextIdx);
          updatedChat.push({
            sender: 'ai',
            text: `🎯 **Next Question (${nextIdx + 1}/${currentQuestions.length}):**\n\n*${nextQ.question}*`
          });
        } else {
          updatedChat.push({
            sender: 'ai',
            text: "Session completed! Review the correct explanations above to strengthen your exam and interview prep."
          });
        }
        setChatHistory(updatedChat);

        setEvaluation({
          score: '5.5 / 10',
          technicalAccuracy: 'Needs Review (50%)',
          confidence: 'Moderate',
          feedback: `Review standard terminology (${currentQ.keywords?.slice(0, 3).join(', ')}).`
        });
      }
    }, 600);
  };

  // Start Real-Time Studio Session
  const handleStartStudioSession = () => {
    const questions = getActiveQuestions();
    setIsStudioActive(true);
    setCurrentQuestionIdx(0);
    setAnswersHistory([]);
    setSessionFinished(false);
    setUserAnswer('');
    setTimerRemaining(90);
    setSpeechTimeElapsed(0);
    setIsTimerActive(true);

    if (questions[0]) {
      speakText(questions[0].question);
    }
  };

  // End / Exit Real-Time Studio Session
  const handleExitStudioSession = () => {
    setIsStudioActive(false);
    setIsTimerActive(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (isMicListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
      setIsMicListening(false);
    }
  };

  // Toggle Microphone Listening
  const handleToggleMic = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Web Speech Recognition is not supported in this browser. You can type your response in the text field below!");
      return;
    }

    if (isMicListening) {
      try { recognitionRef.current.stop(); } catch (e) { }
      setIsMicListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsMicListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Live Metrics Helpers
  const getFillerCount = (text) => {
    if (!text) return 0;
    const fillers = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'mean', 'sort of', 'kind of'];
    const lower = text.toLowerCase();
    let count = 0;
    fillers.forEach(f => {
      const regex = new RegExp(`\\b${f}\\b`, 'g');
      const matches = lower.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  };

  const getWordCount = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const calculateWPM = (text, elapsedSeconds) => {
    const words = getWordCount(text);
    if (elapsedSeconds <= 0 || words === 0) return 0;
    return Math.round((words / elapsedSeconds) * 60);
  };

  // Submit Real-time Answer
  const handleRealtimeSubmitAnswer = () => {
    if (isMicListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { }
      setIsMicListening(false);
    }
    setIsTimerActive(false);

    const questions = getActiveQuestions();
    const currentQ = questions[currentQuestionIdx];

    const words = getWordCount(userAnswer);
    const fillers = getFillerCount(userAnswer);
    const wpm = calculateWPM(userAnswer, Math.max(1, speechTimeElapsed));

    // Match keywords
    const lowerAns = userAnswer.toLowerCase();
    const matchedKeywords = (currentQ.keywords || []).filter(k => lowerAns.includes(k.toLowerCase()));
    const keywordMatchRatio = currentQ.keywords && currentQ.keywords.length > 0
      ? matchedKeywords.length / currentQ.keywords.length
      : 0.5;

    // Calculate score out of 10
    let scoreNum = 6.0;
    if (words > 15) scoreNum += 1.5;
    if (keywordMatchRatio > 0.3) scoreNum += 1.5;
    if (keywordMatchRatio > 0.6) scoreNum += 1.0;
    if (fillers > 3) scoreNum -= 1.0;
    scoreNum = Math.min(10, Math.max(4, Math.round(scoreNum * 10) / 10));

    const evalObj = {
      question: currentQ.question,
      userAnswer: userAnswer || '(No response recorded)',
      matchedKeywords,
      wordCount: words,
      fillerCount: fillers,
      wpm,
      score: scoreNum,
      feedback: keywordMatchRatio > 0.4
        ? `Great attempt! You covered key concepts (${matchedKeywords.join(', ')}). ${fillers > 2 ? 'Try to reduce filler words.' : 'Solid articulate delivery.'}`
        : `Include standard terms like ${currentQ.keywords?.slice(0, 3).join(', ')} to boost technical clarity.`
    };

    const newHistory = [...answersHistory, evalObj];
    setAnswersHistory(newHistory);

    if (currentQuestionIdx + 1 < questions.length) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setUserAnswer('');
      setTimerRemaining(90);
      setSpeechTimeElapsed(0);
      setIsTimerActive(true);

      const nextQ = questions[nextIdx];
      speakText(`Feedback: ${evalObj.feedback}. Next Question: ${nextQ.question}`);
    } else {
      setSessionFinished(true);
      speakText("Congratulations! You have completed all rounds of this real-time AI interview session. Review your full performance scorecard!");
    }
  };

  // CV Maker State
  const [cvData, setCvData] = useState({
    name: 'Muhammad Ahmed',
    crn: 'CRN-104928',
    email: 'ahmed.ca@example.com',
    phone: '+92 300 9876543',
    qualification: 'CA Finalist (CAF Qualified)',
    attempts: 'First Attempt Passed',
    city: 'Lahore',
    skills: 'Financial Modeling, IFRS 15/16, MS Excel (VLOOKUP, Pivot Tables)',
    objective: 'Seeking a challenging Articleship position in a reputable CA firm to apply accounting principles and gain practical audit experience.'
  });

  // AI Tutor State
  const [selectedSubject, setSelectedSubject] = useState('FAR-1 (Financial Accounting)');
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorMessages, setTutorMessages] = useState([
    {
      sender: 'tutor',
      text: "Assalamu Alaikum! I am your 24/7 AI Study Assistant for CAF & ACCA. Ask me any numerical question, accounting standard concept, or audit scenario!"
    }
  ]);

  // Quranic Guidance State
  const [quranSearch, setQuranSearch] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(0);

  // Sample Firms Data
  const firmsData = [
    {
      id: 1,
      name: 'A.F. Ferguson & Co. (PwC Pakistan)',
      category: 'Big 4',
      city: 'Karachi, Lahore, Islamabad',
      stipend: 'Rs. 29,700 / month',
      feedbacksCount: 142,
      rating: 4.9,
      tags: ['Audit', 'Tax', 'Advisory'],
      recentQuestion: 'What are the criteria for capitalizing development expenditure under IAS 38?'
    },
    {
      id: 2,
      name: 'KPMG Taseer Hadi & Co.',
      category: 'Big 4',
      city: 'Lahore, Karachi, Islamabad',
      stipend: 'Rs. 29,700 / month',
      feedbacksCount: 128,
      rating: 4.8,
      tags: ['Statutory Audit', 'Risk Consulting'],
      recentQuestion: 'How do you test inventory valuation when slow-moving items are present?'
    },
    {
      id: 3,
      name: 'EY Ford Rhodes',
      category: 'Big 4',
      city: 'Karachi, Lahore, Islamabad, Rawalpindi',
      stipend: 'Rs. 29,700 / month',
      feedbacksCount: 115,
      rating: 4.8,
      tags: ['Assurance', 'Tax Compliance'],
      recentQuestion: 'Explain the 5-step revenue recognition model under IFRS 15.'
    },
    {
      id: 4,
      name: 'Yousuf Adil (Deloitte Affiliate)',
      category: 'Big 4',
      city: 'Lahore, Karachi, Islamabad, Multan',
      stipend: 'Rs. 29,700 / month',
      feedbacksCount: 98,
      rating: 4.7,
      tags: ['Audit', 'Financial Advisory'],
      recentQuestion: 'Difference between Provision and Contingent Liability under IAS 37.'
    },
    {
      id: 5,
      name: 'BDO Ebrahim & Co.',
      category: 'Category A',
      city: 'Lahore, Karachi, Islamabad, Faisalabad',
      stipend: 'Rs. 25,000 / month',
      feedbacksCount: 84,
      rating: 4.6,
      tags: ['Audit', 'Taxation'],
      recentQuestion: 'What are the main disclosure requirements for Related Party Transactions?'
    },
    {
      id: 6,
      name: 'Grant Thornton Anjum Rahman',
      category: 'Category A',
      city: 'Lahore, Karachi, Islamabad',
      stipend: 'Rs. 25,000 / month',
      feedbacksCount: 76,
      rating: 4.5,
      tags: ['Taxation', 'Corporate Advisory'],
      recentQuestion: 'Explain Sales Tax input tax credit restrictions in Pakistan Income Tax Law.'
    }
  ];

  // Sample Quran Lessons
  const quranLessons = [
    {
      id: 1,
      day: 1,
      title: 'Honesty in Financial Audit & Record Keeping',
      surah: 'Surah Al-Baqarah (2:282)',
      arText: 'وَأَشْهِدُوا إِذَا تَبَايَعْتُمْ ۚ وَلَا يُضَارَّ كَاتِبٌ وَلَا شَهِيدٌ',
      translation: 'And bring witnesses when you conclude a contract, and let neither scribe nor witness suffer harm.',
      corporateWisdom: 'In professional audit & accounting, documenting financial records with complete integrity without falsification or bias is a fundamental Quranic command.'
    },
    {
      id: 2,
      day: 2,
      title: 'Managing Work & Exam Stress with Sabr',
      surah: 'Surah Al-Baqarah (2:153)',
      arText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
      translation: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.',
      corporateWisdom: 'During intense exam preparation or busy audit season deadlines, maintain mental resilience and turn to prayer to alleviate anxiety.'
    },
    {
      id: 3,
      day: 3,
      title: 'Fulfilling Contracts & Professional Pledges',
      surah: 'Surah Al-Ma’idah (5:1)',
      arText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ',
      translation: 'O you who have believed, fulfill all your contracts and obligations.',
      corporateWisdom: 'Whether it is your Articleship deed, employment agreement, or client confidentiality non-disclosure, honoring professional commitments is a cornerstone of faith.'
    }
  ];

  // Filtered firms
  const filteredFirms = firmsData.filter(firm => {
    const matchesCity = selectedCity === 'All' || firm.city.includes(selectedCity);
    const matchesCat = selectedCategory === 'All' || firm.category === selectedCategory;
    const matchesSearch = firm.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
      firm.tags.some(t => t.toLowerCase().includes(directorySearch.toLowerCase()));
    return matchesCity && matchesCat && matchesSearch;
  });



  const handleSendTutorQuery = (e) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;

    setTutorMessages(prev => [...prev, { sender: 'user', text: tutorQuery }]);

    setTimeout(() => {
      setTutorMessages(prev => [
        ...prev,
        {
          sender: 'tutor',
          text: `Great question regarding ${selectedSubject}! Under IAS 16, property, plant, and equipment is initially measured at cost. Depreciation begins when the asset is available for use (i.e. in the location and condition necessary for operation). Let me know if you would like a practice numerical problem!`
        }
      ]);
    }, 1000);

    setTutorQuery('');
  };

  return (
    <div className="min-h-screen bg-navy text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-r from-navy-dark via-emerald-950/40 to-navy-dark border border-brandGreen/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-brandGreen/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brandGreen/15 border border-brandGreen/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Success Suite</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Career Tools & Student AI Hub
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Explore CA/ACCA Firm Directories, AI Mock Interview Simulators, Trainee CV Makers, 24/7 AI Tutors, and Daily Quranic Wisdom — built for CA & ACCA aspirants.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {[
            { id: 'directory', label: 'Firm Directory', icon: Building2 },
            { id: 'mock', label: 'AI Mock Interview', icon: Bot },
            { id: 'cv', label: 'CV Builder', icon: FileText },
            { id: 'tutor', label: 'AI Study Tutor', icon: BookOpen },
            { id: 'quran', label: 'Quranic Guidance', icon: BookMarked }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${isActive
                    ? 'bg-brandGreen text-white shadow-lg shadow-brandGreen/20 border border-brandGreen/50'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SUB-TAB 1: FIRM DIRECTORY & INTERVIEW INSIGHTS */}
        {activeSubTab === 'directory' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-navy-dark p-4 rounded-2xl border border-white/10">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search firm name or tag..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brandGreen"
                />
              </div>

              <div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-brandGreen"
                >
                  <option value="All">All Cities</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Multan">Multan</option>
                  <option value="Faisalabad">Faisalabad</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-brandGreen"
                >
                  <option value="All">All Categories</option>
                  <option value="Big 4">Big 4 Firms</option>
                  <option value="Category A">Category A Firms</option>
                </select>
              </div>
            </div>

            {/* Firm Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFirms.map(firm => (
                <div
                  key={firm.id}
                  className="bg-navy-dark border border-white/10 hover:border-brandGreen/40 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:shadow-xl transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                        {firm.category}
                      </span>
                      <div className="flex items-center space-x-1 text-yellow-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{firm.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-white group-hover:text-emerald-400 transition-colors">
                      {firm.name}
                    </h3>

                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-brandGreen flex-shrink-0" />
                        <span>{firm.city}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-emerald-400 font-semibold">{firm.stipend}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-300 space-y-1">
                      <span className="font-semibold text-brandGreen block">Recent Interview Question:</span>
                      <p className="italic text-gray-400">"{firm.recentQuestion}"</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-gray-400 text-[11px]">{firm.feedbacksCount} Verified Feedbacks</span>
                    <button
                      onClick={() => alert(`Opening feedbacks for ${firm.name}...`)}
                      className="text-brandGreen hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <span>View Feedbacks</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 2: AI MOCK INTERVIEW (REAL-TIME VOICE & VIDEO STUDIO) */}
        {activeSubTab === 'mock' && (
          <div className="space-y-6 animate-fadeIn">

            {/* Real-time Mode Switcher Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-dark p-4 rounded-3xl border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brandGreen/15 border border-brandGreen/30 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">AI Real-Time Interview Studio</h3>
                  <p className="text-xs text-gray-400">Live Web Speech voice recognition, Speech Synthesis, audio waveforms & real-time metrics.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => setMockMode('studio')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${mockMode === 'studio'
                      ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/20'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Real-Time Studio</span>
                </button>
                <button
                  onClick={() => setMockMode('chat')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${mockMode === 'chat'
                      ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/20'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Text Chat Mode</span>
                </button>
              </div>
            </div>

            {/* MODE 1: REAL-TIME INTERACTIVE AUDIO/VIDEO STUDIO */}
            {mockMode === 'studio' && (
              <div className="space-y-6">
                {!isStudioActive ? (
                  /* Setup & Launch Card */
                  <div className="bg-navy-dark p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-brandGreen/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-2xl space-y-3 relative z-10">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Interactive Voice & Speech AI</span>
                      </span>
                      <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                        Ready for Your Simulated Big 4 Interview?
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                        Select your desired role and interview round. The AI Senior Audit Manager will ask you questions out loud, listen to your microphone response in real time, analyze your pace and filler words, and generate a Partner Evaluation Scorecard!
                      </p>
                    </div>

                    {/* Role & Round Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                        <label className="block text-xs font-bold text-gray-300">Select Target Role</label>
                        <select
                          value={interviewRole}
                          onChange={(e) => setInterviewRole(e.target.value)}
                          className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                        >
                          <option value="Audit Trainee">Audit Trainee (Articleship)</option>
                          <option value="Tax Assistant">Tax Advisory Assistant</option>
                          <option value="Advisory Consultant">Financial Advisory Consultant</option>
                        </select>
                      </div>

                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                        <label className="block text-xs font-bold text-gray-300">Select Interview Stage</label>
                        <select
                          value={interviewRound}
                          onChange={(e) => setInterviewRound(e.target.value)}
                          className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                        >
                          <option value="HR Screening">Initial HR Screening</option>
                          <option value="Technical Round">Manager Technical Round</option>
                          <option value="Partner Round">Partner Final Round</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 pt-2 relative z-10">
                      <button
                        onClick={handleStartStudioSession}
                        className="px-6 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-brandGreen/25 flex items-center space-x-2 cursor-pointer active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Start Real-Time Interview Session</span>
                      </button>
                      <button
                        onClick={() => setAiAudioEnabled(!aiAudioEnabled)}
                        className="px-4 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-2xl font-semibold text-xs transition-all border border-white/10 flex items-center space-x-2 cursor-pointer"
                      >
                        {aiAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                        <span>AI Voice: {aiAudioEnabled ? 'Enabled' : 'Muted'}</span>
                      </button>
                    </div>
                  </div>
                ) : sessionFinished ? (
                  /* FINAL PERFORMANCE SCORECARD REPORT */
                  <div className="bg-navy-dark p-8 rounded-3xl border border-brandGreen/30 space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                      <div className="space-y-1">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brandGreen/20 border border-brandGreen/40 text-emerald-400 text-xs font-bold uppercase">
                          <Award className="w-4 h-4" />
                          <span>Final Assessment Complete</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-white">Interview Performance Scorecard</h2>
                        <p className="text-xs text-gray-400">{interviewRole} • {interviewRound}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print Scorecard</span>
                        </button>
                        <button
                          onClick={handleStartStudioSession}
                          className="px-4 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Retake Interview</span>
                        </button>
                      </div>
                    </div>

                    {/* Overall Score Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      {(() => {
                        const totalScore = answersHistory.reduce((acc, curr) => acc + curr.score, 0);
                        const avgScore = answersHistory.length > 0 ? (totalScore / answersHistory.length).toFixed(1) : 8.5;
                        const avgWpm = answersHistory.length > 0 ? Math.round(answersHistory.reduce((acc, curr) => acc + curr.wpm, 0) / answersHistory.length) : 125;
                        const totalFillers = answersHistory.reduce((acc, curr) => acc + curr.fillerCount, 0);

                        return (
                          <>
                            <div className="p-4 rounded-2xl bg-brandGreen/10 border border-brandGreen/30 text-center space-y-1">
                              <span className="text-[11px] text-gray-400 font-bold uppercase">Overall Rating</span>
                              <div className="text-3xl font-black text-emerald-400">{avgScore} / 10</div>
                              <span className="text-[10px] text-emerald-300 font-bold">
                                {avgScore >= 8 ? 'Strong Recommend' : avgScore >= 6 ? 'Passable' : 'Needs Practice'}
                              </span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                              <span className="text-[11px] text-gray-400 font-bold uppercase">Average Speech Pace</span>
                              <div className="text-3xl font-black text-white">{avgWpm} WPM</div>
                              <span className="text-[10px] text-gray-400 font-bold">Optimal: 120 - 150 WPM</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                              <span className="text-[11px] text-gray-400 font-bold uppercase">Total Filler Words</span>
                              <div className="text-3xl font-black text-amber-400">{totalFillers}</div>
                              <span className="text-[10px] text-gray-400 font-bold">Um / Uh / Like</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                              <span className="text-[11px] text-gray-400 font-bold uppercase">Questions Cleared</span>
                              <div className="text-3xl font-black text-white">{answersHistory.length} / {getActiveQuestions().length}</div>
                              <span className="text-[10px] text-brandGreen font-bold">Completed</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Question Breakdown */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-white tracking-wider uppercase">Question-by-Question Breakdown</h4>
                      <div className="space-y-3">
                        {answersHistory.map((ans, idx) => (
                          <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold text-emerald-400">Q{idx + 1}: {ans.question}</span>
                              <span className="px-2.5 py-1 rounded-lg bg-brandGreen/20 text-emerald-400 font-bold text-[11px]">Score: {ans.score} / 10</span>
                            </div>
                            <div className="p-3 rounded-xl bg-navy text-xs text-gray-300 font-mono">
                              <strong>Your Answer:</strong> "{ans.userAnswer}"
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                              <span><strong>Pace:</strong> {ans.wpm} WPM</span>
                              <span>•</span>
                              <span><strong>Fillers:</strong> {ans.fillerCount}</span>
                              <span>•</span>
                              <span><strong>Keywords matched:</strong> {ans.matchedKeywords.length > 0 ? ans.matchedKeywords.join(', ') : 'None'}</span>
                            </div>
                            <p className="text-xs text-emerald-300 italic">"{ans.feedback}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ACTIVE REAL-TIME INTERVIEW STUDIO CALL VIEW */
                  <div className="bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-6 animate-fadeIn">

                    {/* Studio Top Control Bar */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center space-x-3">
                        <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        <span className="text-xs font-extrabold uppercase tracking-wider text-white">Live Real-Time Session</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 text-[10px] font-bold">
                          Q{currentQuestionIdx + 1} of {getActiveQuestions().length}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setAiAudioEnabled(!aiAudioEnabled)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all"
                          title="Toggle AI Voice"
                        >
                          {aiAudioEnabled ? <Volume2 className="w-4 h-4 text-brandGreen" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                        </button>
                        <button
                          onClick={handleExitStudioSession}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          End Session
                        </button>
                      </div>
                    </div>

                    {/* Interview Call Interface Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                      {/* Left: AI Virtual Interlocutor Card */}
                      <div className="lg:col-span-5 bg-navy p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden min-h-[340px]">
                        {/* Animated Aura Ring */}
                        <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${isAiSpeaking
                            ? 'border-brandGreen bg-brandGreen/20 shadow-[0_0_30px_rgba(0,200,83,0.5)] scale-105'
                            : isMicListening
                              ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                              : 'border-white/20 bg-white/5'
                          }`}>
                          <Bot className={`w-14 h-14 ${isAiSpeaking ? 'text-brandGreen animate-bounce' : 'text-white'}`} />
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-extrabold text-white text-base">Senior Audit Manager</h4>
                          <span className="text-[11px] text-brandGreen font-semibold uppercase tracking-wider block">
                            {isAiSpeaking ? '🔊 Speaking Question...' : isMicListening ? '🎙️ Listening to You...' : '💭 Thinking...'}
                          </span>
                        </div>

                        {/* Active Question Box */}
                        {(() => {
                          const currentQ = getActiveQuestions()[currentQuestionIdx];
                          return (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 leading-relaxed font-sans max-w-sm text-left">
                              <span className="font-bold text-emerald-400 block mb-1">Interviewer Question:</span>
                              "{currentQ?.question}"
                            </div>
                          );
                        })()}
                      </div>

                      {/* Right: Candidate Speech & Live Response Panel */}
                      <div className="lg:col-span-7 bg-navy p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">

                        {/* Live HUD Bar: Timer & Real-time Metrics */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block">Timer</span>
                            <span className={`text-lg font-black ${timerRemaining < 15 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                              {timerRemaining}s
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block">Live Pace</span>
                            <span className="text-lg font-black text-white">
                              {calculateWPM(userAnswer, Math.max(1, speechTimeElapsed))} WPM
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block">Fillers</span>
                            <span className="text-lg font-black text-amber-400">
                              {getFillerCount(userAnswer)}
                            </span>
                          </div>
                        </div>

                        {/* Speech Transcript Display & Text Editing Box */}
                        <div className="flex-1 flex flex-col space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-gray-300">Your Live Speech Transcript:</span>
                            {isMicListening && (
                              <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 rounded-full bg-brandGreen animate-ping" />
                                <span className="text-[10px] text-emerald-400 font-bold">Recording Speech...</span>
                              </div>
                            )}
                          </div>

                          <textarea
                            rows="5"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Speak using your mic or type your interview response here..."
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brandGreen leading-relaxed"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                          <button
                            type="button"
                            onClick={handleToggleMic}
                            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${isMicListening
                                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                              }`}
                          >
                            {isMicListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                            <span>{isMicListening ? 'Stop Mic' : 'Start Mic Speaking'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleRealtimeSubmitAnswer}
                            className="w-full sm:w-auto px-6 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-extrabold text-xs transition-all shadow-md shadow-brandGreen/20 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                          >
                            <span>Submit Answer & Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* MODE 2: TEXT CHAT SIMULATOR */}
            {mockMode === 'chat' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                {/* Control Column */}
                <div className="lg:col-span-4 bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-6">
                  <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-brandGreen" />
                    <span>Interview Setup</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Target Role</label>
                      <select
                        value={interviewRole}
                        onChange={(e) => setInterviewRole(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                      >
                        <option value="Audit Trainee">Audit Trainee (Articleship)</option>
                        <option value="Tax Assistant">Tax Advisory Assistant</option>
                        <option value="Advisory Consultant">Financial Advisory Consultant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1.5">Interview Round</label>
                      <select
                        value={interviewRound}
                        onChange={(e) => setInterviewRound(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                      >
                        <option value="HR Screening">Initial HR Screening</option>
                        <option value="Technical Round">Manager Technical Round</option>
                        <option value="Partner Round">Partner Final Round</option>
                      </select>
                    </div>
                  </div>

                  {/* Evaluation Card */}
                  {evaluation && (
                    <div className="p-4 rounded-2xl bg-brandGreen/10 border border-brandGreen/30 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">AI Performance Score</span>
                      <div className="text-xl font-extrabold text-white">{evaluation.score}</div>
                      <div className="text-[11px] text-gray-300 leading-relaxed space-y-1">
                        <p><strong>Accuracy:</strong> {evaluation.technicalAccuracy}</p>
                        <p><strong>Confidence:</strong> {evaluation.confidence}</p>
                        <p className="text-gray-400">{evaluation.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Simulator */}
                <div className="lg:col-span-8 bg-navy-dark p-6 rounded-3xl border border-white/10 flex flex-col h-[520px]">
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                    {chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                              ? 'bg-brandGreen text-white rounded-br-none'
                              : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'
                            }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendInterviewAnswer} className="mt-4 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type your interview response..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brandGreen"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Submit</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* SUB-TAB 3: CV BUILDER */}
        {activeSubTab === 'cv' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* Form Input Column */}
            <div className="lg:col-span-6 bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-brandGreen" />
                <span>Articleship CV Form</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={cvData.name}
                    onChange={(e) => setCvData({ ...cvData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">CRN / ACCA ID</label>
                  <input
                    type="text"
                    value={cvData.crn}
                    onChange={(e) => setCvData({ ...cvData, crn: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={cvData.email}
                    onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={cvData.phone}
                    onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Career Objective</label>
                <textarea
                  rows="3"
                  value={cvData.objective}
                  onChange={(e) => setCvData({ ...cvData, objective: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Technical Skills & Tools</label>
                <input
                  type="text"
                  value={cvData.skills}
                  onChange={(e) => setCvData({ ...cvData, skills: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            {/* Live CV Preview */}
            <div className="lg:col-span-6 bg-white text-navy p-8 rounded-3xl shadow-2xl space-y-6 font-sans">
              <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold uppercase text-navy tracking-tight">{cvData.name}</h2>
                  <p className="text-xs text-brandGreen font-bold">{cvData.qualification} | {cvData.crn}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl bg-navy text-white text-xs font-bold flex items-center space-x-1 hover:bg-navy-dark transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print CV</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold uppercase text-brandGreen tracking-wider mb-1">Career Objective</h4>
                  <p className="text-gray-600 leading-relaxed">{cvData.objective}</p>
                </div>

                <div>
                  <h4 className="font-bold uppercase text-brandGreen tracking-wider mb-1">Educational Stage & Attempts</h4>
                  <p className="text-gray-700"><strong>Status:</strong> {cvData.qualification}</p>
                  <p className="text-gray-700"><strong>Attempt Status:</strong> {cvData.attempts}</p>
                </div>

                <div>
                  <h4 className="font-bold uppercase text-brandGreen tracking-wider mb-1">Skills & Certifications</h4>
                  <p className="text-gray-700">{cvData.skills}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 4: AI TUTOR */}
        {activeSubTab === 'tutor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            <div className="lg:col-span-4 bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-brandGreen" />
                <span>Subject Selection</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Select ICAP / ACCA Paper</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                >
                  <option value="FAR-1 (Financial Accounting)">CAF-1 Financial Accounting & Reporting I</option>
                  <option value="FAR-2 (Financial Accounting)">CAF-5 Financial Accounting & Reporting II</option>
                  <option value="Audit & Assurance">CAF-6 Audit and Assurance</option>
                  <option value="Taxation">CAF-2 Tax Practices</option>
                  <option value="ACCA PM">ACCA Performance Management</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-2">
                <span className="font-bold text-emerald-400">Quick Tutor Prompts:</span>
                <div className="space-y-1.5 text-gray-300">
                  <button
                    onClick={() => setTutorQuery("Explain IAS 16 Cost vs Revaluation Model")}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 transition-colors"
                  >
                    • IAS 16 Revaluation Model
                  </button>
                  <button
                    onClick={() => setTutorQuery("What are the key assertions in Audit of Sales?")}
                    className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 transition-colors"
                  >
                    • Audit Assertions for Revenue
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-navy-dark p-6 rounded-3xl border border-white/10 flex flex-col h-[520px]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                {tutorMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                          ? 'bg-brandGreen text-white rounded-br-none'
                          : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendTutorQuery} className="mt-4 flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask any CAF / ACCA question..."
                  value={tutorQuery}
                  onChange={(e) => setTutorQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brandGreen"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl font-bold text-xs transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>Ask Tutor</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SUB-TAB 5: QURANIC GUIDANCE */}
        {activeSubTab === 'quran' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quranLessons.map(lesson => (
                <div
                  key={lesson.id}
                  className="bg-navy-dark border border-white/10 p-6 rounded-3xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                      Day {lesson.day} • {lesson.surah}
                    </span>
                    <h3 className="font-extrabold text-base text-white">{lesson.title}</h3>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-right font-serif text-emerald-300 text-sm leading-loose">
                      {lesson.arText}
                    </div>

                    <p className="text-xs text-gray-300 italic leading-relaxed">
                      "{lesson.translation}"
                    </p>

                    <div className="p-3 rounded-xl bg-brandGreen/10 border border-brandGreen/20 text-[11px] text-gray-200">
                      <strong className="text-brandGreen block mb-1">Corporate & Exam Wisdom:</strong>
                      {lesson.corporateWisdom}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
