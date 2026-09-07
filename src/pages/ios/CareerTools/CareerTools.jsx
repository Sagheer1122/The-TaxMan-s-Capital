import { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Bot,
  FileText,
  BookOpen,
  Sparkles,
  Search,
  ChevronRight,
  Briefcase,
  BookMarked,
  RefreshCw,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Activity,
  Video,
  History,
  Trash2,
  Eye,
  ShieldCheck,
  Target,
  Users,
  Shield,
  Layers
} from 'lucide-react';
import AIInterviewStudio from '../../../components/interview/AIInterviewStudio';
import InterviewScorecardReport from '../../../components/interview/InterviewScorecardReport';
import { useVideoBehaviorAnalyzer } from '../../../hooks/useVideoBehaviorAnalyzer';
import { useVoiceInterviewEngine } from '../../../hooks/useVoiceInterviewEngine';
import { useMediaDeviceManager } from '../../../hooks/useMediaDeviceManager';
import {
  startInterviewSession,
  sendInterviewAnswer,
  completeInterviewSession,
  getInterviewHistory,
  deleteInterviewSession,
  getInterviewSession
} from '../../../services/interviewService';
import { requireAuth } from '../../../services/authService';
import ArticleshipCVBuilder from '../../../components/ArticleshipCVBuilder';
import StudyTutorChat from '../../../components/study/StudyTutorChat';

export default function CareerTools() {
  const [activeSubTab, setActiveSubTab] = useState('directory');

  // Firm Directory State
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [directorySearch, setDirectorySearch] = useState('');

  // ==========================================
  // AI MOCK INTERVIEW FINITE STATE MACHINE (FSM)
  // ==========================================
  // 'IDLE' | 'REQUESTING_PERMISSIONS' | 'DEVICE_READY' | 'AI_GREETING' | 'WAITING_FOR_READY' |
  // 'INTERVIEW_ACTIVE' | 'AI_SPEAKING' | 'LISTENING_TO_USER' | 'ANALYZING_ANSWER' |
  // 'FOLLOW_UP' | 'INTERVIEW_COMPLETED' | 'GENERATING_REPORT' | 'REPORT_READY' | 'ERROR'
  const [interviewState, setInterviewState] = useState('IDLE');
  const [mockMode, setMockMode] = useState('studio'); // 'studio' | 'voice_only' | 'chat' | 'history'

  // Setup Options
  const [interviewRole, setInterviewRole] = useState('Audit Trainee (Articleship)');
  const [customRole, setCustomRole] = useState('');
  const [interviewStage, setInterviewStage] = useState('Manager Technical Round');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [interviewType, setInterviewType] = useState('Technical');
  const [questionCountChoice, setQuestionCountChoice] = useState('5');
  const [customQuestionCount, setCustomQuestionCount] = useState(5);
  const [interviewDurationMinutes, setInterviewDurationMinutes] = useState(15);
  const [panelMode, setPanelMode] = useState(false); // Two-Agent Panel (Senior Audit Manager + HR Lead)
  const [isBig4, setIsBig4] = useState(true); // Big 4 Challenge Simulator Mode
  const [enableCamera, setEnableCamera] = useState(true);

  // Active Session State
  const [sessionId, setSessionId] = useState(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isFinalizingSession, setIsFinalizingSession] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [totalQuestionsTarget, setTotalQuestionsTarget] = useState(5);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [bankQuestions, setBankQuestions] = useState([]);

  // Transcript & Turn Tracking
  const [userAnswer, setUserAnswer] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [turnEvaluations, setTurnEvaluations] = useState([]);
  const [finalScorecard, setFinalScorecard] = useState(null);

  // Audio & Voice State
  const [aiAudioEnabled, setAiAudioEnabled] = useState(true);

  // Real-time Timer
  const [timerRemaining, setTimerRemaining] = useState(900); // in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  // History State
  const [pastInterviews, setPastInterviews] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  // Coordinated Hardware & Engine Hooks
  const deviceManager = useMediaDeviceManager({ enableCamera: enableCamera && mockMode === 'studio' });
  const videoAnalyzer = useVideoBehaviorAnalyzer({
    stream: deviceManager.stream,
    isStudioActive: interviewState !== 'IDLE' && interviewState !== 'REPORT_READY',
    isCameraActive: deviceManager.isCameraActive
  });
  const submitTurnRef = useRef(null);

  const voiceEngine = useVoiceInterviewEngine({
    aiAudioEnabled,
    onSpeechFinalized: () => {},
    onSilenceDetected: (finalizedTranscript) => {
      // Auto-submit candidate answer turn after silence when in active interview
      if (
        interviewState === 'INTERVIEW_ACTIVE' &&
        (mockMode === 'studio' || mockMode === 'voice_only') &&
        finalizedTranscript &&
        finalizedTranscript.trim().split(/\s+/).length >= 2
      ) {
        if (submitTurnRef.current) {
          submitTurnRef.current(finalizedTranscript);
        }
      }
    }
  });

  // Sync voice transcript with input box
  useEffect(() => {
    if (voiceEngine.liveTranscript) {
      setUserAnswer(voiceEngine.liveTranscript);
    }
  }, [voiceEngine.liveTranscript]);

  // Load Past Interview History when History view is accessed
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getInterviewHistory();
      setPastInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Error fetching history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (mockMode === 'history') {
      fetchHistory();
    }
  }, [mockMode]);

  // Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            handleFinalizeInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerRemaining]);

  // Resolved Target Role & Question Count
  const targetRoleResolved =
    interviewRole === 'Custom Role' ? customRole.trim() || 'Chartered Accountant Trainee' : interviewRole;
  const targetCountResolved =
    questionCountChoice === 'Custom' ? Number(customQuestionCount) || 5 : Number(questionCountChoice) || 5;

  // ==========================================
  // NATURAL LANGUAGE READINESS LISTENER (English & Roman Urdu)
  // ==========================================
  useEffect(() => {
    if (interviewState !== 'WAITING_FOR_READY') return;

    const text = (voiceEngine.liveTranscript || userAnswer || '').trim().toLowerCase();
    if (!text || text.length < 2) return;

    const readyRegex =
      /\b(yes|yeah|yep|yup|ready|i am ready|i'm ready|sure|start|begin|go ahead|let's do it|lets go|lets start|yes sir|yes ma'am|all set|absolutely|jee|ji|g|haan|han|tayyar|theek|ready hn|ready hoon|shuru|shuru karein|bilkul|ok|done)\b/i;
    const notReadyRegex =
      /\b(no|not yet|wait|hold on|give me a moment|give me a second|one minute|1 minute|not ready|stop|pause|rukain|ruko|abhi nahi|abhi ni|thori der|ek minute)\b/i;

    if (readyRegex.test(text)) {
      handleConfirmReady(text);
    } else if (notReadyRegex.test(text)) {
      handleConfirmNotReady(text);
    }
  }, [interviewState, voiceEngine.liveTranscript, userAnswer]);

  // ==========================================
  // START INTERVIEW SESSION (INITIALIZE HARDWARE -> GREETING -> WAITING FOR READY)
  // ==========================================
  const handleStartInterview = async (customParams = {}) => {
    if (!requireAuth('start an AI Mock Interview session')) {
      return;
    }
    setIsStartingSession(true);
    setFinalScorecard(null);
    setTurnEvaluations([]);
    setUserAnswer('');
    voiceEngine.resetTurnMetrics();
    setCurrentQuestionIdx(0);
    setInterviewState('REQUESTING_PERMISSIONS');

    const count = customParams.questionCount || targetCountResolved;
    setTotalQuestionsTarget(count);

    const durationMin = customParams.duration || interviewDurationMinutes;
    const maxSeconds = Number(durationMin) * 60;
    setTimerRemaining(maxSeconds);

    const role = customParams.targetRole || targetRoleResolved;
    const stage = customParams.interviewStage || interviewStage;
    const diff = customParams.difficulty || difficulty;
    const type = customParams.interviewType || interviewType;
    const isPanel = customParams.panelMode !== undefined ? customParams.panelMode : panelMode;
    const big4 = customParams.isBig4 !== undefined ? customParams.isBig4 : isBig4;

    try {
      // 1. Request Camera & Microphone access coordinated
      const wantCam = mockMode === 'studio' && enableCamera;
      await deviceManager.requestMediaDevices({ enableCamera: wantCam });

      // 2. Start session with grounded question bank on backend
      const response = await startInterviewSession({
        targetRole: role,
        interviewStage: stage,
        difficulty: diff,
        interviewType: type,
        questionCount: count,
        duration: durationMin,
        panelMode: isPanel,
        isBig4: big4
      });

      const sid = response.sessionId || response.session?._id;
      setSessionId(sid);
      const bankQs = response.bankQuestions || response.session?.bankQuestions || [];
      setBankQuestions(bankQs);

      const speaker = response.currentSpeaker || {
        role: isPanel ? 'Senior Audit Manager (Technical)' : 'Senior Interviewer',
        name: isPanel ? 'Asim Raza' : 'Senior Interview Panel'
      };
      setCurrentSpeaker(speaker);

      // 3. Realistic GREETING dialogue (Does NOT ask technical question yet)
      const greetingDialogue =
        "Good morning. Welcome to your simulated CA/ACCA interview. I will be conducting today's session. Before we begin, are you ready?";
      setCurrentQuestionText(greetingDialogue);

      setTranscript([
        {
          speaker: 'ai',
          text: greetingDialogue,
          speakerRole: speaker.role,
          speakerName: speaker.name,
          timestamp: new Date(),
          duration: 0
        }
      ]);

      setInterviewState('AI_GREETING');

      // 4. Speak greeting, then enter WAITING_FOR_READY
      if (mockMode === 'studio' || mockMode === 'voice_only') {
        voiceEngine.speakText(greetingDialogue, speaker.role, () => {
          setInterviewState('WAITING_FOR_READY');
          voiceEngine.startListening();
        });
      } else {
        setInterviewState('WAITING_FOR_READY');
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert('Unable to initialize interview room. Please check device permissions and try again.');
      setInterviewState('IDLE');
    } finally {
      setIsStartingSession(false);
    }
  };

  // Candidate confirms READY -> AI confirms and starts Question 1
  const handleConfirmReady = (confirmationText = 'Yes, I am ready.') => {
    voiceEngine.stopListening();
    setUserAnswer('');
    voiceEngine.resetTurnMetrics();

    // Append candidate readiness
    setTranscript((prev) => [
      ...prev,
      {
        speaker: 'candidate',
        text: confirmationText,
        timestamp: new Date(),
        duration: 2
      }
    ]);

    setInterviewState('AI_SPEAKING');

    const firstQuestionObj = bankQuestions[0] || {
      question: 'To begin, could you briefly introduce yourself and highlight your academic or practical experience in accounting and audit?',
      category: 'Behavioral & HR'
    };

    const ackAndQ1 = `Excellent. Let's begin. Question 1: ${firstQuestionObj.question}`;
    setCurrentQuestionText(ackAndQ1);

    setTranscript((prev) => [
      ...prev,
      {
        speaker: 'ai',
        text: ackAndQ1,
        speakerRole: currentSpeaker?.role || 'Senior Interviewer',
        speakerName: currentSpeaker?.name || 'Interview Panel',
        timestamp: new Date(),
        duration: 0
      }
    ]);

    if (mockMode === 'studio' || mockMode === 'voice_only') {
      voiceEngine.speakText(ackAndQ1, currentSpeaker?.role, () => {
        setInterviewState('INTERVIEW_ACTIVE');
        setIsTimerActive(true);
        voiceEngine.startListening();
      });
    } else {
      setInterviewState('INTERVIEW_ACTIVE');
      setIsTimerActive(true);
    }
  };

  // Candidate says NOT READY -> AI acknowledges and continues waiting
  const handleConfirmNotReady = (denialText = 'Not yet, please wait.') => {
    voiceEngine.stopListening();
    setUserAnswer('');
    voiceEngine.resetTurnMetrics();

    setTranscript((prev) => [
      ...prev,
      {
        speaker: 'candidate',
        text: denialText,
        timestamp: new Date(),
        duration: 2
      }
    ]);

    const waitReply = "No problem. Take your time. Let me know when you're ready.";
    setCurrentQuestionText(waitReply);

    setTranscript((prev) => [
      ...prev,
      {
        speaker: 'ai',
        text: waitReply,
        speakerRole: currentSpeaker?.role || 'Senior Interviewer',
        speakerName: currentSpeaker?.name || 'Interview Panel',
        timestamp: new Date(),
        duration: 0
      }
    ]);

    if (mockMode === 'studio' || mockMode === 'voice_only') {
      voiceEngine.speakText(waitReply, currentSpeaker?.role, () => {
        setInterviewState('WAITING_FOR_READY');
        voiceEngine.startListening();
      });
    } else {
      setInterviewState('WAITING_FOR_READY');
    }
  };

  // ==========================================
  // SUBMIT CANDIDATE ANSWER TURN
  // ==========================================
  const handleSubmitAnswerTurn = async (eOrText) => {
    if (eOrText && typeof eOrText.preventDefault === 'function') {
      eOrText.preventDefault();
    }
    if (isSubmittingAnswer || isFinalizingSession) return;

    const explicitText = typeof eOrText === 'string' ? eOrText : null;
    const answer = (explicitText || userAnswer || voiceEngine.liveTranscript || '').trim();
    if (!answer && mockMode === 'chat') return;

    voiceEngine.stopListening();
    setIsSubmittingAnswer(true);
    setInterviewState('ANALYZING_ANSWER');

    const candidateMsg = {
      speaker: 'candidate',
      text: answer || '(No verbal response recorded)',
      timestamp: new Date(),
      duration: voiceEngine.turnSpeakingTime,
      metrics: {
        wpm: voiceEngine.wpm,
        fillerCount: voiceEngine.fillerCount,
        wordCount: answer.split(/\s+/).filter(Boolean).length
      }
    };
    setTranscript((prev) => [...prev, candidateMsg]);
    setUserAnswer('');
    const turnDuration = voiceEngine.turnSpeakingTime;
    voiceEngine.resetTurnMetrics();

    try {
      const response = await sendInterviewAnswer({
        sessionId,
        candidateAnswer: answer,
        duration: turnDuration,
        currentQuestionIndex: currentQuestionIdx,
        bankQuestions,
        panelMode,
        totalQuestions: totalQuestionsTarget,
        metrics: {
          wpm: voiceEngine.wpm,
          fillerCount: voiceEngine.fillerCount,
          cameraEngagement: videoAnalyzer.metrics.cameraEngagement,
          postureStability: videoAnalyzer.metrics.postureStability,
          presenceScore: videoAnalyzer.metrics.presenceScore
        }
      });

      if (response.turnEvaluation) {
        setTurnEvaluations((prev) => [...prev, response.turnEvaluation]);
      }

      const nextReply = response.interviewerReply || "Thank you. Let's proceed to the next question.";
      setCurrentQuestionText(nextReply);
      if (response.currentSpeaker) {
        setCurrentSpeaker(response.currentSpeaker);
      }

      setTranscript((prev) => [
        ...prev,
        {
          speaker: 'ai',
          text: nextReply,
          speakerRole: response.currentSpeaker?.role || currentSpeaker?.role,
          speakerName: response.currentSpeaker?.name || currentSpeaker?.name,
          timestamp: new Date(),
          duration: 0
        }
      ]);

      const nextIdx = response.currentQuestionIndex !== undefined ? response.currentQuestionIndex : currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);

      const isComplete = response.isInterviewComplete || nextIdx >= totalQuestionsTarget;

      if (isComplete) {
        if (mockMode === 'studio' || mockMode === 'voice_only') {
          voiceEngine.speakText(nextReply, response.currentSpeaker?.role, async () => {
            await handleFinalizeInterview();
          });
        } else {
          await handleFinalizeInterview();
        }
      } else {
        if (mockMode === 'studio' || mockMode === 'voice_only') {
          setInterviewState('AI_SPEAKING');
          voiceEngine.speakText(nextReply, response.currentSpeaker?.role, () => {
            setInterviewState('INTERVIEW_ACTIVE');
            voiceEngine.startListening();
          });
        } else {
          setInterviewState('INTERVIEW_ACTIVE');
        }
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setCurrentQuestionIdx((prev) => prev + 1);
      setInterviewState('INTERVIEW_ACTIVE');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  useEffect(() => {
    submitTurnRef.current = handleSubmitAnswerTurn;
  });

  // ==========================================
  // FINALIZE & COMPLETE INTERVIEW (SCORECARD)
  // ==========================================
  const handleFinalizeInterview = async () => {
    setIsFinalizingSession(true);
    setInterviewState('GENERATING_REPORT');
    setIsTimerActive(false);
    voiceEngine.stopListening();
    voiceEngine.stopSpeaking();

    try {
      const response = await completeInterviewSession(sessionId, {
        avgWpm: voiceEngine.wpm,
        totalFillers: voiceEngine.fillerCount,
        cameraEngagement: videoAnalyzer.metrics.cameraEngagement,
        postureStability: videoAnalyzer.metrics.postureStability,
        presenceScore: videoAnalyzer.metrics.presenceScore
      });
      const scorecard = response.evaluation || response.session?.evaluation;
      setFinalScorecard(scorecard);
      setInterviewState('REPORT_READY');
      fetchHistory();
    } catch (err) {
      console.error('Failed to complete interview:', err);
      setInterviewState('REPORT_READY');
    } finally {
      setIsFinalizingSession(false);
    }
  };

  // Toggles for hardware
  const handleToggleMic = () => {
    deviceManager.toggleMicrophone();
    voiceEngine.toggleMic();
  };

  const handleToggleCamera = () => {
    deviceManager.toggleCamera();
  };

  // Practice Weak Areas Handler
  const handlePracticeWeakAreas = (weakTopics = []) => {
    setFinalScorecard(null);
    setTranscript([]);
    setTurnEvaluations([]);
    handleStartInterview({
      targetRole: targetRoleResolved,
      interviewStage: 'Manager Technical Round',
      difficulty: 'Advanced',
      interviewType: 'Technical',
      questionCount: 3,
      duration: 10
    });
  };

  // Exit Studio & Complete Hardware Cleanup
  const handleExitStudio = () => {
    deviceManager.cleanupAllStreams();
    voiceEngine.cleanupVoiceEngine();
    setIsTimerActive(false);
    setInterviewState('IDLE');
    setTranscript([]);
    setTurnEvaluations([]);
    setFinalScorecard(null);
  };

  // View Specific Past Interview Scorecard Modal
  const handleViewPastInterview = async (historyId) => {
    try {
      const sessionData = await getInterviewSession(historyId);
      if (sessionData) {
        setSelectedHistoryItem(sessionData);
        setHistoryModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch session detail:', err);
    }
  };

  const handleDeleteHistory = async (historyId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this interview record?')) {
      await deleteInterviewSession(historyId);
      setPastInterviews((prev) => prev.filter((item) => item._id !== historyId));
    }
  };

  // ==========================================
  // OTHER SUB-TABS STATE (CV, TUTOR, QURAN)
  // ==========================================
  const [cvData, setCvData] = useState({
    name: 'Muhammad Ahmed',
    crn: 'CRN-104928',
    email: 'ahmed.ca@example.com',
    phone: '+92 300 9876543',
    qualification: 'CA Finalist (CAF Qualified)',
    attempts: 'First Attempt Passed',
    city: 'Lahore',
    skills: 'Financial Modeling, IFRS 15/16, MS Excel (VLOOKUP, Pivot Tables), ISA 315/330 Audit Planning',
    objective: 'Seeking a challenging Articleship position in a reputable Big 4 CA firm to apply accounting principles and gain practical audit experience.'
  });

  const [selectedSubject, setSelectedSubject] = useState('FAR-1 (Financial Accounting)');
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorMessages, setTutorMessages] = useState([
    {
      sender: 'tutor',
      text: "Assalamu Alaikum! I am your 24/7 AI Study Assistant for CAF & ACCA. Ask me any numerical question, accounting standard concept, or audit scenario!"
    }
  ]);

  const handleSendTutorQuery = (e) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;
    const q = tutorQuery.trim();
    setTutorMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setTutorQuery('');

    setTimeout(() => {
      let reply = `Regarding your query on **${selectedSubject}**: Always identify the core IAS / IFRS / ISA standard definition before calculating journal entries. Ensure proper assertion testing (Completeness, Valuation, Existence) and tax adjustment where applicable.`;
      if (q.toLowerCase().includes('ias 16')) {
        reply = `Under **IAS 16 (Property, Plant and Equipment)**: Initial recognition is at Cost. Subsequent measurement allows either the Cost Model or Revaluation Model. Depreciation begins when asset is ready for intended use. Note: Land has unlimited useful life and is not depreciated.`;
      } else if (q.toLowerCase().includes('ifrs 15')) {
        reply = `Under **IFRS 15 (Revenue from Contracts with Customers)**, apply the 5-Step Model:\n1. Identify contract\n2. Identify performance obligations\n3. Determine transaction price\n4. Allocate price to obligations\n5. Recognize revenue when/as obligations are satisfied.`;
      }
      setTutorMessages((prev) => [...prev, { sender: 'tutor', text: reply }]);
    }, 600);
  };

  // Firms Data
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
      recentQuestion: 'How do you test inventory valuation when slow-moving items are present under IAS 2?'
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
      recentQuestion: 'What are the main disclosure requirements for Related Party Transactions under IAS 24?'
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

  const quranLessons = [
    {
      id: 1,
      day: 1,
      surah: 'Surah Al-Baqarah (2:282)',
      title: 'Precision in Financial Documentation',
      arText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰ أَجَلٍ مُّسَمًّى فَاكْتُبُوهُ',
      translation: 'O you who have believed, when you contract a debt for a specified term, write it down.',
      corporateWisdom: 'The longest verse of the Quran establishes the fundamental principle of complete audit trails, written contracts, and objective third-party verification.'
    },
    {
      id: 2,
      day: 2,
      surah: 'Surah Al-Mutaffifin (83:1-3)',
      title: 'Integrity in Measurement & Reporting',
      arText: 'وَيْلٌ لِّلْمُطَفِّفِينَ • الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ',
      translation: 'Woe to those who give less [than due], who, when they take a measure from people, take in full.',
      corporateWisdom: 'Professional ethics and accuracy in financial reporting are sacred trusts. Misleading valuations violate divine accountability.'
    },
    {
      id: 3,
      day: 3,
      surah: 'Surah Al-Qasas (28:26)',
      title: 'Competence & Trustworthiness',
      arText: 'إِنَّ خَيْرَ مَنِ اسْتَأْجَرْتَ الْقَوِيُّ الْأَمِينُ',
      translation: 'Indeed, the best one you can hire is the strong and the trustworthy.',
      corporateWisdom: 'Professional success requires both technical competence (Al-Qawiyy) and uncompromising integrity (Al-Ameen).'
    }
  ];

  return (
    <div className="min-h-screen bg-navy text-white py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-dark via-navy to-navy-dark border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-brandGreen/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brandGreen/15 border border-brandGreen/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen CA & ACCA Career Suite</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Career Tools & <span className="text-brandGreen">AI Interview Studio</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Experience simulated Big 4 manager & partner interviews with real-time Gemini voice AI, firm recruitment directories, articleship CV makers, and 24/7 technical tutoring.
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
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'mock' || tab.id === 'cv' || tab.id === 'tutor') {
                    if (!requireAuth(`access ${tab.label}`)) return;
                  }
                  setActiveSubTab(tab.id);
                }}
                className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
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

        {/* ======================================================== */}
        {/* SUB-TAB 1: FIRM DIRECTORY & INTERVIEW INSIGHTS */}
        {/* ======================================================== */}
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
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brandGreen"
                >
                  <option value="All">All Cities (Pakistan)</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brandGreen"
                >
                  <option value="All">All Firm Categories</option>
                  <option value="Big 4">Big 4 Firms</option>
                  <option value="Category A">Category A SMPs</option>
                </select>
              </div>
            </div>

            {/* Firms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {firmsData
                .filter(
                  (f) =>
                    (selectedCity === 'All' || f.city.includes(selectedCity)) &&
                    (selectedCategory === 'All' || f.category === selectedCategory) &&
                    (directorySearch === '' ||
                      f.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
                      f.tags.some((t) => t.toLowerCase().includes(directorySearch.toLowerCase())))
                )
                .map((firm) => (
                  <div
                    key={firm.id}
                    className="bg-navy-dark border border-white/10 rounded-3xl p-6 hover:border-brandGreen/40 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-brandGreen/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-brandGreen/20">
                          {firm.category}
                        </span>
                        <span className="text-xs text-amber-400 font-bold">★ {firm.rating}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-white">{firm.name}</h3>
                      <p className="text-xs text-gray-400">📍 {firm.city}</p>

                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-1">
                        <span className="text-gray-400 block text-[11px]">Monthly Stipend (CAF/ACCA):</span>
                        <span className="text-emerald-400 font-bold text-sm">{firm.stipend}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-brandGreen/5 border border-brandGreen/15 text-xs text-gray-300 space-y-1">
                        <span className="font-semibold text-brandGreen block">Recent Interview Question:</span>
                        <p className="italic">"{firm.recentQuestion}"</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                      <span>{firm.feedbacksCount} verified reviews</span>
                      <button
                        onClick={() => {
                          setInterviewRole('Audit Trainee (Articleship)');
                          setInterviewStage('Manager Technical Round');
                          setActiveSubTab('mock');
                          setMockMode('studio');
                        }}
                        className="text-brandGreen hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Simulate Interview</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 2: PRODUCTION-GRADE AI MOCK INTERVIEW SUITE */}
        {/* ======================================================== */}
        {activeSubTab === 'mock' && (
          <div className="space-y-6 animate-fadeIn">

            {/* Mode Switcher Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-dark p-4 rounded-3xl border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brandGreen/15 border border-brandGreen/30 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">AI Real-Time Interview Studio</h3>
                  <p className="text-xs text-gray-400">Powered by Google Gemini — Adaptive CA & ACCA technical & behavioral simulation.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => {
                    if (!isStudioActive) setMockMode('studio');
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    mockMode === 'studio'
                      ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Real-Time Studio</span>
                </button>
                <button
                  onClick={() => {
                    if (!isStudioActive) setMockMode('voice_only');
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    mockMode === 'voice_only'
                      ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice Only</span>
                </button>
                <button
                  onClick={() => {
                    if (!isStudioActive) setMockMode('chat');
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    mockMode === 'chat'
                      ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Text Chat</span>
                </button>
                <button
                  onClick={() => {
                    if (interviewState === 'IDLE') {
                      setMockMode('history');
                      fetchHistory();
                    }
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    mockMode === 'history'
                      ? 'bg-brandGreen text-white shadow-md shadow-brandGreen/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History</span>
                </button>
              </div>
            </div>

            {/* VIEW 1: INTERVIEW SETUP & LAUNCH CARD */}
            {interviewState === 'IDLE' && mockMode !== 'history' && (
              <div className="bg-navy-dark p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-72 h-72 bg-brandGreen/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-3xl space-y-3 relative z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Physical Simulation • 324 CA Question Bank Grounded</span>
                    </span>
                    {panelMode && (
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>Two AI Panelists Active</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                    Simulate Your Professional CA / ACCA Interview
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    Experience a realistic face-to-face partner interview. The AI speaks its questions out loud, listens to your verbal responses in real-time, monitors engagement and composure through your camera locally, and scores you against verified CA firm criteria.
                  </p>
                </div>

                {/* Setup Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                  {/* Target Role */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300 flex items-center space-x-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-brandGreen" />
                      <span>Target Role</span>
                    </label>
                    <select
                      value={interviewRole}
                      onChange={(e) => setInterviewRole(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="Audit Trainee (Articleship)">Audit Trainee (Articleship)</option>
                      <option value="Audit Associate">Audit Associate</option>
                      <option value="Tax Trainee">Tax Trainee</option>
                      <option value="Tax Associate">Tax Associate</option>
                      <option value="CA Articleship">CA Articleship (General)</option>
                      <option value="ACCA Trainee">ACCA Trainee</option>
                      <option value="Financial Analyst">Financial Analyst</option>
                      <option value="Accounting Associate">Accounting Associate</option>
                      <option value="Internal Audit Trainee">Internal Audit Trainee</option>
                      <option value="Risk Advisory Trainee">Risk Advisory Trainee</option>
                      <option value="Custom Role">Custom Role...</option>
                    </select>

                    {interviewRole === 'Custom Role' && (
                      <input
                        type="text"
                        placeholder="Enter custom role title..."
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        className="w-full mt-2 px-3 py-2 bg-navy border border-brandGreen/40 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Interview Stage */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300 flex items-center space-x-1.5">
                      <Target className="w-3.5 h-3.5 text-blue-400" />
                      <span>Interview Stage</span>
                    </label>
                    <select
                      value={interviewStage}
                      onChange={(e) => setInterviewStage(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="HR Round">HR Round (Culture & Motivation)</option>
                      <option value="Screening Round">Screening Round (Fundamentals)</option>
                      <option value="Technical Round">Technical Round (Core Accounting & Tax)</option>
                      <option value="Manager Technical Round">Manager Technical Round (In-depth Standards)</option>
                      <option value="Behavioral Round">Behavioral Round (Ethics & STAR)</option>
                      <option value="Partner Round">Partner Round (High-level Judgment)</option>
                      <option value="Final Round">Final Induction Round</option>
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Difficulty Level</span>
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="Beginner">Beginner (Foundational definitions)</option>
                      <option value="Intermediate">Intermediate (Standard CAF/ACCA questions)</option>
                      <option value="Advanced">Advanced (Complex IFRS/ISA scenarios)</option>
                      <option value="Expert">Expert (Partner-level dilemma & ethics)</option>
                    </select>
                  </div>

                  {/* Interview Type */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Question Focus Area</label>
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="Technical">Technical (IFRS, ISA, Tax, Accounting)</option>
                      <option value="Behavioral">Behavioral (STAR method, teamwork, stress)</option>
                      <option value="HR">HR (Background, goals, motivation)</option>
                      <option value="Scenario Based">Scenario Based (Audit dilemmas, fraud, delays)</option>
                      <option value="Mixed">Mixed (Comprehensive multi-round)</option>
                    </select>
                  </div>

                  {/* Question Count */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Question Count</label>
                    <select
                      value={questionCountChoice}
                      onChange={(e) => setQuestionCountChoice(e.target.value)}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="3">3 Questions (Rapid warmup)</option>
                      <option value="5">5 Questions (Standard simulation)</option>
                      <option value="10">10 Questions (Comprehensive Big 4 panel)</option>
                      <option value="Custom">Custom count...</option>
                    </select>

                    {questionCountChoice === 'Custom' && (
                      <input
                        type="number"
                        min="2"
                        max="20"
                        value={customQuestionCount}
                        onChange={(e) => setCustomQuestionCount(Math.max(2, Math.min(20, Number(e.target.value))))}
                        className="w-full mt-2 px-3 py-2 bg-navy border border-brandGreen/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Duration */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-gray-300">Session Duration</label>
                    <select
                      value={interviewDurationMinutes}
                      onChange={(e) => setInterviewDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-navy border border-white/10 rounded-xl text-xs text-white focus:border-brandGreen focus:outline-none"
                    >
                      <option value="10">10 Minutes</option>
                      <option value="15">15 Minutes</option>
                      <option value="20">20 Minutes</option>
                      <option value="30">30 Minutes</option>
                    </select>
                  </div>
                </div>

                {/* Simulation Modifiers & Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 relative z-10">
                  {/* Two AI Agent Panel Mode */}
                  <div
                    onClick={() => setPanelMode(!panelMode)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      panelMode
                        ? 'bg-blue-500/10 border-blue-500/40 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${panelMode ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">Two-Agent Interview Panel</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${panelMode ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                          {panelMode ? 'ON' : 'OFF'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Senior Audit Manager (Technical) and HR Lead take turns asking questions naturally.
                      </p>
                    </div>
                  </div>

                  {/* Big 4 Simulation Challenge */}
                  <div
                    onClick={() => setIsBig4(!isBig4)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isBig4
                        ? 'bg-brandGreen/10 border-brandGreen/40 text-white shadow-lg shadow-brandGreen/10'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${isBig4 ? 'bg-brandGreen text-white' : 'bg-white/10 text-gray-400'}`}>
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">Big 4 Firm Challenge</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isBig4 ? 'bg-brandGreen text-white' : 'bg-white/10 text-gray-400'}`}>
                          {isBig4 ? 'ACTIVE' : 'OFF'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Evaluates responses strictly against EY, PwC, KPMG, Deloitte hiring benchmarks.
                      </p>
                    </div>
                  </div>

                  {/* Live Camera Non-Invasive Presence */}
                  <div
                    onClick={() => setEnableCamera(!enableCamera)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      enableCamera && mockMode === 'studio'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${enableCamera ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">Live Camera Presence</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${enableCamera ? 'bg-emerald-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                          {enableCamera ? 'CAMERA ON' : 'DISABLED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Analyzes eye contact and posture stability. 100% private & client-side only.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Launch Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 relative z-10">
                  <div className="flex items-center space-x-3">
                    <button
                      disabled={isStartingSession}
                      onClick={() => handleStartInterview()}
                      className="px-7 py-3.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-2xl font-extrabold text-xs sm:text-sm transition-all shadow-xl shadow-brandGreen/25 flex items-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {isStartingSession ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                      <span>
                        {isStartingSession
                          ? 'Setting up Virtual Boardroom...'
                          : mockMode === 'studio'
                          ? 'Start Physical Simulator (Voice + Video)'
                          : mockMode === 'voice_only'
                          ? 'Start Voice Only Simulator'
                          : 'Start Text Chat Simulation'}
                      </span>
                    </button>

                    {(mockMode === 'studio' || mockMode === 'voice_only') && (
                      <button
                        onClick={() => setAiAudioEnabled(!aiAudioEnabled)}
                        className="px-4 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-2xl font-semibold text-xs transition-all border border-white/10 flex items-center space-x-2 cursor-pointer"
                      >
                        {aiAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                        <span>AI Voice: {aiAudioEnabled ? 'Active' : 'Muted'}</span>
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-brandGreen" />
                    <span>Compliant with ICAP / ACCA ethics framework • No video saved</span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: ACTIVE REAL-TIME INTERVIEW STUDIO / SIMULATION ROOM */}
            {interviewState !== 'IDLE' && interviewState !== 'REPORT_READY' && interviewState !== 'GENERATING_REPORT' && mockMode !== 'history' && (
              <AIInterviewStudio
                interviewState={interviewState}
                targetRole={targetRoleResolved}
                interviewStage={interviewStage}
                difficulty={difficulty}
                interviewType={interviewType}
                totalQuestionsTarget={totalQuestionsTarget}
                currentQuestionIdx={currentQuestionIdx}
                currentQuestionText={currentQuestionText}
                currentSpeaker={currentSpeaker}
                panelMode={panelMode}
                isBig4={isBig4}
                transcript={transcript}
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
                isSubmittingAnswer={isSubmittingAnswer}
                isFinalizingSession={isFinalizingSession}
                timerRemaining={timerRemaining}
                turnSpeakingTime={voiceEngine.turnSpeakingTime}
                wpm={voiceEngine.wpm}
                fillerCount={voiceEngine.fillerCount}
                isMicListening={voiceEngine.isMicListening}
                isAiSpeaking={voiceEngine.isAiSpeaking}
                aiAudioEnabled={aiAudioEnabled}
                audioStream={deviceManager.stream}
                videoRef={deviceManager.videoRef}
                cameraStatus={deviceManager.cameraStatus}
                micStatus={deviceManager.micStatus}
                isCameraActive={deviceManager.isCameraActive}
                deviceError={deviceManager.deviceError}
                voiceStatusMessage={voiceEngine.statusMessage}
                silenceCountdown={voiceEngine.silenceCountdown}
                behavioralMetrics={videoAnalyzer.metrics}
                onConfirmReady={handleConfirmReady}
                onConfirmNotReady={handleConfirmNotReady}
                onToggleMic={handleToggleMic}
                onToggleCamera={handleToggleCamera}
                onToggleAiAudio={() => setAiAudioEnabled(!aiAudioEnabled)}
                onSubmitAnswer={handleSubmitAnswerTurn}
                onFinalizeInterview={handleFinalizeInterview}
                onExitStudio={handleExitStudio}
              />
            )}

            {/* VIEW 2.5: COMPILING REPORT SPINNER */}
            {interviewState === 'GENERATING_REPORT' && mockMode !== 'history' && (
              <div className="bg-[#021B3A] p-12 rounded-3xl border border-brandGreen/30 text-center space-y-4 shadow-2xl animate-pulse">
                <RefreshCw className="w-10 h-10 animate-spin text-brandGreen mx-auto" />
                <h3 className="text-lg font-black text-white">Compiling Big 4 Partner Scorecard...</h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                  Evaluating your technical accounting standard citations, communication structure, speaking pace, and interview composure.
                </p>
              </div>
            )}

            {/* VIEW 3: FINAL AI EVALUATION SCORECARD */}
            {interviewState === 'REPORT_READY' && mockMode !== 'history' && (
              <InterviewScorecardReport
                scorecard={finalScorecard}
                finalScorecard={finalScorecard}
                targetRole={targetRoleResolved}
                targetRoleResolved={targetRoleResolved}
                interviewStage={interviewStage}
                difficulty={difficulty}
                transcript={transcript}
                onPracticeWeakAreas={handlePracticeWeakAreas}
                onRetakeInterview={() => handleStartInterview()}
                onRetakeSession={() => handleStartInterview()}
                onReset={handleExitStudio}
                onExit={handleExitStudio}
              />
            )}

            {/* VIEW 4: INTERVIEW HISTORY LIST */}
            {mockMode === 'history' && (
              <div className="bg-navy-dark p-6 rounded-3xl border border-white/10 space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                      <History className="w-4 h-4 text-brandGreen" />
                      <span>Saved Interview Sessions</span>
                    </h3>
                    <p className="text-xs text-gray-400">Review your past scores, transcripts, and feedback history.</p>
                  </div>
                  <button
                    onClick={fetchHistory}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {historyLoading ? (
                  <div className="py-12 text-center text-xs text-gray-400 flex flex-col items-center space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-brandGreen" />
                    <span>Loading saved interviews...</span>
                  </div>
                ) : pastInterviews.length === 0 ? (
                  <div className="py-12 text-center text-xs text-gray-400 space-y-3">
                    <p>No completed interviews found yet.</p>
                    <button
                      onClick={() => setMockMode('studio')}
                      className="px-4 py-2 bg-brandGreen text-white rounded-xl font-bold cursor-pointer"
                    >
                      Start Your First Simulated Interview
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pastInterviews.map((item) => {
                      const scoreDisplay =
                        item.evaluation?.overallScore !== undefined
                          ? `${item.evaluation.overallScore}/100`
                          : item.overallScore || 'Completed';

                      return (
                        <div
                          key={item._id}
                          onClick={() => handleViewPastInterview(item._id)}
                          className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-brandGreen/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-extrabold text-white text-sm">
                                {item.targetRole || item.interviewRole || 'Audit Trainee'}
                              </h4>
                              <span className="px-2 py-0.5 rounded-md bg-brandGreen/20 text-emerald-400 font-bold text-[10px]">
                                {scoreDisplay}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">
                              {item.interviewStage || item.interviewRound || 'Technical Round'} •{' '}
                              {new Date(item.startedAt || item.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPastInterview(item._id);
                              }}
                              className="px-3 py-1.5 bg-brandGreen/20 hover:bg-brandGreen text-emerald-300 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Scorecard</span>
                            </button>
                            <button
                              onClick={(e) => handleDeleteHistory(item._id, e)}
                              className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PAST SCORECARD MODAL */}
            {historyModalOpen && selectedHistoryItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                <div className="bg-navy-dark border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-thin">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Interview Record & Scorecard</h3>
                      <p className="text-xs text-gray-400">
                        {selectedHistoryItem.targetRole || selectedHistoryItem.interviewRole} •{' '}
                        {selectedHistoryItem.interviewStage || selectedHistoryItem.interviewRound}
                      </p>
                    </div>
                    <button
                      onClick={() => setHistoryModalOpen(false)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {selectedHistoryItem.evaluation ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-brandGreen/15 border border-brandGreen/30 text-center space-y-1">
                        <span className="text-[11px] text-gray-300 uppercase font-bold">Overall Rating</span>
                        <div className="text-3xl font-black text-emerald-400">
                          {selectedHistoryItem.evaluation.overallScore} / 100
                        </div>
                        <span className="text-xs text-emerald-300 font-semibold">
                          {selectedHistoryItem.evaluation.hiringRecommendation}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
                        <strong className="text-white">Partner Assessment:</strong>
                        <p>{selectedHistoryItem.evaluation.finalAssessment}</p>
                      </div>

                      {/* Transcript */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-white uppercase">Interview Transcript:</h4>
                        <div className="max-h-60 overflow-y-auto space-y-2 p-3 bg-black/30 rounded-xl border border-white/5 text-xs">
                          {selectedHistoryItem.transcript?.map((m, idx) => (
                            <div key={idx} className="space-y-1">
                              <span className={`font-bold block ${m.speaker === 'ai' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                {m.speaker === 'ai' ? 'AI Interviewer:' : 'Candidate:'}
                              </span>
                              <p className="text-gray-300 whitespace-pre-line pl-2">{m.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No structured evaluation recorded for this session.</p>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setHistoryModalOpen(false)}
                      className="px-5 py-2.5 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 3: ARTICLESHIP CV BUILDER (HAFIZ NUMAN FORMAT) */}
        {/* ======================================================== */}
        {activeSubTab === 'cv' && (
          <div className="animate-fadeIn">
            <ArticleshipCVBuilder />
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 4: 24/7 AI STUDY TUTOR */}
        {/* ======================================================== */}
        {activeSubTab === 'tutor' && (
          <div className="animate-fadeIn">
            <StudyTutorChat />
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 5: DAILY QURANIC GUIDANCE */}
        {/* ======================================================== */}
        {activeSubTab === 'quran' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quranLessons.map((lesson) => (
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
