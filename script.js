/* ==========================================================================
   CYBERSECURITY MASTER CLASSROOM - INTERACTIVE SCRIPT
   Author & Creator: Raunak Raj
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initTopicNavigation();
  initSearchFilter();
  initPasswordTester();
  initScamSimulator();
  initCyberQuiz();
});

/* 1. Scroll Progress Bar - Throttled for 60fps Smooth Mobile Scrolling */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const progress = (window.scrollY / totalHeight) * 100;
          progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* 2. Topic Navigation & Active Scroll Observer - Smooth & Non-Intrusive */
function initTopicNavigation() {
  const chips = document.querySelectorAll('.topic-chip');
  const sections = document.querySelectorAll('.subtopic-card');
  const scrollWrapper = document.querySelector('.topics-scroll-wrapper');

  if (!sections.length || !chips.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -50% 0px',
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        chips.forEach(chip => {
          if (chip.getAttribute('href') === `#${id}`) {
            chip.classList.add('active');
            // Gently scroll chip into view only if out of visible bounds of topic nav bar
            if (scrollWrapper && isOutOfView(chip, scrollWrapper)) {
              scrollWrapper.scrollTo({
                left: chip.offsetLeft - scrollWrapper.clientWidth / 2 + chip.clientWidth / 2,
                behavior: 'smooth'
              });
            }
          } else {
            chip.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

function isOutOfView(element, container) {
  const elemLeft = element.offsetLeft;
  const elemRight = elemLeft + element.clientWidth;
  const containerLeft = container.scrollLeft;
  const containerRight = containerLeft + container.clientWidth;
  return (elemLeft < containerLeft || elemRight > containerRight);
}

/* 3. Real-Time Search Filter */
function initSearchFilter() {
  const searchInput = document.getElementById('searchInput');
  const cards = document.querySelectorAll('.subtopic-card');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  });
}

/* 4. Password Strength Meter Lab */
function initPasswordTester() {
  const input = document.getElementById('pwdInput');
  const fill = document.getElementById('pwdMeterFill');
  const feedback = document.getElementById('pwdFeedback');

  if (!input || !fill || !feedback) return;

  input.addEventListener('input', () => {
    const val = input.value;
    if (!val) {
      fill.style.width = '0%';
      feedback.textContent = 'Type a sample password to test strength...';
      feedback.style.color = 'var(--text-muted)';
      return;
    }

    let score = 0;
    if (val.length >= 8) score += 25;
    if (val.length >= 12) score += 15;
    if (/[A-Z]/.test(val)) score += 20;
    if (/[0-9]/.test(val)) score += 20;
    if (/[^A-Za-z0-9]/.test(val)) score += 20;

    fill.style.width = `${score}%`;

    if (score < 40) {
      fill.style.background = 'var(--rose-red)';
      feedback.textContent = '⚠️ Weak Password! Easy for hackers to guess or crack using automated scripts.';
      feedback.style.color = 'var(--rose-red)';
    } else if (score < 75) {
      fill.style.background = 'var(--accent-gold)';
      feedback.textContent = '⚡ Moderate Password! Add numbers, uppercase letters, and symbols like @#$% to strengthen.';
      feedback.style.color = 'var(--accent-gold)';
    } else {
      fill.style.background = 'var(--emerald-green)';
      feedback.textContent = '🛡️ Super Strong Fortress Password! Cyber attackers will have a very tough time breaking this.';
      feedback.style.color = 'var(--emerald-green)';
    }
  });
}

/* 5. Phishing & Scam Spotter Simulator */
const scamScenarios = [
  {
    from: "support@secure-bank-update-verify.com",
    subject: "URGENT: Your account will be locked in 12 hours!",
    body: "Dear User, We detected suspicious logins. Click immediately to enter your password and secret PIN to verify: http://bank-login-update-security.xyz",
    isPhishing: true,
    explanation: "🚩 PHISHING DETECTED! Look at the sender address 'secure-bank-update-verify.com' and urgent threat panic language. Official banks never ask for PINs or passwords via email links!"
  },
  {
    from: "no-reply@official-school-portal.edu",
    subject: "Homework Schedule Update for Next Week",
    body: "Hello Students, Please review the updated class syllabus on the official school website dashboard by logging in via your normal portal.",
    isPhishing: false,
    explanation: "✅ LEGITIMATE EMAIL! It comes from an official school domain (.edu) and asks you to log in through your usual portal without urgent threats or asking for sensitive credentials."
  },
  {
    from: "admin@free-game-diamonds-claim.net",
    subject: "YOU WON 10,000 FREE GAME CREDITS!",
    body: "Congratulations! You have been selected for free Robux/FreeFire Diamonds! Enter your account password and phone OTP to claim right now!",
    isPhishing: true,
    explanation: "🚩 PHISHING DETECTED! Offers that sound too good to be true are traps to steal your gaming accounts and OTPs."
  }
];

let currentScamIdx = 0;

function initScamSimulator() {
  renderScamScenario();
}

function renderScamScenario() {
  const container = document.getElementById('scamDisplay');
  const resultBox = document.getElementById('scamResult');
  if (!container || !resultBox) return;

  const scam = scamScenarios[currentScamIdx];
  resultBox.style.display = 'none';

  container.innerHTML = `
    <div class="email-mockup">
      <div class="email-meta">
        <span><strong>From:</strong> ${scam.from}</span>
        <span><strong>Subject:</strong> ${scam.subject}</span>
      </div>
      <div class="email-body">
        <p>${scam.body}</p>
      </div>
    </div>
    <div class="scam-choices">
      <button class="btn-choice btn-legit" onclick="checkScamChoice(false)">✅ Safe & Real</button>
      <button class="btn-choice btn-phish" onclick="checkScamChoice(true)">🚩 Phishing Scam!</button>
    </div>
  `;
}

window.checkScamChoice = function(userGuessedPhishing) {
  const scam = scamScenarios[currentScamIdx];
  const resultBox = document.getElementById('scamResult');
  if (!resultBox) return;

  const isCorrect = (userGuessedPhishing === scam.isPhishing);
  resultBox.style.display = 'block';

  if (isCorrect) {
    resultBox.style.background = 'rgba(16, 185, 129, 0.15)';
    resultBox.style.border = '1px solid var(--emerald-green)';
    resultBox.style.color = 'var(--emerald-green)';
    resultBox.innerHTML = `<strong>🎉 EXCELLENT EYE! You got it right!</strong><br>${scam.explanation}`;
  } else {
    resultBox.style.background = 'rgba(244, 63, 94, 0.15)';
    resultBox.style.border = '1px solid var(--rose-red)';
    resultBox.style.color = 'var(--rose-red)';
    resultBox.innerHTML = `<strong>❌ OOPS! CAUGHT IN THE TRAP!</strong><br>${scam.explanation}`;
  }

  setTimeout(() => {
    currentScamIdx = (currentScamIdx + 1) % scamScenarios.length;
    renderScamScenario();
  }, 4500);
};

/* 6. Cyber Security Guardian Quiz - 15 COMPREHENSIVE QUESTIONS */
const quizQuestions = [
  {
    q: "1. What primary purpose does Cybersecurity serve?",
    options: ["To speed up internet connection", "To protect computers, networks, and personal data from digital attacks", "To design video games", "To buy products online"],
    answer: 1
  },
  {
    q: "2. What does the 'S' in 'HTTPS://' stand for when visiting websites?",
    options: ["System", "Secure", "Server", "Speed"],
    answer: 1
  },
  {
    q: "3. Which three components form the foundational CIA Triad of Cybersecurity?",
    options: ["Computers, Internet, Apps", "Confidentiality, Integrity, Availability", "Control, Intelligence, Action", "Code, Information, Access"],
    answer: 1
  },
  {
    q: "4. What should you do if an online stranger asks for your home address or school name?",
    options: ["Share it if they seem friendly", "Refuse immediately and tell a trusted adult", "Give a fake address", "Post it in public chat"],
    answer: 1
  },
  {
    q: "5. What is Multi-Factor Authentication (MFA)?",
    options: ["Using the same password twice", "An extra layer of security such as an OTP code sent to your phone", "Sharing passwords with best friends", "Changing your username daily"],
    answer: 1
  },
  {
    q: "6. Is it safe to enter passwords or bank details while connected to free open public Wi-Fi?",
    options: ["Yes, public Wi-Fi is always encrypted", "No, attackers can intercept unencrypted network traffic", "Yes, if the Wi-Fi speed is fast", "Only if using incognito tab"],
    answer: 1
  },
  {
    q: "7. What is the official Indian Cyber Crime Emergency Helpline number for financial fraud?",
    options: ["100", "1930", "911", "1098"],
    answer: 1
  },
  {
    q: "8. In the T.H.I.N.K. before you post rule, what does the letter 'T' stand for?",
    options: ["Is it True?", "Is it Trendy?", "Is it Total?", "Is it Technical?"],
    answer: 0
  },
  {
    q: "9. What is 'Cyber Grooming'?",
    options: ["Cleaning your computer keyboard", "When an online stranger builds trust to manipulate a young person", "Installing antivirus updates", "Editing social media profile pictures"],
    answer: 1
  },
  {
    q: "10. Why is downloading illegal or pirated game mods dangerous?",
    options: ["It reduces screen brightness", "They frequently carry malware, keyloggers, and trojans", "It changes game background music", "It uses up battery faster"],
    answer: 1
  },
  {
    q: "11. What is a 'Phishing Scam'?",
    options: ["Catching fish on a digital game", "Fake messages designed to trick you into revealing secret passwords or money", "A type of internet router", "A new computer programming language"],
    answer: 1
  },
  {
    q: "12. What should you NEVER share with anyone over the phone or SMS?",
    options: ["Your favorite color", "Your One-Time Password (OTP) and PIN", "Your favorite movie", "Your homework topic"],
    answer: 1
  },
  {
    q: "13. How does a Virtual Private Network (VPN) help keep you safe on public networks?",
    options: ["It speeds up your processor", "It creates an encrypted tunnel for your internet traffic", "It deletes all your photos", "It turns off screen notifications"],
    answer: 1
  },
  {
    q: "14. What is the recommended first response to Cyberbullying?",
    options: ["Bully them back with mean comments", "Don't respond, take screenshots, block them, and tell an adult", "Delete your computer", "Keep it a secret"],
    answer: 1
  },
  {
    q: "15. What official portal can citizens use to report cybercrimes in India online?",
    options: ["google.com", "cybercrime.gov.in", "wikipedia.org", "onlinegaming.com"],
    answer: 1
  }
];

let userAnswers = {};

function initCyberQuiz() {
  const quizForm = document.getElementById('cyberQuizForm');
  if (!quizForm) return;

  let html = '';
  quizQuestions.forEach((item, qIdx) => {
    html += `
      <div class="quiz-card" id="quizCard_${qIdx}">
        <div class="quiz-question">${item.q}</div>
        <div class="quiz-options">
          ${item.options.map((opt, oIdx) => `
            <button type="button" class="quiz-option-btn" onclick="selectQuizOption(${qIdx}, ${oIdx})">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  });

  html += `<button type="button" class="quiz-submit-btn" onclick="submitCyberQuiz()">Submit 15-Question Quiz • Check Score</button>`;
  html += `<div id="quizResultScore" style="display:none; text-align:center; margin-top:1.5rem; font-size:1.25rem; font-weight:800;"></div>`;

  quizForm.innerHTML = html;
}

window.selectQuizOption = function(qIdx, oIdx) {
  userAnswers[qIdx] = oIdx;
  const card = document.getElementById(`quizCard_${qIdx}`);
  if (!card) return;

  const buttons = card.querySelectorAll('.quiz-option-btn');
  buttons.forEach((btn, idx) => {
    if (idx === oIdx) {
      btn.style.borderColor = 'var(--primary-cyan)';
      btn.style.background = 'rgba(6, 182, 212, 0.2)';
      btn.style.color = '#ffffff';
    } else {
      btn.style.borderColor = 'var(--border-light)';
      btn.style.background = 'rgba(255, 255, 255, 0.03)';
      btn.style.color = 'var(--text-main)';
    }
  });
};

window.submitCyberQuiz = function() {
  let score = 0;
  quizQuestions.forEach((item, qIdx) => {
    const card = document.getElementById(`quizCard_${qIdx}`);
    const buttons = card.querySelectorAll('.quiz-option-btn');
    const userSelected = userAnswers[qIdx];

    buttons.forEach((btn, idx) => {
      if (idx === item.answer) {
        btn.classList.add('selected-correct');
      } else if (idx === userSelected && userSelected !== item.answer) {
        btn.classList.add('selected-wrong');
      }
    });

    if (userSelected === item.answer) {
      score++;
    }
  });

  const scoreDiv = document.getElementById('quizResultScore');
  if (scoreDiv) {
    scoreDiv.style.display = 'block';
    if (score === quizQuestions.length) {
      scoreDiv.style.color = 'var(--emerald-green)';
      scoreDiv.innerHTML = `🏆 PERFECT SCORE! ${score}/${quizQuestions.length} — You are an Official Certified Cyber Guardian!`;
    } else if (score >= 11) {
      scoreDiv.style.color = 'var(--accent-gold)';
      scoreDiv.innerHTML = `⭐ GREAT JOB! You scored ${score}/${quizQuestions.length}. Review the highlighted answers above to get 100%!`;
    } else {
      scoreDiv.style.color = 'var(--rose-red)';
      scoreDiv.innerHTML = `📘 GOOD ATTEMPT! You scored ${score}/${quizQuestions.length}. Read through the notes once more and try again!`;
    }
  }
};
