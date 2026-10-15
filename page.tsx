 "use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Bookmark, CalendarDays, Check, ChevronRight, CircleHelp, Flower2, Heart, Languages, Menu, MessageCircle, Send, Sparkles, Sun, Volume2, X } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };

const verses = [
  {
    chapter: "Chapter 2 · Verse 47",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    transliteration: "Karmanye vadhikaraste ma phaleshu kadachana",
    meaning: "You have a right to action, but not to the fruits of action.",
    lesson: "Give your best attention to the work in front of you. You cannot control every outcome, but you can choose your effort, preparation and attitude.",
    practice: "Choose one important task today. Work on it for 20 focused minutes without checking for results."
  },
  {
    chapter: "Chapter 6 · Verse 5",
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।",
    transliteration: "Uddhared atmanatmanam natmanam avasadayet",
    meaning: "Lift yourself through your own effort; do not let yourself fall.",
    lesson: "Small, steady choices can help you move forward. Treat yourself with patience while taking responsibility for your next step.",
    practice: "Do one small thing that supports your wellbeing or progress, even if you do not feel fully ready."
  },
  {
    chapter: "Chapter 2 · Verse 14",
    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।",
    transliteration: "Matra-sparshas tu kaunteya shitoshna-sukha-duhkha-dah",
    meaning: "Experiences of comfort and discomfort come and go.",
    lesson: "A difficult moment does not have to define your whole day. Pause, notice what you are feeling, and respond thoughtfully rather than immediately.",
    practice: "When a strong emotion appears, take three slow breaths before choosing what to do next."
  }
];

const suggestions = [
  "How can I control anger?",
  "I am worried about my future",
  "How do I stay disciplined?",
  "How can I handle failure?"
];

function getDemoAnswer(question: string) {
  const q = question.toLowerCase();
  if (q.includes("anger") || q.includes("angry")) {
    return "The Gita encourages steadiness of mind and thoughtful action. Try pausing before you respond: take three slow breaths, name what you are feeling, and decide what response matches your values. In Bhagavad Gita 2.62–2.63, Krishna describes how unchecked attachment and desire can lead to anger. This is a starting point for reflection, not a substitute for professional help when anger feels unmanageable.";
  }
  if (q.includes("future") || q.includes("worried") || q.includes("anxious")) {
    return "A useful Gita-inspired practice is to separate what you can influence from what you cannot control. Bhagavad Gita 2.47 is commonly understood as an invitation to focus on sincere action rather than becoming consumed by results. Write down one step you can take today, make it small, and give it your attention. The future is uncertain, but your next action can be clear.";
  }
  if (q.includes("discipline") || q.includes("focus") || q.includes("habit")) {
    return "The Gita presents practice and steadiness as important parts of training the mind. In Bhagavad Gita 6.26, the mind is gently brought back whenever it wanders. Choose one small habit, set a realistic time, and return to it without judging yourself when you get distracted. Consistency grows through repeated returns, not perfection.";
  }
  if (q.includes("failure") || q.includes("fail") || q.includes("mistake")) {
    return "Try viewing a setback as information rather than as your identity. Bhagavad Gita 2.47 reminds readers to focus on action, while outcomes may not be fully in our control. Ask: What was in my control? What can I learn? What is the next useful step? Let the lesson guide your next attempt.";
  }
  return "A Gita-inspired way to explore this is to pause, identify what is within your control, and choose one thoughtful action. Bhagavad Gita 2.47 is often discussed in relation to acting sincerely without becoming attached to outcomes. Reflect on your values, consider the likely effects of your choices, and take one manageable next step. This demo answer is general guidance, so please check the relevant verse and a trusted translation for deeper study.";
}

export default function Home() {
  const [language, setLanguage] = useState<"English" | "हिन्दी">("English");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [journal, setJournal] = useState("");
  const [savedJournal, setSavedJournal] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [verseIndex, setVerseIndex] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  const verse = verses[verseIndex];
  const greeting = language === "English" ? "Find clarity in the Gita." : "गीता में पाएं जीवन की स्पष्टता।";

  useEffect(() => {
    try {
      const oldSaved = localStorage.getItem("gita-saved-verse");
      const oldJournal = localStorage.getItem("gita-journal");
      if (oldSaved === "true") setSaved(true);
      if (oldJournal) { setSavedJournal(oldJournal); setJournal(oldJournal); }
    } catch {}
  }, []);

  const navItems = useMemo(() => [
    { name: "Home", icon: Sun },
    { name: "Ask Gita AI", icon: MessageCircle },
    { name: "Daily Wisdom", icon: BookOpen },
    { name: "Journal", icon: Heart },
  ], []);

  function sendQuestion(text = question) {
    const clean = text.trim();
    if (!clean) return;
    setMessages((prev) => [...prev, { role: "user", text: clean }, { role: "assistant", text: getDemoAnswer(clean) }]);
    setQuestion("");
    setActiveTab("Ask Gita AI");
    setTimeout(() => document.getElementById("chat-response")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  }

  function saveVerse() {
    const next = !saved;
    setSaved(next);
    try { localStorage.setItem("gita-saved-verse", String(next)); } catch {}
  }

  function saveJournal() {
    setSavedJournal(journal);
    try { localStorage.setItem("gita-journal", journal); } catch {}
  }

  function navigate(name: string) {
    setActiveTab(name);
    setShowMenu(false);
    const id = name === "Home" ? "home" : name === "Ask Gita AI" ? "ask" : name === "Daily Wisdom" ? "wisdom" : "journal";
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setActiveTab("Home")}>
          <span className="brand-mark"><Flower2 size={23} /></span>
          <span><strong>Gita Life Coach AI</strong><small>WISDOM FOR EVERYDAY LIFE</small></span>
        </a>
        <nav className="desktop-nav">
          {navItems.map(({ name }) => <button key={name} className={activeTab === name ? "nav-link active" : "nav-link"} onClick={() => navigate(name)}>{name}</button>)}
        </nav>
        <div className="top-actions">
          <button className="language-button" onClick={() => setLanguage(language === "English" ? "हिन्दी" : "English")} aria-label="Change language"><Languages size={17} /><span>{language}</span></button>
          <button className="menu-button" onClick={() => setShowMenu(!showMenu)} aria-label="Open menu">{showMenu ? <X /> : <Menu />}</button>
        </div>
        {showMenu && <div className="mobile-menu">{navItems.map(({ name, icon: Icon }) => <button key={name} onClick={() => navigate(name)}><Icon size={17}/>{name}</button>)}</div>}
      </header>

      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> ANCIENT WISDOM · MODERN LIFE</div>
          <h1>{greeting.split("Gita")[0]}<em>{language === "English" ? "Gita." : ""}</em></h1>
          <p className="hero-subtitle">{language === "English" ? "Ask life's big questions. Explore timeless teachings. Take one meaningful step today." : "जीवन के सवाल पूछें। शाश्वत शिक्षाओं को समझें और आज एक सार्थक कदम उठाएं।"}</p>
          <div className="hero-buttons">
            <button className="button-primary" onClick={() => navigate("Ask Gita AI")}>Ask Gita AI <ChevronRight size={17}/></button>
            <button className="button-quiet" onClick={() => navigate("Daily Wisdom")}>Explore daily wisdom</button>
          </div>
          <div className="hero-note"><span className="online-dot"/> A calm space to reflect, learn and grow</div>
        </div>
        <div className="hero-art">
          <div className="art-glow"/>
          <img src="https://images.unsplash.com/photo-1604608672516-8d9f4f5c1f4f?auto=format&fit=crop&w=1000&q=85" alt="Peaceful golden light and devotional atmosphere" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div className="art-overlay"><span className="om-symbol">ॐ</span><span>श्रीमद्भगवद्गीता</span><small>Wisdom for the journey within</small></div>
          <div className="floating-quote"><span>“</span><p>Let your actions be sincere, and your mind steady.</p><small>REFLECT · ACT · GROW</small></div>
        </div>
      </section>

      <section className="verse-section section-wrap" id="wisdom">
        <div className="section-heading">
          <div><div className="eyebrow">YOUR DAILY PAUSE</div><h2>Today's Gita wisdom</h2></div>
          <button className="text-link" onClick={() => setVerseIndex((verseIndex + 1) % verses.length)}>Explore another verse <ChevronRight size={16}/></button>
        </div>
        <div className="verse-card">
          <div className="verse-art"><div className="mandala">✺</div><span className="verse-tag">VERSE OF THE DAY</span><div className="verse-ornament">॥ ॐ ॥</div><p>Wisdom begins<br/>with a pause.</p></div>
          <div className="verse-content">
            <div className="verse-meta"><span>{verse.chapter}</span><button className={saved ? "save-button saved" : "save-button"} onClick={saveVerse}><Bookmark size={16} fill={saved ? "currentColor" : "none"}/>{saved ? "Saved" : "Save verse"}</button></div>
            <h3 className="sanskrit">{verse.sanskrit}</h3>
            <p className="transliteration">{verse.transliteration}</p>
            <blockquote>{verse.meaning}</blockquote>
            <div className="meaning-block"><strong>In everyday life</strong><p>{verse.lesson}</p></div>
            <div className="practice-block"><span className="practice-icon"><Sun size={17}/></span><div><strong>Try this today</strong><p>{verse.practice}</p></div></div>
          </div>
        </div>
      </section>

      <section className="chat-section section-wrap" id="ask">
        <div className="chat-intro">
          <div className="eyebrow"><Sparkles size={14}/> REFLECT WITH GITA WISDOM</div>
          <h2>A question on your mind?</h2>
          <p>Explore everyday challenges through the lens of the Bhagavad Gita. Ask openly, reflect gently.</p>
          <div className="chat-points"><span><Check size={15}/> Thoughtful reflections</span><span><Check size={15}/> Verse references to explore</span><span><Check size={15}/> Hindi or English</span></div>
        </div>
        <div className="chat-box">
          <div className="chat-header"><div className="ai-avatar"><Flower2 size={19}/></div><div><strong>Your Gita guide</strong><small><span className="online-dot"/> Demo mode · no account needed</small></div><span className="demo-pill">DEMO</span></div>
          <div className="chat-body" id="chat-response">
            {messages.length === 0 ? <div className="chat-welcome"><div className="welcome-icon"><MessageCircle size={22}/></div><h3>What would you like guidance on?</h3><p>Choose a question or write your own below.</p><div className="suggestion-list">{suggestions.map((s) => <button key={s} onClick={() => sendQuestion(s)}>{s}<ChevronRight size={15}/></button>)}</div></div> : <div className="message-list">{messages.map((m, i) => <div key={i} className={m.role === "user" ? "message user-message" : "message ai-message"}><span className="message-label">{m.role === "user" ? "YOU" : "GITA GUIDE · DEMO"}</span><p>{m.text}</p></div>)}</div>}
          </div>
          <form className="chat-input" onSubmit={(e) => { e.preventDefault(); sendQuestion(); }}>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about focus, fear, relationships..." aria-label="Your question"/>
            <button type="submit" disabled={!question.trim()} aria-label="Send question"><Send size={18}/></button>
          </form>
          <p className="chat-disclaimer">Demo responses only. This version does not connect to a live AI service.</p>
        </div>
      </section>

      <section className="practice-section section-wrap">
        <div className="section-heading"><div><div className="eyebrow">SMALL STEPS, STEADY GROWTH</div><h2>Bring wisdom into your day</h2></div></div>
        <div className="practice-grid">
          <article className="practice-card"><div className="card-icon peach"><CalendarDays size={21}/></div><span className="card-kicker">2 MINUTES</span><h3>Pause & reflect</h3><p>Take a quiet moment to notice what matters most to you today.</p><button onClick={() => navigate("Journal")}>Start reflecting <ChevronRight size={15}/></button></article>
          <article className="practice-card"><div className="card-icon sage"><BookOpen size={21}/></div><span className="card-kicker">LEARN</span><h3>Explore a teaching</h3><p>Read a verse, understand its context, and connect it to real life.</p><button onClick={() => navigate("Daily Wisdom")}>Read today's verse <ChevronRight size={15}/></button></article>
          <article className="practice-card"><div className="card-icon lavender"><Heart size={21}/></div><span className="card-kicker">YOUR JOURNEY</span><h3>Keep a journal</h3><p>Write down a thought, a lesson or one thing you are grateful for.</p><button onClick={() => navigate("Journal")}>Open journal <ChevronRight size={15}/></button></article>
        </div>
      </section>

      <section className="journal-section section-wrap" id="journal">
        <div className="journal-card">
          <div className="journal-copy"><div className="eyebrow">A SPACE FOR YOU</div><h2>Your reflection journal</h2><p>What is one thing you want to approach with more patience or clarity today?</p><div className="journal-prompt"><Sparkles size={16}/><span>There is no perfect answer. Just begin honestly.</span></div></div>
          <div className="journal-editor"><label htmlFor="journal-entry">TODAY'S REFLECTION</label><textarea id="journal-entry" value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="Today, I want to remember..." rows={5}/><div className="journal-footer"><span>{journal.length} characters · saved on this device only</span><button className="button-primary" onClick={saveJournal}><Check size={16}/>{savedJournal === journal && journal ? "Saved" : "Save reflection"}</button></div></div>
        </div>
      </section>

      <section className="closing section-wrap">
        <span className="closing-om">ॐ</span><h2>One mindful step is a beginning.</h2><p>Return to the wisdom. Return to yourself.</p><button className="button-primary" onClick={() => { setVerseIndex((verseIndex + 1) % verses.length); navigate("Daily Wisdom"); }}>Explore another teaching <ChevronRight size={17}/></button>
      </section>

      <footer className="footer">
        <div className="footer-brand"><span className="brand-mark"><Flower2 size={20}/></span><div><strong>Gita Life Coach AI</strong><small>Wisdom for everyday life</small></div></div>
        <div className="footer-links"><button onClick={() => setShowAbout(!showAbout)}><CircleHelp size={15}/> About this demo</button><span>Made for reflection, learning and growth</span></div>
        {showAbout && <div className="about-note">This is a frontend-only prototype. Chat answers are prewritten demo responses, and journal/bookmark data stays in your browser. It is not a source of religious authority, mental-health care or professional advice.</div>}
        <div className="footer-bottom">© {new Date().getFullYear()} Gita Life Coach AI · A learning prototype</div>
      </footer>
    </main>
  );
}
