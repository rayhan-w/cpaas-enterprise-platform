document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const messagesList = document.getElementById('messages-list');
  const chatContainer = document.getElementById('chat-container');
  const welcomeHero = document.getElementById('welcome-hero');
  const btnVoice = document.getElementById('btn-voice');
  const btnClear = document.getElementById('btn-clear');
  const btnKnowledge = document.getElementById('btn-knowledge');
  const btnEmbed = document.getElementById('btn-embed');
  const modalKnowledge = document.getElementById('modal-knowledge');
  const modalEmbed = document.getElementById('modal-embed');
  const kbCategoriesGrid = document.getElementById('kb-categories-grid');
  const kbSearchInput = document.getElementById('kb-search-input');

  let kbDataCache = null;
  let isThinking = false;

  // Auto-resize textarea
  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  // Handle Enter key for sending
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  // Quick Chips Click
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q) {
        sendMessage(q);
      }
    });
  });

  let chatHistory = [];

  // Clear Chat
  btnClear.addEventListener('click', () => {
    messagesList.innerHTML = '';
    chatHistory = [];
    welcomeHero.style.display = 'block';
  });

  // Form Submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text || isThinking) return;

    userInput.value = '';
    userInput.style.height = 'auto';
    sendMessage(text);
  });

  async function sendMessage(text) {
    if (welcomeHero) welcomeHero.style.display = 'none';

    // 1. Append User Message & Track History
    appendMessage(text, 'user');
    chatHistory.push({ role: 'user', content: text });

    // 2. Show Typing Indicator
    isThinking = true;
    const typingElem = showTypingIndicator();
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory.slice(-8)
        })
      });

      const data = await res.json();
      typingElem.remove();
      isThinking = false;

      if (data && data.reply) {
        appendMessage(data.reply, 'bot', data.sources);
        chatHistory.push({ role: 'model', content: data.reply });
      } else {
        appendMessage('দুঃখিত, কোনো ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'bot');
      }
    } catch (err) {
      console.error('Chat error:', err);
      typingElem.remove();
      isThinking = false;
      appendMessage('দুঃখিত, সার্ভারের সাথে যোগাযোগ করা সম্ভব হয়নি।', 'bot');
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function appendMessage(content, sender, sources = []) {
    const row = document.createElement('div');
    row.className = `message-row ${sender}-row`;

    const avatar = document.createElement('div');
    avatar.className = `msg-avatar ${sender}-avatar`;
    avatar.innerHTML = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<img src="logo.png" alt="BAUST" class="bot-msg-logo">';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';

    if (sender === 'user') {
      bubble.textContent = content;
    } else {
      // Parse markdown
      bubble.innerHTML = marked.parse(content);

      // Add actions (copy, speak)
      const actions = document.createElement('div');
      actions.className = 'msg-actions';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-msg-action';
      copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(content);
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy', 2000);
      });

      let isSpeaking = false;
      const speakBtn = document.createElement('button');
      speakBtn.className = 'btn-msg-action';
      speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
      speakBtn.addEventListener('click', () => {
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
          speakBtn.classList.remove('speaking');
          isSpeaking = false;
        } else {
          window.speechSynthesis.cancel();
          speakBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
          speakBtn.classList.add('speaking');
          isSpeaking = true;
          speakText(content, () => {
            speakBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
            speakBtn.classList.remove('speaking');
            isSpeaking = false;
          });
        }
      });

      actions.appendChild(copyBtn);
      if ('speechSynthesis' in window) {
        actions.appendChild(speakBtn);
      }
      bubble.appendChild(actions);
    }

    if (sender === 'user') {
      row.appendChild(bubble);
      row.appendChild(avatar);
    } else {
      row.appendChild(avatar);
      row.appendChild(bubble);
    }

    messagesList.appendChild(row);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'message-row bot-row typing-row';
    row.innerHTML = `
      <div class="msg-avatar bot-avatar"><img src="logo.png" alt="BAUST" class="bot-msg-logo"></div>
      <div class="typing-bubble">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messagesList.appendChild(row);
    return row;
  }

  // Voice Input (Speech-to-Text)
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.interimResults = false;

    let isRecording = false;

    btnVoice.addEventListener('click', () => {
      if (isRecording) {
        recognition.stop();
      } else {
        try {
          recognition.start();
          btnVoice.classList.add('recording');
          btnVoice.title = 'Listening... Click to stop';
          isRecording = true;
        } catch (e) {
          console.error(e);
        }
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      btnVoice.classList.remove('recording');
      isRecording = false;
      sendMessage(transcript);
    };

    recognition.onerror = () => {
      btnVoice.classList.remove('recording');
      isRecording = false;
    };

    recognition.onend = () => {
      btnVoice.classList.remove('recording');
      isRecording = false;
    };
  } else {
    btnVoice.style.display = 'none';
  }

  // Text-to-Speech (Multilingual Voice Synthesis Engine)
  function cleanTextForSpeech(text) {
    if (!text) return '';
    return text
      .replace(/https?:\/\/\S+/g, '') // remove URLs
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [title](url) -> title
      .replace(/\|[^|\n]+\|/g, ' ') // clean table pipes
      .replace(/[-*#_`~>]/g, ' ') // remove markdown markers
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
      .replace(/\s+/g, ' ')
      .trim();
  }

  function speakText(rawText, onEndCallback) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = cleanTextForSpeech(rawText);
    if (!clean) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const isBangla = /[\u0980-\u09FF]/.test(clean);
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = isBangla ? 'bn-BD' : 'en-US';
    utterance.rate = isBangla ? 0.95 : 1.0;
    utterance.pitch = 1.0;

    // Load available voices
    const voices = window.speechSynthesis.getVoices();
    if (isBangla) {
      const bnVoice = voices.find(v => (v.lang && v.lang.toLowerCase().includes('bn')) || (v.name && (v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'))));
      if (bnVoice) utterance.voice = bnVoice;
    } else {
      const enVoice = voices.find(v => (v.lang && v.lang.toLowerCase().includes('en')) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Zira')));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // Modals Logic
  function openModal(modal) {
    modal.classList.add('active');
  }

  function closeModal(modal) {
    modal.classList.remove('active');
  }

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-close');
      const target = document.getElementById(id);
      if (target) closeModal(target);
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal(e.target);
    }
  });

  // Open Knowledge Base Modal
  btnKnowledge.addEventListener('click', async () => {
    openModal(modalKnowledge);
    if (!kbDataCache) {
      try {
        const res = await fetch('/api/knowledge');
        kbDataCache = await res.json();
        renderKbGrid(kbDataCache.categories);
      } catch (err) {
        console.error('KB fetch error:', err);
      }
    }
  });

  function renderKbGrid(categories) {
    kbCategoriesGrid.innerHTML = '';
    (categories || []).forEach(cat => {
      const card = document.createElement('div');
      card.className = 'kb-card';
      card.innerHTML = `
        <h4>${cat.name}</h4>
        <p>${cat.summary}</p>
      `;
      card.addEventListener('click', () => {
        closeModal(modalKnowledge);
        sendMessage(`Tell me about ${cat.name}`);
      });
      kbCategoriesGrid.appendChild(card);
    });
  }

  if (kbSearchInput) {
    kbSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      if (!kbDataCache) return;
      const filtered = kbDataCache.categories.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.summary.toLowerCase().includes(q)
      );
      renderKbGrid(filtered);
    });
  }

  // Open Embed Code Modal
  btnEmbed.addEventListener('click', async () => {
    openModal(modalEmbed);
    try {
      const res = await fetch('/api/embed-code');
      const data = await res.json();
      if (data) {
        document.getElementById('embed-script-code').textContent = data.scriptTag;
        document.getElementById('embed-iframe-code').textContent = data.iframeCode;
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Copy Buttons in Modal
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const codeElem = document.getElementById(targetId);
      if (codeElem) {
        navigator.clipboard.writeText(codeElem.textContent);
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy', 2000);
      }
    });
  });
});
