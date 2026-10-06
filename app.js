/**
 * ZORVI AI — Next-Generation Multi-Mockup Architecture (v2.0)
 * High-UX / Ultra-Fidelity Interactive State Engine & Live Co-Creation Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Core Reactive State Store
  // =========================================================================
  const state = {
    // Navigation state
    activeVariant: 'split', // 'split' | 'zen' | 'bento' | 'cinematic'
    activeCompanionView: null, // null | 'dashboard' | 'audit' | 'roi'
    theme: localStorage.getItem('zorvi_theme') || 'light',
    deviceViewport: 'mac', // 'mac' | 'phone'

    // Mockup 1 (Split Studio) Step State
    splitStep: 1,
    splitMaxStep: 5,

    // Mockup 2 (Zen Flow) Step State
    zenStep: 1,
    zenMaxStep: 5,

    // Mockup 4 (Cinematic Carousel) Step State
    cinematicStep: 1,
    cinematicMaxStep: 5,

    // User Configuration Matrix
    archetype: 'creator', // 'creator' | 'startup' | 'agency' | 'enterprise'
    brand: {
      name: 'Zorvi AI',
      domain: 'zorvi.ai',
      primary: '#E1352A',
      secondary: '#1E232E',
      accent: '#FFF6F4',
      glow: '#FF6B4A',
      font: 'Plus Jakarta Sans',
      voice: ['Professional', 'Bold']
    },
    audience: {
      persona: 'b2b-founders',
      toneValue: 2,
      depthValue: 3
    },
    copilot: 'growth', // 'growth' | 'storyteller' | 'authority'

    // Flow Timer
    elapsedSeconds: 48,
    timerInterval: null,

    // Audit gallery manifest & lightbox state
    manifest: [],
    filteredManifest: [],
    activeModalIndex: 0
  };

  // Archetype dictionary
  const ARCHETYPES = {
    creator: {
      title: 'Solo Creator & Influencer',
      badge: 'High Velocity',
      summary: 'Reels, Viral Hooks, X Threads',
      channels: ['Instagram Reels', 'X / Twitter', 'YouTube Shorts']
    },
    startup: {
      title: 'Startup & Growth Team',
      badge: 'B2B Reach',
      summary: 'LinkedIn Thought Leadership, SEO Blogs, Product Announcements',
      channels: ['LinkedIn', 'SEO Blog', 'Substack Newsletter']
    },
    agency: {
      title: 'Agency & Multi-Brand',
      badge: 'Multi-Tenant',
      summary: 'Client Workspaces, Approval Queues, Bulk Batch Scheduling',
      channels: ['Client Workspaces', 'Multi-Brand Calendar', 'White-Label Decks']
    },
    enterprise: {
      title: 'Full Content Suite',
      badge: 'Enterprise',
      summary: 'Automated Remotion Video, Dual LLM Pipelines, WordPress/Ghost',
      channels: ['Remotion GPU Video', 'Omni-Channel API', 'Enterprise CMS']
    }
  };

  // Copilot dictionary
  const COPILOTS = {
    growth: {
      name: 'The Growth Strategist',
      engine: 'GPT-4o Engine',
      badge: '⚡ The Growth Strategist (GPT-4o)',
      focus: 'Algorithmic reach, virality hooks, audience retention'
    },
    storyteller: {
      name: 'The Visual Storyteller',
      engine: 'Gemini + Remotion Video',
      badge: '🎬 The Visual Storyteller (Remotion GPU)',
      focus: 'Vertical 9:16 reels, video storyboards, motion graphics'
    },
    authority: {
      name: 'The Industry Authority',
      engine: 'Dual LLM Hybrid',
      badge: '📚 The Industry Authority (Dual LLM)',
      focus: 'SEO long-form publications, deep research, whitepapers'
    }
  };

  // Preset Brands Knowledge Base
  const BRAND_DATABASE = {
    'zorvi.ai': {
      name: 'Zorvi AI',
      domain: 'zorvi.ai',
      primary: '#E1352A',
      secondary: '#1E232E',
      accent: '#FFF6F4',
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
      secondary: '#191919',
      accent: '#FFFFFF',
      glow: '#666666',
      font: 'Outfit',
      voice: ['Friendly', 'Conversational']
    }
  };

  // Tone Label Matrix
  const TONE_LABELS = {
    1: 'Direct & Concise',
    2: 'Analytical & Action-Oriented',
    3: 'Balanced & Conversational',
    4: 'Story-Driven & Inspiring',
    5: 'Deeply Narrative & Empathetic'
  };

  const DEPTH_LABELS = {
    1: 'Casual Social Snacks',
    2: 'Punchy Short-Form',
    3: 'High-Authority & Polished',
    4: 'Strategic Frameworks',
    5: 'Academic Whitepapers'
  };

  // Step Meta for Split Studio
  const SPLIT_STEP_META = {
    1: {
      badge: 'Step 1 of 5',
      time: '⚡ ~45s to first campaign',
      title: 'What is your primary content objective?',
      btnText: 'Continue'
    },
    2: {
      badge: 'Step 2 of 5',
      time: '⚡ ~35s remaining',
      title: 'Instant Brand Extraction & Guidelines',
      btnText: 'Confirm Brand'
    },
    3: {
      badge: 'Step 3 of 5',
      time: '⚡ ~20s remaining',
      title: 'Audience & Tone Intelligence Matrix',
      btnText: 'Lock Audience'
    },
    4: {
      badge: 'Step 4 of 5',
      time: '⚡ ~10s remaining',
      title: 'Select Your AI Creative Copilot',
      btnText: 'Generate First Campaign'
    },
    5: {
      badge: 'Step 5 of 5',
      time: '✨ Instant Magic Payoff!',
      title: 'Your Custom Campaign is Ready to Ship',
      btnText: 'Launch Workspace'
    }
  };

  // Cinematic Step Meta
  const CINEMATIC_META = {
    1: {
      eyebrow: 'YOUR CREATIVE UNIVERSE',
      title: 'Define your brand distribution universe',
      desc: 'Select your primary creator archetype to begin crafting omni-channel campaigns.'
    },
    2: {
      eyebrow: 'BRAND IDENTITY & HARMONY',
      title: 'Extract palette, typography and brand voice',
      desc: 'Zorvi AI parses your website in 350ms flat. Zero 3-minute blocking screens.'
    },
    3: {
      eyebrow: 'AUDIENCE PERSONA RADAR',
      title: 'Who is your highest-value target audience?',
      desc: 'One interactive slider replaces the 10-question survey of the legacy flow.'
    },
    4: {
      eyebrow: 'CREATIVE ENSEMBLE',
      title: 'Pair with your dedicated AI Copilot',
      desc: 'Dual LLM intelligence with Remotion automated video rendering on demand.'
    },
    5: {
      eyebrow: 'THE PREMIERE MOMENT',
      title: '3 publish-ready campaigns synthesized',
      desc: 'Staged directly into your Content Pipeline. Zero empty state shock.'
    }
  };

  // =========================================================================
  // 2. DOM Elements Cache
  // =========================================================================
  const body = document.body;
  const themeSwitchBtn = document.getElementById('themeSwitchBtn');
  const stopwatchDisplay = document.getElementById('stopwatchDisplay');
  const brandHomeLink = document.getElementById('brandHomeLink');

  // Variant Switcher Pills
  const variantPills = document.querySelectorAll('.variant-pill');
  const stageVariantSplit = document.getElementById('stageVariantSplit');
  const stageVariantZen = document.getElementById('stageVariantZen');
  const stageVariantBento = document.getElementById('stageVariantBento');
  const stageVariantCinematic = document.getElementById('stageVariantCinematic');

  // Companion Nav Buttons & Stages
  const compButtons = document.querySelectorAll('.comp-btn');
  const stageCompanionDashboard = document.getElementById('stageCompanionDashboard');
  const stageCompanionAudit = document.getElementById('stageCompanionAudit');
  const stageCompanionROI = document.getElementById('stageCompanionROI');

  // Device Toggle
  const btnToggleMac = document.getElementById('btnToggleMac');
  const btnTogglePhone = document.getElementById('btnTogglePhone');
  const deviceFrameShell = document.getElementById('deviceFrameShell');

  // Split Studio Controls
  const splitStepBadge = document.getElementById('splitStepBadge');
  const splitTimeEst = document.getElementById('splitTimeEst');
  const splitStepHeading = document.getElementById('splitStepHeading');
  const splitProgressBar = document.getElementById('splitProgressBar');
  const splitDotsRow = document.getElementById('splitDotsRow');
  const splitDotButtons = splitDotsRow ? splitDotsRow.querySelectorAll('.step-dot-btn') : [];
  const splitPanels = document.querySelectorAll('.cockpit-step-panel');
  const btnSplitBack = document.getElementById('btnSplitBack');
  const btnSplitContinue = document.getElementById('btnSplitContinue');
  const btnSplitContinueText = document.getElementById('btnSplitContinueText');
  const splitStepIndicator = document.getElementById('splitStepIndicator');
  const btnSplitEnterWorkspace = document.getElementById('btnSplitEnterWorkspace');

  // Step 1: Archetypes
  const archetypeCards = document.querySelectorAll('.card-archetype-item');

  // Step 2: Brand Extraction
  const splitBrandUrlInput = document.getElementById('splitBrandUrlInput');
  const btnSplitExtractBrand = document.getElementById('btnSplitExtractBrand');
  const presetChips = document.querySelectorAll('.preset-pill-chip');
  const splitSwatchPrimary = document.getElementById('splitSwatchPrimary');
  const splitHexPrimary = document.getElementById('splitHexPrimary');
  const splitSwatchSecondary = document.getElementById('splitSwatchSecondary');
  const splitHexSecondary = document.getElementById('splitHexSecondary');
  const splitVoiceChips = document.querySelectorAll('#splitVoiceChips .v-chip');

  // Step 3: Audience Matrix
  const personaCards = document.querySelectorAll('.persona-card-item');
  const splitToneSlider = document.getElementById('splitToneSlider');
  const splitDepthSlider = document.getElementById('splitDepthSlider');
  const splitToneLabel = document.getElementById('splitToneLabel');
  const splitDepthLabel = document.getElementById('splitDepthLabel');

  // Step 4: Copilot
  const copilotCards = document.querySelectorAll('.copilot-card-box');

  // Step 5: Summary text
  const splitBrandDisplay = document.getElementById('splitBrandDisplay');
  const splitCopilotDisplay = document.getElementById('splitCopilotDisplay');

  // Live Canvas Viewport
  const canvasUrlBar = document.getElementById('canvasUrlBar');
  const canvasBrandBadge = document.getElementById('canvasBrandBadge');
  const canvasAvatar = document.getElementById('canvasAvatar');
  const canvasBrandName = document.getElementById('canvasBrandName');
  const canvasArchetypeBadge = document.getElementById('canvasArchetypeBadge');
  const canvasCopilotBadge = document.getElementById('canvasCopilotBadge');
  const canvasLinkedInBody = document.getElementById('canvasLinkedInBody');
  const canvasTwitterBody = document.getElementById('canvasTwitterBody');
  const canvasVideoBody = document.getElementById('canvasVideoBody');

  // Zen Flow Controls
  const zenStepBadge = document.getElementById('zenStepBadge');
  const zenProgressPills = document.querySelectorAll('.zen-progress-pills .z-pill');
  const zenSteps = document.querySelectorAll('.zen-stage-step');
  const zenOptionRows = document.querySelectorAll('.zen-option-row');
  const zenUrlInput = document.getElementById('zenUrlInput');
  const btnZenExtract = document.getElementById('btnZenExtract');
  const zenBrandChips = document.querySelectorAll('.z-chip');
  const zenPersonaChips = document.querySelectorAll('.zen-persona-chip');
  const zenToneSlider = document.getElementById('zenToneSlider');
  const zenToneLabel = document.getElementById('zenToneLabel');
  const zenCopCards = document.querySelectorAll('.zen-cop-card');
  const btnZenPrev = document.getElementById('btnZenPrev');
  const btnZenNext = document.getElementById('btnZenNext');
  const btnZenEnterWorkspace = document.getElementById('btnZenEnterWorkspace');

  // Bento Grid Controls
  const bentoArchItems = document.querySelectorAll('.bento-arch-item');
  const bentoPresets = document.querySelectorAll('.b-btn-preset');
  const bentoDemoPills = document.querySelectorAll('.b-demo-pill');
  const bentoCopItems = document.querySelectorAll('.b-cop-item');
  const btnBentoDeployWorkspace = document.getElementById('btnBentoDeployWorkspace');

  // Cinematic Deck Controls
  const cinematicStepNum = document.getElementById('cinematicStepNum');
  const deckTitle = document.getElementById('deckTitle');
  const deckDesc = document.getElementById('deckDesc');
  const deckCards = document.querySelectorAll('.deck-slide-card');
  const btnDeckPrev = document.getElementById('btnDeckPrev');
  const btnDeckNext = document.getElementById('btnDeckNext');
  const dockDots = document.querySelectorAll('.dock-dots-track .dock-dot');

  // Dashboard Controls
  const btnDashReturnMockup = document.getElementById('btnDashReturnMockup');
  const btnDashNewContent = document.getElementById('btnDashNewContent');

  // Audit Lightbox & Gallery
  const auditFilterPills = document.querySelectorAll('.a-filter');
  const auditGridGallery = document.getElementById('auditGridGallery');
  const auditModalBackdrop = document.getElementById('auditModalBackdrop');
  const btnDismissModal = document.getElementById('btnDismissModal');
  const modalStepIdBadge = document.getElementById('modalStepIdBadge');
  const modalScreenTitle = document.getElementById('modalScreenTitle');
  const modalTimestampTag = document.getElementById('modalTimestampTag');
  const modalViewerImg = document.getElementById('modalViewerImg');
  const modalObservedDesc = document.getElementById('modalObservedDesc');
  const modalFrictionDesc = document.getElementById('modalFrictionDesc');
  const modalSolutionDesc = document.getElementById('modalSolutionDesc');
  const modalPageCount = document.getElementById('modalPageCount');
  const btnModalPrev = document.getElementById('btnModalPrev');
  const btnModalNext = document.getElementById('btnModalNext');

  // Toast Container
  const toastHub = document.getElementById('toastHub');

  // =========================================================================
  // 3. Theme Management
  // =========================================================================
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

  if (themeSwitchBtn) {
    themeSwitchBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Obsidian Noir' : 'Warm Cream'} theme`);
    });
  }

  applyTheme(state.theme);

  // =========================================================================
  // 4. View Switching (Mockups & Companion Views)
  // =========================================================================
  const allStages = [
    stageVariantSplit,
    stageVariantZen,
    stageVariantBento,
    stageVariantCinematic,
    stageCompanionDashboard,
    stageCompanionAudit,
    stageCompanionROI
  ];

  function hideAllStages() {
    allStages.forEach(stage => {
      if (stage) {
        stage.style.display = 'none';
        stage.classList.remove('active');
      }
    });
  }

  function activateMockupVariant(variantName) {
    state.activeVariant = variantName;
    state.activeCompanionView = null;

    hideAllStages();

    // Update variant pills
    variantPills.forEach(pill => {
      pill.classList.toggle('active', pill.dataset.variant === variantName);
    });

    // Deactivate companion nav buttons
    compButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected stage
    if (variantName === 'split' && stageVariantSplit) {
      stageVariantSplit.style.display = 'block';
      stageVariantSplit.classList.add('active');
      renderSplitStep(state.splitStep);
    } else if (variantName === 'zen' && stageVariantZen) {
      stageVariantZen.style.display = 'block';
      stageVariantZen.classList.add('active');
      renderZenStep(state.zenStep);
    } else if (variantName === 'bento' && stageVariantBento) {
      stageVariantBento.style.display = 'block';
      stageVariantBento.classList.add('active');
      syncBentoWithState();
    } else if (variantName === 'cinematic' && stageVariantCinematic) {
      stageVariantCinematic.style.display = 'block';
      stageVariantCinematic.classList.add('active');
      renderCinematicStep(state.cinematicStep);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded Mockup ${variantName.toUpperCase()}`);
  }

  function activateCompanionView(viewName) {
    state.activeCompanionView = viewName;

    hideAllStages();

    // Deactivate variant pills
    variantPills.forEach(pill => pill.classList.remove('active'));

    // Activate matching companion button
    compButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    if (viewName === 'dashboard' && stageCompanionDashboard) {
      stageCompanionDashboard.style.display = 'block';
      stageCompanionDashboard.classList.add('active');
    } else if (viewName === 'audit' && stageCompanionAudit) {
      stageCompanionAudit.style.display = 'block';
      stageCompanionAudit.classList.add('active');
      if (state.manifest.length === 0) {
        loadManifestAndRenderGallery();
      }
    } else if (viewName === 'roi' && stageCompanionROI) {
      stageCompanionROI.style.display = 'block';
      stageCompanionROI.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bind variant pills
  variantPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const v = pill.dataset.variant;
      activateMockupVariant(v);
    });
  });

  // Bind companion nav buttons
  compButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      activateCompanionView(view);
    });
  });

  // Brand Home link resets to default Mockup 1
  if (brandHomeLink) {
    brandHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      activateMockupVariant('split');
    });
  }

  // Dashboard return button
  if (btnDashReturnMockup) {
    btnDashReturnMockup.addEventListener('click', () => {
      activateMockupVariant(state.activeVariant || 'split');
    });
  }

  if (btnDashNewContent) {
    btnDashNewContent.addEventListener('click', () => {
      showToast('Opening Zorvi AI Studio creation modal...');
    });
  }

  // =========================================================================
  // 5. Stopwatch Benchmark Tracker
  // =========================================================================
  function startStopwatch() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      state.elapsedSeconds++;
      const mins = Math.floor(state.elapsedSeconds / 60);
      const secs = state.elapsedSeconds % 60;
      if (stopwatchDisplay) {
        stopwatchDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    }, 1000);
  }

  startStopwatch();

  // =========================================================================
  // 6. Reactive Content Generator & Canvas Synchronizer
  // =========================================================================
  function synthesizeCopy() {
    const brandName = state.brand.name;
    const copilotId = state.copilot;
    const toneText = TONE_LABELS[state.audience.toneValue] || 'Balanced';
    const primaryColor = state.brand.primary;

    let linkedInHtml = '';
    let twitterHtml = '';
    let videoHtml = '';

    if (copilotId === 'storyteller') {
      linkedInHtml = `
        <p>Visual storytelling is no longer optional for B2B brands in 2026.</p>
        <br>
        <p>At <strong>${brandName}</strong>, we run video content through automated Remotion render pipelines:</p>
        <p>• 15-second hook reels rendered directly from markdown prompts</p>
        <p>• Zero video editing software or rendering latency</p>
        <p>• Automated brand color grading matched to <span style="color:${primaryColor};font-weight:700;">${primaryColor}</span></p>
        <br>
        <p>Are you building short-form video into your quarterly strategy?</p>
      `;
      twitterHtml = `
        <p><strong>1/4</strong> The biggest bottleneck in video production is rendering latency. 🎬</p>
        <br>
        <p><strong>2/4</strong> With <strong>${brandName}</strong>, Remotion GPU pipelines compile vertical 9:16 reels in under 12 seconds.</p>
        <br>
        <p><strong>3/4</strong> Tone locked: <em>${toneText}</em>. Zero manual keyframing.</p>
      `;
      videoHtml = `
        <p><strong>[Scene 1 • 0-2s] Visual Hook:</strong> High-energy transition with brand accent <em>${brandName}</em>.</p>
        <br>
        <p><strong>[Scene 2 • 3-8s] Core Problem:</strong> "Why spending 4 hours inside video editors is killing your distribution."</p>
        <br>
        <p><strong>[Scene 3 • 9-16s] Remotion Demo:</strong> Live UI render rendering 5 social formats in parallel.</p>
        <br>
        <p><strong>[CTA • 17-20s]:</strong> "Follow ${brandName} for daily AI workflow breakdowns."</p>
      `;
    } else if (copilotId === 'authority') {
      linkedInHtml = `
        <p>The state of omni-channel distribution for modern enterprises:</p>
        <br>
        <p>Why <strong>${brandName}</strong> replaced fragmented point solutions with an integrated AI Content Studio:</p>
        <p>1. Dual LLM verification (GPT-4o + Gemini 1.5 side-by-side)</p>
        <p>2. Strict brand governance adhering to ${state.brand.font} typography</p>
        <p>3. Direct multi-tenant deployment across LinkedIn, X, and Medium</p>
        <br>
        <p>Tone profile: <em>${toneText}</em>. Read our full architectural breakdown below.</p>
      `;
      twitterHtml = `
        <p><strong>1/5</strong> Why most content engines fail at scale: Model Drift. 🧵</p>
        <br>
        <p><strong>2/5</strong> <strong>${brandName}</strong> employs Dual LLM consensus checking. Every claim is cross-referenced before publication.</p>
        <br>
        <p><strong>3/5</strong> High authority. Zero hallucinated metrics.</p>
      `;
      videoHtml = `
        <p><strong>[Scene 1 • 0-3s]:</strong> "How top operators publish 10x more research with zero burnout."</p>
        <br>
        <p><strong>[Scene 2 • 4-10s]:</strong> Flowchart diagram of Dual LLM verification inside <em>${brandName}</em>.</p>
        <br>
        <p><strong>[Scene 3 • 11-18s]:</strong> Automated PDF and whitepaper generation walkthrough.</p>
      `;
    } else {
      // Default: The Growth Strategist
      linkedInHtml = `
        <p>Most content creators spend 10+ hours a week juggling 6 disjointed tools just to ship 3 posts.</p>
        <br>
        <p>Here is what happens when you centralize your AI workspace at <strong>${brandName}</strong>:</p>
        <p>• <strong>Dual LLM Drafting:</strong> GPT-4o for sharp hooks + Gemini 1.5 for comprehensive research.</p>
        <p>• <strong>Instant Video Storytelling:</strong> One-click Remotion rendering for high-retention Reels.</p>
        <p>• <strong>Tone Calibrated:</strong> ${toneText} targeting top decision makers.</p>
        <br>
        <p>Stop managing tools. Start scaling distribution with ${brandName}.</p>
      `;
      twitterHtml = `
        <p><strong>1/4</strong> The biggest bottleneck in modern marketing is the 9-minute friction between an insight and a published asset. 🧵</p>
        <br>
        <p><strong>2/4</strong> Traditional onboarding traps you in 14 screens and 3-minute waiting bars.</p>
        <br>
        <p><strong>3/4</strong> Modern tools optimize for "Time to First Magic Moment." Enter URL → Extract brand → 3 assets ready.</p>
      `;
      videoHtml = `
        <p><strong>[Scene 1 • 0-2s]:</strong> Fast Hook: <em>"Why are you still using 5 different tools for your brand?"</em></p>
        <br>
        <p><strong>[Scene 2 • 3-7s]:</strong> Screen split: 10 browser tabs vs. 1 Zorvi AI workspace.</p>
        <br>
        <p><strong>[Scene 3 • 8-15s]:</strong> Automated Remotion render generating studio captions.</p>
      `;
    }

    return { linkedInHtml, twitterHtml, videoHtml };
  }

  function syncLiveCanvas() {
    const b = state.brand;
    const arch = ARCHETYPES[state.archetype] || ARCHETYPES.creator;
    const cop = COPILOTS[state.copilot] || COPILOTS.growth;
    const copy = synthesizeCopy();

    // Chrome bar
    if (canvasUrlBar) canvasUrlBar.textContent = `app.zorvi.ai/workspace/${b.domain}`;
    if (canvasBrandBadge) canvasBrandBadge.textContent = b.name;

    // Hero details
    if (canvasAvatar) {
      canvasAvatar.textContent = b.name.charAt(0);
      canvasAvatar.style.background = `linear-gradient(135deg, ${b.primary} 0%, ${b.secondary} 100%)`;
    }
    if (canvasBrandName) canvasBrandName.textContent = b.name;
    if (canvasArchetypeBadge) canvasArchetypeBadge.textContent = `${arch.title} Mode`;
    if (canvasCopilotBadge) canvasCopilotBadge.textContent = cop.badge;

    // Generated Copy
    if (canvasLinkedInBody) canvasLinkedInBody.innerHTML = copy.linkedInHtml;
    if (canvasTwitterBody) canvasTwitterBody.innerHTML = copy.twitterHtml;
    if (canvasVideoBody) canvasVideoBody.innerHTML = copy.videoHtml;

    // Summary step 5
    if (splitBrandDisplay) splitBrandDisplay.textContent = b.name;
    if (splitCopilotDisplay) splitCopilotDisplay.textContent = cop.name;
  }

  // =========================================================================
  // 7. Device Viewport Toggling (Mac Desktop vs iPhone Mobile)
  // =========================================================================
  if (btnToggleMac && btnTogglePhone && deviceFrameShell) {
    btnToggleMac.addEventListener('click', () => {
      btnToggleMac.classList.add('active');
      btnTogglePhone.classList.remove('active');
      deviceFrameShell.classList.remove('device-phone');
      deviceFrameShell.classList.add('device-mac');
      state.deviceViewport = 'mac';
      showToast('Switched Live Preview to Desktop Mac');
    });

    btnTogglePhone.addEventListener('click', () => {
      btnTogglePhone.classList.add('active');
      btnToggleMac.classList.remove('active');
      deviceFrameShell.classList.remove('device-mac');
      deviceFrameShell.classList.add('device-phone');
      state.deviceViewport = 'phone';
      showToast('Switched Live Preview to Mobile iPhone 16 Pro');
    });
  }

  // =========================================================================
  // 8. Mockup 1 (Split Studio) Step Navigation
  // =========================================================================
  function renderSplitStep(step) {
    state.splitStep = step;
    const meta = SPLIT_STEP_META[step] || SPLIT_STEP_META[1];

    // Header info
    if (splitStepBadge) splitStepBadge.textContent = meta.badge;
    if (splitTimeEst) splitTimeEst.textContent = meta.time;
    if (splitStepHeading) splitStepHeading.textContent = meta.title;
    if (splitStepIndicator) splitStepIndicator.textContent = `Step ${step} of 5`;
    if (btnSplitContinueText) btnSplitContinueText.textContent = meta.btnText;

    // Progress bar
    if (splitProgressBar) {
      const pct = step * 20;
      splitProgressBar.style.width = `${pct}%`;
    }

    // Step dots
    splitDotButtons.forEach(btn => {
      const s = parseInt(btn.dataset.step, 10);
      btn.classList.remove('active', 'completed');
      if (s === step) btn.classList.add('active');
      else if (s < step) btn.classList.add('completed');
    });

    // Step panels
    splitPanels.forEach(panel => {
      const pId = parseInt(panel.dataset.panel, 10);
      panel.classList.toggle('active', pId === step);
    });

    // Back button state
    if (btnSplitBack) {
      btnSplitBack.disabled = step === 1;
    }

    // Live canvas sync
    syncLiveCanvas();
  }

  if (btnSplitContinue) {
    btnSplitContinue.addEventListener('click', () => {
      if (state.splitStep < state.splitMaxStep) {
        renderSplitStep(state.splitStep + 1);
      } else {
        activateCompanionView('dashboard');
        showToast('🎉 Onboarding completed in 48s! Welcome to Zorvi.');
      }
    });
  }

  if (btnSplitBack) {
    btnSplitBack.addEventListener('click', () => {
      if (state.splitStep > 1) {
        renderSplitStep(state.splitStep - 1);
      }
    });
  }

  splitDotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.dataset.step, 10);
      if (targetStep) renderSplitStep(targetStep);
    });
  });

  if (btnSplitEnterWorkspace) {
    btnSplitEnterWorkspace.addEventListener('click', () => {
      activateCompanionView('dashboard');
      showToast('🚀 Welcome to your Zorvi Workspace with 3 Staged Drafts!');
    });
  }

  // Step 1: Archetype selection
  archetypeCards.forEach(card => {
    card.addEventListener('click', () => {
      archetypeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.archetype = card.dataset.archetype || 'creator';
      syncLiveCanvas();
      showToast(`Selected Archetype: ${ARCHETYPES[state.archetype].title}`);
    });
  });

  // Step 2: Brand extraction
  function updateBrandVisuals(b) {
    state.brand = b;
    if (splitBrandUrlInput) splitBrandUrlInput.value = b.domain;
    if (splitSwatchPrimary) splitSwatchPrimary.style.background = b.primary;
    if (splitHexPrimary) splitHexPrimary.textContent = b.primary;
    if (splitSwatchSecondary) splitSwatchSecondary.style.background = b.secondary;
    if (splitHexSecondary) splitHexSecondary.textContent = b.secondary;

    syncLiveCanvas();
  }

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const bKey = chip.dataset.brand;
      if (BRAND_DATABASE[bKey]) {
        updateBrandVisuals(BRAND_DATABASE[bKey]);
        showToast(`Instant Brand Loaded: ${BRAND_DATABASE[bKey].name}`);
      }
    });
  });

  if (btnSplitExtractBrand && splitBrandUrlInput) {
    btnSplitExtractBrand.addEventListener('click', () => {
      const inputVal = splitBrandUrlInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      btnSplitExtractBrand.textContent = 'Extracting...';
      btnSplitExtractBrand.disabled = true;

      // 350ms instant heuristic match (no 3-minute wait!)
      setTimeout(() => {
        btnSplitExtractBrand.textContent = 'Extract';
        btnSplitExtractBrand.disabled = false;

        const matched = BRAND_DATABASE[inputVal] || {
          name: inputVal.split('.')[0].toUpperCase(),
          domain: inputVal || 'custom.ai',
          primary: '#E1352A',
          secondary: '#1E232E',
          accent: '#FFF6F4',
          glow: '#FF6B4A',
          font: 'Plus Jakarta Sans',
          voice: ['Professional', 'Bold']
        };

        updateBrandVisuals(matched);
        showToast(`Extracted ${matched.name} palette in 350ms! (Zero waiting latency)`);
      }, 350);
    });
  }

  splitVoiceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      syncLiveCanvas();
    });
  });

  // Step 3: Audience Matrix
  personaCards.forEach(card => {
    card.addEventListener('click', () => {
      personaCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.audience.persona = card.dataset.persona;
      syncLiveCanvas();
      showToast('Audience persona updated');
    });
  });

  if (splitToneSlider) {
    splitToneSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.audience.toneValue = val;
      if (splitToneLabel) splitToneLabel.textContent = TONE_LABELS[val];
      syncLiveCanvas();
    });
  }

  if (splitDepthSlider) {
    splitDepthSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state.audience.depthValue = val;
      if (splitDepthLabel) splitDepthLabel.textContent = DEPTH_LABELS[val];
      syncLiveCanvas();
    });
  }

  // Step 4: Copilot
  copilotCards.forEach(card => {
    card.addEventListener('click', () => {
      copilotCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.copilot = card.dataset.agent || 'growth';
      syncLiveCanvas();
      showToast(`AI Copilot: ${COPILOTS[state.copilot].name}`);
    });
  });

  // =========================================================================
  // 9. Mockup 2 (Zen Flow) Keyboard & Step Engine
  // =========================================================================
  function renderZenStep(step) {
    state.zenStep = step;
    if (zenStepBadge) zenStepBadge.textContent = `STEP ${step} OF 5`;

    zenProgressPills.forEach((pill, idx) => {
      pill.classList.toggle('active', idx < step);
    });

    zenSteps.forEach((s, idx) => {
      s.classList.toggle('active', idx + 1 === step);
    });

    if (btnZenPrev) btnZenPrev.disabled = step === 1;
  }

  if (btnZenNext) {
    btnZenNext.addEventListener('click', () => {
      if (state.zenStep < state.zenMaxStep) {
        renderZenStep(state.zenStep + 1);
      } else {
        activateCompanionView('dashboard');
        showToast('🎉 Zen Onboarding Complete! Welcome to Zorvi.');
      }
    });
  }

  if (btnZenPrev) {
    btnZenPrev.addEventListener('click', () => {
      if (state.zenStep > 1) {
        renderZenStep(state.zenStep - 1);
      }
    });
  }

  if (btnZenEnterWorkspace) {
    btnZenEnterWorkspace.addEventListener('click', () => {
      activateCompanionView('dashboard');
      showToast('🚀 Launching Workspace from Zen Flow!');
    });
  }

  zenOptionRows.forEach((row, idx) => {
    row.addEventListener('click', () => {
      zenOptionRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      state.archetype = row.dataset.zenArch || 'creator';
      showToast(`Selected: ${ARCHETYPES[state.archetype].title}`);
      // Auto-advance with pleasant delay
      setTimeout(() => {
        if (state.zenStep === 1) renderZenStep(2);
      }, 300);
    });
  });

  zenBrandChips.forEach(chip => {
    chip.addEventListener('click', () => {
      zenBrandChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const bKey = chip.dataset.zenBrand;
      if (BRAND_DATABASE[bKey]) {
        updateBrandVisuals(BRAND_DATABASE[bKey]);
        if (zenUrlInput) zenUrlInput.value = bKey;
        showToast(`Zen Brand Loaded: ${BRAND_DATABASE[bKey].name}`);
      }
    });
  });

  if (btnZenExtract && zenUrlInput) {
    btnZenExtract.addEventListener('click', () => {
      const inputVal = zenUrlInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const matched = BRAND_DATABASE[inputVal] || {
        name: inputVal.split('.')[0].toUpperCase(),
        domain: inputVal || 'zen.ai',
        primary: '#E1352A',
        secondary: '#1E232E',
        accent: '#FFF6F4',
        glow: '#FF6B4A',
        font: 'Plus Jakarta Sans',
        voice: ['Professional', 'Bold']
      };
      updateBrandVisuals(matched);
      showToast(`Extracted ${matched.name} in 350ms!`);
      setTimeout(() => {
        if (state.zenStep === 2) renderZenStep(3);
      }, 400);
    });
  }

  zenPersonaChips.forEach(chip => {
    chip.addEventListener('click', () => {
      zenPersonaChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      showToast('Audience Persona Selected');
    });
  });

  if (zenToneSlider) {
    zenToneSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (zenToneLabel) zenToneLabel.textContent = TONE_LABELS[val];
    });
  }

  zenCopCards.forEach(card => {
    card.addEventListener('click', () => {
      zenCopCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.copilot = card.dataset.zenCop || 'growth';
      showToast(`Copilot: ${COPILOTS[state.copilot].name}`);
      setTimeout(() => {
        if (state.zenStep === 4) renderZenStep(5);
      }, 350);
    });
  });

  // Global Keyboard Navigation for Zen Flow
  window.addEventListener('keydown', (e) => {
    if (state.activeVariant !== 'zen' || state.activeCompanionView !== null) return;

    // Number keys 1-4
    if (['1', '2', '3', '4'].includes(e.key) && state.zenStep === 1) {
      const idx = parseInt(e.key, 10) - 1;
      if (zenOptionRows[idx]) {
        zenOptionRows[idx].click();
      }
    }

    // Enter key advances
    if (e.key === 'Enter') {
      if (state.zenStep < state.zenMaxStep) {
        renderZenStep(state.zenStep + 1);
      } else {
        activateCompanionView('dashboard');
      }
    }

    // Escape / Backspace goes back
    if (e.key === 'Escape' || (e.key === 'Backspace' && document.activeElement.tagName !== 'INPUT')) {
      if (state.zenStep > 1) {
        renderZenStep(state.zenStep - 1);
      }
    }
  });

  // =========================================================================
  // 10. Mockup 3 (Bento Grid) Interactions
  // =========================================================================
  function syncBentoWithState() {
    bentoArchItems.forEach(item => {
      item.classList.toggle('active', item.dataset.bentoArch === state.archetype);
    });
  }

  bentoArchItems.forEach(item => {
    item.addEventListener('click', () => {
      bentoArchItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      state.archetype = item.dataset.bentoArch || 'creator';
      showToast(`Bento Archetype: ${ARCHETYPES[state.archetype].title}`);
    });
  });

  bentoPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      bentoPresets.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const bName = btn.textContent.trim();
      if (BRAND_DATABASE[bName]) {
        updateBrandVisuals(BRAND_DATABASE[bName]);
        showToast(`Bento Brand: ${bName}`);
      }
    });
  });

  bentoDemoPills.forEach(pill => {
    pill.addEventListener('click', () => {
      bentoDemoPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      showToast('Audience Target Updated');
    });
  });

  bentoCopItems.forEach(item => {
    item.addEventListener('click', () => {
      bentoCopItems.forEach(c => c.classList.remove('active'));
      item.classList.add('active');
      showToast('Copilot Strategy Updated');
    });
  });

  if (btnBentoDeployWorkspace) {
    btnBentoDeployWorkspace.addEventListener('click', () => {
      activateCompanionView('dashboard');
      showToast('🚀 Deploying Workspace from Bento Cockpit!');
    });
  }

  // =========================================================================
  // 11. Mockup 4 (Cinematic Carousel) Controls
  // =========================================================================
  function renderCinematicStep(step) {
    state.cinematicStep = step;
    const meta = CINEMATIC_META[step] || CINEMATIC_META[1];

    if (cinematicStepNum) cinematicStepNum.textContent = step;
    if (deckTitle) deckTitle.textContent = meta.title;
    if (deckDesc) deckDesc.textContent = meta.desc;

    deckCards.forEach((c, idx) => {
      c.classList.toggle('active', idx + 1 === step);
    });

    dockDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx + 1 === step);
    });

    if (btnDeckPrev) btnDeckPrev.disabled = step === 1;
  }

  if (btnDeckNext) {
    btnDeckNext.addEventListener('click', () => {
      if (state.cinematicStep < state.cinematicMaxStep) {
        renderCinematicStep(state.cinematicStep + 1);
      } else {
        activateCompanionView('dashboard');
        showToast('🎉 Cinematic Flow Completed!');
      }
    });
  }

  if (btnDeckPrev) {
    btnDeckPrev.addEventListener('click', () => {
      if (state.cinematicStep > 1) {
        renderCinematicStep(state.cinematicStep - 1);
      }
    });
  }

  deckCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      deckCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      showToast(`Selected Slide ${idx + 1}`);
    });
  });

  // =========================================================================
  // 12. Forensic Audit Gallery & Lightbox Modal (All 33 Screens)
  // =========================================================================
  const FALLBACK_MANIFEST = [
    { id: 'step_00', file: 'step_00_email_verification.jpg', title: 'Email Verification Notice', timestamp: '00:00', progress: 'Pre-Onboarding', category: 'Auth', description: 'Initial verification screen requiring email confirmation before entering workspace.', friction: 'External email dependency before product access.', solution: 'Passwordless 1-click Google OAuth entry.' },
    { id: 'step_01', file: 'step_01_signin_signup.jpg', title: 'Sign In / Product Capabilities', timestamp: '00:05', progress: 'Pre-Onboarding', category: 'Auth', description: 'Hero screen highlighting Zorvi features (AI Generation, Multi-brand, Remotion video, Pitch decks).', friction: 'Standard credentials entry.', solution: 'Kept clean with OAuth 1-click.' },
    { id: 'step_02', file: 'step_02_credentials_input.jpg', title: 'User Credentials Entry', timestamp: '00:15', progress: 'Pre-Onboarding', category: 'Auth', description: 'User entering credentials manually.', friction: 'Manual form completion.', solution: 'One-click sign up.' },
    { id: 'step_03', file: 'step_03_goal_focus_selection.jpg', title: 'Goal: What do you want to create?', timestamp: '00:30', progress: '9% (3m left)', category: 'Intent', description: 'Wizard Step 1: Broad focus selection (Social Media, Blog Content, Video Content, Everything).', friction: 'Selecting Everything triggers an overwhelming deluge of sub-questions.', solution: 'Step 1: 4 Creator Archetypes with smart defaults.' },
    { id: 'step_04', file: 'step_04_more_details_multiselect.jpg', title: 'More Details: Granular Deliverables', timestamp: '00:45', progress: '18% (3m left)', category: 'Intent', description: 'Step 2: 15+ checkboxes across Social Platforms, Blog Types, and Video Types.', friction: 'High cognitive load; forces user to configure sub-options too early.', solution: 'Pre-configured defaults with smart presets.' },
    { id: 'step_05', file: 'step_05_account_type.jpg', title: 'Account Type: How will you be working?', timestamp: '00:55', progress: '27% (2m left)', category: 'Intent', description: 'Step 3: Personal (Solo creator), Company (Team), Agency (Multiple clients).', friction: 'Separate screen for a 1-click question.', solution: 'Unified directly into Archetype selector.' },
    { id: 'step_06', file: 'step_06_role_selection.jpg', title: 'About You: What is your role?', timestamp: '01:03', progress: '36% (2m left)', category: 'Intent', description: 'Step 4: Role selection (Business Owner, Marketing Manager, Creator, Founder, HR, Other).', friction: 'Redundant qualification screen.', solution: 'Merged into Step 1.' },
    { id: 'step_07', file: 'step_07_team_size.jpg', title: 'Team Size: Scale of organization', timestamp: '01:08', progress: '45% (2m left)', category: 'Intent', description: 'Step 5: Just me, 2-10, 11-50, 50+.', friction: 'Redundant organizational scale question.', solution: 'Inferred from Archetype.' },
    { id: 'step_08', file: 'step_08_current_tools.jpg', title: 'Current Tools: Competitor Ecosystem', timestamp: '01:17', progress: '64% (1m left)', category: 'Intent', description: 'Step 6: 18 tool badges (Buffer, Hootsuite, ChatGPT, Claude, Jasper, etc.) plus search/add.', friction: 'Internal market research with zero value to user.', solution: 'Removed from gating flow.' },
    { id: 'step_09', file: 'step_09_brand_url_input.jpg', title: 'Create Brand: URL Input', timestamp: '01:25', progress: '73% (1m left)', category: 'Brand', description: 'Step 7: Enter website URL (zorvi.ai) for automatic AI extraction.', friction: 'Triggers heavy synchronous scraper.', solution: 'Step 2: Instant URL scraper with preset chips.' },
    { id: 'step_10', file: 'step_10_brand_analysis_wait_1.jpg', title: 'Brand Analysis: Connecting & Screenshot', timestamp: '01:34', progress: '73% (1m left)', category: 'Latency Blocker', description: 'AI connects to website; displays Estimated time remaining: 3m 0s.', friction: 'SEVERE BLOCKER: User forced to wait 1-3 minutes looking at progress bar.', solution: 'Async background processing + optimistic UI.' },
    { id: 'step_11', file: 'step_11_brand_analysis_wait_2.jpg', title: 'Brand Analysis: Colors & Font Extraction', timestamp: '01:49', progress: '73% (1m left)', category: 'Latency Blocker', description: 'Extracts screenshot, colors, and typography.', friction: 'Notice: This usually takes 1-2 minutes.', solution: 'Instant heuristic color swatches in 350ms.' },
    { id: 'step_12', file: 'step_12_brand_voice_typography.jpg', title: 'Brand Voice & Typography Review', timestamp: '02:03', progress: '73% (1m left)', category: 'Brand', description: 'Step 8: Review Plus Jakarta Sans fonts, 7 voice tones, and 10 adjective tags.', friction: 'Massive administrative form presented before creating any content.', solution: 'Interactive live card with quick tone chips.' },
    { id: 'step_13', file: 'step_13_brand_voice_tones.jpg', title: 'Brand Voice: Selecting Tone Tags', timestamp: '02:12', progress: '73% (1m left)', category: 'Brand', description: 'User selects Professional, Bold, Visionary.', friction: 'Form fatigue.', solution: 'Smart default chips.' },
    { id: 'step_14', file: 'step_14_creating_brand_loader.jpg', title: 'Creating Brand Animation', timestamp: '02:18', progress: '73% (1m left)', category: 'Latency Blocker', description: 'Creating your brand workspace animation.', friction: 'Additional spinner latency.', solution: 'Instant optimistic transition.' },
    { id: 'step_15', file: 'step_15_audience_quiz_q1.jpg', title: 'Audience Quiz Q1/10: TikTok Demographics', timestamp: '02:24', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Step 10: Age range on TikTok (13-17, 18-24, 25-34, Other).', friction: 'SURVEY FATIGUE: Beginning of a 10-question sequential survey.', solution: 'Step 3: 1 unified Audience & Tone Matrix.' },
    { id: 'step_16', file: 'step_16_audience_quiz_q2.jpg', title: 'Audience Quiz Q2/10: Instagram Reels Format', timestamp: '02:33', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Preferred Reels content (Entertainment, Educational, Trends, Tutorials).', friction: 'Repetitive platform-by-platform interrogation.', solution: 'Included in Step 3 Matrix.' },
    { id: 'step_17', file: 'step_17_audience_quiz_q3.jpg', title: 'Audience Quiz Q3/10: Short-Form Video Tone', timestamp: '02:40', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Video tone question.', friction: 'Redundant with brand voice settings.', solution: 'Consolidated into Step 3.' },
    { id: 'step_18', file: 'step_18_audience_quiz_q4.jpg', title: 'Audience Quiz Q4/10: LinkedIn Professional Level', timestamp: '02:48', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Entry-level, Manager, C-Suite targeting.', friction: 'Another survey step.', solution: 'Replaced with Persona chips.' },
    { id: 'step_19', file: 'step_19_audience_quiz_q5.jpg', title: 'Audience Quiz Q5/10: LinkedIn Industry Focus', timestamp: '02:56', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Technology, Finance, Creative, Healthcare.', friction: 'Survey fatigue keeps user at 82%.', solution: 'Archetype-driven defaults.' },
    { id: 'step_20', file: 'step_20_audience_quiz_q6.jpg', title: 'Audience Quiz Q6/10: Facebook Content Format', timestamp: '03:04', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Facebook community post preferences.', friction: 'Low relevance for B2B users.', solution: 'Eliminated entirely.' },
    { id: 'step_21', file: 'step_21_audience_quiz_q7.jpg', title: 'Audience Quiz Q7/10: SaaS on Facebook Frustrations', timestamp: '03:10', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Bizarre auto-generated question about SaaS pain points on Facebook.', friction: 'High confusion and low relevance.', solution: 'Eliminated entirely.' },
    { id: 'step_22', file: 'step_22_audience_quiz_q8.jpg', title: 'Audience Quiz Q8/10: X Tone and Brevity', timestamp: '03:18', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Snarky, Informative, Meme-heavy, Thought leadership.', friction: '8 questions deep without seeing product.', solution: 'Tone slider covers this intuitively.' },
    { id: 'step_23', file: 'step_23_audience_quiz_q9_q10.jpg', title: 'Audience Quiz Q9 & Q10: Final Survey Steps', timestamp: '03:26', progress: '82% (1m left)', category: 'Survey Quiz', description: 'Final two questions of the 10-question gauntlet.', friction: 'Progress bar frozen at 82% across 10 screens.', solution: 'Replaced with 1 interactive matrix.' },
    { id: 'step_24', file: 'step_24_persona_generation_wait.jpg', title: 'Persona Generation Loading Screen', timestamp: '03:32', progress: '82% (1m left)', category: 'Latency Blocker', description: 'Building your audience personas (Progress: 60%).', friction: 'Another spinner delaying the user.', solution: 'Real-time client synthesis.' },
    { id: 'step_25', file: 'step_25_persona_review_1.jpg', title: 'Persona Review: Tech Innovators', timestamp: '03:42', progress: '82% (1m left)', category: 'Brand', description: 'Generated persona details card review.', friction: 'Informational display requiring extra next clicks.', solution: 'Embedded into Step 3 preview.' },
    { id: 'step_26', file: 'step_26_persona_review_2.jpg', title: 'Persona Review: Marketing Strategists', timestamp: '03:52', progress: '82% (1m left)', category: 'Brand', description: 'Second persona card review.', friction: 'More reading before product use.', solution: 'Pre-staged into workspace.' },
    { id: 'step_27', file: 'step_27_invite_team.jpg', title: 'Invite Team Members Screen', timestamp: '04:02', progress: '91% (1m left)', category: 'Auth', description: 'Step 12: Invite teammates by email before seeing product value.', friction: 'Premature virality ask.', solution: 'Moved to workspace settings.' },
    { id: 'step_28', file: 'step_28_dashboard_arrival.jpg', title: 'Arrival on Zorvi Home Dashboard', timestamp: '04:06', progress: '100% Completed', category: 'Product Tour', description: 'Empty dashboard with zero drafts, zero review, zero published.', friction: 'EMPTY STATE SHOCK: No dopamine or pre-generated content.', solution: 'Step 5 generates 3 drafts waiting in queue.' },
    { id: 'step_29', file: 'step_29_tour_step_1_ai_briefing.jpg', title: 'Dashboard Tour 1/9: AI Briefing Tooltip', timestamp: '04:08', progress: 'Tour 1/9', category: 'Product Tour', description: 'Create your first piece of content modal over dashboard.', friction: '9-step modal obstacle course.', solution: 'Direct value delivery.' },
    { id: 'step_30', file: 'step_30_tour_step_2_editor.jpg', title: 'Dashboard Tour 2/9: Editor Overview', timestamp: '04:14', progress: 'Tour 2/9', category: 'Product Tour', description: 'Tooltips explaining prompt generation.', friction: 'Cognitive overload after 10-minute setup.', solution: 'Contextual on-demand tooltips.' },
    { id: 'step_31', file: 'step_31_tour_step_3_assets.jpg', title: 'Dashboard Tour 3/9: Asset Library', timestamp: '04:19', progress: 'Tour 3/9', category: 'Product Tour', description: 'Pointing to empty asset library.', friction: 'Empty folder syndrome.', solution: 'Pre-populated pipeline.' },
    { id: 'step_32', file: 'step_32_final_dashboard_state.jpg', title: 'Final Workspace State (Zorvi AI v1.7.0)', timestamp: '04:24', progress: 'Workspace Ready', category: 'Product Tour', description: 'Complete Zorvi UI with sidebar, content pipeline, upcoming publishes, plans.', friction: 'User has spent nearly 10 minutes and still has 0 active drafts in pipeline.', solution: 'Full pre-populated workspace.' }
  ];

  async function loadManifestAndRenderGallery() {
    try {
      const res = await fetch('screenshots/manifest.json');
      if (res.ok) {
        state.manifest = await res.json();
      } else {
        throw new Error('Manifest not found');
      }
    } catch (e) {
      state.manifest = FALLBACK_MANIFEST;
    }

    state.filteredManifest = [...state.manifest];
    renderAuditGrid(state.filteredManifest);
  }

  function renderAuditGrid(items) {
    if (!auditGridGallery) return;
    auditGridGallery.innerHTML = '';

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'audit-card-item';
      card.innerHTML = `
        <div class="audit-img-wrap">
          <img src="screenshots/steps/${item.file}" alt="${item.title}" loading="lazy">
          <span class="audit-badge-step">${item.id.replace('_', ' ').toUpperCase()}</span>
          <span class="audit-time-tag">${item.timestamp}</span>
        </div>
        <div class="audit-info-body">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <div class="audit-friction-alert">⚠️ Friction: ${item.friction}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightboxModal(index, items);
      });

      auditGridGallery.appendChild(card);
    });
  }

  // Filter Pills for Audit Gallery
  auditFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      auditFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.category;

      if (cat === 'all') {
        state.filteredManifest = [...state.manifest];
      } else {
        state.filteredManifest = state.manifest.filter(m => m.category.toLowerCase().includes(cat.toLowerCase()));
      }
      renderAuditGrid(state.filteredManifest);
    });
  });

  // Lightbox Modal Dialog
  function openLightboxModal(index, list) {
    const items = list || state.filteredManifest;
    state.activeModalIndex = index;
    const item = items[index];
    if (!item || !auditModalBackdrop) return;

    if (modalStepIdBadge) modalStepIdBadge.textContent = item.id.toUpperCase();
    if (modalScreenTitle) modalScreenTitle.textContent = item.title;
    if (modalTimestampTag) modalTimestampTag.textContent = `${item.timestamp} (${item.progress})`;
    if (modalViewerImg) modalViewerImg.src = `screenshots/steps/${item.file}`;
    if (modalObservedDesc) modalObservedDesc.textContent = item.description;
    if (modalFrictionDesc) modalFrictionDesc.textContent = item.friction;
    if (modalSolutionDesc) modalSolutionDesc.textContent = item.solution || 'Consolidated and solved in the next-generation 5-step flow.';
    if (modalPageCount) modalPageCount.textContent = `${index + 1} of ${items.length}`;

    if (btnModalPrev) btnModalPrev.disabled = index === 0;
    if (btnModalNext) btnModalNext.disabled = index === items.length - 1;

    auditModalBackdrop.style.display = 'flex';
  }

  function closeLightboxModal() {
    if (auditModalBackdrop) auditModalBackdrop.style.display = 'none';
  }

  if (btnDismissModal) btnDismissModal.addEventListener('click', closeLightboxModal);
  if (auditModalBackdrop) {
    auditModalBackdrop.addEventListener('click', (e) => {
      if (e.target === auditModalBackdrop) closeLightboxModal();
    });
  }

  if (btnModalPrev) {
    btnModalPrev.addEventListener('click', () => {
      if (state.activeModalIndex > 0) {
        openLightboxModal(state.activeModalIndex - 1, state.filteredManifest);
      }
    });
  }

  if (btnModalNext) {
    btnModalNext.addEventListener('click', () => {
      if (state.activeModalIndex < state.filteredManifest.length - 1) {
        openLightboxModal(state.activeModalIndex + 1, state.filteredManifest);
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (auditModalBackdrop && auditModalBackdrop.style.display === 'flex') {
      if (e.key === 'Escape') closeLightboxModal();
      if (e.key === 'ArrowLeft' && state.activeModalIndex > 0) {
        openLightboxModal(state.activeModalIndex - 1, state.filteredManifest);
      }
      if (e.key === 'ArrowRight' && state.activeModalIndex < state.filteredManifest.length - 1) {
        openLightboxModal(state.activeModalIndex + 1, state.filteredManifest);
      }
    }
  });

  // =========================================================================
  // 13. Toast Hub Utility
  // =========================================================================
  function showToast(message) {
    if (!toastHub) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    toastHub.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  // =========================================================================
  // 14. Initial Bootstrap
  // =========================================================================
  activateMockupVariant('split');
  syncLiveCanvas();
});
