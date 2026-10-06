/**
 * Zorvi AI — Next-Gen 5-Step Onboarding Architecture
 * State Machine, Interactive Controls, and Live AI Preview Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Core State
  // -------------------------------------------------------------------------
  const state = {
    currentStep: 1,
    totalSteps: 5,
    currentView: 'wizard',
    theme: localStorage.getItem('zorvi_theme') || 'light',
    
    // User selections
    archetype: 'creator',
    brand: {
      name: 'Zorvi AI',
      domain: 'zorvi.ai',
      primaryColor: '#E1352A',
      secondaryColor: '#1E232E',
      font: 'Plus Jakarta Sans',
      voice: ['Professional', 'Bold']
    },
    audience: {
      persona: 'b2b-founders',
      toneValue: 2,
      depthValue: 3,
      hook: 'contrarian'
    },
    copilot: 'growth',
    channels: ['linkedin', 'x', 'instagram'],

    // Timer benchmark
    elapsedSeconds: 0,
    timerInterval: null,

    // Screenshots manifest cache
    manifest: []
  };

  // Step Meta Data for Progress Tracker
  const stepMeta = {
    1: {
      title: 'What is your primary content objective?',
      badge: 'Step 1 of 5',
      percent: 20,
      timeRemaining: '~45 seconds',
      hint: 'Step 1 of 5: Creator Archetype & Intent',
      btnText: 'Continue'
    },
    2: {
      title: 'Instant Brand Extraction & Guidelines',
      badge: 'Step 2 of 5',
      percent: 40,
      timeRemaining: '~35 seconds',
      hint: 'Step 2 of 5: Brand Palette & Voice',
      btnText: 'Confirm Brand'
    },
    3: {
      title: 'Interactive Audience & Tone Matrix',
      badge: 'Step 3 of 5',
      percent: 60,
      timeRemaining: '~20 seconds',
      hint: 'Step 3 of 5: Audience Persona & Tone',
      btnText: 'Lock Audience'
    },
    4: {
      title: 'Select Your AI Creative Copilot',
      badge: 'Step 4 of 5',
      percent: 80,
      timeRemaining: '~10 seconds',
      hint: 'Step 4 of 5: Copilot Engine & Distribution',
      btnText: 'Generate My First Campaign'
    },
    5: {
      title: 'Your Custom Campaign is Ready to Ship',
      badge: 'Step 5 of 5',
      percent: 100,
      timeRemaining: '0 seconds!',
      hint: 'Step 5 of 5: Publish or Launch Workspace',
      btnText: 'Launch Workspace'
    }
  };

  // -------------------------------------------------------------------------
  // 2. DOM Elements
  // -------------------------------------------------------------------------
  const body = document.body;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const viewTabs = document.querySelectorAll('.nav-tab');
  const viewPanels = {
    wizard: document.getElementById('viewWizard'),
    dashboard: document.getElementById('viewDashboard'),
    inspector: document.getElementById('viewInspector'),
    analytics: document.getElementById('viewAnalytics')
  };

  // Wizard Elements
  const stepCounterBadge = document.getElementById('stepCounterBadge');
  const stepHeaderTitle = document.getElementById('stepHeaderTitle');
  const timeRemaining = document.getElementById('timeRemaining');
  const progressFill = document.getElementById('progressFill');
  const navDots = document.querySelectorAll('.steps-nav-dots .dot');
  const stepPanes = document.querySelectorAll('.step-pane');
  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnNextStep = document.getElementById('btnNextStep');
  const btnNextStepText = document.getElementById('btnNextStepText');
  const stepHelpHint = document.getElementById('stepHelpHint');
  const flowTimer = document.getElementById('flowTimer');

  // Step 1 Elements
  const archetypeCards = document.querySelectorAll('.archetype-card');
  const customizerTrigger = document.getElementById('customizerTrigger');
  const customizerBody = document.getElementById('customizerBody');

  // Step 2 Elements
  const brandUrlInput = document.getElementById('brandUrlInput');
  const btnExtractBrand = document.getElementById('btnExtractBrand');
  const presetChips = document.querySelectorAll('.preset-chip');
  const brandNameDisplay = document.getElementById('brandNameDisplay');
  const brandDomainDisplay = document.getElementById('brandDomainDisplay');
  const brandAvatar = document.getElementById('brandAvatar');
  const swatchPrimary = document.getElementById('swatchPrimary');
  const hexPrimary = document.getElementById('hexPrimary');
  const swatchSecondary = document.getElementById('swatchSecondary');
  const hexSecondary = document.getElementById('hexSecondary');
  const displayFont = document.getElementById('displayFont');
  const voiceChips = document.querySelectorAll('.voice-chip');

  // Step 3 Elements
  const personaOptions = document.querySelectorAll('.persona-option-item');
  const toneSlider = document.getElementById('toneSlider');
  const sliderToneValue = document.getElementById('sliderToneValue');
  const depthSlider = document.getElementById('depthSlider');
  const sliderDepthValue = document.getElementById('sliderDepthValue');
  const hookChips = document.querySelectorAll('.hook-chip');
  const synthesizedPersonaText = document.getElementById('synthesizedPersonaText');

  // Step 4 Elements
  const copilotCards = document.querySelectorAll('.copilot-card');

  // Step 5 Elements
  const genBrandTarget = document.getElementById('genBrandTarget');
  const genAgentTarget = document.getElementById('genAgentTarget');
  const btnRegenerateSample = document.getElementById('btnRegenerateSample');
  const btnLaunchWorkspace = document.getElementById('btnLaunchWorkspace');
  const copyButtons = document.querySelectorAll('.copy-btn');
  const scheduleChips = document.querySelectorAll('.btn-schedule-chip');

  // Dashboard View Elements
  const btnRestartWizard = document.getElementById('btnRestartWizard');
  const btnNewContentModal = document.getElementById('btnNewContentModal');

  // Inspector Elements
  const screenshotsGalleryGrid = document.getElementById('screenshotsGalleryGrid');
  const filterPills = document.querySelectorAll('.filter-pill');
  const screenshotModalOverlay = document.getElementById('screenshotModalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalStepId = document.getElementById('modalStepId');
  const modalStepTitle = document.getElementById('modalStepTitle');
  const modalTimestamp = document.getElementById('modalTimestamp');
  const modalDesc = document.getElementById('modalDesc');
  const modalFriction = document.getElementById('modalFriction');
  const modalSolution = document.getElementById('modalSolution');
  const modalCounter = document.getElementById('modalCounter');
  const modalPrevBtn = document.getElementById('modalPrevBtn');
  const modalNextBtn = document.getElementById('modalNextBtn');

  let currentModalIndex = 0;

  // -------------------------------------------------------------------------
  // 3. Theme Management
  // -------------------------------------------------------------------------
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('zorvi_theme', theme);
    if (theme === 'dark') {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
    } else {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    applyTheme(state.theme === 'light' ? 'dark' : 'light');
    showToast(`Switched to ${state.theme} mode`);
  });

  applyTheme(state.theme);

  // -------------------------------------------------------------------------
  // 4. View Switching
  // -------------------------------------------------------------------------
  function switchView(viewName) {
    state.currentView = viewName;
    
    // Tab states
    viewTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === viewName);
    });

    // Panels visibility
    Object.keys(viewPanels).forEach(key => {
      if (viewPanels[key]) {
        viewPanels[key].style.display = key === viewName ? 'block' : 'none';
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchView(tab.dataset.view);
    });
  });

  // -------------------------------------------------------------------------
  // 5. Benchmark Timer
  // -------------------------------------------------------------------------
  function startBenchmarkTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.elapsedSeconds = 0;
    state.timerInterval = setInterval(() => {
      state.elapsedSeconds++;
      const mins = Math.floor(state.elapsedSeconds / 60);
      const secs = state.elapsedSeconds % 60;
      flowTimer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
  }

  startBenchmarkTimer();

  // -------------------------------------------------------------------------
  // 6. Wizard Step Navigation & State Machine
  // -------------------------------------------------------------------------
  function renderStep(step) {
    state.currentStep = step;
    const meta = stepMeta[step];

    // Update Header Info
    stepCounterBadge.textContent = meta.badge;
    stepHeaderTitle.textContent = meta.title;
    timeRemaining.textContent = meta.timeRemaining;
    progressFill.style.width = `${meta.percent}%`;
    progressFill.setAttribute('aria-valuenow', meta.percent);
    stepHelpHint.textContent = meta.hint;
    btnNextStepText.textContent = meta.btnText;

    // Prev Button State
    btnPrevStep.disabled = step === 1;

    // Nav Dots
    navDots.forEach(dot => {
      const dotStep = parseInt(dot.dataset.step, 10);
      dot.classList.remove('active', 'completed');
      if (dotStep === step) {
        dot.classList.add('active');
      } else if (dotStep < step) {
        dot.classList.add('completed');
      }
    });

    // Step Panes
    stepPanes.forEach(pane => {
      pane.classList.remove('active');
      if (parseInt(pane.dataset.stepId, 10) === step) {
        pane.classList.add('active');
      }
    });

    // Step 5 Specific Preparation
    if (step === 5) {
      updateGeneratedContent();
    }
  }

  btnNextStep.addEventListener('click', () => {
    if (state.currentStep < state.totalSteps) {
      renderStep(state.currentStep + 1);
    } else {
      // Completed Step 5 -> Launch Workspace!
      launchWorkspace();
    }
  });

  btnPrevStep.addEventListener('click', () => {
    if (state.currentStep > 1) {
      renderStep(state.currentStep - 1);
    }
  });

  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetStep = parseInt(dot.dataset.step, 10);
      renderStep(targetStep);
    });
  });

  // -------------------------------------------------------------------------
  // 7. Step 1: Archetype Selection
  // -------------------------------------------------------------------------
  archetypeCards.forEach(card => {
    card.addEventListener('click', () => {
      archetypeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.archetype = card.dataset.archetype;
      showToast(`Selected: ${card.querySelector('h3').textContent}`);
    });
  });

  customizerTrigger.addEventListener('click', () => {
    const isHidden = customizerBody.style.display === 'none';
    customizerBody.style.display = isHidden ? 'block' : 'none';
  });

  document.querySelectorAll('.tag-toggle').forEach(tag => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      tag.classList.toggle('active');
      const input = tag.querySelector('input');
      if (input) input.checked = tag.classList.contains('active');
    });
  });

  // -------------------------------------------------------------------------
  // 8. Step 2: Instant Brand Extraction
  // -------------------------------------------------------------------------
  const brandDatabase = {
    'zorvi.ai': {
      name: 'Zorvi AI',
      domain: 'zorvi.ai',
      primary: '#E1352A',
      secondary: '#1E232E',
      accent: '#FFF5F2',
      glow: '#FF6B4A',
      font: 'Plus Jakarta Sans',
      voice: ['Professional', 'Bold']
    },
    'linear.app': {
      name: 'Linear',
      domain: 'linear.app',
      primary: '#5E6AD2',
      secondary: '#0E1015',
      accent: '#F3F4FB',
      glow: '#828DF7',
      font: 'Inter',
      voice: ['Precise', 'Authoritative']
    },
    'stripe.com': {
      name: 'Stripe',
      domain: 'stripe.com',
      primary: '#635BFF',
      secondary: '#0A2540',
      accent: '#F6F9FC',
      glow: '#7A73FF',
      font: 'Plus Jakarta Sans',
      voice: ['Professional', 'Visionary']
    },
    'notion.so': {
      name: 'Notion',
      domain: 'notion.so',
      primary: '#2E2E2E',
      secondary: '#F7F6F3',
      accent: '#FFFFFF',
      glow: '#5C5C5C',
      font: 'Outfit',
      voice: ['Friendly', 'Casual']
    }
  };

  function updateBrandDisplay(b) {
    state.brand = b;
    brandNameDisplay.textContent = b.name;
    brandDomainDisplay.textContent = b.domain;
    brandAvatar.textContent = b.name.charAt(0);
    brandAvatar.style.background = `linear-gradient(135deg, ${b.primary} 0%, ${b.secondary} 100%)`;

    swatchPrimary.style.backgroundColor = b.primary;
    hexPrimary.textContent = b.primary;
    swatchSecondary.style.backgroundColor = b.secondary;
    hexSecondary.textContent = b.secondary;
    displayFont.textContent = b.font;

    // Update active voice chips
    voiceChips.forEach(chip => {
      chip.classList.toggle('active', b.voice.includes(chip.dataset.voice));
    });
  }

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const url = chip.dataset.url;
      brandUrlInput.value = url;
      if (brandDatabase[url]) {
        updateBrandDisplay(brandDatabase[url]);
        showToast(`Instant Brand Loaded: ${brandDatabase[url].name}`);
      }
    });
  });

  btnExtractBrand.addEventListener('click', () => {
    const inputVal = brandUrlInput.value.trim().toLowerCase();
    const spinner = btnExtractBrand.querySelector('.btn-spinner');
    if (spinner) spinner.style.display = 'inline-block';
    btnExtractBrand.disabled = true;

    // Simulate 350ms instant heuristic match (no 3-minute wait!)
    setTimeout(() => {
      if (spinner) spinner.style.display = 'none';
      btnExtractBrand.disabled = false;

      const cleanDomain = inputVal.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const matched = brandDatabase[cleanDomain] || {
        name: cleanDomain.split('.')[0].toUpperCase(),
        domain: cleanDomain,
        primary: '#E1352A',
        secondary: '#1E232E',
        accent: '#FFF5F2',
        glow: '#FF6B4A',
        font: 'Plus Jakarta Sans',
        voice: ['Professional', 'Visionary']
      };

      updateBrandDisplay(matched);
      showToast(`Extracted palette & typography in 380ms! (0s wait)`);
    }, 380);
  });

  voiceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const activeVoices = Array.from(document.querySelectorAll('.voice-chip.active')).map(c => c.dataset.voice);
      state.brand.voice = activeVoices;
    });
  });

  // -------------------------------------------------------------------------
  // 9. Step 3: Audience & Tone Matrix
  // -------------------------------------------------------------------------
  const personaTextMap = {
    'b2b-founders': 'B2B Tech Founders & Marketers',
    'genz-creators': 'Gen-Z Digital Creators & Influencers',
    'growth-marketers': 'Agency Clients & SMB Decision Makers',
    'tech-innovators': 'Software Engineers & Product Architects'
  };

  const toneLabelMap = {
    1: 'Laser-Focused & Direct',
    2: 'Analytical & Action-Oriented',
    3: 'Balanced & Conversational',
    4: 'Story-Driven & Inspirational',
    5: 'Deeply Narrative & Empathetic'
  };

  const depthLabelMap = {
    1: 'Casual & Ultra-Short',
    2: 'Punchy Social Posts',
    3: 'High-Authority & Polished',
    4: 'Strategic Frameworks',
    5: 'Academic & Whitepaper Grade'
  };

  function updateSynthesizedPersona() {
    const personaName = personaTextMap[state.audience.persona] || 'General Audience';
    const toneText = toneLabelMap[state.audience.toneValue] || 'Balanced';
    const depthText = depthLabelMap[state.audience.depthValue] || 'High-Authority';
    const activeHook = document.querySelector('.hook-chip.active')?.textContent || 'Contrarian Insights';

    sliderToneValue.textContent = toneText;
    sliderDepthValue.textContent = depthText;

    synthesizedPersonaText.innerHTML = `<strong>Target:</strong> ${personaName} • <strong>Tone:</strong> ${toneText} (${depthText}) with <em>${activeHook}</em>.`;
  }

  personaOptions.forEach(item => {
    item.addEventListener('click', () => {
      personaOptions.forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      state.audience.persona = item.dataset.persona;
      updateSynthesizedPersona();
    });
  });

  toneSlider.addEventListener('input', (e) => {
    state.audience.toneValue = parseInt(e.target.value, 10);
    updateSynthesizedPersona();
  });

  depthSlider.addEventListener('input', (e) => {
    state.audience.depthValue = parseInt(e.target.value, 10);
    updateSynthesizedPersona();
  });

  hookChips.forEach(chip => {
    chip.addEventListener('click', () => {
      hookChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.audience.hook = chip.dataset.hook;
      updateSynthesizedPersona();
    });
  });

  // -------------------------------------------------------------------------
  // 10. Step 4: AI Copilot & Channel Selection
  // -------------------------------------------------------------------------
  const copilotNames = {
    growth: 'The Growth Strategist',
    storyteller: 'The Visual Storyteller',
    authority: 'The Industry Authority'
  };

  copilotCards.forEach(card => {
    card.addEventListener('click', () => {
      copilotCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.copilot = card.dataset.agent;
      showToast(`Selected Copilot: ${copilotNames[state.copilot]}`);
    });
  });

  // -------------------------------------------------------------------------
  // 11. Step 5: Magic Generation & Preview Tailoring
  // -------------------------------------------------------------------------
  function updateGeneratedContent() {
    genBrandTarget.textContent = state.brand.name;
    genAgentTarget.textContent = copilotNames[state.copilot];

    const contentLinkedIn = document.getElementById('contentLinkedIn');
    const contentTwitter = document.getElementById('contentTwitter');
    const contentVideo = document.getElementById('contentVideo');

    // Tailored content copy based on brand and copilot
    if (state.copilot === 'storyteller') {
      contentLinkedIn.innerHTML = `
        <p>Visual storytelling is no longer optional for B2B brands in 2026.</p>
        <br>
        <p>At <strong>${state.brand.name}</strong>, we run video content through automated Remotion render pipelines:</p>
        <p>• 15-second hook reels rendered directly from markdown prompts</p>
        <p>• Zero video editing software or rendering latency</p>
        <p>• Automated brand color grading matched to ${state.brand.primaryColor}</p>
        <br>
        <p>Are you building short-form video into your quarterly strategy?</p>
      `;
      contentVideo.innerHTML = `
        <p><strong>[Scene 1 • 0-2s] Visual Hook:</strong> High-energy transition with brand accent <em>${state.brand.name}</em>.</p>
        <br>
        <p><strong>[Scene 2 • 3-8s] Core Problem:</strong> "Why spending 4 hours inside video editors is killing your distribution."</p>
        <br>
        <p><strong>[Scene 3 • 9-16s] Remotion Demo:</strong> Live UI render rendering 5 social formats in parallel.</p>
        <br>
        <p><strong>[CTA • 17-20s]:</strong> "Follow ${state.brand.name} for daily AI workflow breakdowns."</p>
      `;
    } else if (state.copilot === 'authority') {
      contentLinkedIn.innerHTML = `
        <p>The state of omni-channel distribution for modern enterprises:</p>
        <br>
        <p>Why <strong>${state.brand.name}</strong> replaced fragmented point solutions with an integrated AI Content Studio:</p>
        <p>1. Dual LLM verification (GPT-4o + Gemini 1.5 side-by-side)</p>
        <p>2. Strict brand governance adhering to ${state.brand.font} typography</p>
        <p>3. Direct multi-tenant deployment across LinkedIn, X, and Medium</p>
        <br>
        <p>Read our full architectural breakdown in the comments.</p>
      `;
    } else {
      // Default Growth Strategist
      contentLinkedIn.innerHTML = `
        <p>Most content creators spend 10+ hours a week juggling 6 disjointed tools just to ship 3 posts.</p>
        <br>
        <p>Here is what happens when you centralize your AI workspace at <strong>${state.brand.name}</strong>:</p>
        <p>1. <strong>Dual LLM Drafting:</strong> GPT-4o for sharp hooks + Gemini 1.5 for comprehensive research.</p>
        <p>2. <strong>Instant Video Storytelling:</strong> One-click Remotion rendering for high-retention Reels.</p>
        <p>3. <strong>Zero Multi-Brand Friction:</strong> Tone of voice locked across every channel automatically.</p>
        <br>
        <p>Stop managing tools. Start scaling distribution with ${state.brand.name}.</p>
        <br>
        <p>#AIContent #CreatorEconomy #GrowthMarketing #SaaS</p>
      `;
    }
  }

  btnRegenerateSample.addEventListener('click', () => {
    btnRegenerateSample.disabled = true;
    showToast('Re-synthesizing campaign variations with Gemini...');
    setTimeout(() => {
      btnRegenerateSample.disabled = false;
      updateGeneratedContent();
      showToast('Fresh campaign assets ready!');
    }, 600);
  });

  // Copy buttons
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const textElem = document.getElementById(targetId);
      if (textElem) {
        navigator.clipboard.writeText(textElem.innerText).then(() => {
          showToast('Copied to clipboard! Ready to publish.');
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
        });
      }
    });
  });

  scheduleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      showToast('Asset queued in calendar! View on Dashboard.');
    });
  });

  function launchWorkspace() {
    showToast('🎉 Onboarding completed in under 55 seconds! Welcome to Zorvi.');
    switchView('dashboard');
  }

  btnLaunchWorkspace.addEventListener('click', launchWorkspace);

  // -------------------------------------------------------------------------
  // 12. Dashboard Interactions
  // -------------------------------------------------------------------------
  btnRestartWizard.addEventListener('click', () => {
    renderStep(1);
    switchView('wizard');
    startBenchmarkTimer();
    showToast('Reset 5-step flow. Ready to test again!');
  });

  btnNewContentModal.addEventListener('click', () => {
    showToast('Opening Zorvi AI Content Studio...');
  });

  document.querySelectorAll('.btn-card-action').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Draft action processed in Zorvi pipeline!');
    });
  });

  // -------------------------------------------------------------------------
  // 13. Original Flow Forensic Inspector (33 Screenshots)
  // -------------------------------------------------------------------------
  async function loadManifestAndRenderGallery() {
    try {
      const res = await fetch('screenshots/manifest.json');
      if (res.ok) {
        state.manifest = await res.json();
      } else {
        throw new Error('Manifest fetch failed');
      }
    } catch (e) {
      console.warn('Could not fetch manifest.json via HTTP (likely local file protocol), using embedded fallback');
      state.manifest = [
        { id: 'step_00', file: 'step_00_email_verification.jpg', title: 'Email Verification Notice', timestamp: '00:00', progress: 'Pre-Onboarding', category: 'Auth', description: 'Initial verification screen requiring email confirmation before entering workspace.', friction: 'External email dependency before product access.', solution: 'Passwordless 1-click entry.' },
        { id: 'step_01', file: 'step_01_signin_signup.jpg', title: 'Sign In / Product Capabilities Overview', timestamp: '00:05', progress: 'Pre-Onboarding', category: 'Auth', description: 'Hero screen highlighting Zorvi features (AI Generation, Multi-brand, Remotion video, Pitch decks).', friction: 'Standard credentials entry.', solution: 'Kept clean with Google OAuth 1-click.' },
        { id: 'step_03', file: 'step_03_goal_focus_selection.jpg', title: 'Goal: What do you want to create?', timestamp: '00:30', progress: '9% (3m left)', category: 'Intent', description: 'Broad focus selection (Social Media, Blog Content, Video Content, Everything).', friction: 'Selecting Everything triggers an overwhelming deluge of sub-questions.', solution: 'Step 1: 4 Creator Archetypes with smart defaults.' },
        { id: 'step_04', file: 'step_04_more_details_multiselect.jpg', title: 'More Details: Granular Deliverables', timestamp: '00:45', progress: '18% (3m left)', category: 'Intent', description: '15+ checkboxes across Social Platforms, Blog Types, and Video Types.', friction: 'High cognitive load; forces user to configure sub-options too early.', solution: 'Pre-configured defaults with optional accordion.' },
        { id: 'step_05', file: 'step_05_account_type.jpg', title: 'Account Type: How will you be working?', timestamp: '00:55', progress: '27% (2m left)', category: 'Intent', description: 'Personal (Solo creator), Company (Team), Agency (Multiple clients).', friction: 'Separate screen for a 1-click question.', solution: 'Unified into Archetype selector.' },
        { id: 'step_06', file: 'step_06_role_selection.jpg', title: 'About You: What is your role?', timestamp: '01:03', progress: '36% (2m left)', category: 'Intent', description: 'Role selection (Business Owner, Marketing Manager, Creator, Founder, HR, Other).', friction: 'Redundant qualification screen.', solution: 'Merged into Step 1.' },
        { id: 'step_07', file: 'step_07_team_size.jpg', title: 'Team Size: Scale of organization', timestamp: '01:08', progress: '45% (2m left)', category: 'Intent', description: 'Just me, 2-10, 11-50, 50+.', friction: 'Redundant organizational scale question.', solution: 'Inferred from Archetype.' },
        { id: 'step_08', file: 'step_08_current_tools.jpg', title: 'Current Tools: Competitor Ecosystem', timestamp: '01:17', progress: '64% (1m left)', category: 'Brand', description: '18 tool badges (Buffer, Hootsuite, ChatGPT, Claude, Jasper, etc.) plus search/add.', friction: 'Internal market research with zero value to user.', solution: 'Removed from gating flow.' },
        { id: 'step_09', file: 'step_09_brand_url_input.jpg', title: 'Create Brand: URL Input', timestamp: '01:25', progress: '73% (1m left)', category: 'Brand', description: 'Enter website URL (zorvi.ai) for automatic AI extraction.', friction: 'Triggers heavy synchronous scraper.', solution: 'Step 2: Instant URL scraper with preset chips.' },
        { id: 'step_10', file: 'step_10_brand_analysis_wait_1.jpg', title: 'Brand Analysis: Connecting & Screenshot', timestamp: '01:34', progress: '73% (1m left)', category: 'Latency Blocker', description: 'AI connects to website; displays Estimated time remaining: 3m 0s.', friction: 'SEVERE BLOCKER: User forced to wait 1-3 minutes looking at progress bar.', solution: 'Async background processing + optimistic UI.' },
        { id: 'step_11', file: 'step_11_brand_analysis_wait_2.jpg', title: 'Brand Analysis: Colors & Font Extraction', timestamp: '01:49', progress: '73% (1m left)', category: 'Latency Blocker', description: 'Extracts screenshot, colors, and typography.', friction: 'Notice: This usually takes 1-2 minutes.', solution: 'Instant heuristic color swatches in 380ms.' },
        { id: 'step_12', file: 'step_12_brand_voice_typography.jpg', title: 'Brand Voice & Typography Review', timestamp: '02:03', progress: '73% (1m left)', category: 'Brand', description: 'Review Plus Jakarta Sans fonts, 7 voice tones, and 10 adjective tags.', friction: 'Massive administrative form presented before creating any content.', solution: 'Interactive live card with quick tone chips.' },
        { id: 'step_15', file: 'step_15_audience_quiz_q1.jpg', title: 'Audience Quiz Q1/10: TikTok Demographics', timestamp: '02:24', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Step 10: Age range on TikTok (13-17, 18-24, 25-34, Other).', friction: 'SURVEY FATIGUE: Beginning of a 10-question sequential survey.', solution: 'Step 3: 1 unified Audience & Tone Matrix.' },
        { id: 'step_16', file: 'step_16_audience_quiz_q2.jpg', title: 'Audience Quiz Q2/10: Instagram Reels Format', timestamp: '02:33', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Preferred Reels content (Entertainment, Educational, Trends, Tutorials).', friction: 'Repetitive platform-by-platform interrogation.', solution: 'Included in Step 3 Matrix.' },
        { id: 'step_21', file: 'step_21_audience_quiz_q7.jpg', title: 'Audience Quiz Q7/10: SaaS on Facebook Frustrations', timestamp: '03:10', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Bizarre auto-generated question about SaaS pain points on Facebook.', friction: 'High confusion and low relevance.', solution: 'Eliminated entirely.' },
        { id: 'step_24', file: 'step_24_persona_generation_wait.jpg', title: 'Persona Generation Loading Screen', timestamp: '03:32', progress: '82% (1m left)', category: 'Latency Blocker', description: 'Building your audience personas (Progress: 60%).', friction: 'Another spinner delaying the user.', solution: 'Real-time client synthesis.' },
        { id: 'step_27', file: 'step_27_invite_team.jpg', title: 'Invite Team Members Screen', timestamp: '04:02', progress: '91% (1m left)', category: 'Auth', description: 'Invite teammates by email before seeing product value.', friction: 'Premature virality ask.', solution: 'Moved to workspace settings.' },
        { id: 'step_28', file: 'step_28_dashboard_arrival.jpg', title: 'Arrival on Zorvi Home Dashboard', timestamp: '04:06', progress: '100% Completed', category: 'Product Tour', description: 'Empty dashboard with zero drafts, zero review, zero published.', friction: 'EMPTY STATE SHOCK: No dopamine or pre-generated content.', solution: 'Step 5 generates 3 drafts waiting in queue.' },
        { id: 'step_29', file: 'step_29_tour_step_1_ai_briefing.jpg', title: 'Dashboard Tour 1/9: AI Briefing Tooltip', timestamp: '04:08', progress: 'Tour 1/9', category: 'Product Tour', description: 'Create your first piece of content modal over dashboard.', friction: '9-step modal obstacle course.', solution: 'Direct value delivery.' },
        { id: 'step_32', file: 'step_32_final_dashboard_state.jpg', title: 'Final Workspace State (Zorvi AI v1.7.0)', timestamp: '04:24', progress: 'Workspace Ready', category: 'Product Tour', description: 'Complete Zorvi UI with sidebar, content pipeline, upcoming publishes, plans.', friction: 'User has spent nearly 10 minutes and still has 0 active drafts in pipeline.', solution: 'Full pre-populated workspace.' }
      ];
    }

    renderGallery(state.manifest);
  }

  function renderGallery(items) {
    screenshotsGalleryGrid.innerHTML = '';
    items.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'screenshot-card';
      card.innerHTML = `
        <div class="screenshot-img-wrap">
          <img src="screenshots/steps/${item.file}" alt="${item.title}" loading="lazy">
          <span class="screenshot-badge-top">${item.id.replace('_', ' ').toUpperCase()}</span>
          <span class="screenshot-time-badge">${item.timestamp}</span>
        </div>
        <div class="screenshot-info">
          <span class="screenshot-category">${item.category} • ${item.progress}</span>
          <h4>${item.title}</h4>
          <p class="screenshot-desc">${item.description}</p>
          <div class="screenshot-footer">
            <span class="friction-tag">⚠️ ${item.friction}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openModal(idx, items);
      });

      screenshotsGalleryGrid.appendChild(card);
    });
  }

  // Filter Pills for Gallery
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.category;
      if (cat === 'all') {
        renderGallery(state.manifest);
      } else {
        const filtered = state.manifest.filter(m => m.category === cat);
        renderGallery(filtered);
      }
    });
  });

  // Modal Lightbox
  let currentFilteredList = [];

  function openModal(index, list) {
    currentFilteredList = list || state.manifest;
    currentModalIndex = index;
    const item = currentFilteredList[index];
    if (!item) return;

    modalStepId.textContent = item.id.toUpperCase();
    modalStepTitle.textContent = item.title;
    modalTimestamp.textContent = `${item.timestamp} (${item.progress})`;
    modalImg.src = `screenshots/steps/${item.file}`;
    modalDesc.textContent = item.description;
    modalFriction.textContent = item.friction;
    modalSolution.textContent = item.solution || 'Consolidated and solved in the optimized 5-step flow.';
    modalCounter.textContent = `${index + 1} of ${currentFilteredList.length}`;

    modalPrevBtn.disabled = index === 0;
    modalNextBtn.disabled = index === currentFilteredList.length - 1;

    screenshotModalOverlay.style.display = 'flex';
  }

  function closeModal() {
    screenshotModalOverlay.style.display = 'none';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  screenshotModalOverlay.addEventListener('click', (e) => {
    if (e.target === screenshotModalOverlay) closeModal();
  });

  modalPrevBtn.addEventListener('click', () => {
    if (currentModalIndex > 0) openModal(currentModalIndex - 1, currentFilteredList);
  });

  modalNextBtn.addEventListener('click', () => {
    if (currentModalIndex < currentFilteredList.length - 1) openModal(currentModalIndex + 1, currentFilteredList);
  });

  // -------------------------------------------------------------------------
  // 14. Toast Notification Utility
  // -------------------------------------------------------------------------
  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  // Initializations
  loadManifestAndRenderGallery();
  renderStep(1);
  updateBrandDisplay(brandDatabase['zorvi.ai']);
  updateSynthesizedPersona();
});
