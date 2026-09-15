/**
 * CORE AITU - Retro Mainframe Presentation Engine (v3)
 * - Official CORE vector logo integrated from /logo
 * - Progress rail starts at 0% on slide 1 and smoothly fills to 100% on slide 12
 * - Removed obsolete audio controls and rotary elements
 * - Clean, distraction-free slide navigation and directory matrix
 */

class PresentationApp {
  constructor(slides) {
    this.slides = slides;
    const urlParams = new URLSearchParams(window.location.search);
    const slideParam = parseInt(urlParams.get("slide"), 10);
    this.currentIndex = (!isNaN(slideParam) && slideParam >= 0 && slideParam < slides.length) ? slideParam : 0;
    this.graphics = null;

    this.viewportEl = document.getElementById("slide-viewport");
    this.counterEl = document.getElementById("slide-counter");
    this.progressFillEl = document.getElementById("slide-progress-fill");
    this.matrixModalEl = document.getElementById("slide-matrix-modal");
    this.matrixGridEl = document.getElementById("slide-matrix-grid");
  }

  init() {
    this.renderAllSlides();
    this.renderMatrixGrid();
    this.bindEvents();
    this.bindHeroSelectorEvents();
    this.updateSlideDisplay();

    // Start 3D procedural graphics
    if (window.MainframeGraphics) {
      this.graphics = new window.MainframeGraphics();
      this.graphics.init();
    }
  }

  renderAllSlides() {
    if (!this.viewportEl) return;
    this.viewportEl.innerHTML = "";

    this.slides.forEach((slide, idx) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = `slide-item ${idx === 0 ? "active" : ""}`;
      slideDiv.id = `slide-${idx}`;

      let innerHtml = "";
      // Slide 1 has no header (clean hero format); Slides 2..12 have clean title without redundant meta/page number
      if (idx > 0) {
        innerHtml += `
          <div class="slide-top-header">
            <div class="slide-title-main">${slide.title}</div>
          </div>
        `;
      }

      innerHtml += this.buildSlideBody(slide, idx);
      slideDiv.innerHTML = innerHtml;
      this.viewportEl.appendChild(slideDiv);
    });
  }

  buildSlideBody(slide, idx) {
    const c = slide.content;

    switch (slide.type) {
      case "hero_title":
      case "title_3d":
        return `
          <div class="hero-slide-container">
            <!-- Official Vector CORE Logo (Line version) prominent & hero-sized -->
            <div class="hero-main-banner">
              <div class="hero-logo-svg">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="8 23 84 20">
                  <g transform="translate(-154.22322, -39.758774)">
                    <g style="fill:#ffffff;fill-opacity:1" transform="translate(-0.57834055,0.43889499)">
                      <path d="m 167.76015,63.573437 v 3.52795 h 14.11076 v -3.52795 z" fill="#ffffff" />
                      <path d="m 167.76015,77.684721 v 3.527433 h 14.11076 v -3.527433 z" fill="#ffffff" />
                      <path d="m 167.76015,67.101387 h -3.52795 v 10.583334 h 3.52795 z" fill="#ffffff" />
                      <path d="m 199.51015,77.684721 h -10.58334 v 3.527433 h 10.58334 z" fill="#ffffff" />
                      <path d="m 188.92681,63.573437 v 3.52795 h 10.58334 v -3.52795 z" fill="#ffffff" />
                      <path d="m 199.51015,67.101387 v 10.583334 h 3.52743 V 67.101387 Z" fill="#ffffff" />
                      <path d="M 188.92681,77.684721 V 67.101387 h -3.52795 v 10.583334 z" fill="#ffffff" />
                      <path d="m 206.56553,67.101387 v 3.52795 3.527434 7.055383 h 3.52795 v -7.055383 h 5.29167 l 5.29166,7.055383 h 3.52744 l -5.29167,-7.055383 h 1.76423 v -3.527434 h -10.58333 v -3.52795 z" fill="#ffffff" />
                      <path d="m 210.09348,63.573437 v 3.52795 h 10.58333 v 3.52795 h 3.52744 v -3.52795 -3.52795 h -3.52744 z" fill="#ffffff" />
                      <path d="m 231.26015,77.684721 v 3.527433 h 14.11076 v -3.527433 z" fill="#ffffff" />
                      <path d="m 231.26015,67.101387 h -3.52795 v 3.52795 3.527434 3.52795 h 3.52795 v -3.52795 h 14.11076 v -3.527434 h -14.11076 z" fill="#ffffff" />
                      <path d="m 231.26015,63.573437 v 3.52795 h 14.11076 v -3.52795 z" fill="#ffffff" />
                      <path d="m 191.74886,69.923437 v 4.938717 h 4.93872 v -4.938717 z" fill="#ffffff" />
                    </g>
                  </g>
                </svg>
              </div>
              <div class="hero-subtitle">${c.subtitle}</div>
              <div class="hero-motto">"${c.motto}"</div>
            </div>
          </div>
        `;

      case "about_grid":
        return `
          <div class="slide-grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1; min-height: 0; height: 100%; align-items: stretch;">
            <!-- Left Column: 3D Holographic Wireframe Orbs Stage -->
            <div class="crt-panel highlight" style="display: flex; flex-direction: column; padding: 10px; height: 100%; min-height: 0; position: relative; overflow: hidden; border: 1px solid var(--c-crt-border);">
              <div class="three-canvas-container" id="ecosystem-3d-canvas" style="flex: 1; width: 100%; height: 100%; min-height: 0; border: none; background: transparent; position: relative; overflow: hidden;"></div>
            </div>

            <!-- Right Column: Lead Overview + Evenly Distributed CORE Acronym Cards -->
            <div style="display: flex; flex-direction: column; gap: 8px; height: 100%; min-height: 0;">
              <div class="crt-panel highlight" style="padding: 10px 14px; flex-shrink: 0;">
                <p class="crt-text" style="font-size: 12.5px; font-weight: 500; color: #ffffff; line-height: 1.45; margin: 0;">
                  ${c.lead}
                </p>
              </div>

              <!-- 4 Acronym Cards evenly filling the exact remaining height -->
              <div style="display: flex; flex-direction: column; gap: 6px; flex: 1; min-height: 0;">
                ${c.acronym.map(item => `
                  <div class="crt-panel" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; padding: 8px 12px; border-left: 3px solid var(--c-red-bright);">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
                      <span style="font-family: var(--font-mono), monospace; font-size: 12.5px; font-weight: 900; color: #ffffff; background: rgba(239, 68, 68, 0.25); border: 1px solid var(--c-red-bright); padding: 1px 6px; border-radius: 2px;">[ ${item.letter} ]</span>
                      <span style="font-family: var(--font-mono), monospace; font-size: 12px; font-weight: 800; color: #ffffff; letter-spacing: 1.2px;">${item.word}</span>
                    </div>
                    <p class="crt-text" style="font-size: 11px; line-height: 1.35; color: var(--c-crt-text-dim); margin: 0;">
                      ${item.desc}
                    </p>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `;

      case "globe_split":
        return `
          <div class="slide-grid-2col">
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div class="crt-panel highlight">
                <div class="panel-header">
                  <span class="panel-title">${c.mission_title}</span>
                  <span class="panel-tag">CORE OBJECTIVE</span>
                </div>
                <p class="crt-text" style="font-size: 17px; font-weight: bold; color: #ffffff; line-height: 1.5;">
                  ${c.mission_text}
                </p>
              </div>
              <div class="crt-panel" style="flex: 1;">
                <div class="panel-header">
                  <span class="panel-title">OPERATIONAL TENETS</span>
                  <span class="panel-tag">GUIDELINES</span>
                </div>
                <ul class="crt-list">
                  ${c.values.map(v => `
                    <li>
                      <div><strong>${v.name}:</strong> ${v.desc}</div>
                    </li>
                  `).join("")}
                </ul>
              </div>
            </div>
            <div class="three-canvas-container" id="opensource-network-canvas">
              <div class="canvas-overlay-label">ОТКРЫТЫЙ СТЕК // ГРАФ ЗАВИСИМОСТЕЙ И КОНТРИБЬЮТОРОВ</div>
            </div>
          </div>
        `;

      case "horizontal_hero_3d":
        return `
          <div class="horizontal-hero-layout">
            <!-- Left Stage: 3D Pedestal & Hero Wardrobe Viewport -->
            <div class="crt-panel highlight hero-stage-panel">
              <!-- Top Quick Hero Selector Tabs -->
              <div class="hero-selector-strip" id="hero-tabs-bar">
                ${c.roles.map((r, rIdx) => `
                  <button class="hero-tab-btn ${rIdx === 0 ? 'active' : ''}" data-hero-idx="${rIdx}">
                    <span class="hero-tab-num">0${rIdx + 1}</span>
                    <span class="hero-tab-title">${r.title.split(' ')[0]}</span>
                  </button>
                `).join('')}
              </div>

              <!-- 3D Pedestal Canvas Container -->
              <div class="three-canvas-container hero-canvas-stage" id="hero-3d-pedestal-canvas">
                <!-- Procedural 3D Canvas injected here -->
              </div>
            </div>

            <!-- Right Dossier: Dynamic Selected Role Specifications -->
            <div class="hero-dossier-col">
              <!-- Lead Horizontal Model Summary Panel -->
              <div class="crt-panel highlight" style="padding: 14px 18px;">
                <div class="panel-header" style="margin-bottom: 8px;">
                  <span class="panel-title">ПРИНЦИП ПЛОСКОЙ КОЛЛЕГИИ</span>
                </div>
                <p class="crt-text" style="font-size: 13.5px; font-weight: 500; color: #ffffff; line-height: 1.55; margin: 0;">
                  ${c.lead}
                </p>
              </div>

              <!-- Live Operative Card (Dynamically updated on selection) -->
              <div class="crt-panel hero-dossier-card" id="hero-dossier-panel" style="flex: 1; padding: 20px 22px; display: flex; flex-direction: column; justify-content: flex-start; border-left: 4px solid var(--c-red-bright);">
                <div style="margin-bottom: 8px;">
                  <span class="dossier-code" id="dossier-code" style="font-family: var(--font-mono); font-size: 13px; font-weight: 900; color: var(--c-red-bright); letter-spacing: 2px;">
                    [ ${c.roles[0].code} ]
                  </span>
                </div>

                <h3 class="dossier-title" id="dossier-title" style="font-family: var(--font-mono); font-size: 21px; font-weight: 900; color: #ffffff; margin: 0 0 12px 0; letter-spacing: 1px;">
                  ${c.roles[0].title}
                </h3>

                <div class="dossier-unit-badge" id="dossier-unit" style="display: inline-block; font-family: var(--font-mono); font-size: 11px; font-weight: 800; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.3); padding: 3px 8px; border-radius: 2px; color: #ffffff; margin-bottom: 16px; letter-spacing: 1px;">
                  НАПРАВЛЕНИЕ: ${c.roles[0].unit}
                </div>

                <p class="crt-text" id="dossier-tasks" style="font-size: 14.5px; line-height: 1.6; color: #ffffff; margin: 0; flex: 1;">
                  ${c.roles[0].tasks}
                </p>
              </div>
            </div>
          </div>
        `;

      case "projects_3d":
        return `
          <div class="slide-grid-2col">
            <div class="three-canvas-container" id="servers-3d-canvas">
              <div class="canvas-overlay-label">COMPUTE NODES & INFRASTRUCTURE // 3D CLUSTER</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div class="crt-panel" style="padding: 12px 16px;">
                <p class="crt-text" style="font-size: 15px; color: #ffffff; font-weight: bold;">
                  ${c.lead}
                </p>
              </div>
              ${c.projects.map(p => `
                <div class="crt-panel" style="flex: 1;">
                  <div class="panel-header">
                    <span class="panel-title">${p.name}</span>
                    <span class="panel-tag">${p.status}</span>
                  </div>
                  <p class="crt-text" style="font-size: 14px;">${p.desc}</p>
                  <div style="font-size: 13px; color: #ffffff; margin-top: 8px;">
                    <strong>STACK:</strong> ${p.tech}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;

      case "events_list":
        return `
          <div class="slide-grid-2col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: 100%; min-height: 0;">
            ${c.events.map(e => `
              <div class="crt-panel highlight" style="display: flex; flex-direction: column; justify-content: center; padding: 20px 22px;">
                <div class="panel-header" style="margin-bottom: 12px;">
                  <span class="panel-title" style="font-size: 14px; letter-spacing: 1.2px; line-height: 1.35;">${e.title}</span>
                  ${e.badge ? `<span class="panel-tag">${e.badge}</span>` : ""}
                </div>
                <p class="crt-text" style="font-size: 14px; line-height: 1.6; color: var(--c-crt-text-dim); margin: 0;">${e.desc}</p>
              </div>
            `).join("")}
          </div>
        `;

      case "culture_matrix":
        return `
          <div class="slide-grid-2col">
            ${c.principles.map((p, pIdx) => `
              <div class="crt-panel">
                <div class="panel-header">
                  <span class="panel-title">${p.title}</span>
                  <span class="panel-tag">TENET 0${pIdx + 1}</span>
                </div>
                <p class="crt-text" style="font-size: 16px; line-height: 1.6;">
                  ${p.desc}
                </p>
              </div>
            `).join("")}
          </div>
        `;

      case "leads_grid":
        return `
          <div class="slide-grid-3col">
            ${c.roles.map(r => `
              <div class="crt-panel">
                <div class="panel-header">
                  <span class="panel-title" style="font-size: 14px;">${r.title}</span>
                  <span class="panel-tag">${r.unit}</span>
                </div>
                <p class="crt-text" style="font-size: 14px;">${r.tasks}</p>
              </div>
            `).join("")}
          </div>
        `;

      case "stats_dashboard":
        return `
          <div class="stats-dashboard-container">
            <!-- Large Top Metric Cards -->
            <div class="stats-metrics-row">
              ${c.metrics.map(m => `
                <div class="stat-metric-card">
                  <div class="stat-number">${m.num}</div>
                  <div class="stat-label">${m.label}</div>
                </div>
              `).join("")}
            </div>

            <!-- Structured 3-Column Guarantees Panel (Fills the lower space cleanly) -->
            <div class="stats-guarantees-grid">
              ${c.highlights.map((h, i) => {
                const titles = ["ОТКРЫТЫЙ ФИНАНСОВЫЙ ЖУРНАЛ", "АКАДЕМИЧЕСКАЯ И ПРАВОВАЯ ЗАЩИТА", "БАЛЛЫ АКТИВИСТАМ SSCI GPA"];
                return `
                  <div class="crt-panel highlight stat-guarantee-card">
                    <div class="panel-header">
                      <span class="panel-title" style="font-size: 13.5px;">${titles[i] || "ГАРАНТИЯ"}</span>
                    </div>
                    <p class="crt-text" style="font-size: 14.5px; color: #ffffff; line-height: 1.6; margin-top: 10px; flex: 1;">
                      ${h}
                    </p>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;

      case "roadmap_timeline":
        return `
          <div class="slide-grid-2col">
            <div class="crt-panel" style="justify-content: center;">
              <div class="panel-header">
                <span class="panel-title">ПЛАН МАСШТАБИРОВАНИЯ (2026–2030)</span>
                <span class="panel-tag">РОАДМАП</span>
              </div>
              <div class="roadmap-timeline">
                ${c.steps.map(s => `
                  <div class="timeline-step ${s.active ? "active" : ""}">
                    <div class="step-phase">${s.phase}</div>
                    <div class="step-desc">${s.desc}</div>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="three-canvas-container" id="orbit-3d-canvas">
              <div class="canvas-overlay-label">PROGRESSION CIRCUIT // COMMIT TREE</div>
            </div>
          </div>
        `;

      case "recruitment_steps":
        return `
          <div style="display: flex; flex-direction: column; gap: 14px; height: 100%;">
            <div class="crt-panel highlight" style="padding: 14px 18px;">
              <p class="crt-text" style="font-size: 17px; color: #ffffff; font-weight: bold;">
                ${c.lead}
              </p>
            </div>
            <div class="slide-grid-4col">
              ${c.stages.map(s => `
                <div class="crt-panel" style="justify-content: flex-start; padding: 20px 18px;">
                  <div style="font-size: 16px; font-weight: bold; color: #ffffff; margin-bottom: 12px; letter-spacing: 0.5px;">
                    ${s.title}
                  </div>
                  <p class="crt-text" style="font-size: 14px; line-height: 1.55;">${s.desc}</p>
                </div>
              `).join("")}
            </div>
          </div>
        `;

      case "outro_terminal":
        const qrList = (c.qr_codes && c.qr_codes.length) ? c.qr_codes : [{ src: "./qr_1.jpg" }, { src: "./qr_2.jpg" }];
        return `
          <div class="slide-grid-2col" style="height: 100%; align-items: stretch;">
            <div class="crt-panel highlight" style="justify-content: center; gap: 20px; padding: 36px 30px;">
              <div style="display: flex; flex-direction: column; gap: 16px; justify-content: center;">
                ${c.channels.map(ch => `
                  <div style="background: rgba(0,0,0,0.5); padding: 16px 20px; border: 1px solid var(--c-crt-border-subtle); display: flex; justify-content: space-between; align-items: center; border-left: 3px solid var(--c-crt-border);">
                    <span style="color: var(--c-crt-muted); font-weight: bold; font-size: 14px; letter-spacing: 1px;">${ch.name}:</span>
                    <span style="color: #ffffff; font-size: 16px; font-weight: bold; font-family: monospace;">${ch.value}</span>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="crt-panel" style="align-items: center; justify-content: center; text-align: center; gap: 22px; padding: 36px 20px;">
              <div class="panel-title" style="font-size: 16px; letter-spacing: 2px;">ТЕРМИНАЛ ДОСТУПА В СООБЩЕСТВО</div>
              <div style="display: flex; flex-direction: row; gap: 16px; justify-content: center; align-items: center; flex-wrap: wrap;">
                ${qrList.map((qr, qIdx) => `
                  <div style="width: 175px; height: 175px; background: #ffffff; border: 3px solid #ffffff; border-radius: 4px; padding: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 18px rgba(255,255,255,0.2);">
                    <img src="${qr.src}" alt="${qr.alt || 'QR Code ' + (qIdx + 1)}" style="width: 100%; height: 100%; object-fit: contain; display: block; border-radius: 2px;">
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `;

      default:
        return `<div class="crt-panel"><p class="crt-text">SLIDE DATA UNAVAILABLE</p></div>`;
    }
  }

  renderMatrixGrid() {
    if (!this.matrixGridEl) return;
    this.matrixGridEl.innerHTML = "";

    this.slides.forEach((slide, idx) => {
      const card = document.createElement("div");
      card.className = `matrix-card ${idx === this.currentIndex ? "current" : ""}`;
      card.innerHTML = `
        <div class="matrix-card-num">${String(idx + 1).padStart(2, "0")} / ${this.slides.length}</div>
        <div class="matrix-card-title">${slide.title}</div>
        <div class="matrix-card-desc">${slide.category}</div>
      `;
      card.addEventListener("click", () => {
        this.goToSlide(idx);
        this.toggleMatrix(false);
      });
      this.matrixGridEl.appendChild(card);
    });
  }

  updateSlideDisplay() {
    const total = this.slides.length;
    const currentNum = this.currentIndex + 1;

    // Update Counter Display
    if (this.counterEl) {
      this.counterEl.textContent = `${String(currentNum).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    }

    // Lower Progress Rail: Starts from 0% on slide 1 (page 1 is starting point)
    if (this.progressFillEl) {
      const pct = total > 1 ? (this.currentIndex / (total - 1)) * 100 : 0;
      this.progressFillEl.style.width = `${pct}%`;
    }

    // Toggle active slide
    const slideEls = document.querySelectorAll(".slide-item");
    slideEls.forEach((el, idx) => {
      if (idx === this.currentIndex) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    // Update Matrix Modal Highlight
    const matrixCards = document.querySelectorAll(".matrix-card");
    matrixCards.forEach((c, idx) => {
      if (idx === this.currentIndex) c.classList.add("current");
      else c.classList.remove("current");
    });

    // If on Horizontal Hero 3D slide, ensure hero events are active and 3D canvas is running
    const currentSlide = this.slides[this.currentIndex];
    if (currentSlide && currentSlide.type === "horizontal_hero_3d") {
      this.bindHeroSelectorEvents();
      if (this.graphics) {
        if (!document.querySelector("#hero-3d-pedestal-canvas canvas")) {
          this.graphics.initHorizontalModel("hero-3d-pedestal-canvas");
        }
        if (typeof this.graphics.setHero === "function") {
          this.graphics.setHero(this.currentHeroIndex || 0);
        }
      }
    }

    // If on Slide 2 (about_grid), ensure 3D ecosystem orbs canvas is running
    if (currentSlide && currentSlide.type === "about_grid") {
      if (this.graphics) {
        if (!document.querySelector("#ecosystem-3d-canvas canvas")) {
          this.graphics.initEcosystemOrbs("ecosystem-3d-canvas");
        }
      }
    }
  }

  _triggerCRTFlicker(callback) {
    const crtUnit = document.querySelector('.crt-unit');
    if (!crtUnit) { callback(); return; }
    crtUnit.classList.add('crt-transition');
    callback();
    setTimeout(() => {
      crtUnit.classList.remove('crt-transition');
    }, 220);
  }

  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) {
      this._triggerCRTFlicker(() => {
        this.currentIndex++;
        this.updateSlideDisplay();
      });
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this._triggerCRTFlicker(() => {
        this.currentIndex--;
        this.updateSlideDisplay();
      });
    }
  }

  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this._triggerCRTFlicker(() => {
        this.currentIndex = index;
        this.updateSlideDisplay();
      });
    }
  }

  toggleMatrix(forceState) {
    if (!this.matrixModalEl) return;
    const isOpen = this.matrixModalEl.classList.contains("open");
    const newState = forceState !== undefined ? forceState : !isOpen;

    if (newState) {
      this.matrixModalEl.classList.add("open");
    } else {
      this.matrixModalEl.classList.remove("open");
    }
  }

  toggleFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  bindEvents() {
    // Keyboard Controls
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          this.nextSlide();
          break;
        case "ArrowLeft":
        case "Backspace":
        case "PageUp":
          e.preventDefault();
          this.prevSlide();
          break;
        case "Escape":
          this.toggleMatrix();
          break;
        case "f":
        case "F":
          this.toggleFullscreen();
          break;
        case "Home":
          this.goToSlide(0);
          break;
        case "End":
          this.goToSlide(this.slides.length - 1);
          break;
      }
    });

    // Push Buttons
    const btnNext = document.getElementById("btn-next");
    const btnPrev = document.getElementById("btn-prev");
    const btnMatrix = document.getElementById("btn-matrix");
    const btnMatrixClose = document.getElementById("btn-matrix-close");
    const btnFullscreen = document.getElementById("btn-fullscreen");

    if (btnNext) btnNext.addEventListener("click", () => this.nextSlide());
    if (btnPrev) btnPrev.addEventListener("click", () => this.prevSlide());
    if (btnMatrix) btnMatrix.addEventListener("click", () => this.toggleMatrix(true));
    if (btnMatrixClose) btnMatrixClose.addEventListener("click", () => this.toggleMatrix(false));
    if (btnFullscreen) btnFullscreen.addEventListener("click", () => this.toggleFullscreen());

    // Touch Swipe support
    let touchStartX = 0;
    window.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) this.nextSlide();
        else this.prevSlide();
      }
    }, { passive: true });
  }

  bindHeroSelectorEvents() {
    const prevBtn = document.getElementById("hero-prev-btn");
    const nextBtn = document.getElementById("hero-next-btn");
    const tabBtns = document.querySelectorAll(".hero-tab-btn");

    if (!prevBtn && !nextBtn && tabBtns.length === 0) return;

    if (this.currentHeroIndex === undefined) {
      this.currentHeroIndex = 0;
    }

    const leadsSlide = this.slides.find(s => s.id === "leads");
    const roles = leadsSlide ? leadsSlide.content.roles : [];
    if (!roles.length) return;

    const updateHeroUI = (idx) => {
      this.currentHeroIndex = (idx + roles.length) % roles.length;
      const role = roles[this.currentHeroIndex];

      // Update Tabs
      tabBtns.forEach((btn, bIdx) => {
        btn.classList.toggle("active", bIdx === this.currentHeroIndex);
      });

      // Update Indicator
      const codeEl = document.getElementById("hero-indicator-code");
      if (codeEl) codeEl.textContent = `${role.code} // ${role.unit}`;

      // Update Dossier Card with subtle CRT transition
      const dossierPanel = document.getElementById("hero-dossier-panel");
      if (dossierPanel) {
        dossierPanel.style.opacity = "0.7";
        setTimeout(() => { dossierPanel.style.opacity = "1"; }, 80);
      }

      const dCode = document.getElementById("dossier-code");
      const dTag = document.getElementById("dossier-tag");
      const dTitle = document.getElementById("dossier-title");
      const dUnit = document.getElementById("dossier-unit");
      const dTasks = document.getElementById("dossier-tasks");
      const dGear = document.getElementById("dossier-gear");

      if (dCode) dCode.textContent = `[ ${role.code} ]`;
      if (dTag) dTag.textContent = role.tag;
      if (dTitle) dTitle.textContent = role.title;
      if (dUnit) dUnit.textContent = `НАПРАВЛЕНИЕ: ${role.unit}`;
      if (dTasks) dTasks.textContent = role.tasks;
      if (dGear) dGear.textContent = role.gear;

      // Update 3D Model in Graphics Engine
      if (this.graphics && typeof this.graphics.setHero === "function") {
        this.graphics.setHero(this.currentHeroIndex);
      }
    };

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.stopPropagation();
        updateHeroUI(this.currentHeroIndex - 1);
      };
    }
    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.stopPropagation();
        updateHeroUI(this.currentHeroIndex + 1);
      };
    }

    tabBtns.forEach((btn, bIdx) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        updateHeroUI(bIdx);
      };
    });
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new PresentationApp(SLIDES_DATA);
  app.init();
  window.CORE_PRESENTATION = app;
});
