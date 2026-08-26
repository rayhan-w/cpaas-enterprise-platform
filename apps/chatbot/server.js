const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load BAUST knowledge base & entities
let kbData = { university: {}, modules: [], categories: [] };
let entities = [];

try {
  const kbFilePath = path.join(__dirname, 'data', 'baust_knowledge.json');
  if (fs.existsSync(kbFilePath)) {
    kbData = JSON.parse(fs.readFileSync(kbFilePath, 'utf-8'));
    console.log(`[KB] Loaded ${kbData.modules.length} modules and ${kbData.categories.length} categories.`);
  }

  const entitiesFilePath = path.join(__dirname, 'data', 'baust_entities.json');
  if (fs.existsSync(entitiesFilePath)) {
    entities = JSON.parse(fs.readFileSync(entitiesFilePath, 'utf-8'));
    console.log(`[ENTITIES] Loaded ${entities.length} verified faculty and leadership entities.`);
  }
} catch (err) {
  console.error('[KB] Error loading data:', err.message);
}

// ----------------------------------------------------
// 🧠 SMART LANGUAGE DETECTOR
// ----------------------------------------------------

function detectLanguage(query) {
  // 1. If contains Bengali Unicode characters -> Bangla
  if (/[\u0980-\u09FF]/.test(query)) {
    return 'bn';
  }

  // 2. Banglish word indicators -> User asked in Banglish, reply in Bangla
  const banglishMarkers = /\b(ke|koto|ki|kivabe|kemne|kemon|ase|naki|hobe|jabo|ache|dibe|deya|korbo|koro|korle|vorti|borti|taka|khoroch|khoroc|koroc|shob|sob|kon|kono|thaka|gari|bas|shikkhok|bhai|vai|bolte|parba|parben|bolen|janan|dorkar|lagbe|kothay|thikana|jogajog|hastel|skolarsip|bivagio|prodhan|alom|nki|bortir|vortir|joggota|koyta|kobe|amar|amr|amake|amk|konta|bhalo|valoo|valo|bhalo|pabo|chance|session|jam|porashona|pora|porbo|suggest|recommend|nibo|nebo|uchit|ke ke|kew|kar|kara)\b/i;

  if (banglishMarkers.test(query)) {
    return 'banglish'; // Target response language: Bangla
  }

  // 3. English grammar / question keywords
  const englishMarkers = /\b(what|who|where|when|why|how|which|tell|show|explain|is|are|the|fee|fees|cost|tuition|admission|requirement|requirements|eligibility|hostel|transport|scholarship|waiver|faculty|teacher|teachers|department|contact|details|about|hello|hi|hey|good|should|better|compare|difference|advice|suggest|recommend|chance|qualify|eligible|members|list)\b/i;

  if (englishMarkers.test(query)) {
    return 'en';
  }

  return 'en';
}

// ----------------------------------------------------
// 🧠 FUZZY MATCHING & PHONETIC NORMALIZER ENGINE
// ----------------------------------------------------

function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function stringSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1;
  const dist = levenshteinDistance(s1, s2);
  return 1 - dist / maxLen;
}

function normalizePhonetics(str) {
  if (!str) return '';
  let s = str.toLowerCase().trim();

  return s.replace(/ph/g, 'f')
          .replace(/kh/g, 'k')
          .replace(/gh/g, 'g')
          .replace(/th/g, 't')
          .replace(/dh/g, 'd')
          .replace(/bh/g, 'b')
          .replace(/sh|ss/g, 's')
          .replace(/ch/g, 'c')
          .replace(/ee|ea|y/g, 'i')
          .replace(/oo/g, 'u')
          .replace(/w/g, 'v')
          .replace(/z/g, 'j')
          .replace(/o(?=[a-z])/g, 'a')
          .replace(/(\w)\1+/g, '$1');
}

// Unicode-Safe Intent Dictionaries
const INTENT_KEYWORDS = {
  fees: ['fee', 'fees', 'tuition', 'tution', 'tusion', 'cost', 'costing', 'payment', 'taka', 'tk', 'khoroch', 'khoroc', 'koroc', 'টাকা', 'ফি', 'খরচ', 'টিউশন', 'সেমিস্টার ফি', 'সেমিস্টার'],
  admission: ['admission', 'admisn', 'admision', 'apply', 'applied', 'requirement', 'requirements', 'requirment', 'eligibility', 'eligiblity', 'joggota', 'gpa', 'ssc', 'hsc', 'diploma', 'vorti', 'vortir', 'borti', 'borty', 'vorty', 'form', 'circular', 'ভর্তি', 'যোগ্যতা', 'আবেদন', 'ভর্তির'],
  cse: ['cse', 'computer', 'software', 'programming', 'সিএসই', 'কম্পিউটার'],
  eee: ['eee', 'electrical', 'electronic', 'ইইই', 'ইলেকট্রিক্যাল'],
  me: ['me', 'mech', 'mechanical', 'মেকানিক্যাল', 'যন্ত্রকৌশল'],
  ipe: ['ipe', 'industrial', 'production', 'আইপিই'],
  civil: ['ce', 'civil', 'পুরকৌশল', 'সিভিল'],
  bba: ['bba', 'mba', 'dba', 'ais', 'business', 'ব্যবসা', 'বিবিএ', 'এমবিএ'],
  english: ['english', 'eng', 'ইংরেজি', 'ইংলিশ'],
  math: ['math', 'mathematics', 'গণিত', 'maths'],
  physics: ['physics', 'পদার্থবিজ্ঞান', 'পদার্থ'],
  chemistry: ['chemistry', 'রসায়ন', 'রসায়ন'],
  science: ['arts and sciences', 'arts and science', 'a&s', 'কলা ও বিজ্ঞান'],
  hostel: ['hostel', 'hastel', 'hall', 'residential', 'dormitory', 'dorm', 'room', 'seat', 'thaka', 'dining', 'হস্টেল', 'হল', 'আবাসন', 'আবাসিক', 'মেস', 'থাকা'],
  transport: ['transport', 'bus', 'buss', 'bas', 'route', 'travel', 'gari', 'gadi', 'যাতায়াত', 'বাস', 'পরিবহন', 'গাড়ি'],
  waiver: ['waiver', 'waver', 'scholarship', 'skolarsip', 'discount', 'aid', 'army quota', 'quota', 'freedom fighter', 'mukti joddha', 'ওয়েভার', 'স্কলারশিপ', 'বৃত্তি', 'ছাড়', 'মুক্তিযোদ্ধা', 'কোটা'],
  contact: ['contact', 'kontact', 'phone', 'phn', 'number', 'mobile', 'hotline', 'email', 'address', 'location', 'kothay', 'jogajog', 'thikana', 'যোগাযোগ', 'ফোন', 'ঠিকানা', 'কোথায়'],
  faculty: ['faculty', 'teacher', 'teachers', 'shikkhok', 'dean', 'head', 'professor', 'lecturer', 'বিভাগীয় প্রধান', 'শিক্ষক', 'হেড'],
  notice: ['notice', 'notis', 'circular', 'tender', 'routine', 'meeting', 'নোটিশ', 'সার্কুলার'],
  about: ['about', 'history', 'ugc', 'government', 'ieb', 'accreditation', 'saidpur', 'kemon', 'সম্পর্কে', 'ইতিহাস']
};

function detectIntents(rawQuery) {
  const queryLower = rawQuery.toLowerCase();
  const queryNorm = normalizePhonetics(rawQuery);
  const matched = new Set();

  for (const [intent, words] of Object.entries(INTENT_KEYWORDS)) {
    for (const w of words) {
      const wLower = w.toLowerCase();
      const wNorm = normalizePhonetics(wLower);

      if (queryLower.includes(wLower) || queryNorm.includes(wNorm)) {
        matched.add(intent);
        break;
      }

      const tokens = queryNorm.split(/\s+/);
      for (const t of tokens) {
        if (t.length >= 3 && stringSimilarity(t, wNorm) >= 0.80) {
          matched.add(intent);
          break;
        }
      }
    }
  }

  return Array.from(matched);
}

function fuzzyMatchEntity(rawQuery, detectedIntents) {
  const query = rawQuery.toLowerCase().trim();
  const queryNorm = normalizePhonetics(query);
  const queryNormWords = queryNorm.split(/[^a-zA-Z0-9\u0980-\u09FF]+/).filter(w => w.length >= 2);

  // If asking for a list of teachers (e.g. "ke ke ase", "who are the teachers", "faculty list"), suppress single person match
  if (/ke ke|who are|faculty list|teachers list|শিক্ষক কারা|কে কে আছেন|কে কে আছে/i.test(query)) {
    return null;
  }

  const isPersonQuery = /\b(ke|who|kar|name|nam|sir|teacher|head|vc|vici|dean|proctor|registrar|prof|dr|ড\.|কে)\b/i.test(query);

  let bestMatch = null;
  let highestScore = 0;

  for (const entity of entities) {
    let score = 0;

    for (const alias of entity.aliases || []) {
      const aLower = alias.toLowerCase().trim();
      const aNorm = normalizePhonetics(aLower);
      const aliasWords = aNorm.split(/\s+/).filter(w => w.length >= 2);

      const regexAlias = new RegExp(`(^|[^a-z0-9\u0980-\u09FF])${aLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9\u0980-\u09FF])`, 'i');
      if (regexAlias.test(query) || regexAlias.test(rawQuery) || queryNorm === aNorm) {
        score += (aliasWords.length >= 2 ? 400 : 220);
        break;
      }

      if (aliasWords.length >= 2) {
        let matchedCount = 0;
        for (const aWord of aliasWords) {
          for (const qWord of queryNormWords) {
            const sim = stringSimilarity(qWord, aWord);
            if (sim >= 0.75) {
              matchedCount++;
              break;
            }
          }
        }
        if (matchedCount === aliasWords.length) {
          score += 350;
          break;
        } else if (matchedCount > 0) {
          score += (matchedCount * 30);
        }
      } else if (aliasWords.length === 1) {
        const singleAlias = aliasWords[0];
        if (['cse', 'eee', 'me', 'ipe', 'ce', 'bba', 'math', 'maths'].includes(singleAlias)) continue;
        for (const qWord of queryNormWords) {
          const sim = stringSimilarity(qWord, singleAlias);
          if (sim >= 0.80) {
            score += Math.round(sim * 70);
            break;
          }
        }
      }
    }

    if (isPersonQuery && score > 0) {
      score += 40;
    }

    if (score > highestScore && score >= 80) {
      highestScore = score;
      bestMatch = entity;
    }
  }

  // Topic vs person check
  if (detectedIntents.some(i => ['fees', 'admission', 'hostel', 'transport', 'waiver'].includes(i))) {
    if (!isPersonQuery && highestScore < 300) {
      return null;
    }
  }

  return bestMatch;
}

// ----------------------------------------------------
// 🧠 CONVERSATIONAL REASONING & DECISION-MAKING ENGINE
// ----------------------------------------------------

function handleConversationalDecisions(userMsg, targetLang, history = []) {
  const isEnglish = (targetLang === 'en');
  const q = userMsg.toLowerCase();

  // 1. Departmental Faculty Directory Query (e.g. "math dept a ke ke ase", "cse teachers list", "who are in math department?")
  if (/ke ke ase|faculty|teachers|shikkhok|teacher list|faculties|who are in|members|শিক্ষক কারা|শিক্ষকবৃন্দ|কে কে আছেন|কে কে আছে|teachers in/i.test(q) || (/math|cse|eee|me|ipe|civil|bba|english|physics|chemistry/i.test(q) && /ke ke|shikkhok|teacher|faculty|কারা|members/i.test(q))) {
    let deptKey = null;
    let deptName = '';
    let portalUrl = 'https://www.baust.edu.bd/';

    if (/math|mathematics|গণিত/i.test(q)) { deptKey = 'math'; deptName = 'Mathematics (গণিত / কলা ও বিজ্ঞান)'; portalUrl = 'https://www.baust.edu.bd/as'; }
    else if (/cse|computer|সিএসই/i.test(q)) { deptKey = 'cse'; deptName = 'Computer Science & Engineering (CSE)'; portalUrl = 'https://www.baust.edu.bd/cse'; }
    else if (/eee|electrical|ইইই/i.test(q)) { deptKey = 'eee'; deptName = 'Electrical & Electronic Engineering (EEE)'; portalUrl = 'https://www.baust.edu.bd/eee'; }
    else if (/me|mechanical|মেকানিক্যাল/i.test(q)) { deptKey = 'me'; deptName = 'Mechanical Engineering (ME)'; portalUrl = 'https://www.baust.edu.bd/me'; }
    else if (/ipe|industrial|আইপিই/i.test(q)) { deptKey = 'ipe'; deptName = 'Industrial & Production Engineering (IPE)'; portalUrl = 'https://www.baust.edu.bd/ipe'; }
    else if (/civil|পুরকৌশল|সিভিল/i.test(q)) { deptKey = 'civil'; deptName = 'Civil Engineering (CE)'; portalUrl = 'https://www.baust.edu.bd/department-of-civil-engineering'; }
    else if (/bba|business|ব্যবসা/i.test(q)) { deptKey = 'bba'; deptName = 'Business Administration (DBA / BBA)'; portalUrl = 'https://www.baust.edu.bd/dba'; }
    else if (/english|ইংরেজি/i.test(q)) { deptKey = 'english'; deptName = 'English (ইংরেজি)'; portalUrl = 'https://www.baust.edu.bd/department-of-english'; }
    else if (/physics|পদার্থ/i.test(q)) { deptKey = 'physics'; deptName = 'Physics (পদার্থবিজ্ঞান)'; portalUrl = 'https://www.baust.edu.bd/as'; }
    else if (/chemistry|রসায়ন|রসায়ন/i.test(q)) { deptKey = 'chemistry'; deptName = 'Chemistry (রসায়ন)'; portalUrl = 'https://www.baust.edu.bd/as'; }
    else if (/arts|science|কলা/i.test(q)) { deptKey = 'as'; deptName = 'Arts & Sciences (কলা ও বিজ্ঞান)'; portalUrl = 'https://www.baust.edu.bd/as'; }

    if (deptKey) {
      const matchedTeachers = entities.filter(e => {
        const dep = (e.department || '').toLowerCase();
        if (deptKey === 'math' && (dep.includes('math') || dep.includes('arts and science'))) return true;
        if (deptKey === 'as' && dep.includes('arts and science')) return true;
        return dep.includes(deptKey);
      });

      if (matchedTeachers.length > 0) {
        if (isEnglish) {
          const rows = matchedTeachers.map(t => `| **${t.name}** | ${t.designation || 'Faculty Member'} | ${t.degrees || 'Faculty Member at BAUST'} |`).join('\n');
          return `### 👨‍🏫 Faculty Members of ${deptName}

Here is the verified list of faculty members in this department at BAUST:

| Faculty Name | Designation | Degrees & Academic Background |
| :--- | :--- | :--- |
${rows}

---
🔗 **Official Portal:** [BAUST Department Link](${portalUrl})`;
        } else {
          const rows = matchedTeachers.map(t => `| **${t.name}** (${t.name_bn || t.name}) | ${t.designation_bn || t.designation || 'শিক্ষক'} | ${t.degrees || 'বিএইউএসটি ফ্যাকাল্টি'} |`).join('\n');
          return `### 👨‍🏫 ${deptName} বিভাগের সম্মানিত শিক্ষকবৃন্দ

BAUST-এর সংশ্লিষ্ট বিভাগে পাঠদানকারী বর্তমান সম্মানিত ফ্যাকাল্টি মেম্বারগণের তালিকা:

| শিক্ষকের নাম (Faculty Name) | পদবী (Designation) | শিক্ষাগত যোগ্যতা ও ডিগ্রি |
| :--- | :--- | :--- |
${rows}

---
🔗 **অফিশিয়াল সোর্স:** [BAUST Department Link](${portalUrl})`;
        }
      }
    }
  }

  // 2. GPA Eligibility Calculator & Decision Maker
  const gpas = (userMsg.match(/\b[3-5](?:\.\d{1,2})?\b/g) || []).map(Number);
  const hasGpaQuery = gpas.length > 0 || /gpa|ssc|hsc|diploma|পলিটেকনিক|ডিপ্লোমা|chance|vorti|যোগ্য|chance pabo/i.test(q);

  if (hasGpaQuery && (gpas.length >= 1 || /ssc|hsc|diploma/i.test(q)) && /hote parbo|pabo|chance|apply|ভর্তি হতে পারব|চান্স পাব|যোগ্য|admission/i.test(q)) {
    let ssc = null, hsc = null, totalGpa = 0;
    const isDiploma = /diploma|পলিটেকনিক|ডিপ্লোমা/i.test(q);

    const sscMatch = q.match(/ssc[^\d]{0,5}([3-5](?:\.\d{1,2})?)/i);
    const hscMatch = q.match(/hsc[^\d]{0,5}([3-5](?:\.\d{1,2})?)/i);

    if (sscMatch) ssc = parseFloat(sscMatch[1]);
    if (hscMatch) hsc = parseFloat(hscMatch[1]);

    if (!ssc && !hsc && gpas.length >= 2) {
      ssc = gpas[0];
      hsc = gpas[1];
      totalGpa = ssc + hsc;
    } else if (ssc && hsc) {
      totalGpa = ssc + hsc;
    } else if (gpas.length === 1) {
      totalGpa = gpas[0];
    }

    if (isDiploma) {
      if (isEnglish) {
        return `### 🎓 Decision & Eligibility Assessment (Diploma Background)

* **Diploma Qualification:** Valid for Engineering Programs (CSE, EEE, ME, IPE, Civil).
* **Requirement:** Minimum CGPA 3.00+ in Diploma in Engineering.

#### 💡 Recommendation & Next Steps:
1. **Eligibility:** You are eligible to apply for undergraduate engineering programs.
2. **Admission Test:** You will sit for the admission test covering Departmental Fundamentals, Basic Math, and English.
3. **Application:** Online application at [BAUST Admission Portal](https://www.baust.edu.bd/).`;
      } else {
        return `### 🎓 ফলাফল ও ভর্তি সংক্রান্ত পরামর্শ (ডিপ্লোমা ব্যাকগ্রাউন্ড)

* **ডিপ্লোমা যোগ্যতা:** পলিটেকনিক থেকে ডিপ্লোমা ইন ইঞ্জিনিয়ারিং সম্পন্নকারীদের জন্য BAUST-এ সকল ইঞ্জিনিয়ারিং বিভাগে (CSE, EEE, ME, IPE, Civil) আবেদনের পূর্ণ সুযোগ রয়েছে।
* **ন্যূনতম রিকোয়ারমেন্ট:** ডিপ্লোমায় ন্যূনতম **CGPA ৩.০০** থাকতে হবে।

#### 💡 আপনার জন্য চূড়ান্ত সিদ্ধান্ত ও করণীয়:
1. **ভর্তির সম্ভাবনা:** আপনার ফলাফল অনুযায়ী আপনি ইঞ্জিনিয়ারিং প্রোগ্রামে সরাসরি আবেদন করতে পারবেন।
2. **ভর্তি পরীক্ষা:** বেসিক ডিপার্টমেন্টাল বিষয়, গণিত ও ইংরেজির ওপর ভর্তি পরীক্ষায় অংশ নিতে হবে।
3. **আবেদন লিংক:** অনলাইনে [BAUST Admission Portal](https://www.baust.edu.bd/)-এ গিয়ে আবেদন ফর্ম পূরণ করুন।`;
      }
    }

    if (totalGpa > 0) {
      const isEligibleEngineering = totalGpa >= 7.50 && (!ssc || ssc >= 3.0) && (!hsc || hsc >= 3.0);
      const isEligibleBBA = totalGpa >= 6.00;

      if (isEligibleEngineering) {
        let waiverChance = '';
        if (totalGpa >= 9.50) {
          waiverChance = isEnglish
            ? '🏆 **Scholarship Chance:** With GPA ' + totalGpa.toFixed(2) + ', you have a strong chance for Semester Merit Waiver (up to 50% - 100%)!'
            : '🏆 **স্কলারশিপের সম্ভাবনা:** আপনার সম্মিলিত জিপিএ ' + totalGpa.toFixed(2) + ' থাকায় আপনি সেমিস্টার ফাইনালের ফলাফলের ভিত্তিতে ২৫% থেকে ১০০% পর্যন্ত মেরিট ওয়েভার পেতে পারেন!';
        }

        if (isEnglish) {
          return `### 🎯 Admission Decision: YES, You are Eligible! ✅

* **Your GPA Summary:** ${ssc ? `SSC: ${ssc.toFixed(2)}, ` : ''}${hsc ? `HSC: ${hsc.toFixed(2)}, ` : ''}**Total GPA: ${totalGpa.toFixed(2)}**
* **Engineering Eligibility:** Requires Combined GPA 7.50 – 8.00 (Minimum 3.00 in SSC & HSC individually).

#### 📊 Assessment & Advice:
1. **Admission Chances:** **Very High!** You comfortably qualify for **CSE, EEE, ME, IPE, and Civil Engineering** at BAUST.
2. ${waiverChance}
3. **What You Should Do Now:**
   * Prepare for the admission test (Focus on HSC Physics, Chemistry, Mathematics, and Basic English).
   * Submit online application at [BAUST Admission Portal](https://www.baust.edu.bd/).

📞 For instant admission guidance, call Admission Hotline: **01769-675556, 01769-675557**`;
        } else {
          return `### 🎯 ভর্তির সিদ্ধান্ত: হ্যাঁ, আপনি সম্পূর্ণ যোগ্য! ✅

* **আপনার ফলাফলের সারসংক্ষেপ:** ${ssc ? `এসএসসি: ${ssc.toFixed(2)}, ` : ''}${hsc ? `এইচএসসি: ${hsc.toFixed(2)}, ` : ''}**মোট জিপিএ: ${totalGpa.toFixed(2)}**
* **ইঞ্জিনিয়ারিং রিকোয়ারমেন্ট:** এসএসসি ও এইচএসসি মিলিয়ে ন্যূনতম জিপিএ ৭.৫০ – ৮.০০ (উভয়ে আলাদাভাবে ন্যূনতম ৩.০০)।

#### 💡 আপনার জন্য বিশ্লেষণ ও পরামর্শ:
1. **ভর্তির সম্ভাবনা:** **খুবই চমৎকার!** আপনি **CSE, EEE, ME, IPE, Civil** সহ যেকোনো ইঞ্জিনিয়ারিং বিভাগে পরীক্ষা দেওয়ার জন্য সম্পূর্ণ যোগ্য।
2. ${waiverChance}
3. **পরবর্তী পদক্ষেপ:**
   * এইচএসসি-র গণিত, পদার্থবিজ্ঞান, রসায়ন ও ইংরেজির গুরুত্বপূর্ণ টপিকগুলো রিভিশন দিয়ে ভর্তি পরীক্ষার প্রস্তুতি নিন।
   * [BAUST Admission Portal](https://www.baust.edu.bd/)-এ গিয়ে অনলাইনে আবেদন করুন।

📞 যেকোনো প্রয়োজনে ভর্তি হেল্পলাইনে যোগাযোগ করুন: **01769-675556, 01769-675557**`;
        }
      } else if (isEligibleBBA) {
        if (isEnglish) {
          return `### 🎯 Admission Decision: Eligible for BBA & English!

* **Your Total GPA:** ${totalGpa.toFixed(2)}
* **Status:** While Engineering requires GPA 7.50+, you are **fully eligible for BBA and BA (Hons) in English** at BAUST (Requires GPA 6.00+).

#### 💡 Advice:
BAUST's BBA and English departments offer excellent faculty, modern multimedia classrooms, and high job placement.`;
        } else {
          return `### 🎯 ভর্তির সিদ্ধান্ত: BBA ও English প্রোগ্রামে সুযোগ রয়েছে!

* **আপনার মোট জিপিএ:** ${totalGpa.toFixed(2)}
* **অবস্থা:** ইঞ্জিনিয়ারিংয়ে ন্যূনতম ৭.৫০ প্রয়োজন হলেও, আপনি **BBA এবং BA (Hons) in English** বিভাগে ভর্তির জন্য **সম্পূর্ণ যোগ্য** (ন্যূনতম GPA ৬.০০ প্রয়োজন)।

#### 💡 পরামর্শ:
BAUST-এর ব্যবসায় প্রশাসন (BBA) ও ইংরেজি বিভাগ অত্যন্ত সুনামের সাথে পরিচালিত হচ্ছে এবং সামরিক ক্যাম্পাসের শৃঙ্খলাপূর্ণ পরিবেশে আপনি নিশ্চিন্তে ক্যারিয়ার গড়তে পারেন।`;
        }
      }
    }
  }

  // 3. Department Comparison & Guidance
  if (/compare|naki|vs|versus|konta bhalo|konta nibo|konta better|which one is better|konta choice/i.test(q) && (/cse/i.test(q) || /eee/i.test(q) || /me/i.test(q) || /civil/i.test(q) || /ipe/i.test(q) || /bba/i.test(q))) {
    let dept1 = 'CSE', dept2 = 'EEE';
    if (/me|mechanical/i.test(q) && /ipe/i.test(q)) { dept1 = 'ME'; dept2 = 'IPE'; }
    else if (/civil/i.test(q) && /cse/i.test(q)) { dept1 = 'CSE'; dept2 = 'Civil'; }
    else if (/bba/i.test(q) && /cse/i.test(q)) { dept1 = 'CSE'; dept2 = 'BBA'; }

    if (isEnglish) {
      return `### ⚖️ Department Comparison & Career Guidance: ${dept1} vs ${dept2}

Choosing between **${dept1}** and **${dept2}** depends on your personal passion and career goals:

#### 💻 1. ${dept1} Overview:
* **Core Focus:** Software Development, Artificial Intelligence (AI), Machine Learning, Cybersecurity, Algorithms, Web/Mobile Apps.
* **Lab Facilities at BAUST:** Modern high-end AI labs, Software Engineering labs, Network & Cisco labs under experienced PhD faculty.
* **Career Scope:** Software Engineer, Data Scientist, System Architect, Remote Global Tech Jobs, IT Officer in Banks/Govt.

#### ⚡ 2. ${dept2} Overview:
* **Core Focus:** Power Systems, Electronics, Telecommunication, Embedded Systems, IoT, Renewable Energy, Robotics.
* **Lab Facilities at BAUST:** Advanced Electrical Machines lab, Power System lab, Telecommunication & VLSI lab.
* **Career Scope:** Power Grid / BPDB / PGCB engineer, Telecom sector, Hardware design, Industrial Automation, BCS.

#### 🎯 Expert Decision Recommendation:
* Choose **${dept1}** if you love coding, problem-solving, AI, and want high-growth local & remote software jobs.
* Choose **${dept2}** if you are passionate about power grids, electronics hardware, telecom, and core engineering infrastructure.`;
    } else {
      return `### ⚖️ বিভাগ নির্বাচন ও ক্যারিয়ার পরামর্শ: ${dept1} বনাম ${dept2}

**${dept1}** এবং **${dept2}** দুটিই BAUST-এর শীর্ষ চাহিদাসম্পন্ন বিভাগ। আপনার জন্য কোনটি সেরা হবে তা নির্ভর করছে আপনার আগ্রহের ওপর:

#### 💻 ১. ${dept1} (কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং):
* **প্রধান ফোকাস:** সফটওয়্যার ডেভেলপমেন্ট, কৃত্রিম বুদ্ধিমত্তা (AI), মেশিন লার্নিং, সাইবার সিকিউরিটি, ডেটা সায়েন্স, ওয়েব ও মোবাইল অ্যাপস।
* **BAUST-এর সুবিধা:** পিএইচডি ডিগ্রিধারী অভিজ্ঞ শিক্ষকমণ্ডলী, অত্যাধুনিক হাই-কনফিগারেশন ল্যাব এবং প্রোগ্রামিং ক্লাবের সক্রিয় কার্যক্রম।
* **ক্যারিয়ার ক্ষেত্র:** দেশি ও আন্তর্জাতিক সফটওয়্যার কোম্পানি, রিমোট জব, ব্যাংক/সরকারি আইটি অফিসার, রিসার্চ ও উচ্চশিক্ষা।

#### ⚡ ২. ${dept2} (ইলেকট্রিক্যাল অ্যান্ড ইলেকট্রনিক ইঞ্জিনিয়ারিং):
* **প্রধান ফোকাস:** পাওয়ার সিস্টেম, ইলেকট্রনিক্স, টেলিকমিউনিকেশন, এমবেডেড সিস্টেমস, আইওটি ও নবায়নযোগ্য শক্তি।
* **BAUST-এর সুবিধা:** পাওয়ার সিস্টেম ল্যাব, মেশিন ল্যাব, সার্কিট ও ভিএলএসআই ল্যাব সুবিধা।
* **ক্যারিয়ার ক্ষেত্র:** পিডিবি, পাওয়ার গ্রিড, টেলিকম কোম্পানি, ইন্ড্রাস্ট্রিয়াল অটোমেশন, বিসিএস ও বিদেশে উচ্চশিক্ষা।

#### 🎯 আপনার জন্য চূড়ান্ত পরামর্শ:
* যদি আপনার কোডিং, লজিক্যাল প্রবলেম সলভিং এবং সফটওয়্যার তৈরিতে আগ্রহ থাকে $\rightarrow$ **${dept1} বেছে নিন।**
* যদি সার্কিট, হার্ডওয়্যার, পাওয়ার গ্রিড ও ইলেকট্রনিক্স ডিভাইসে আগ্রহ থাকে $\rightarrow$ **${dept2} বেছে নিন।**`;
    }
  }

  // 4. Honest BAUST Review & Environment / Session Jam Question
  if (/kemon|bhalo hobe|pora ki bhalo|session jam|environment|porashona kemon|security|discipline|porashunar man|is baust good|should i admit/i.test(q)) {
    if (isEnglish) {
      return `### 🏫 Honest Evaluation: Why Choose BAUST?

Bangladesh Army University of Science and Technology (BAUST), Saidpur offers a unique academic environment in Bangladesh:

#### 🌟 Key Strengths & Highlights:
1. **Strict Discipline & 100% Session-Jam Free:**
   * Run under the direct supervision of the Bangladesh Army. Semester schedules and exams are strictly on time. 4-year engineering finishes precisely in 4 years.
2. **Quality Faculty & Accreditation:**
   * Senior professors, PhD holders from top global universities (UKM, Xiamen, RUET, BUET), and IEB accredited departments.
3. **Safe Cantonment Living & Residential Facilities:**
   * Located in Saidpur Cantonment. 24/7 security with Abbas Uddin Ahmed Hall (Male) and Taramon Bibi Hall (Female).
4. **Hands-on Labs & Infrastructure:**
   * Well-equipped labs, dedicated transport fleet covering Rangpur, Dinajpur, and Nilphamari.

#### 🎯 Verdict:
If you want quality engineering education with disciplined campus life, zero politics, and on-time graduation, **BAUST is an outstanding choice.**`;
    } else {
      return `### 🏫 BAUST-এর পড়াশোনার মান ও ক্যাম্পাস মূল্যায়ন

বাংলাদেশ সেনাবাহিনী পরিচালিত বিশ্ববিদ্যালয় হিসেবে BAUST অন্যান্য বেসরকারি বিশ্ববিদ্যালয়ের তুলনায় সম্পূর্ণ ব্যতিক্রমী ও সুশৃঙ্খল:

#### 🌟 প্রধান বৈশিষ্ট্য ও সুবিধাসমূহ:
1. **১০০% সেশনজট মুক্ত ও অন-টাইম গ্র্যাজুয়েশন:**
   * সেনাবাহিনীর প্রত্যক্ষ তত্ত্বাবধানে পরিচালিত হওয়ায় অ্যাকাডেমিক ক্যালেন্ডার শতভাগ মেনে চলা হয়। ৪ বছরের অনার্স বা ইঞ্জিনিয়ারিং নির্দিষ্ট ৪ বছরেই সম্পন্ন হয়।
2. **উন্নত ল্যাব ও যোগ্য শিক্ষকমণ্ডলী:**
   * বুয়েট, রুয়েট, কুয়েট এবং বিদেশের শীর্ষ বিশ্ববিদ্যালয় থেকে পিএইচডি ও এমএসসি সম্পন্ন অভিজ্ঞ শিক্ষকবৃন্দ পাঠদান পরিচালনা করেন।
3. **নিরাপদ ক্যাম্পাস ও আবাসিক ব্যবস্থা:**
   * সৈয়দপুর সেনানিবাসের ভেতরে অবস্থিত হওয়ায় ক্যাম্পাস সম্পূর্ণ রাজনীতিমুক্ত ও সর্বোচ্চ নিরাপদ। ছেলেদের ও মেয়েদের জন্য আধুনিক সুযোগ-সুবিধাসহ হল রয়েছে।
4. **বাস ও পরিবহন নেটওয়ার্ক:**
   * রংপুর, দিনাজপুর, নীলফামারী ও সৈয়দপুর শহরজুড়ে নিজস্ব বাস সার্ভিস পরিচালিত হয়।

#### 🎯 চূড়ান্ত মতামত:
যদি আপনার লক্ষ্য হয় রাজনীতিমুক্ত নিরাপদ পরিবেশে সঠিক সময়ে ইঞ্জিনিয়ারিং বা অনার্স শেষ করে দেশ-বিদেশে ক্যারিয়ার গড়া, তবে **BAUST নিঃসন্দেহে একটি চমৎকার ও নির্ভরযোগ্য বিশ্ববিদ্যালয়।**`;
    }
  }

  // 5. Admission Test Preparation Tips
  if (/prostuti|preparation|exam tips|kivabe porbo|syllabus|admission test/i.test(q)) {
    if (isEnglish) {
      return `### 📚 BAUST Admission Test Preparation Guide

To secure your seat and high merit rank in the BAUST admission test, follow this preparation roadmap:

#### 🎯 Subject Breakdown (For Engineering):
1. **Mathematics:** Focus on HSC Calculus (Integration & Differentiation), Matrices, Trigonometry, and Vectors.
2. **Physics:** Emphasize Mechanics, Electricity & Magnetism, Optics, and Modern Physics.
3. **Chemistry:** Review Chemical Bonding, Periodic Table trends, Organic basic reactions, and Solutions.
4. **English:** Focus on Basic Grammar, Vocabulary, Prepositions, and Sentence correction.

#### 💡 Top Tips for Success:
* Review HSC main textbooks thoroughly and practice MCQs with speed.
* Solve previous admission question patterns.
* Time management is key: practice answering within 1 minute per question.`;
    } else {
      return `### 📚 BAUST ভর্তি পরীক্ষার পূর্ণাঙ্গ প্রস্তুতি গাইড

BAUST ভর্তি পরীক্ষায় মেধা তালিকায় এগিয়ে থাকতে নিচের কৌশলগুলো অনুসরণ করুন:

#### 🎯 বিষয়ভিত্তিক প্রস্তুতির মূল বিষয়সমূহ (ইঞ্জিনিয়ারিং):
১. **উচ্চতর গণিত:** এইচএসসি সিলেবাসের ক্যালকুলাস (অন্তরীকরণ ও যোগজীকরণ), ম্যাট্রিক্স, ত্রিকোণমিতি ও ভেক্টর থেকে বেশি প্রশ্ন আসে।
২. **পদার্থবিজ্ঞান:** গতিবিদ্যা, কাজ-শক্তি-ক্ষমতা, তড়িৎবিজ্ঞান, আলো ও আধুনিক পদার্থবিজ্ঞান গুরুত্ব দিন।
৩. **রসায়ন:** মৌলের পর্যায়বৃত্ত ধর্ম, রাসায়নিক বন্ধন, দ্রবণ ও জৈব রসায়নের মূল বিক্রিয়াগুলো রিভিশন দিন।
৪. **ইংরেজি:** বেসিক গ্রামার, Prepositions, Tense, Vocabulary এবং Sentence Correction।

#### 💡 টিপস:
* মূল পাঠ্যবইয়ের সূত্র ও গাণিতিক উদাহরণগুলো নিয়মিত প্র্যাকটিস করুন।
* ভর্তি পরীক্ষায় নেগেটিভ মার্কিং এড়াতে নিশ্চিত না হয়ে আন্দাজে দাগাবেন না।
* সময় ব্যবস্থাপনা বজায় রেখে দ্রুত উত্তর করার অভ্যাস করুন।`;
    }
  }

  // 6. Bot Identity & Conversational Intro
  if (/tumi ke|who are you|tumi ki|what can you do|ki korte paro|tomar nam ki|who created you/i.test(q)) {
    if (isEnglish) {
      return `### 🤖 About Me — BAUST AI Virtual Assistant

I am the **Official AI Assistant of Bangladesh Army University of Science and Technology (BAUST), Saidpur**.

#### 🚀 What I Can Help You With:
* 🎓 **Assess Admission Eligibility & Calculate GPA decisions**
* ⚖️ **Compare Departments & give Career Counseling (CSE vs EEE vs ME vs Civil)**
* 👨‍🏫 **Search Faculty Directories of all Departments (Math, CSE, EEE, ME, Civil, BBA, English)**
* 💰 **Calculate 4-Year Tuition Fees & Installment Schedules**
* 🏢 **Guide on Halls, Hostels, Transport Routes & Campus Life**
* 🎁 **Explain Waivers (Freedom Fighters, Army Quota, Merit Scholarships)**

Feel free to ask me anything freely in **English, বাংলা, or Banglish**!`;
    } else {
      return `### 🤖 আমার পরিচিতি — BAUST AI ভার্চুয়াল অ্যাসিস্ট্যান্ট

আমি **বাংলাদেশ আর্মি ইউনিভার্সিটি অব সায়েন্স অ্যান্ড টেকনোলজি (BAUST), সৈয়দপুর**-এর অফিশিয়াল স্মার্ট ভার্চুয়াল অ্যাসিস্ট্যান্ট।

#### 🚀 আমি আপনাকে যেভাবে সহায়তা করতে পারি:
* 🎓 **ভর্তির যোগ্যতা ও জিপিএ বিশ্লেষণ করে চূড়ান্ত সিদ্ধান্ত ও পরামর্শ দেওয়া**
* ⚖️ **ডিপার্টমেন্ট তুলনা ও ক্যারিয়ার গাইডেন্স (CSE, EEE, ME, Civil, BBA)**
* 👨‍🏫 **সকল বিভাগের শিক্ষকদের তালিকা ও পরিচিতি প্রদর্শন (গণিত, সিএসই, ইইই, এমই, সিভিল, বিবিএ, ইংরেজি)**
* 💰 **৪ বছরের টিউশন ফি ও সেমিস্টার কিস্তির হিসাব প্রদান**
* 🏢 **হল, হোস্টেল, বাস রুট ও বিশ্ববিদ্যালয় জীবনের বাস্তব তথ্য জানানো**
* 🎁 **বৃত্তি ও ওয়েভার সুবিধা (মুক্তিযোদ্ধা কোটা, সেনা পরিবার কোটা ও মেরিট ছাড়)**

আপনি আপনার মতো করে **বাংলা, বাংলিশ বা ইংরেজি** যেকোনো ভাষায় প্রশ্ন করতে পারেন!`;
    }
  }

  return null;
}

// Smart RAG Matcher & Scorer
function searchKnowledge(query, matchedIntents) {
  const q = query.toLowerCase();
  const qNorm = normalizePhonetics(q);
  const scoredModules = [];
  const isNoticeExplicit = matchedIntents.includes('notice') || q.includes('notice') || q.includes('নোটিশ');

  for (const mod of kbData.modules) {
    let score = 0;
    const titleLower = (mod.title || '').toLowerCase();
    const sectionLower = (mod.section || '').toLowerCase();
    const contentLower = (mod.content || '').toLowerCase();
    const sectionNorm = normalizePhonetics(sectionLower);

    // Heavy penalty for notice pages if user didn't ask for notices
    if (!isNoticeExplicit && (sectionLower.includes('notice') || titleLower.includes('notice') || sectionLower.includes('meeting'))) {
      score -= 50;
    }

    const tokens = q.split(/\s+/).filter(t => t.length > 2);
    for (const t of tokens) {
      if (titleLower.includes(t)) score += 12;
      if (sectionLower.includes(t)) score += 15;
      if (contentLower.includes(t)) score += 2;
    }

    for (const tag of matchedIntents) {
      if (sectionLower.includes(tag) || titleLower.includes(tag) || sectionNorm.includes(tag)) score += 30;
      if (contentLower.includes(tag)) score += 6;
    }

    if (score > 0) {
      scoredModules.push({ mod, score });
    }
  }

  scoredModules.sort((a, b) => b.score - a.score);
  return scoredModules.slice(0, 4).map(item => item.mod);
}

// ----------------------------------------------------
// 🗣️ MULTI-LINGUAL LANGUAGE-ADAPTIVE RESPONSE GENERATOR
// ----------------------------------------------------

function generateSmartAnswer(userMsg, matchedIntents, topModules, matchedEntity, targetLang, history = []) {
  const isEnglish = (targetLang === 'en');

  // 1. Check conversational reasoning & decision engine first!
  const decisionReply = handleConversationalDecisions(userMsg, targetLang, history);
  if (decisionReply) {
    return decisionReply;
  }

  // 2. Entity (Faculty / Leadership) Profile
  if (matchedEntity) {
    if (isEnglish) {
      return `### 👨‍🏫 ${matchedEntity.name}

* **💼 Designation:** ${matchedEntity.designation}
* **🏛️ Department:** ${matchedEntity.department}
${matchedEntity.degrees ? `* **🎓 Academic Degrees & Qualifications:** ${matchedEntity.degrees}` : ''}

#### 📋 Biography & Profile:
${matchedEntity.bio}

---
🔗 **Official Source:** [BAUST Faculty Portal](https://www.baust.edu.bd/cse)`;
    } else {
      return `### 👨‍🏫 ${matchedEntity.name} (${matchedEntity.name_bn || ''})

* **💼 পদবী (Designation):** ${matchedEntity.designation} ${matchedEntity.designation_bn ? `(${matchedEntity.designation_bn})` : ''}
* **🏛️ বিভাগ / অনুষদ (Department):** ${matchedEntity.department} ${matchedEntity.department_bn ? `(${matchedEntity.department_bn})` : ''}
${matchedEntity.degrees ? `* **🎓 শিক্ষাগত যোগ্যতা ও ডিগ্রি:** ${matchedEntity.degrees}` : ''}

#### 📋 বিস্তারিত পরিচিতি:
${matchedEntity.bio}

---
🔗 **অফিশিয়াল সোর্স:** [BAUST Faculty Portal](https://www.baust.edu.bd/cse)`;
    }
  }

  // 3. Greetings
  if (['hi', 'hello', 'hey', 'salam', 'assalamu alaikum', 'কেমন আছ', 'হাই', 'হ্যালো', 'হেলো', 'ki khobor', 'kemon'].some(g => userMsg.toLowerCase().includes(g)) && matchedIntents.length === 0) {
    if (isEnglish) {
      return `**Hello and Welcome!** 👋\n\nI am the **BAUST AI Assistant** — the official virtual assistant for Bangladesh Army University of Science and Technology (BAUST), Saidpur.\n\nFeel free to ask me anything about:\n\n* 💰 **Tuition Fees & Payments** (CSE, EEE, ME, Civil, IPE, BBA, English)\n* 🎓 **Admission Requirements & Eligibility Decisions** (SSC/HSC GPA, Forms, Criteria)\n* 👨‍🏫 **Faculty Directory & Leadership** (VC, Deans, Department Heads, 90+ Professors)\n* 🎁 **Waivers & Scholarships** (Freedom Fighter Quota, Army Personnel Quota, Merit Waivers)\n* 🏢 **Hostels & Residential Facilities** (Male & Female Dormitories)\n* 🚌 **Transport & Bus Routes** (Rangpur, Dinajpur, Nilphamari, Saidpur routes)\n* 📞 **Official Contact Information**\n\nHow can I help you today?`;
    } else {
      return `**আসসালামু আলাইকুম!** 👋\n\nআমি **BAUST AI Assistant** — বাংলাদেশ আর্মি ইউনিভার্সিটি অব সায়েন্স অ্যান্ড টেকনোলজি (BAUST), সৈয়দপুর-এর অফিশিয়াল স্মার্ট ভার্চুয়াল অ্যাসিস্ট্যান্ট।\n\nআপনি যেকোনো বিষয়ে প্রশ্ন বা পরামর্শ চাইতে পারেন:\n\n* 💰 **টিউশন ফি ও খরচ** (CSE, EEE, ME, Civil, IPE, BBA, English)\n* 🎓 **ভর্তি যোগ্যতা ও জিপিএ মূল্যায়ন** (SSC/HSC GPA দিয়ে সুযোগ যাচাই)\n* ⚖️ **ডিপার্টমেন্ট তুলনা ও ক্যারিয়ার পরামর্শ** (CSE naki EEE?)\n* 👨‍🏫 **বিভাগীয় প্রধান ও শিক্ষক পরিচিতি** (CSE Head, VC, Deans, 90+ Teachers)\n* 🎁 **ওয়েভার ও স্কলারশিপ** (মুক্তিযোদ্ধা কোটা, আর্মি পার্সোনেল কোটা, মেরিট স্কলারশিপ)\n* 🏢 **হল ও আবাসন সুবিধা** (ছেলেদের ও মেয়েদের হোস্টেল)\n* 🚌 **বাস সার্ভিস ও যাতায়াত রুট** (রংপুর, দিনাজপুর, নীলফামারী, সৈয়দপুর)\n* 📞 **যোগাযোগ ও অফিস নম্বর**\n\nআপনার প্রশ্নটি লিখুন!`;
    }
  }

  // 4. Tuition Fees
  if (matchedIntents.includes('fees')) {
    let specificDept = '';
    if (matchedIntents.includes('cse')) specificDept = 'CSE';
    else if (matchedIntents.includes('eee')) specificDept = 'EEE';
    else if (matchedIntents.includes('me')) specificDept = 'ME';
    else if (matchedIntents.includes('civil')) specificDept = 'Civil';
    else if (matchedIntents.includes('ipe')) specificDept = 'IPE';
    else if (matchedIntents.includes('bba')) specificDept = 'BBA';
    else if (matchedIntents.includes('english')) specificDept = 'English';

    if (isEnglish) {
      return `### 💰 BAUST Tuition Fees & Cost Structure

Estimated total 4-year tuition fees (8 semesters) at Bangladesh Army University of Science and Technology (BAUST):

| Program | Total Credits | Estimated Total Fee (8 Semesters) |
| :--- | :--- | :--- |
| **B.Sc. in CSE** | 160+ | ৳ 7,85,000 – 8,20,000 |
| **B.Sc. in EEE** | 160+ | ৳ 7,50,000 – 7,90,000 |
| **B.Sc. in ME** | 160+ | ৳ 7,50,000 – 7,90,000 |
| **B.Sc. in Civil** | 160+ | ৳ 7,60,000 – 8,00,000 |
| **B.Sc. in IPE** | 160+ | ৳ 7,30,000 – 7,70,000 |
| **BBA** | 126+ | ৳ 4,60,000 – 5,00,000 |
| **BA (Hons) English** | 120+ | ৳ 3,60,000 – 4,00,000 |

${specificDept ? `> 🎯 **Note for ${specificDept}:** Semester fees can be paid in convenient installments, and admission fee is paid once at the start.\n\n` : ''}
#### 💳 Payment Channels:
* Payments can be made via Trust Bank Ltd, bKash, Nagad, or TAP directly to the university account.
* Official link: [BAUST Tuition Fees Page](https://www.baust.edu.bd/admission/tuition-fees/)`;
    } else {
      return `### 💰 BAUST টিউশন ফি ও খরচ (Tuition Fees & Cost Structure)

বাংলাদেশ আর্মি ইউনিভার্সিটি অব সায়েন্স অ্যান্ড টেকনোলজি (BAUST)-এর ৪ বছরের (৮ সেমিস্টার) আনুমানিক মোট ফি তালিকা:

| প্রোগ্রাম (Program) | মোট ক্রেডিট | আনুমানিক মোট খরচ (৪ বছর / ৮ সেমিস্টার) |
| :--- | :--- | :--- |
| **B.Sc. in CSE** | ১৬০+ | ৳ ৭,৮৫,০০০ – ৮,২০,০০০ |
| **B.Sc. in EEE** | ১৬০+ | ৳ ৭,৫০,০০০ – ৭,৯০,০০০ |
| **B.Sc. in ME** | ১৬০+ | ৳ ৭,৫০,০০০ – ৭,৯০,০০০ |
| **B.Sc. in Civil** | ১৬০+ | ৳ ৭,৬০,০০০ – ৮,০০,০০০ |
| **B.Sc. in IPE** | ১৬০+ | ৳ ৭,৩০,০০০ – ৭,৭০,০০০ |
| **BBA** | ১২৬+ | ৳ ৪,৬০,০০০ – ৫,০০,০০০ |
| **BA (Hons) English** | ১২০+ | ৳ ৩,৬০,০০০ – ৪,০০,০০০ |

${specificDept ? `> 🎯 **${specificDept} বিভাগের জন্য নোট:** প্রতি সেমিস্টারে কিস্তিতে (installments) ফি দেওয়ার পূর্ণ সুবিধা রয়েছে এবং ভর্তি ফি শুরুতে একবারই দিতে হয়।\n\n` : ''}
#### 💳 পেমেন্ট মাধ্যম:
* ট্রাস্ট ব্যাংক (Trust Bank Ltd), বিকাশ (bKash), নগদ (Nagad), বা ট্যাপ (TAP)-এর মাধ্যমে সরাসরি সেমিস্টার ফি জমা দেওয়া যায়।
* বিস্তারিত ও লেটেস্ট আপডেট: [BAUST Tuition Fees Page](https://www.baust.edu.bd/admission/tuition-fees/)`;
    }
  }

  // 5. Admission / Requirements
  if (matchedIntents.includes('admission')) {
    if (isEnglish) {
      return `### 🎓 BAUST Admission Requirements & Procedures

#### 1. Engineering Programs (CSE, EEE, ME, IPE, Civil, ICT):
* **Science Background:** Minimum GPA 3.00 in both SSC & HSC with a combined total **GPA 7.50 – 8.00**.
* Mandatory minimum grade requirements in Mathematics, Physics, and Chemistry in HSC.
* **Diploma Holders:** Diploma in Engineering graduates can also apply (minimum CGPA 3.00).

#### 2. Business Administration (BBA) & English (BA in English):
* Candidates from any group (Science, Commerce, Arts) with a combined minimum **GPA 6.00 – 6.50** in SSC & HSC.

#### 📝 How to Apply:
1. Visit the [BAUST Admission Portal](https://www.baust.edu.bd/) and fill out the online application form.
2. Pay the application fee (BDT 1,000/-) via bKash/Nagad/Trust Bank.
3. Download your Admit Card and attend the admission test.

📞 Admission Hotline: **01769-675556, 01769-675557**`;
    } else {
      return `### 🎓 BAUST ভর্তি যোগ্যতা ও আবেদন প্রক্রিয়া (Admission Requirements)

#### ১. ইঞ্জিনিয়ারিং প্রোগ্রামসমূহ (CSE, EEE, ME, IPE, Civil, ICT):
* **বিজ্ঞান বিভাগ (Science):** এসএসসি (SSC) ও এইচএসসি (HSC) উভয় পরীক্ষায় ন্যূনতম GPA ৩.০০ সহ সর্বমোট ন্যূনতম **GPA ৭.৫০ – ৮.০০** থাকতে হবে।
* এইচএসসিতে গণিত (Mathematics), পদার্থবিজ্ঞান (Physics), ও রসায়ন (Chemistry)-তে ন্যূনতম নির্ধারিত গ্রেড থাকতে হবে।
* **ডিপ্লোমা শিক্ষার্থী:** ডিপ্লোমা ইন ইঞ্জিনিয়ারিং সম্পন্নকারী শিক্ষার্থীরাও সংশ্লিষ্ট বিভাগে আবেদন করতে পারবেন (ন্যূনতম CGPA ৩.০০)।

#### ২. ব্যবসায় প্রশাসন (BBA) ও ইংরেজি (BA in English):
* যেকোনো বিভাগ (Science, Commerce, Arts) থেকে এসএসসি ও এইচএসসিতে সম্মিলিতভাবে ন্যূনতম **GPA ৬.০০ – ৬.৫০**।

#### 📝 আবেদনের নিয়ম:
1. অনলাইনে [BAUST Admission Portal](https://www.baust.edu.bd/)-এ গিয়ে অনলাইন ফর্ম পূরণ করুন।
2. আবেদন ফি (BDT ১,০০০/- বা নির্ধারিত) বিকাশ/নগদ/ট্রাস্ট ব্যাংকে প্রদান করুন।
3. অ্যাডমিট কার্ড সংগ্রহ করে ভর্তি পরীক্ষায় অংশ নিন।

📞 হেল্পলাইন: **01769-675556, 01769-675557**`;
    }
  }

  // 6. Waiver / Scholarship
  if (matchedIntents.includes('waiver')) {
    if (isEnglish) {
      return `### 🎁 Scholarships, Waivers & Financial Aid

BAUST offers several scholarship and waiver opportunities:

1. **Freedom Fighters' Children Quota:** **100% tuition fee waiver** under the Private University Act 2010.
2. **Army Personnel Quota (Army Family Concession):**
   * Special tuition fee rebates/concessions for children of serving and retired Bangladesh Army personnel (Officers, JCOs, NCOs, ORs).
3. **Merit-Based Scholarship (Merit Waiver):**
   * 25% to 100% tuition fee waiver based on semester final exam results (CGPA 3.80 - 4.00).
4. **Sibling Waiver:**
   * Special concession if two siblings are studying simultaneously at BAUST.

🔗 Learn more: [BAUST Waiver & Financial Aid](https://www.baust.edu.bd/admission/waiver-and-financial-aid/)`;
    } else {
      return `### 🎁 স্কলারশিপ ও ওয়েভার সুবিধা (Scholarships & Financial Aid)

BAUST-এ শিক্ষার্থীদের জন্য বিশেষ ওয়েভার ও বৃত্তি:

1. **মুক্তিযোদ্ধা কোটা:** বেসরকারি বিশ্ববিদ্যালয় আইন ২০১০ অনুযায়ী বীর মুক্তিযোদ্ধার সন্তানদের জন্য **১০০% টিউশন ফি ওয়েভার** (কোটা অনুযায়ী)।
2. **সেনাবাহিনী পরিবারের জন্য বিশেষ ছাড় (Army Quota):**
   * বাংলাদেশ সেনাবাহিনীতে কর্মরত ও অবসরপ্রাপ্ত সেনা সদস্য (Officers, JCOs, NCOs, ORs)-দের সন্তানদের জন্য নির্ধারিত হারে বিশেষ ছাড়/রিবেট রয়েছে।
3. **মেরিট স্কলারশিপ (Merit Waiver):**
   * সেমিস্টার ফাইনাল পরীক্ষার ফলাফলের (CGPA ৩.৮০ - ৪.০০) ওপর ভিত্তি করে ২৫% থেকে ১০০% পর্যন্ত টিউশন ফি ছাড় দেওয়া হয়।
4. **সহোদর/সহোদরা ছাড় (Sibling Waiver):**
   * একই সাথে দুই ভাই-বোন অধ্যয়নরত থাকলে একজনের জন্য বিশেষ কনসেশন প্রযোজ্য।

🔗 বিস্তারিত জানুন: [BAUST Waiver & Financial Aid](https://www.baust.edu.bd/admission/waiver-and-financial-aid/)`;
    }
  }

  // 7. Hostels / Accommodation
  if (matchedIntents.includes('hostel')) {
    if (isEnglish) {
      return `### 🏢 Residential & Hostel Facilities

BAUST provides secure, modern on-campus and cantonment-adjacent residential facilities:

* 👦 **Male Hall:** Abbas Uddin Ahmed Hall (Male Dormitory)
* 👧 **Female Hall:** Taramon Bibi Hall (Female Dormitory)

#### 🌟 Hall Amenities:
* 24/7 CCTV surveillance & Military security coverage.
* High-speed broadband Wi-Fi, nutritious dining hall & canteen.
* 100% uninterrupted electricity with generator backup.
* Dedicated study rooms, library corner, and indoor sports (Table Tennis, Carrom, Badminton).

🔗 Details: [BAUST Residential Facilities](https://www.baust.edu.bd/facilities/residential-facilities-male-female/)`;
    } else {
      return `### 🏢 আবাসিক হল ও হোস্টেল সুবিধা (Residential Facilities)

BAUST শিক্ষার্থীদের জন্য আধুনিক ও নিশ্ছিদ্র নিরাপত্তার হলের ব্যবস্থা রয়েছে:

* 👦 **ছেলেদের হল:** আব্বাস উদ্দীন আহমেদ হল (Abbas Uddin Ahmed Hall / Male Dormitory)
* 👧 **মেয়েদের হল:** তারামন বিবি হল (Taramon Bibi Hall / Female Dormitory)

#### 🌟 হলের সুবিধাসমূহ:
* ২৪ ঘণ্টা সিসিটিভি ও মিলিটারি সিকিউরিটি নিরাপত্তা।
* উচ্চগতির ব্রডব্যান্ড ওয়াইফাই (Wi-Fi), পুষ্টিকর খাবারের ডাইনিং ও মেস।
* নিরবচ্ছিন্ন বিদ্যুৎ ও জেনারেটর ব্যাকআপ।
* রিডিং রুম, স্টাডি রুম এবং ইনডোর গেমস সুবিধা (টেবিল টেনিস, ক্যারাম, ব্যাডমিন্টন)।

🔗 বিস্তারিত: [BAUST Residential Facilities](https://www.baust.edu.bd/facilities/residential-facilities-male-female/)`;
    }
  }

  // 8. Transport
  if (matchedIntents.includes('transport')) {
    if (isEnglish) {
      return `### 🚌 Transport & Bus Route Facilities

BAUST maintains its own fleet of dedicated university buses:

#### 📍 Major Bus Routes:
1. **Rangpur Route:** Rangpur City ⇄ Saidpur Cantonment Campus
2. **Dinajpur Route:** Dinajpur City ⇄ Saidpur Campus
3. **Nilphamari Route:** Nilphamari Sadar ⇄ Saidpur Campus
4. **Parbatipur Route:** Parbatipur ⇄ Saidpur Campus
5. **Saidpur Local Route:** Connecting key city points to Campus

> ⏰ Scheduled morning pick-up before class starts and afternoon drop-off after classes conclude.

🔗 Details: [BAUST Transport Information](https://www.baust.edu.bd/facilities/transport/)`;
    } else {
      return `### 🚌 পরিবহন ও বাস সার্ভিস সুবিধা (Transport Facilities)

BAUST নিজস্ব বাস বহর পরিচালনা করে থাকে:

#### 📍 প্রধান বাস রুটসমূহ:
1. **রংপুর রুট:** রংপুর শহর ⇄ সৈয়দপুর ক্যাম্পাস
2. **দিনাজপুর রুট:** দিনাজপুর শহর ⇄ সৈয়দপুর ক্যাম্পাস
3. **নীলফামারী রুট:** নীলফামারী সদর ⇄ সৈয়দপুর ক্যাম্পাস
4. **পার্বতীপুর রুট:** পার্বতীপুর ⇄ সৈয়দপুর ক্যাম্পাস
5. **সৈয়দপুর লোকাল রুট:** শহরের বিভিন্ন পয়েন্ট ⇄ ক্যাম্পাস

> ⏰ সকালের ক্লাসের আগে পিক-আপ এবং বিকালের ক্লাস শেষে ড্রপ-অফ শিডিউল রয়েছে।

🔗 বিস্তারিত: [BAUST Transport Information](https://www.baust.edu.bd/facilities/transport/)`;
    }
  }

  // 9. Contact
  if (matchedIntents.includes('contact')) {
    if (isEnglish) {
      return `### 📞 BAUST Contact & Location Information

* 🏛️ **Institution:** Bangladesh Army University of Science and Technology (BAUST)
* 📍 **Address:** Saidpur Cantonment, Saidpur, Nilphamari - 5310, Bangladesh.
* 📱 **Admission Hotlines:**
  * **01769-675556**
  * **01769-675557**
  * **01769-675558**
* 📧 **Email:** admission@baust.edu.bd, info@baust.edu.bd
* 🌐 **Official Website:** [www.baust.edu.bd](https://www.baust.edu.bd/)
* 🕒 **Office Hours:** Sunday to Thursday (8:00 AM – 4:00 PM)`;
    } else {
      return `### 📞 BAUST যোগাযোগ ও ঠিকানা (Contact & Office Information)

* 🏛️ **বিশ্ববিদ্যালয়ের নাম:** বাংলাদেশ আর্মি ইউনিভার্সিটি অব সায়েন্স অ্যান্ড টেকনোলজি (BAUST)
* 📍 **ঠিকানা:** সৈয়দপুর সেনানিবাস (Saidpur Cantonment), সৈয়দপুর, নীলফামারী - ৫৩১০, বাংলাদেশ।
* 📱 **ভর্তি অফিস হটলাইন:**
  * **01769-675556**
  * **01769-675557**
  * **01769-675558**
* 📧 **ইমেইল:** admission@baust.edu.bd, info@baust.edu.bd
* 🌐 **অফিশিয়াল ওয়েবসাইট:** [www.baust.edu.bd](https://www.baust.edu.bd/)
* 🕒 **অফিস সময়:** রবিবার থেকে বৃহস্পতিবার (সকাল ৮:০০ – বিকাল ৪:০০)`;
    }
  }

  // 10. Department queries
  if (matchedIntents.includes('cse') || matchedIntents.includes('eee') || matchedIntents.includes('me') || matchedIntents.includes('civil') || matchedIntents.includes('bba') || matchedIntents.includes('ipe') || matchedIntents.includes('faculty')) {
    if (isEnglish) {
      return `### 🏛️ BAUST Faculties & Offered Programs

BAUST offers the following academic faculties and programs:

1. **Faculty of Electrical & Computer Engineering (FECE):**
   * Department of Computer Science & Engineering (CSE) - B.Sc. in CSE
   * Department of Electrical & Electronic Engineering (EEE) - B.Sc. in EEE
   * Department of Information & Communication Technology (ICT)
2. **Faculty of Mechanical & Production Engineering (FMPE):**
   * Department of Mechanical Engineering (ME) - B.Sc. in ME
   * Department of Industrial & Production Engineering (IPE) - B.Sc. in IPE (IEB Accredited)
3. **Faculty of Civil Engineering (FCE):**
   * Department of Civil Engineering (CE) - B.Sc. in CE
4. **Faculty of Business Studies (FBS):**
   * Department of Business Administration (BBA, MBA)
   * Department of Accounting & Information Systems (AIS)
5. **Faculty of Science & Humanities:**
   * Department of English (BA Hons in English)
   * Department of Arts and Sciences (Physics, Chemistry, Math)

🔗 Explore more at: [BAUST Programs](https://www.baust.edu.bd/)`;
    } else {
      return `### 🏛️ BAUST অনুষদ ও বিভাগসমূহ (Faculties & Academic Programs)

BAUST-এ নিম্নলিখিত ফ্যাকাল্টি এবং বিভাগসমূহ পরিচালিত হয়:

1. **Faculty of Electrical & Computer Engineering (FECE):**
   * Department of Computer Science & Engineering (CSE) - B.Sc. in CSE
   * Department of Electrical & Electronic Engineering (EEE) - B.Sc. in EEE
   * Department of Information & Communication Technology (ICT)
2. **Faculty of Mechanical & Production Engineering (FMPE):**
   * Department of Mechanical Engineering (ME) - B.Sc. in ME
   * Department of Industrial & Production Engineering (IPE) - B.Sc. in IPE (IEB Accredited)
3. **Faculty of Civil Engineering (FCE):**
   * Department of Civil Engineering (CE) - B.Sc. in CE
4. **Faculty of Business Studies (FBS):**
   * Department of Business Administration (BBA, MBA)
   * Department of Accounting & Information Systems (AIS)
5. **Faculty of Science & Humanities:**
   * Department of English (BA Hons in English)
   * Department of Arts and Sciences (Physics, Chemistry, Math)

🔗 বিস্তারিত জানতে ভিজিট করুন: [BAUST Programs](https://www.baust.edu.bd/)`;
    }
  }

  // 11. Fallback to top grounded module
  if (topModules.length > 0) {
    const topMod = topModules[0];
    const excerpt = topMod.content.slice(0, 1500).replace(/\n{2,}/g, '\n\n');
    return `### 📌 ${topMod.section || topMod.title}\n\n${excerpt}\n\n---\n🔗 **Source:** [BAUST Official Portal](${topMod.url})`;
  }

  // General fallback
  if (isEnglish) {
    return `I can help you with any information regarding Bangladesh Army University of Science and Technology (BAUST), Saidpur.\n\nWhat would you like to know? For example:\n- **Faculty profiles (e.g. Who is Dr. Nakib Hayat Chowdhury?)**\n- **Tuition fees for CSE, EEE, ME, Civil, BBA**\n- **Admission requirements and GPA evaluation**\n- **Hostel facilities and bus routes**\n\nPlease feel free to ask!`;
  } else {
    return `বাংলাদেশ আর্মি ইউনিভার্সিটি অব সায়েন্স অ্যান্ড টেকনোলজি (BAUST), সৈয়দপুর সংক্রান্ত যেকোনো তথ্যের জন্য আমি সহায়তা করতে পারি।\n\nআপনি নির্দিষ্টভাবে কী জানতে চান? যেমন:\n- **শিক্ষক পরিচিতি (যেমন: নকীব হায়াত চৌধুরী কে?)**\n- **CSE বা EEE এর সেমিস্টার ফি কত?**\n- **ভর্তির যোগ্যতা ও জিপিএ মূল্যায়ন**\n- **আবাসিক হল বা বাস সার্ভিসের রুট কী কী?**\n\nঅনুগ্রহ করে আপনার প্রশ্নটি লিখুন!`;
  }
}

// Fallback Gemini Integration if key exists
async function callGeminiIfAvailable(userMsg, contextSnippets, apiKey, targetLang, history = []) {
  if (!apiKey) return null;
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const langRule = (targetLang === 'en')
      ? 'You MUST respond strictly in professional English.'
      : 'You MUST respond strictly in Bengali (বাংলা). Even if the user asked in Banglish, reply in clear, natural Bengali script (বাংলা).';

    const systemPrompt = `You are the official AI Assistant and University Counselor for Bangladesh Army University of Science and Technology (BAUST), located in Saidpur Cantonment, Bangladesh.
${langRule}
You can reason freely, give helpful academic guidance, calculate GPA eligibility, compare departments, list faculty members, and counsel prospective students.
Always ground factual university details (fees, departments, faculty names, rules, hostels) in the following verified BAUST facts:
${contextSnippets.slice(0, 3000)}

Format answers with clean markdown, clear headings, bullet points, and official BAUST URLs when relevant.`;

    const contents = [];
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMsg}` }]
    });

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    }
  } catch (err) {
    console.warn('[Gemini] Fallback to RAG engine:', err.message);
  }
  return null;
}

// ----------------------------------------------------
// 🌐 API ROUTES
// ----------------------------------------------------

app.post('/api/chat', async (req, res) => {
  try {
    const { message, userKey, history } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Detect target language (English vs Bangla/Banglish)
    const detectedLang = detectLanguage(message);

    // 2. Detect intents with Unicode-safe keywords
    const matchedIntents = detectIntents(message);

    // 3. Fuzzy match person / faculty entity
    const matchedEntity = fuzzyMatchEntity(message, matchedIntents);

    // 4. Search grounded knowledge modules
    const topModules = searchKnowledge(message, matchedIntents);
    const contextSnippets = topModules.map(m => `[${m.section || m.title}]: ${m.content.slice(0, 800)}`).join('\n\n');

    const effectiveKey = userKey || process.env.GEMINI_API_KEY;
    let reply = null;

    if (effectiveKey && !matchedEntity) {
      reply = await callGeminiIfAvailable(message, contextSnippets, effectiveKey, detectedLang, history);
    }

    if (!reply) {
      reply = generateSmartAnswer(message, matchedIntents, topModules, matchedEntity, detectedLang, history);
    }

    return res.json({
      reply,
      language: detectedLang,
      matchedEntity: matchedEntity ? matchedEntity.name : null,
      intents: matchedIntents,
      sources: topModules.map(m => ({ title: m.section || m.title, url: m.url }))
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Knowledge API endpoint
app.get('/api/knowledge', (req, res) => {
  res.json({
    university: kbData.university,
    categories: kbData.categories,
    entities: entities.map(e => ({ name: e.name, designation: e.designation, department: e.department })),
    totalModules: kbData.modules.length,
    modules: kbData.modules.map(m => ({ section: m.section, title: m.title, url: m.url }))
  });
});

// Embed code snippet generator endpoint
app.get('/api/embed-code', (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const protocol = req.protocol || 'http';
  const scriptUrl = `${protocol}://${host}/widget.js`;

  res.json({
    scriptTag: `<script src="${scriptUrl}" async></script>`,
    iframeCode: `<iframe src="${protocol}://${host}" width="420" height="650" style="border:none; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.15);" allow="microphone"></iframe>`
  });
});

// Standalone embeddable widget JS
app.get('/widget.js', (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const protocol = req.protocol || 'http';
  const serverBase = `${protocol}://${host}`;

  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
(function() {
  if (document.getElementById('baust-chatbot-widget-container')) return;

  const container = document.createElement('div');
  container.id = 'baust-chatbot-widget-container';
  container.innerHTML = \`
    <style>
      #baust-chat-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%);
        color: #ffffff;
        border: 2px solid #52b788;
        box-shadow: 0 10px 25px rgba(27, 67, 50, 0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        z-index: 999999;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      #baust-chat-btn:hover {
        transform: scale(1.08) rotate(5deg);
        box-shadow: 0 14px 30px rgba(27, 67, 50, 0.55);
      }
      #baust-chat-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 16px;
        height: 16px;
        background: #e63946;
        border: 2px solid #fff;
        border-radius: 50%;
      }
      #baust-chat-frame {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 400px;
        height: 600px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 120px);
        border: none;
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        z-index: 999998;
        display: none;
        transition: all 0.3s ease;
        background: #ffffff;
      }
      @media (max-width: 480px) {
        #baust-chat-btn {
          bottom: 16px;
          right: 16px;
          width: 54px;
          height: 54px;
        }
        #baust-chat-frame {
          bottom: 80px;
          right: 10px;
          left: 10px;
          width: calc(100vw - 20px);
          height: calc(100dvh - 100px);
          max-width: 100vw;
          max-height: 100dvh;
          border-radius: 16px;
        }
      }
    </style>
    <button id="baust-chat-btn" title="Chat with BAUST AI Assistant" aria-label="Open BAUST Chatbot">
      <img src="${serverBase}/logo.png" alt="BAUST" style="width:38px; height:38px; object-fit:contain;" onerror="this.outerHTML='💬'">
      <span id="baust-chat-badge"></span>
    </button>
    <iframe id="baust-chat-frame" src="${serverBase}/?embed=true" allow="microphone"></iframe>
  \`;
  document.body.appendChild(container);

  const btn = document.getElementById('baust-chat-btn');
  const frame = document.getElementById('baust-chat-frame');
  let isOpen = false;

  btn.addEventListener('click', function() {
    isOpen = !isOpen;
    frame.style.display = isOpen ? 'block' : 'none';
    btn.innerHTML = isOpen ? '✕' : '<img src="${serverBase}/logo.png" alt="BAUST" style="width:38px; height:38px; object-fit:contain;"><span id="baust-chat-badge"></span>';
  });
})();
  `);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  🎓 BAUST AI Chatbot & Knowledge Server is Live!  `);
    console.log(`  🌐 Website URL : http://localhost:${PORT}        `);
    console.log(`  📦 Embed Widget: http://localhost:${PORT}/widget.js `);
    console.log(`====================================================`);
  });
}

module.exports = app;
