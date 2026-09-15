/**
 * CORE AITU - Mainframe Procedural Graphics & 3D Simulation (v4)
 * Provides consistent blueprint-wireframe 3D rendering with zero external dependencies:
 * - Open-Source Contributor Network Graph (Slide 1)
 * - Network Mesh Topology with data packet flow (Slide 3)
 * - 3D Isometric Server Infrastructure Cluster (Slide 5)
 * - Git-Style Branching Commit/Progression Tree (Slide 10)
 * - Calm, slow-moving telemetry monitors
 */

class MainframeGraphics {
  constructor() {
    this.animationFrameIds = {};
  }

  init() {
    this.initCalmOscilloscopes();
    this.initOpenSourceNetwork("opensource-network-canvas");
    this.initEcosystemOrbs("ecosystem-3d-canvas");
    this.initHorizontalModel("hero-3d-pedestal-canvas");
    this.initProgressionTree("orbit-3d-canvas");
  }


  // =========================================================================
  // Calm, Slow-Moving Side Telemetry Oscilloscope (Subtle & Non-Distracting)
  // =========================================================================
  initCalmOscilloscopes() {
    const canvas = document.getElementById("wing-osc-1");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let phase = 0;

    const render = () => {
      const w = canvas.width = canvas.clientWidth || 120;
      const h = canvas.height = canvas.clientHeight || 64;

      ctx.fillStyle = "#0d1110";
      ctx.fillRect(0, 0, w, h);

      // Faint coordinate grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 16) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0; y < h; y += 14) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      // Calm, subtle waveform (slow speed, low distraction)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        const mod = (x + phase * 6) % w;
        const spike = Math.exp(-Math.pow((mod - w / 2) / 8, 2)) * 12;
        const y = h / 2 + Math.sin(x * 0.07 + phase) * 4 - spike;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Ultra-slow progression (calm telemetry)
      phase += 0.005;
      this.animationFrameIds["wing_osc_1"] = requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 1. Open-Source Contributor Network Graph (Slide 1)
  // Animated network of open-source projects as nodes connected by glowing
  // data edges, with commit pulse markers. Consistent blueprint wireframe style.
  // =========================================================================
  initOpenSourceNetwork(canvasId) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const PROJECTS = [
      { label: "LINUX", x: 0.5, y: 0.5, r: 18, color: "#ffffff", accent: true },
      { label: "GIT", x: 0.25, y: 0.28, r: 13, color: "#e2e8e4" },
      { label: "BASH", x: 0.76, y: 0.3, r: 12, color: "#e2e8e4" },
      { label: "GCC", x: 0.18, y: 0.62, r: 11, color: "#c5d1cb" },
      { label: "PYTHON", x: 0.72, y: 0.68, r: 14, color: "#e2e8e4" },
      { label: "VIM", x: 0.35, y: 0.76, r: 10, color: "#c5d1cb" },
      { label: "MAKE", x: 0.83, y: 0.5, r: 10, color: "#c5d1cb" },
      { label: "SSH", x: 0.14, y: 0.42, r: 10, color: "#c5d1cb" },
      { label: "APT", x: 0.6, y: 0.18, r: 10, color: "#c5d1cb" },
      { label: "GREP", x: 0.38, y: 0.2, r: 9, color: "#7e8f87" },
    ];

    const EDGES = [
      [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],
      [1,3],[1,5],[1,9],[2,6],[2,8],[3,7],[4,5],[4,6],[8,9]
    ];

    // Commit pulses: each is { edge index, progress 0-1, active }
    const pulses = EDGES.map(() => ({
      t: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
      active: Math.random() < 0.4
    }));

    let frame = 0;

    const render = () => {
      const w = canvas.width = container.clientWidth || 540;
      const h = canvas.height = container.clientHeight || 300;

      ctx.fillStyle = "#0c100e";
      ctx.fillRect(0, 0, w, h);

      // Blueprint grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 22) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0; y < h; y += 22) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      // Resolve positions
      const nodes = PROJECTS.map(p => ({ ...p, px: p.x * w, py: p.y * h }));

      // Draw edges
      EDGES.forEach(([a, b], ei) => {
        const na = nodes[a], nb = nodes[b];
        const grad = ctx.createLinearGradient(na.px, na.py, nb.px, nb.py);
        grad.addColorStop(0, "rgba(255,255,255,0.18)");
        grad.addColorStop(1, "rgba(255,255,255,0.08)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(na.px, na.py);
        ctx.lineTo(nb.px, nb.py);
        ctx.stroke();

        // Commit pulse traveling along edge
        const pulse = pulses[ei];
        pulse.t += pulse.speed;
        if (pulse.t > 1) { pulse.t = 0; pulse.active = Math.random() < 0.55; }

        if (pulse.active) {
          const px = na.px + (nb.px - na.px) * pulse.t;
          const py = na.py + (nb.py - na.py) * pulse.t;
          ctx.fillStyle = "#e63946";
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach((n, i) => {
        // Glow
        const glowR = n.r + 6 + Math.sin(frame * 0.04 + i) * 2;
        const glow = ctx.createRadialGradient(n.px, n.py, n.r * 0.3, n.px, n.py, glowR);
        glow.addColorStop(0, n.accent ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.px, n.py, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Node ring
        ctx.strokeStyle = n.accent ? "#ffffff" : "rgba(255,255,255,0.55)";
        ctx.lineWidth = n.accent ? 2 : 1;
        ctx.beginPath();
        ctx.arc(n.px, n.py, n.r, 0, Math.PI * 2);
        ctx.stroke();

        // Center dot
        ctx.fillStyle = n.accent ? "#ffffff" : "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.arc(n.px, n.py, n.accent ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = n.accent ? "#ffffff" : "#7e8f87";
        ctx.font = `${n.accent ? "bold " : ""}${n.accent ? 11 : 10}px Consolas, monospace`;
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.px, n.py + n.r + 10);
      });

      frame++;
      this.animationFrameIds["open_source_net"] = requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 3D Holographic Wireframe Orbs (Slide 2 - CORE Ecosystem & Domains)
  // Procedural 3D isometric simulation of 7 spherical nodes:
  // - 1 Central Systems Core + 6 outer specialized domains
  // - Generous non-overlapping distance between all nodes
  // - 3D latitude/longitude wireframe rings rotating on axes
  // - Glowing phosphor cores and animated bidirectional data conduits
  // - Bottom baseline aligned to match the right acronym column
  // =========================================================================
  initEcosystemOrbs(canvasId) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    if (this.animationFrameIds["ecosystem_orbs"]) {
      cancelAnimationFrame(this.animationFrameIds["ecosystem_orbs"]);
    }
    container.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // Mouse tracking for subtle 3D parallax tilt & interactive hover
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouse.targetX = Math.max(-1, Math.min(1, nx));
      mouse.targetY = Math.max(-1, Math.min(1, ny));
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.active = false;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    // 7 Domain Definitions (Central Core + 6 Orbital Nodes)
    // Sized and positioned with strict safety margins to prevent any clipping
    const DOMAINS = [
      {
        id: "center_core",
        title: "РАЗРАБОТКА СИСТЕМ",
        subtitle: "Спикеры & эксперты",
        radius: 21,
        isCenter: true,
        accent: false,
        phase: 0,
        rotSpeed: 0.0055,
        align: "center",
        textSide: "bottom"
      },
      {
        id: "sec_sw",
        title: "Безопасность ПО",
        subtitle: "(физическая & цифровая)",
        angle: -Math.PI / 2, // Top (12 o'clock)
        radius: 16,
        isCenter: false,
        accent: false,
        phase: 1.1,
        rotSpeed: 0.0075,
        align: "center",
        textSide: "top"
      },
      {
        id: "ai_models",
        title: "Безопасный & этичный ИИ",
        subtitle: "в открытых системах",
        angle: -Math.PI / 6, // Top-Right (2 o'clock)
        radius: 16,
        isCenter: false,
        accent: false,
        phase: 2.3,
        rotSpeed: 0.0065,
        align: "left",
        textSide: "right"
      },
      {
        id: "other_act",
        title: "Другие активности",
        subtitle: "Открытый бюджет & финансы",
        angle: Math.PI / 6, // Bottom-Right (4 o'clock)
        radius: 15,
        isCenter: false,
        accent: false,
        phase: 3.7,
        rotSpeed: 0.007,
        align: "left",
        textSide: "right"
      },
      {
        id: "os_online",
        title: "Операционные системы",
        subtitle: "Дискуссии & поддержка",
        angle: Math.PI / 2, // Bottom (6 o'clock)
        radius: 16,
        isCenter: false,
        accent: false,
        phase: 4.8,
        rotSpeed: 0.006,
        align: "center",
        textSide: "bottom"
      },
      {
        id: "linux_klub",
        title: "Linux KLUB",
        subtitle: "[ ФУНДАМЕНТ // БАЗА ]",
        angle: (5 * Math.PI) / 6, // Bottom-Left (8 o'clock)
        radius: 17,
        isCenter: false,
        accent: true, // Red accent
        phase: 5.6,
        rotSpeed: 0.0085,
        align: "right",
        textSide: "left"
      },
      {
        id: "open_systems",
        title: "Открытые системы",
        subtitle: "& свободное ПО",
        angle: -(5 * Math.PI) / 6, // Top-Left (10 o'clock)
        radius: 16,
        isCenter: false,
        accent: false,
        phase: 0.7,
        rotSpeed: 0.007,
        align: "right",
        textSide: "left"
      }
    ];

    let frame = 0;

    // Helper: Razor-Sharp 3D Sphere Wireframe with Latitude & Longitude Rings
    const draw3DWireframeSphere = (x0, y0, r, rotY, rotX, isAccent, isCenter) => {
      // 1. Solid Silhouette Core (Prevents see-through clutter)
      ctx.beginPath();
      ctx.arc(x0, y0, r, 0, Math.PI * 2);
      ctx.fillStyle = isCenter ? "#121a17" : isAccent ? "#1c1012" : "#0f1614";
      ctx.fill();

      // Outer boundary stroke
      ctx.lineWidth = isCenter ? 1.6 : isAccent ? 1.4 : 1.1;
      ctx.strokeStyle = isAccent ? "#e63946" : isCenter ? "#ffffff" : "rgba(255, 255, 255, 0.65)";
      ctx.stroke();

      // 2. 3D Latitude Rings (Parallels: Equator + Polar parallels)
      const parallels = isCenter ? [-0.8, -0.4, 0, 0.4, 0.8] : [-0.62, 0, 0.62];
      parallels.forEach((phi) => {
        const ringR = r * Math.cos(phi);
        const ringY0 = r * Math.sin(phi);
        const isEquator = phi === 0;

        ctx.beginPath();
        const steps = 28;
        for (let s = 0; s <= steps; s++) {
          const a = (s / steps) * Math.PI * 2;
          const lx = ringR * Math.cos(a);
          const ly = ringY0;
          const lz = ringR * Math.sin(a);

          // Rotate around X (pitch)
          const rx_y = ly * Math.cos(rotX) - lz * Math.sin(rotX);
          const rx_z = ly * Math.sin(rotX) + lz * Math.cos(rotX);

          // Rotate around Y (yaw)
          const ry_x = lx * Math.cos(rotY) + rx_z * Math.sin(rotY);

          const px = x0 + ry_x;
          const py = y0 + rx_y;

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.lineWidth = isEquator ? (isCenter ? 1.3 : 1.1) : 0.75;
        if (isAccent) {
          ctx.strokeStyle = isEquator ? "rgba(230, 57, 70, 0.85)" : "rgba(230, 57, 70, 0.35)";
        } else if (isCenter) {
          ctx.strokeStyle = isEquator ? "#ffffff" : "rgba(255, 255, 255, 0.38)";
        } else {
          ctx.strokeStyle = isEquator ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.25)";
        }
        ctx.stroke();
      });

      // 3. 3D Longitude Meridians (2 perpendicular vertical great circles)
      const meridians = [0, Math.PI / 2];
      meridians.forEach((merAngle) => {
        ctx.beginPath();
        const steps = 28;
        for (let s = 0; s <= steps; s++) {
          const psi = (s / steps) * Math.PI * 2;
          const lx = r * Math.sin(psi) * Math.cos(merAngle);
          const ly = r * Math.cos(psi);
          const lz = r * Math.sin(psi) * Math.sin(merAngle);

          // Rotate around X
          const rx_y = ly * Math.cos(rotX) - lz * Math.sin(rotX);
          const rx_z = ly * Math.sin(rotX) + lz * Math.cos(rotX);

          // Rotate around Y
          const ry_x = lx * Math.cos(rotY) + rx_z * Math.sin(rotY);

          const px = x0 + ry_x;
          const py = y0 + rx_y;

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = isAccent ? "rgba(230, 57, 70, 0.38)" : "rgba(255, 255, 255, 0.28)";
        ctx.stroke();
      });

      // 4. Glowing Phosphor Core Point (Clean radial gradient without heavy blur)
      const coreGrad = ctx.createRadialGradient(x0, y0, 0, x0, y0, r * 0.45);
      if (isAccent) {
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.45, "rgba(230, 57, 70, 0.85)");
        coreGrad.addColorStop(1, "rgba(230, 57, 70, 0)");
      } else if (isCenter) {
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.4, "rgba(200, 240, 225, 0.9)");
        coreGrad.addColorStop(1, "rgba(200, 240, 225, 0)");
      } else {
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.65)");
        coreGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      }
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(x0, y0, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const w = rect.width || 480;
      const h = rect.height || 380;

      // Ensure exact native pixel dimensions for razor-sharp, zero-blur rendering
      const targetW = Math.round(w * dpr);
      const targetH = Math.round(h * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Smooth mouse interpolation for 3D parallax tilt
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, w, h);

      // Faint coordinate background grid (pixel-aligned for crispness)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      const step = 28;
      ctx.beginPath();
      for (let x = step; x < w; x += step) {
        const px = Math.round(x) + 0.5;
        ctx.moveTo(px, 0); ctx.lineTo(px, h);
      }
      for (let y = step; y < h; y += step) {
        const py = Math.round(y) + 0.5;
        ctx.moveTo(0, py); ctx.lineTo(w, py);
      }
      ctx.stroke();

      // Corner technical reticles (strictly inset to prevent touching borders)
      const rLen = 8;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      // Top-Left
      ctx.moveTo(8, 8 + rLen); ctx.lineTo(8, 8); ctx.lineTo(8 + rLen, 8);
      // Top-Right
      ctx.moveTo(w - 8 - rLen, 8); ctx.lineTo(w - 8, 8); ctx.lineTo(w - 8, 8 + rLen);
      // Bottom-Left
      ctx.moveTo(8, h - 8 - rLen); ctx.lineTo(8, h - 8); ctx.lineTo(8 + rLen, h - 8);
      // Bottom-Right
      ctx.moveTo(w - 8 - rLen, h - 8); ctx.lineTo(w - 8, h - 8); ctx.lineTo(w - 8, h - 8 - rLen);
      ctx.stroke();

      // Safe bounds and adaptive orbit radii
      const safePad = 14;
      const availHalfW = (w - 2 * safePad) * 0.5;
      const availHalfH = (h - 2 * safePad) * 0.5;

      // Orbit radii dynamically calculated with +25% generous spacing between all nodes
      const cx = w * 0.5;
      const cy = h * 0.5;
      const orbitRx = Math.max(70, Math.min(105, availHalfW - 125));
      const orbitRy = Math.max(65, Math.min(95, availHalfH - 45));

      // Orbital dashed calibration ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, orbitRx, orbitRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Compute node positions with calm harmonic bobbing (slowed down for stability)
      const nodesPos = DOMAINS.map((d) => {
        let x = cx;
        let y = cy;
        if (!d.isCenter) {
          x = cx + Math.cos(d.angle) * orbitRx;
          y = cy + Math.sin(d.angle) * orbitRy;
        }
        // Calm harmonic floating motion (reduced speed and amplitude)
        const bobY = Math.sin(frame * 0.012 + d.phase) * 2.2;
        const bobX = Math.cos(frame * 0.01 + d.phase) * 1.5;
        // Parallax mouse tilt
        const px = x + bobX + mouse.x * (d.isCenter ? 2 : 5);
        const py = y + bobY + mouse.y * (d.isCenter ? 2 : 5);
        return { ...d, px, py };
      });

      const centerNode = nodesPos[0];

      // Draw Laser Conduits between Center Core and 6 Outer Nodes
      for (let i = 1; i < nodesPos.length; i++) {
        const outer = nodesPos[i];

        // Conduit Line
        ctx.beginPath();
        ctx.moveTo(centerNode.px, centerNode.py);
        ctx.lineTo(outer.px, outer.py);
        ctx.strokeStyle = outer.accent ? "rgba(230, 57, 70, 0.25)" : "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Data Packets (slowed down ~4x for a calm, steady flow without flicker)
        for (let p = 0; p < 2; p++) {
          const progress = (frame * 0.0035 + i * 0.16 + p * 0.5) % 1.0;
          const pktX = centerNode.px + (outer.px - centerNode.px) * progress;
          const pktY = centerNode.py + (outer.py - centerNode.py) * progress;

          // Crisp solid phosphor bead
          ctx.beginPath();
          ctx.arc(pktX, pktY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = outer.accent ? "#e63946" : "#ffffff";
          ctx.fill();

          // Crisp outer halo ring (clean, zero blur, zero flicker)
          ctx.beginPath();
          ctx.arc(pktX, pktY, 3.2, 0, Math.PI * 2);
          ctx.strokeStyle = outer.accent ? "rgba(230, 57, 70, 0.35)" : "rgba(255, 255, 255, 0.35)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Render 3D Spheres (Outer first, then Center)
      const renderOrder = [1, 2, 3, 4, 5, 6, 0];
      renderOrder.forEach((idx) => {
        const d = nodesPos[idx];
        const rotY = frame * d.rotSpeed + mouse.x * 0.18;
        const rotX = 0.32 + mouse.y * 0.18;

        draw3DWireframeSphere(d.px, d.py, d.radius, rotY, rotX, d.accent, d.isCenter);

        // Technical Reticle cross around central core
        if (d.isCenter) {
          const crossSize = d.radius + 6;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          // Vertical ticks
          ctx.moveTo(d.px, d.py - crossSize); ctx.lineTo(d.px, d.py - d.radius - 2);
          ctx.moveTo(d.px, d.py + d.radius + 2); ctx.lineTo(d.px, d.py + crossSize);
          // Horizontal ticks
          ctx.moveTo(d.px - crossSize, d.py); ctx.lineTo(d.px - d.radius - 2, d.py);
          ctx.moveTo(d.px + d.radius + 2, d.py); ctx.lineTo(d.px + crossSize, d.py);
          ctx.stroke();
        }

        // Render Projected Labels with Strict Boundary Clamping (Zero Cut-Off)
        const fontFam = 'var(--font-mono), "Consolas", monospace';
        ctx.font = `bold 10px ${fontFam}`;

        if (d.isCenter) {
          // Central Core Label (Cleanly centered below crosshair)
          ctx.textAlign = "center";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(d.title, d.px, d.py + d.radius + 16);

          ctx.font = `8.5px ${fontFam}`;
          ctx.fillStyle = "#7e8f87";
          ctx.fillText(d.subtitle, d.px, d.py + d.radius + 27);
        } else if (d.textSide === "top") {
          // Top node (Безопасность ПО)
          ctx.textAlign = "center";
          const topAnchorY = Math.max(safePad + 22, d.py - d.radius - 8);
          ctx.fillStyle = "#ffffff";
          ctx.fillText(d.title, d.px, topAnchorY - 11);

          ctx.font = `8.5px ${fontFam}`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fillText(d.subtitle, d.px, topAnchorY);
        } else if (d.textSide === "bottom") {
          // Bottom node (Операционные системы)
          ctx.textAlign = "center";
          const botAnchorY = Math.min(h - safePad - 13, d.py + d.radius + 12);
          ctx.fillStyle = "#ffffff";
          ctx.fillText(d.title, d.px, botAnchorY);

          ctx.font = `8.5px ${fontFam}`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fillText(d.subtitle, d.px, botAnchorY + 11);
        } else if (d.textSide === "right") {
          // Right nodes: Clamped so right edge never exceeds w - safePad
          ctx.textAlign = "left";
          const titleW = ctx.measureText(d.title).width;
          ctx.font = `8.5px ${fontFam}`;
          const subW = ctx.measureText(d.subtitle).width;
          const maxW = Math.max(titleW, subW);

          const anchorX = Math.min(w - safePad - maxW, d.px + d.radius + 8);
          ctx.font = `bold 10px ${fontFam}`;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(d.title, anchorX, d.py - 2);

          ctx.font = `8.5px ${fontFam}`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fillText(d.subtitle, anchorX, d.py + 10);
        } else if (d.textSide === "left") {
          // Left nodes: Clamped so left edge NEVER goes below safePad (prevents clipping completely)
          ctx.textAlign = "right";
          if (d.accent) {
            // Linux KLUB (Prominent Foundation)
            ctx.font = `900 12px ${fontFam}`;
            const titleW = ctx.measureText(d.title).width;
            ctx.font = `bold 8px ${fontFam}`;
            const subW = ctx.measureText(d.subtitle).width;
            const maxW = Math.max(titleW, subW);

            const anchorX = Math.max(safePad + maxW, d.px - d.radius - 8);
            ctx.font = `900 12px ${fontFam}`;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(d.title, anchorX, d.py - 2);

            ctx.font = `bold 8px ${fontFam}`;
            ctx.fillStyle = "#e63946";
            ctx.fillText(d.subtitle, anchorX, d.py + 10);
          } else {
            // Open Systems & FOSS
            ctx.font = `bold 10px ${fontFam}`;
            const titleW = ctx.measureText(d.title).width;
            ctx.font = `8.5px ${fontFam}`;
            const subW = ctx.measureText(d.subtitle).width;
            const maxW = Math.max(titleW, subW);

            const anchorX = Math.max(safePad + maxW, d.px - d.radius - 8);
            ctx.font = `bold 10px ${fontFam}`;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(d.title, anchorX, d.py - 2);

            ctx.font = `8.5px ${fontFam}`;
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.fillText(d.subtitle, anchorX, d.py + 10);
          }
        }
      });

      frame++;
      this.animationFrameIds["ecosystem_orbs"] = requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 2. Network Mesh Topology (Slide 3 - Mission)
  // Interconnected node web with animated data packets flowing along paths,
  // representing open, interoperable systems. Blueprint wireframe style.
  // =========================================================================
  initNetworkMesh(canvasId) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // Hex-ish grid of nodes
    const buildNodes = (w, h) => {
      const nodes = [];
      const cols = 6, rows = 4;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offset = (r % 2) * 0.5;
          nodes.push({
            px: (c + offset + 0.5) * (w / cols),
            py: (r + 0.5) * (h / rows),
            id: r * cols + c,
            type: (r === 1 && c === 2) ? "gateway" : (r + c) % 3 === 0 ? "hub" : "node"
          });
        }
      }
      return nodes;
    };

    const buildEdges = (nodes) => {
      const edges = [];
      const cols = 6;
      nodes.forEach((n, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        if (c < cols - 1) edges.push([i, i + 1]);
        if (r > 0) {
          const offset = r % 2;
          if (offset && c < cols - 1) { edges.push([i, i - cols]); edges.push([i, i - cols + 1]); }
          else if (!offset && c > 0) { edges.push([i, i - cols]); edges.push([i, i - cols - 1]); }
          else edges.push([i, i - cols]);
        }
      });
      return edges;
    };

    let packets = [];
    let frame = 0;

    const spawnPacket = (edges, nodes) => {
      if (packets.length < 12 && Math.random() < 0.06) {
        const ei = Math.floor(Math.random() * edges.length);
        const [a, b] = edges[ei];
        packets.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.015 });
      }
    };

    const render = () => {
      const w = canvas.width = container.clientWidth || 420;
      const h = canvas.height = container.clientHeight || 300;

      ctx.fillStyle = "#0c100e";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 22) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0; y < h; y += 22) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      const nodes = buildNodes(w, h);
      const edges = buildEdges(nodes);
      spawnPacket(edges, nodes);

      // Draw edges
      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(na.px, na.py);
        ctx.lineTo(nb.px, nb.py);
        ctx.stroke();
      });

      // Draw packets
      packets = packets.filter(pk => pk.t <= 1);
      packets.forEach(pk => {
        pk.t += pk.speed;
        const na = nodes[pk.a], nb = nodes[pk.b];
        const px = na.px + (nb.px - na.px) * pk.t;
        const py = na.py + (nb.py - na.py) * pk.t;
        ctx.fillStyle = "#e63946";
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach(n => {
        const pulse = 1 + Math.sin(frame * 0.03 + n.id) * 0.3;
        const isGateway = n.type === "gateway";
        const isHub = n.type === "hub";
        const r = isGateway ? 9 : isHub ? 6 : 4;

        if (isGateway) {
          ctx.strokeStyle = "#e63946";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(n.px, n.py, r + 5 * pulse, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.strokeStyle = isGateway ? "#ffffff" : isHub ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)";
        ctx.lineWidth = isGateway ? 2 : 1;
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isGateway ? "#ffffff" : "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.arc(n.px, n.py, isGateway ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Gateway callout
      const gw = nodes.find(n => n.type === "gateway");
      if (gw) {
        ctx.strokeStyle = "#e63946";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gw.px, gw.py);
        ctx.lineTo(gw.px + 28, gw.py - 26);
        ctx.lineTo(gw.px + 100, gw.py - 26);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px Consolas, monospace";
        ctx.fillText("GATEWAY // OPEN PROTOCOL", gw.px + 32, gw.py - 30);
      }

      ctx.fillStyle = "#7e8f87";
      ctx.font = "12px Consolas, monospace";
      ctx.fillText("MESH TOPOLOGY // DECENTRALIZED NETWORK", 14, h - 12);

      frame++;
      this.animationFrameIds["network_mesh"] = requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 3. Git-Style Branching Commit Tree (Slide 10 - Roadmap)
  // A git commit tree growing from left to right: branches split, merge,
  // with commit dots and milestone callouts. Represents progression and
  // digital independence. Blueprint wireframe style.
  // =========================================================================
  initProgressionTree(canvasId) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let frame = 0;

    const COMMITS = [
      // main branch (y=0.5), feature branches above and below
      { x: 0.06, y: 0.5,  branch: 0, label: "INIT",      milestone: true  },
      { x: 0.18, y: 0.5,  branch: 0, label: "v0.1",      milestone: false },
      { x: 0.25, y: 0.32, branch: 1, label: "INFRA",     milestone: false },
      { x: 0.33, y: 0.5,  branch: 0, label: "v0.2",      milestone: false },
      { x: 0.38, y: 0.68, branch: 2, label: "CTF",       milestone: false },
      { x: 0.48, y: 0.32, branch: 1, label: "SEC",       milestone: false },
      { x: 0.52, y: 0.5,  branch: 0, label: "v1.0",      milestone: true  },
      { x: 0.62, y: 0.68, branch: 2, label: "COLLAB",    milestone: false },
      { x: 0.68, y: 0.5,  branch: 0, label: "v1.1",      milestone: false },
      { x: 0.76, y: 0.32, branch: 1, label: "RESEARCH",  milestone: false },
      { x: 0.85, y: 0.5,  branch: 0, label: "v2.0",      milestone: true  },
      { x: 0.93, y: 0.5,  branch: 0, label: "HEAD",      milestone: false, head: true },
    ];

    const EDGES = [
      // main trunk
      [0,1],[1,3],[3,6],[6,8],[8,10],[10,11],
      // feature branch 1
      [1,2],[2,5],[5,8],
      // feature branch 2
      [3,4],[4,7],[7,8],
      // side hop
      [8,9],[9,10],
    ];

    const BRANCH_COLORS = ["#ffffff", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.45)"];

    // Animated HEAD cursor blinking
    let headBlink = 0;

    const render = () => {
      const w = canvas.width = container.clientWidth || 360;
      const h = canvas.height = container.clientHeight || 260;

      ctx.fillStyle = "#0c100e";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 22) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0; y < h; y += 22) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      const nodes = COMMITS.map(c => ({ ...c, px: c.x * w, py: c.y * h }));

      // Draw edges
      EDGES.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        const branchIdx = na.branch;
        ctx.strokeStyle = BRANCH_COLORS[branchIdx] || "rgba(255,255,255,0.3)";
        ctx.lineWidth = branchIdx === 0 ? 1.8 : 1.2;

        ctx.beginPath();
        if (na.branch !== nb.branch) {
          // Bezier curve for branch/merge
          ctx.moveTo(na.px, na.py);
          ctx.bezierCurveTo(
            (na.px + nb.px) / 2, na.py,
            (na.px + nb.px) / 2, nb.py,
            nb.px, nb.py
          );
        } else {
          ctx.moveTo(na.px, na.py);
          ctx.lineTo(nb.px, nb.py);
        }
        ctx.stroke();
      });

      // Draw commit nodes
      headBlink = Math.sin(frame * 0.06) > 0;
      nodes.forEach(n => {
        const r = n.milestone ? 7 : n.head ? 8 : 5;

        if (n.milestone) {
          // Milestone callout diamond
          ctx.strokeStyle = "#e63946";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(n.px, n.py - r - 4);
          ctx.lineTo(n.px + r + 4, n.py);
          ctx.lineTo(n.px, n.py + r + 4);
          ctx.lineTo(n.px - r - 4, n.py);
          ctx.closePath();
          ctx.stroke();
        }

        ctx.strokeStyle = n.milestone ? "#ffffff" : n.head ? (headBlink ? "#e63946" : "#ffffff") : BRANCH_COLORS[n.branch] || "#ffffff";
        ctx.lineWidth = n.milestone || n.head ? 2 : 1;
        ctx.beginPath();
        ctx.arc(n.px, n.py, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = n.milestone ? "#ffffff" : n.head ? (headBlink ? "#e63946" : "#ffffff") : "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.arc(n.px, n.py, n.milestone ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();

        // Commit label
        ctx.fillStyle = n.milestone ? "#ffffff" : n.head ? "#e63946" : "#7e8f87";
        ctx.font = `${n.milestone || n.head ? "bold " : ""}11px Consolas, monospace`;
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.px, n.py - r - 7);
      });

      // Callouts for milestone commits
      nodes.filter(n => n.milestone).forEach((n, i) => {
        const callouts = ["FOUNDATION", "LAUNCH", "SCALE"];
        if (!callouts[i]) return;
        ctx.strokeStyle = "#e63946";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(n.px + 10, n.py - 12);
        ctx.lineTo(n.px + 22, n.py - 28);
        ctx.lineTo(n.px + 80, n.py - 28);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Consolas, monospace";
        ctx.textAlign = "left";
        ctx.fillText(callouts[i], n.px + 24, n.py - 32);
      });

      ctx.textAlign = "left";
      ctx.fillStyle = "#7e8f87";
      ctx.font = "12px Consolas, monospace";
      ctx.fillText("GIT LOG --oneline --all --graph // PROGRESSION", 14, h - 12);

      frame++;
      this.animationFrameIds["progression_tree"] = requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 4. Horizontal Model 3D Low-Poly Operator Stage (Slide 4 - Governance)
  // Stylized Low-Poly Shaded Retro-3D Humanoid Operative:
  // - Stationary front-isometric view (no 60° turntable jump between characters)
  // - Smooth Pop & Ease-Out transition (0.88 -> 1.0 scale + lift) on role switch
  // - Low-poly faceted shading with lighting normal calculation and CRT phosphor edges
  // - 6 unique volumetric loadouts and silhouette props for each coordinator role
  // - High-DPI devicePixelRatio rendering for razor-sharp fidelity
  // =========================================================================
  initHorizontalModel(canvasId) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    if (this.animationFrameIds["hero_pedestal_3d"]) {
      cancelAnimationFrame(this.animationFrameIds["hero_pedestal_3d"]);
    }
    container.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let heroIdx = 0;
    let transitionProgress = 1.0; // 1.0 = settled
    const baseRotY = Math.PI + 0.28; // Stationary front-isometric ~16° yaw facing the viewer
    const pitch = 0.28; // ~16° downward perspective pitch
    const camDist = 380;
    const f = 430;
    let frame = 0;

    // External hook to switch active hero smoothly on the SAME spot
    this.setHero = (newIdx) => {
      const targetIdx = (newIdx + 6) % 6;
      if (heroIdx === targetIdx && transitionProgress >= 0.95) return;
      heroIdx = targetIdx;
      transitionProgress = 0.0; // Trigger smooth, non-flickering pop-up materialization
    };

    // 3D Perspective Projection Matrix
    const project = (x, y, z, cx, cy, rotY, scaleMul = 1.0, yOffset = 0) => {
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const x1 = (x * scaleMul) * cosY - (z * scaleMul) * sinY;
      const z1 = (x * scaleMul) * sinY + (z * scaleMul) * cosY;

      const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      const y1 = ((y + yOffset) * scaleMul) * cosP - z1 * sinP;
      const z2 = ((y + yOffset) * scaleMul) * sinP + z1 * cosP + camDist;

      if (z2 <= 20) return null;
      const scale = f / z2;
      return {
        x: cx + x1 * scale,
        y: cy + y1 * scale,
        scale: scale,
        depth: z2
      };
    };

    // Directional light vector for low-poly facet shading (illuminating front-right)
    const lightDir = [-0.35, -0.75, 0.55];
    const lightLen = Math.hypot(...lightDir);
    const lx = lightDir[0] / lightLen, ly = lightDir[1] / lightLen, lz = lightDir[2] / lightLen;

    // Helper: Draw Low-Poly Shaded 3D Polygon Face with Dynamic Lighting
    const drawPoly3D = (pts, baseR, baseG, baseB, alpha, edgeColor, edgeW, scaleMul, yOff, rotY, cx, cy) => {
      if (!pts || pts.length < 3) return;

      const proj = [];
      for (let i = 0; i < pts.length; i++) {
        const p = project(pts[i][0], pts[i][1], pts[i][2], cx, cy, rotY, scaleMul, yOff);
        if (!p) return;
        proj.push(p);
      }

      // Compute normal in 3D using first 3 vertices
      const v0 = pts[0], v1 = pts[1], v2 = pts[2];
      const ax = v1[0] - v0[0], ay = v1[1] - v0[1], az = v1[2] - v0[2];
      const bx = v2[0] - v0[0], by = v2[1] - v0[1], bz = v2[2] - v0[2];
      let nx = ay * bz - az * by;
      let ny = az * bx - ax * bz;
      let nz = ax * by - ay * bx;
      const nlen = Math.hypot(nx, ny, nz);
      if (nlen > 0.0001) {
        nx /= nlen; ny /= nlen; nz /= nlen;
      } else {
        nx = 0; ny = 0; nz = 1;
      }

      // Diffuse Lambertian intensity
      const dot = nx * lx + ny * ly + nz * lz;
      const diffuse = Math.max(0, dot);
      const intensity = 0.28 + 0.72 * diffuse;

      const r = Math.min(255, Math.round(baseR * intensity));
      const g = Math.min(255, Math.round(baseG * intensity));
      const b = Math.min(255, Math.round(baseB * intensity));

      ctx.beginPath();
      ctx.moveTo(proj[0].x, proj[0].y);
      for (let i = 1; i < proj.length; i++) {
        ctx.lineTo(proj[i].x, proj[i].y);
      }
      ctx.closePath();

      // Translucent polygonal facet fill
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();

      // Crisp glowing wireframe edge
      ctx.strokeStyle = edgeColor || `rgba(${Math.min(255, r + 45)}, ${Math.min(255, g + 45)}, ${Math.min(255, b + 45)}, ${Math.min(1.0, alpha + 0.3)})`;
      ctx.lineWidth = edgeW || 1.1;
      ctx.stroke();
    };

    // Helper: Draw 3D Line
    const drawLine3D = (x1, y1, z1, x2, y2, z2, color = "#ffffff", lw = 1.4, scaleMul = 1.0, yOff = 0, rotY = baseRotY, cx, cy) => {
      const p1 = project(x1, y1, z1, cx, cy, rotY, scaleMul, yOff);
      const p2 = project(x2, y2, z2, cx, cy, rotY, scaleMul, yOff);
      if (!p1 || !p2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    };

    // Helper: Draw 3D Point
    const drawPoint3D = (x, y, z, radius = 2.5, color = "#ffffff", scaleMul = 1.0, yOff = 0, rotY = baseRotY, cx, cy) => {
      const p = project(x, y, z, cx, cy, rotY, scaleMul, yOff);
      if (!p) return;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, radius * p.scale * 0.9), 0, Math.PI * 2);
      ctx.fill();
    };

    // Helper: Draw 3D Circle
    const drawCircle3D = (cx3, cy3, cz3, r, color = "#ffffff", lw = 1.2, segments = 24, scaleMul = 1.0, yOff = 0, rotY = baseRotY, cx, cy) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      let first = null;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const px = cx3 + Math.cos(angle) * r;
        const pz = cz3 + Math.sin(angle) * r;
        const p = project(px, cy3, pz, cx, cy, rotY, scaleMul, yOff);
        if (!p) continue;
        if (!first) { first = p; ctx.moveTo(p.x, p.y); }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    };

    // Helper: Draw Low-Poly Shaded Box with Depth Sorting (Back faces first, Front faces on top)
    const drawBox3D = (bx, by, bz, bw, bh, bd, baseR, baseG, baseB, alpha, edgeColor, lw, scaleMul, yOff, rotY, cx, cy) => {
      const hw = bw * 0.5, hh = bh * 0.5, hd = bd * 0.5;
      const c = [
        [-hw, -hh, -hd], [hw, -hh, -hd], [hw, hh, -hd], [-hw, hh, -hd],
        [-hw, -hh, hd],  [hw, -hh, hd],  [hw, hh, hd],  [-hw, hh, hd]
      ].map(([x, y, z]) => [bx + x, by + y, bz + z]);

      const rawFaces = [
        [c[4], c[5], c[6], c[7]], // Front (+Z)
        [c[1], c[0], c[3], c[2]], // Back (-Z)
        [c[0], c[1], c[5], c[4]], // Top (-Y)
        [c[7], c[6], c[2], c[3]], // Bottom (+Y)
        [c[0], c[4], c[7], c[3]], // Left (-X)
        [c[5], c[1], c[2], c[6]]  // Right (+X)
      ];

      // Depth sort: furthest depth (drawn first) to closest depth (drawn last)
      const facesWithDepth = rawFaces.map(face => {
        let sumDepth = 0;
        for (let i = 0; i < face.length; i++) {
          const p = project(face[i][0], face[i][1], face[i][2], cx, cy, rotY, scaleMul, yOff);
          sumDepth += p ? p.depth : 300;
        }
        return { face, depth: sumDepth / face.length };
      });
      facesWithDepth.sort((a, b) => b.depth - a.depth);

      facesWithDepth.forEach(fwd => {
        drawPoly3D(fwd.face, baseR, baseG, baseB, alpha, edgeColor, lw, scaleMul, yOff, rotY, cx, cy);
      });
    };

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const w = rect.width || 420;
      const h = rect.height || 360;

      // Native High-DPI canvas backing store
      const targetW = Math.round(w * dpr);
      const targetH = Math.round(h * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      const cx = w * 0.5;
      const cy = h * 0.63;

      // Dark CRT backdrop
      ctx.fillStyle = "#0c100e";
      ctx.fillRect(0, 0, w, h);

      // Faint CRT matrix coordinate grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 22; x < w; x += 22) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 22; y < h; y += 22) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      // Transition advancement (smooth pop-up on role change)
      if (transitionProgress < 1.0) {
        transitionProgress = Math.min(1.0, transitionProgress + 0.055);
      }
      const t = transitionProgress;
      const easeOut = 1 - Math.pow(1 - t, 3);
      const bounce = Math.sin(t * Math.PI) * 0.035;
      const popScale = 0.90 + 0.10 * easeOut + bounce;
      const popY = (1 - easeOut) * 16; // Rises smoothly 16px onto pedestal
      const popAlpha = Math.min(1.0, 0.55 + 0.45 * easeOut);

      // Gentle, calm idle breathing sway (STATIONARY front-isometric angle, NO 60° jump)
      const idleSway = Math.sin(frame * 0.016) * 0.03;
      const rotY = baseRotY + idleSway;
      const breathY = Math.sin(frame * 0.028) * 1.5;
      const totalYOff = popY + breathY;

      // -------------------------------------------------------------
      // 1. TURNTABLE PEDESTAL (Solid, Stationary, High-Tech Floor)
      // -------------------------------------------------------------
      // Ground shadow ring
      drawCircle3D(0, 18, 0, 96, "rgba(255, 255, 255, 0.06)", 1.5, 32, 1.0, 0, rotY, cx, cy);
      drawCircle3D(0, 18, 0, 112, "rgba(255, 255, 255, 0.03)", 1, 32, 1.0, 0, rotY, cx, cy);

      // Base tier (cylinder Y = 10 to Y = 18)
      drawCircle3D(0, 18, 0, 84, "rgba(255, 255, 255, 0.45)", 1.4, 28, 1.0, 0, rotY, cx, cy);
      drawCircle3D(0, 10, 0, 84, "rgba(255, 255, 255, 0.55)", 1.4, 28, 1.0, 0, rotY, cx, cy);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const cos = Math.cos(a) * 84, sin = Math.sin(a) * 84;
        drawLine3D(cos, 10, sin, cos, 18, sin, "rgba(255, 255, 255, 0.35)", 1.2, 1.0, 0, rotY, cx, cy);
        drawPoint3D(cos, 14, sin, 1.8, (i % 2 === 0) ? "#22c55e" : "#ffffff", 1.0, 0, rotY, cx, cy);
      }

      // Upper platform surface tracks
      drawCircle3D(0, 0, 0, 72, "rgba(255, 255, 255, 0.3)", 1.2, 28, 1.0, 0, rotY, cx, cy);
      drawCircle3D(0, 0, 0, 48, "rgba(255, 255, 255, 0.22)", 1, 24, 1.0, 0, rotY, cx, cy);
      drawCircle3D(0, 0, 0, 24, "rgba(255, 255, 255, 0.16)", 1, 16, 1.0, 0, rotY, cx, cy);

      // Center glowing compass reticle
      drawLine3D(-14, 0, 0, 14, 0, 0, "rgba(255, 255, 255, 0.3)", 1, 1.0, 0, rotY, cx, cy);
      drawLine3D(0, 0, -14, 0, 0, 14, "rgba(255, 255, 255, 0.3)", 1, 1.0, 0, rotY, cx, cy);

      // Active role signal beacon notch on pedestal rim
      const notchAngle = heroIdx * (Math.PI * 2 / 6);
      const nx = Math.cos(notchAngle) * 72, nz = Math.sin(notchAngle) * 72;
      drawLine3D(nx * 0.85, 0, nz * 0.85, nx * 1.06, 0, nz * 1.06, "#e63946", 2.4, 1.0, 0, rotY, cx, cy);
      drawPoint3D(nx * 1.06, 0, nz * 1.06, 3, "#e63946", 1.0, 0, rotY, cx, cy);

      // -------------------------------------------------------------
      // 2. VOLUMETRIC LOW-POLY SHADED CYBER-OPERATIVE
      // -------------------------------------------------------------
      const rColor = (heroIdx === 1) ? "#22c55e" : (heroIdx === 2) ? "#e63946" : (heroIdx === 3) ? "#38bdf8" : (heroIdx === 4) ? "#f59e0b" : "#ffffff";
      const bodyBaseR = 26, bodyBaseG = 38, bodyBaseB = 35;

      // Boots: Angular faceted sabatons
      drawBox3D(-14, 0, 4, 10, 8, 18, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.75)", 1.2, popScale, totalYOff, rotY, cx, cy);
      drawBox3D(14, 0, 4, 10, 8, 18, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.75)", 1.2, popScale, totalYOff, rotY, cx, cy);

      // Shins / Greaves: Faceted armor segments (Ankle -> Knee)
      drawBox3D(-14, -22, 1, 9, 36, 11, bodyBaseR, bodyBaseG, bodyBaseB, 0.7 * popAlpha, "rgba(255,255,255,0.6)", 1.1, popScale, totalYOff, rotY, cx, cy);
      drawBox3D(14, -22, 1, 9, 36, 11, bodyBaseR, bodyBaseG, bodyBaseB, 0.7 * popAlpha, "rgba(255,255,255,0.6)", 1.1, popScale, totalYOff, rotY, cx, cy);

      // Knees: Chiseled hexagonal knee guard nodes
      drawBox3D(-14, -42, 5, 11, 8, 7, 36, 52, 48, 0.85 * popAlpha, rColor, 1.3, popScale, totalYOff, rotY, cx, cy);
      drawBox3D(14, -42, 5, 11, 8, 7, 36, 52, 48, 0.85 * popAlpha, rColor, 1.3, popScale, totalYOff, rotY, cx, cy);

      // Thighs: Angular quadriceps armor
      drawBox3D(-13, -64, 1, 11, 36, 12, bodyBaseR, bodyBaseG, bodyBaseB, 0.7 * popAlpha, "rgba(255,255,255,0.6)", 1.1, popScale, totalYOff, rotY, cx, cy);
      drawBox3D(13, -64, 1, 11, 36, 12, bodyBaseR, bodyBaseG, bodyBaseB, 0.7 * popAlpha, "rgba(255,255,255,0.6)", 1.1, popScale, totalYOff, rotY, cx, cy);

      // Pelvis / Belt: Faceted hip armor
      drawBox3D(0, -84, 0, 32, 10, 15, 34, 46, 42, 0.8 * popAlpha, "rgba(255,255,255,0.8)", 1.3, popScale, totalYOff, rotY, cx, cy);

      // Spine & Cyber Core: Segmented column
      drawBox3D(0, -96, 0, 14, 16, 12, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.65)", 1.1, popScale, totalYOff, rotY, cx, cy);
      drawPoint3D(0, -96, 7, 2.5, rColor, popScale, totalYOff, rotY, cx, cy);

      // Torso / Chestplate: Chiseled angular armor
      drawBox3D(0, -122, 0, 42, 34, 19, 32, 48, 44, 0.85 * popAlpha, "rgba(255,255,255,0.85)", 1.4, popScale, totalYOff, rotY, cx, cy);

      // Angular Pectoral Armor V-Facet lines
      drawLine3D(-16, -132, 10, 0, -114, 10, "rgba(255,255,255,0.9)", 1.6, popScale, totalYOff, rotY, cx, cy);
      drawLine3D(16, -132, 10, 0, -114, 10, "rgba(255,255,255,0.9)", 1.6, popScale, totalYOff, rotY, cx, cy);
      drawLine3D(0, -136, 10, 0, -114, 10, rColor, 1.8, popScale, totalYOff, rotY, cx, cy);

      // Shoulders: Armored Pauldrons
      drawBox3D(-26, -138, 0, 14, 12, 15, 36, 52, 48, 0.85 * popAlpha, "rgba(255,255,255,0.8)", 1.3, popScale, totalYOff, rotY, cx, cy);
      drawBox3D(26, -138, 0, 14, 12, 15, 36, 52, 48, 0.85 * popAlpha, "rgba(255,255,255,0.8)", 1.3, popScale, totalYOff, rotY, cx, cy);

      // Cybernetic Head / Helmet: Faceted 6-sided visor helm
      drawBox3D(0, -164, 0, 20, 22, 20, 36, 50, 46, 0.88 * popAlpha, "rgba(255,255,255,0.9)", 1.4, popScale, totalYOff, rotY, cx, cy);

      // Slanted Helmet Crown Facets
      const crownTop = [0, -177, 0];
      const cFL = [-10, -172, 10], cFR = [10, -172, 10], cBL = [-10, -172, -10], cBR = [10, -172, -10];
      drawPoly3D([crownTop, cFL, cFR], 42, 58, 54, 0.85 * popAlpha, "rgba(255,255,255,0.8)", 1.2, popScale, totalYOff, rotY, cx, cy);
      drawPoly3D([crownTop, cFR, cBR], 34, 46, 42, 0.85 * popAlpha, "rgba(255,255,255,0.8)", 1.2, popScale, totalYOff, rotY, cx, cy);
      drawPoly3D([crownTop, cBR, cBL], 28, 38, 35, 0.85 * popAlpha, "rgba(255,255,255,0.8)", 1.2, popScale, totalYOff, rotY, cx, cy);
      drawPoly3D([crownTop, cBL, cFL], 38, 52, 48, 0.85 * popAlpha, "rgba(255,255,255,0.8)", 1.2, popScale, totalYOff, rotY, cx, cy);

      // Glowing Horizontal Visor Strip across front face
      drawLine3D(-8, -164, 11, 8, -164, 11, rColor, 3.5, popScale, totalYOff, rotY, cx, cy);
      drawPoint3D(0, -164, 11, 2.5, "#ffffff", popScale, totalYOff, rotY, cx, cy);

      // -------------------------------------------------------------
      // 3. UNIQUE ROLE-SPECIFIC LOW-POLY LOADOUTS & PROPS
      // -------------------------------------------------------------
      if (heroIdx === 0) {
        // [HERO 01] COORDINATOR: Commander Mantle + Floating Command Gyro-Orb + Beacon
        // Left arm relaxed with fist
        drawBox3D(-30, -120, 2, 8, 24, 9, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);
        drawPoint3D(-30, -107, 4, 3, "#ffffff", popScale, totalYOff, rotY, cx, cy);

        // Right arm raised presenting command gyro-orb
        drawBox3D(30, -126, 12, 8, 22, 9, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);
        drawPoint3D(30, -114, 22, 3, "#ffffff", popScale, totalYOff, rotY, cx, cy);

        // Floating Low-Poly Command Dodecahedron / Gyro-Orb
        const orbY = -124 + Math.sin(frame * 0.04) * 2.5;
        const orbZ = 28;
        drawBox3D(30, orbY, orbZ, 12, 12, 12, 60, 20, 24, 0.9 * popAlpha, "#e63946", 1.6, popScale, totalYOff, rotY, cx, cy);
        drawPoint3D(30, orbY, orbZ, 3, "#ffffff", popScale, totalYOff, rotY, cx, cy);
        drawCircle3D(30, orbY, orbZ, 16, "rgba(230, 57, 41, 0.6)", 1.2, 16, popScale, totalYOff, rotY, cx, cy);

        // Overhead Diamond Holo-Crown Beacon
        const by = -196 + Math.sin(frame * 0.05) * 3;
        drawBox3D(0, by, 0, 10, 10, 10, 60, 20, 24, 0.9 * popAlpha, "#e63946", 1.5, popScale, totalYOff, rotY, cx, cy);
        drawCircle3D(0, by, 0, 18, "rgba(255, 255, 255, 0.4)", 1, 16, popScale, totalYOff, rotY, cx, cy);

        // Commander Sash (diagonal red cyber-strap)
        drawLine3D(-18, -136, 10, 12, -88, 8, "#e63946", 2.5, popScale, totalYOff, rotY, cx, cy);

      } else if (heroIdx === 1) {
        // [HERO 02] DEV & OPEN SOURCE: Forearm Cyberdeck Gauntlet + Terminal Screen + Matrix Bits
        // Left arm forward holding cyberdeck
        drawBox3D(-24, -120, 14, 8, 20, 8, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);
        drawBox3D(24, -120, 14, 8, 20, 8, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);

        // Cyberdeck Terminal Base Plate
        drawBox3D(0, -112, 24, 36, 5, 22, 20, 48, 36, 0.9 * popAlpha, "#22c55e", 1.5, popScale, totalYOff, rotY, cx, cy);

        // Holographic Terminal Screen (angled upwards)
        const scrTL = [-17, -135, 14], scrTR = [17, -135, 14], scrBR = [17, -114, 18], scrBL = [-17, -114, 18];
        drawPoly3D([scrTL, scrTR, scrBR, scrBL], 20, 80, 45, 0.85 * popAlpha, "#22c55e", 1.6, popScale, totalYOff, rotY, cx, cy);

        // Rising Phosphor Matrix Code Sparks
        for (let i = 0; i < 4; i++) {
          const sx = -12 + i * 8;
          const sy = -116 - ((frame * 1.6 + i * 16) % 28);
          drawPoint3D(sx, sy, 18, 1.8, "#22c55e", popScale, totalYOff, rotY, cx, cy);
        }

      } else if (heroIdx === 2) {
        // [HERO 03] SECURITY & RESEARCH: Volumetric Low-Poly Aegis Riot Shield + Scanner Probe
        // Left arm holding Aegis shield
        drawBox3D(-28, -122, 12, 8, 22, 8, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);

        // Low-Poly Faceted Aegis Shield
        const sx = -30, sy = -118, sz = 24;
        const sCenter = [sx, sy, sz + 8];
        const sTL = [sx - 18, sy - 32, sz], sTR = [sx + 18, sy - 32, sz];
        const sML = [sx - 22, sy + 6, sz],  sMR = [sx + 22, sy + 6, sz];
        const sTip = [sx, sy + 38, sz];

        // 4 Facets of the Kite Shield
        drawPoly3D([sCenter, sTL, sTR], 55, 20, 24, 0.85 * popAlpha, "#e63946", 1.6, popScale, totalYOff, rotY, cx, cy);
        drawPoly3D([sCenter, sTR, sMR], 45, 18, 20, 0.85 * popAlpha, "#e63946", 1.6, popScale, totalYOff, rotY, cx, cy);
        drawPoly3D([sCenter, sMR, sTip], 40, 16, 18, 0.85 * popAlpha, "#e63946", 1.6, popScale, totalYOff, rotY, cx, cy);
        drawPoly3D([sCenter, sTip, sML], 42, 17, 19, 0.85 * popAlpha, "#e63946", 1.6, popScale, totalYOff, rotY, cx, cy);
        drawPoly3D([sCenter, sML, sTL], 50, 19, 22, 0.85 * popAlpha, "#e63946", 1.6, popScale, totalYOff, rotY, cx, cy);

        // Right arm holding tactical scanner blade
        drawBox3D(28, -124, 14, 8, 22, 8, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);
        drawLine3D(28, -120, 24, 28, -120, 48, "#e63946", 2.6, popScale, totalYOff, rotY, cx, cy);
        drawPoint3D(28, -120, 48, 3, "#ffffff", popScale, totalYOff, rotY, cx, cy);

        // Radar frequency ping wave
        const pingPhase = (frame * 0.04) % 1.0;
        drawCircle3D(28, -120, 48 + pingPhase * 30, 8 + pingPhase * 16, `rgba(230, 57, 41, ${1 - pingPhase})`, 1.3, 16, popScale, totalYOff, rotY, cx, cy);

      } else if (heroIdx === 3) {
        // [HERO 04] EDUCATION & COMMUNITY: Low-Poly Holographic Codex Prism + Light Waves
        drawBox3D(-20, -120, 14, 8, 20, 8, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);
        drawBox3D(20, -120, 14, 8, 20, 8, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);

        // Floating Low-Poly Open Codex Book (Dual angled facet prisms)
        const by = -122 + Math.sin(frame * 0.04) * 2;
        const bz = 24;

        // Left wing/page
        const lSpine = [0, by, bz], lTop = [-15, by - 10, bz + 4], lBot = [-15, by + 10, bz + 4], lMid = [0, by + 2, bz];
        drawPoly3D([lSpine, lTop, lBot, lMid], 20, 50, 75, 0.85 * popAlpha, "#38bdf8", 1.5, popScale, totalYOff, rotY, cx, cy);

        // Right wing/page
        const rSpine = [0, by, bz], rTop = [15, by - 10, bz + 4], rBot = [15, by + 10, bz + 4], rMid = [0, by + 2, bz];
        drawPoly3D([rSpine, rTop, rBot, rMid], 20, 50, 75, 0.85 * popAlpha, "#38bdf8", 1.5, popScale, totalYOff, rotY, cx, cy);

        // Radiant central knowledge crystal
        drawBox3D(0, by - 6, bz, 8, 8, 8, 40, 90, 130, 0.9 * popAlpha, "#ffffff", 1.4, popScale, totalYOff, rotY, cx, cy);
        drawPoint3D(0, by - 6, bz, 3, "#38bdf8", popScale, totalYOff, rotY, cx, cy);

        // Floating knowledge spark particles
        for (let i = 0; i < 3; i++) {
          const sa = frame * 0.04 + (i / 3) * Math.PI * 2;
          drawPoint3D(Math.cos(sa) * 18, by - 10 + Math.sin(sa * 2) * 4, bz + Math.sin(sa) * 18, 1.8, "#ffffff", popScale, totalYOff, rotY, cx, cy);
        }

      } else if (heroIdx === 4) {
        // [HERO 05] EVENTS & LOGISTICS: Headset Mic + Transceiver Horn + Timetable Slate
        // Left hand holds tactical walkie-talkie / megaphone
        drawBox3D(-24, -122, 12, 8, 20, 8, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);
        drawBox3D(-22, -124, 22, 10, 16, 12, 38, 48, 44, 0.85 * popAlpha, "#f59e0b", 1.4, popScale, totalYOff, rotY, cx, cy);
        drawLine3D(-22, -132, 22, -22, -150, 22, "#f59e0b", 2.2, popScale, totalYOff, rotY, cx, cy);
        drawPoint3D(-22, -150, 22, 2.5, "#ffffff", popScale, totalYOff, rotY, cx, cy);

        // Concentric soundwave arcs
        for (let i = 0; i < 2; i++) {
          const swPhase = (frame * 0.05 + i * 0.5) % 1.0;
          drawCircle3D(-22, -124, 26 + swPhase * 24, 6 + swPhase * 12, `rgba(245, 158, 11, ${1 - swPhase})`, 1.3, 16, popScale, totalYOff, rotY, cx, cy);
        }

        // Right hand holds timetable clipboard
        drawBox3D(24, -120, 14, 8, 20, 8, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);
        drawBox3D(22, -112, 24, 20, 26, 3, 36, 48, 42, 0.85 * popAlpha, "#ffffff", 1.3, popScale, totalYOff, rotY, cx, cy);
        drawLine3D(16, -118, 26, 28, -118, 26, "#22c55e", 1.3, popScale, totalYOff, rotY, cx, cy);
        drawLine3D(16, -112, 26, 28, -112, 26, "#22c55e", 1.3, popScale, totalYOff, rotY, cx, cy);
        drawLine3D(16, -106, 26, 24, -106, 26, "#22c55e", 1.3, popScale, totalYOff, rotY, cx, cy);

        // Headset with boom mic
        drawLine3D(10, -164, 4, 16, -162, 8, "#ffffff", 1.6, popScale, totalYOff, rotY, cx, cy);
        drawLine3D(16, -162, 8, 10, -156, 14, "#f59e0b", 1.8, popScale, totalYOff, rotY, cx, cy);
        drawPoint3D(10, -156, 14, 2.2, "#f59e0b", popScale, totalYOff, rotY, cx, cy);

      } else if (heroIdx === 5) {
        // [HERO 06] MEDIA & PR: Broadcast Satellite Dish Antenna + Video Capture Prism
        // Left shoulder satellite broadcast dish
        const dishX = -24, dishY = -152, dishZ = -10;
        drawLine3D(-26, -138, 0, dishX, dishY, dishZ, "#ffffff", 2, popScale, totalYOff, rotY, cx, cy);
        drawCircle3D(dishX, dishY, dishZ, 15, "rgba(255, 255, 255, 0.9)", 1.5, 20, popScale, totalYOff, rotY, cx, cy);
        drawCircle3D(dishX, dishY, dishZ, 8, "rgba(255, 255, 255, 0.5)", 1.2, 16, popScale, totalYOff, rotY, cx, cy);
        drawLine3D(dishX, dishY, dishZ, dishX, dishY - 7, dishZ + 14, "#e63946", 2.2, popScale, totalYOff, rotY, cx, cy);
        drawPoint3D(dishX, dishY - 7, dishZ + 14, 2.5, "#e63946", popScale, totalYOff, rotY, cx, cy);

        // Expanding broadcast pulse rings from dish
        const bcPhase = (frame * 0.04) % 1.0;
        drawCircle3D(dishX, dishY - 7, dishZ + 14 + bcPhase * 26, 6 + bcPhase * 16, `rgba(230, 57, 41, ${1 - bcPhase})`, 1.3, 16, popScale, totalYOff, rotY, cx, cy);

        // Right arm holding video camera prism
        drawBox3D(26, -126, 14, 8, 20, 8, bodyBaseR, bodyBaseG, bodyBaseB, 0.75 * popAlpha, "rgba(255,255,255,0.7)", 1.1, popScale, totalYOff, rotY, cx, cy);
        drawBox3D(24, -124, 24, 16, 14, 20, 36, 48, 44, 0.88 * popAlpha, "#ffffff", 1.4, popScale, totalYOff, rotY, cx, cy);
        drawCircle3D(24, -124, 34, 6, "#e63946", 1.6, 16, popScale, totalYOff, rotY, cx, cy);
        drawPoint3D(24, -124, 34, 2.5, "#e63946", popScale, totalYOff, rotY, cx, cy);
      }

      // -------------------------------------------------------------
      // 4. CRT CORNER RETICLES (Crisp Terminal Alignment)
      // -------------------------------------------------------------
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Top-Left reticle
      ctx.moveTo(14, 22); ctx.lineTo(24, 22); ctx.moveTo(14, 22); ctx.lineTo(14, 32);
      // Top-Right reticle
      ctx.moveTo(w - 14, 22); ctx.lineTo(w - 24, 22); ctx.moveTo(w - 14, 22); ctx.lineTo(w - 14, 32);
      // Bottom-Left reticle
      ctx.moveTo(14, h - 22); ctx.lineTo(24, h - 22); ctx.moveTo(14, h - 22); ctx.lineTo(14, h - 32);
      // Bottom-Right reticle
      ctx.moveTo(w - 14, h - 22); ctx.lineTo(w - 24, h - 22); ctx.moveTo(w - 14, h - 22); ctx.lineTo(w - 14, h - 32);
      ctx.stroke();

      frame++;
      this.animationFrameIds["hero_pedestal_3d"] = requestAnimationFrame(render);
    };

    render();
  }

  initServerCluster(canvasId) {
    const container = document.getElementById(canvasId);
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // 3D Sparse Server Objects (World Coordinates)
    // Floor is Y = 0; height goes up (negative Y in 3D)
    const TOWERS = [
      {
        id: "campus_host",
        name: "CAMPUS // PRIMARY CLUSTER",
        subtitle: "10GbE // ISOLATED LAB RANGE",
        x: -125, y: 0, z: 20,
        w: 48, h: 96, d: 42,
        ledColor: "#22c55e", // green
        calloutDir: -1
      },
      {
        id: "compute_ai",
        name: "SECURE COMPUTE // AI & AUDIT",
        subtitle: "vLLM // SUPPLY CHAIN",
        x: 125, y: 0, z: 20,
        w: 48, h: 96, d: 42,
        ledColor: "#f59e0b", // amber
        calloutDir: 1
      },
      {
        id: "campus_mirror",
        name: "CAMPUS MIRROR // STORAGE",
        subtitle: "AITU FOSS REPOSITORIES",
        x: 0, y: 0, z: -115,
        w: 56, h: 108, d: 44,
        ledColor: "#38bdf8", // cyan
        calloutDir: 0
      }
    ];

    // Central 10GbE Optical Switch Platform
    const SWITCH = {
      x: 0, y: 0, z: 5,
      w: 44, h: 22, d: 32
    };

    // 3D Connection Conduits (start -> end 3D points)
    const CONDUITS = [
      { from: TOWERS[0], to: SWITCH, color: "rgba(255, 255, 255, 0.3)", lift: -45 },
      { from: TOWERS[1], to: SWITCH, color: "rgba(255, 255, 255, 0.3)", lift: -45 },
      { from: TOWERS[2], to: SWITCH, color: "rgba(255, 255, 255, 0.3)", lift: -55 },
      { from: TOWERS[0], to: TOWERS[1], color: "rgba(230, 57, 41, 0.35)", lift: -30 } // Purple team bus
    ];

    // Animated data packets traveling along conduits
    const PACKETS = [
      { conduitIdx: 0, t: 0.15, speed: 0.007, color: "#22c55e" },
      { conduitIdx: 0, t: 0.70, speed: 0.009, color: "#ffffff" },
      { conduitIdx: 1, t: 0.35, speed: 0.008, color: "#f59e0b" },
      { conduitIdx: 1, t: 0.85, speed: 0.006, color: "#ffffff" },
      { conduitIdx: 2, t: 0.20, speed: 0.007, color: "#38bdf8" },
      { conduitIdx: 2, t: 0.65, speed: 0.008, color: "#ffffff" },
      { conduitIdx: 3, t: 0.40, speed: 0.010, color: "#e63946" },
      { conduitIdx: 3, t: 0.90, speed: 0.012, color: "#e63946" }
    ];

    let frame = 0;

    // 3D Perspective Projection Matrix
    const project3D = (x, y, z, cx, cy, rotY, pitch, f, camDist) => {
      // Yaw rotation (Y-axis)
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Pitch elevation (X-axis)
      const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      const y1 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP + camDist;

      if (z2 <= 20) return null;
      const scale = f / z2;
      return {
        x: cx + x1 * scale,
        y: cy + y1 * scale,
        scale: scale,
        depth: z2
      };
    };

    const render = () => {
      const w = canvas.width = container.clientWidth || 500;
      const h = canvas.height = container.clientHeight || 320;

      ctx.fillStyle = "#0c100e";
      ctx.fillRect(0, 0, w, h);

      // Camera parameters: gentle subtle orbital sway
      const rotY = Math.sin(frame * 0.004) * 0.38;
      const pitch = 0.36;
      const f = 430;
      const camDist = 500;
      const cx = w * 0.5;
      const cy = h * 0.52;

      // 1. Draw 3D Ground Plane Blueprint Grid & Concentric Metric Rings
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;

      // Ground grid lines
      for (let gx = -220; gx <= 220; gx += 44) {
        const p1 = project3D(gx, 0, -200, cx, cy, rotY, pitch, f, camDist);
        const p2 = project3D(gx, 0, 160, cx, cy, rotY, pitch, f, camDist);
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      for (let gz = -200; gz <= 160; gz += 40) {
        const p1 = project3D(-220, 0, gz, cx, cy, rotY, pitch, f, camDist);
        const p2 = project3D(220, 0, gz, cx, cy, rotY, pitch, f, camDist);
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Radial range rings on ground
      [80, 160, 240].forEach((rad, idx) => {
        ctx.strokeStyle = idx === 1 ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.035)";
        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= Math.PI * 2; a += 0.2) {
          const rx = Math.cos(a) * rad;
          const rz = Math.sin(a) * rad;
          const p = project3D(rx, 0, rz, cx, cy, rotY, pitch, f, camDist);
          if (p) {
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else { ctx.lineTo(p.x, p.y); }
          }
        }
        ctx.stroke();
      });

      // 2. Draw 3D Connection Conduits (Overhead fiber lines between towers & switch)
      CONDUITS.forEach(c => {
        const startX = c.from.x, startY = -c.from.h * 0.75, startZ = c.from.z;
        const endX = c.to.x, endY = -c.to.h * 0.5, endZ = c.to.z;
        const midX = (startX + endX) * 0.5;
        const midY = Math.min(startY, endY) + c.lift;
        const midZ = (startZ + endZ) * 0.5;

        // Sample quadratic 3D curve
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        let first = true;
        for (let step = 0; step <= 16; step++) {
          const u = step / 16;
          // Quadratic bezier in 3D
          const bx = (1 - u) * (1 - u) * startX + 2 * (1 - u) * u * midX + u * u * endX;
          const by = (1 - u) * (1 - u) * startY + 2 * (1 - u) * u * midY + u * u * endY;
          const bz = (1 - u) * (1 - u) * startZ + 2 * (1 - u) * u * midZ + u * u * endZ;
          const p = project3D(bx, by, bz, cx, cy, rotY, pitch, f, camDist);
          if (p) {
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else { ctx.lineTo(p.x, p.y); }
          }
        }
        ctx.stroke();
      });

      // 3. Draw Data Packets Moving Along 3D Conduits
      PACKETS.forEach(pk => {
        pk.t = (pk.t + pk.speed) % 1;
        const c = CONDUITS[pk.conduitIdx];
        const startX = c.from.x, startY = -c.from.h * 0.75, startZ = c.from.z;
        const endX = c.to.x, endY = -c.to.h * 0.5, endZ = c.to.z;
        const midX = (startX + endX) * 0.5;
        const midY = Math.min(startY, endY) + c.lift;
        const midZ = (startZ + endZ) * 0.5;

        const u = pk.t;
        const bx = (1 - u) * (1 - u) * startX + 2 * (1 - u) * u * midX + u * u * endX;
        const by = (1 - u) * (1 - u) * startY + 2 * (1 - u) * u * midY + u * u * endY;
        const bz = (1 - u) * (1 - u) * startZ + 2 * (1 - u) * u * midZ + u * u * endZ;

        const p = project3D(bx, by, bz, cx, cy, rotY, pitch, f, camDist);
        if (p) {
          ctx.fillStyle = pk.color;
          ctx.shadowColor = pk.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5 * (p.scale / 0.8), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Helper function to render a volumetric 3D box with shaded faces & slots
      const draw3DBox = (box, isSwitch = false) => {
        const hw = box.w * 0.5;
        const hd = box.d * 0.5;
        const bh = box.h;

        // 8 box corners in 3D world space
        const v = [
          { x: box.x - hw, y: 0,   z: box.z - hd }, // 0: bottom-back-left
          { x: box.x + hw, y: 0,   z: box.z - hd }, // 1: bottom-back-right
          { x: box.x + hw, y: 0,   z: box.z + hd }, // 2: bottom-front-right
          { x: box.x - hw, y: 0,   z: box.z + hd }, // 3: bottom-front-left
          { x: box.x - hw, y: -bh, z: box.z - hd }, // 4: top-back-left
          { x: box.x + hw, y: -bh, z: box.z - hd }, // 5: top-back-right
          { x: box.x + hw, y: -bh, z: box.z + hd }, // 6: top-front-right
          { x: box.x - hw, y: -bh, z: box.z + hd }, // 7: top-front-left
        ];

        // Project all corners to 2D
        const pv = v.map(pt => project3D(pt.x, pt.y, pt.z, cx, cy, rotY, pitch, f, camDist));
        if (pv.some(p => !p)) return;

        // A. Ground Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.beginPath();
        ctx.moveTo(pv[0].x, pv[0].y);
        ctx.lineTo(pv[1].x, pv[1].y);
        ctx.lineTo(pv[2].x, pv[2].y);
        ctx.lineTo(pv[3].x, pv[3].y);
        ctx.closePath();
        ctx.fill();

        // B. Top Face
        ctx.fillStyle = isSwitch ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.09)";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(pv[4].x, pv[4].y);
        ctx.lineTo(pv[5].x, pv[5].y);
        ctx.lineTo(pv[6].x, pv[6].y);
        ctx.lineTo(pv[7].x, pv[7].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top ventilation vents
        const pTopMid1 = { x: (pv[4].x + pv[7].x) * 0.5, y: (pv[4].y + pv[7].y) * 0.5 };
        const pTopMid2 = { x: (pv[5].x + pv[6].x) * 0.5, y: (pv[5].y + pv[6].y) * 0.5 };
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pTopMid1.x, pTopMid1.y);
        ctx.lineTo(pTopMid2.x, pTopMid2.y);
        ctx.stroke();

        // C. Left Side Face
        ctx.fillStyle = "rgba(16, 22, 20, 0.9)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pv[0].x, pv[0].y);
        ctx.lineTo(pv[3].x, pv[3].y);
        ctx.lineTo(pv[7].x, pv[7].y);
        ctx.lineTo(pv[4].x, pv[4].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // D. Right Side Face
        ctx.fillStyle = "rgba(20, 26, 24, 0.88)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pv[1].x, pv[1].y);
        ctx.lineTo(pv[2].x, pv[2].y);
        ctx.lineTo(pv[6].x, pv[6].y);
        ctx.lineTo(pv[5].x, pv[5].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // E. Front Face (Rack Bay with Blade Units)
        ctx.fillStyle = "#121816";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(pv[3].x, pv[3].y);
        ctx.lineTo(pv[2].x, pv[2].y);
        ctx.lineTo(pv[6].x, pv[6].y);
        ctx.lineTo(pv[7].x, pv[7].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rack Unit Blade Slots & Activity LEDs on front panel
        const numSlots = isSwitch ? 3 : 9;
        for (let s = 1; s <= numSlots; s++) {
          const ratio = s / (numSlots + 1);
          const pLeft = {
            x: pv[7].x + (pv[3].x - pv[7].x) * ratio,
            y: pv[7].y + (pv[3].y - pv[7].y) * ratio
          };
          const pRight = {
            x: pv[6].x + (pv[2].x - pv[6].x) * ratio,
            y: pv[6].y + (pv[2].y - pv[6].y) * ratio
          };

          // Slot boundary line
          ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pLeft.x + 3, pLeft.y);
          ctx.lineTo(pRight.x - 3, pRight.y);
          ctx.stroke();

          // Server Activity LED on front panel
          if (!isSwitch && s % 2 === 1) {
            const ledRatio = 0.82;
            const ledX = pLeft.x + (pRight.x - pLeft.x) * ledRatio;
            const ledY = pLeft.y + (pRight.y - pLeft.y) * ledRatio - 2;
            const isBlink = Math.sin(frame * 0.08 + s * 1.5 + box.x) > -0.3;

            ctx.fillStyle = isBlink ? (box.ledColor || "#22c55e") : "rgba(255,255,255,0.15)";
            ctx.beginPath();
            ctx.arc(ledX, ledY, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Switch Optical Port Indicators
        if (isSwitch) {
          for (let p = 0; p < 4; p++) {
            const pr = 0.25 + p * 0.18;
            const px = pv[7].x + (pv[6].x - pv[7].x) * pr;
            const py = (pv[7].y + pv[3].y) * 0.5;
            ctx.fillStyle = Math.sin(frame * 0.12 + p) > 0 ? "#e63946" : "#22c55e";
            ctx.fillRect(px - 1.5, py - 2, 3, 4);
          }
        }

        // F. Technical 3D HUD Callout Label for Towers
        if (!isSwitch && box.name) {
          const anchorX = (pv[6].x + pv[7].x) * 0.5;
          const anchorY = pv[6].y;
          const dir = box.calloutDir || 1;
          const elbowX = anchorX + (dir === 0 ? 0 : dir * 36);
          const elbowY = anchorY - 26;
          const tagEndX = elbowX + (dir === 0 ? 90 : dir * 85);

          ctx.strokeStyle = "#e63946";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(anchorX, anchorY);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(tagEndX, elbowY);
          ctx.stroke();

          // Anchor pin ring
          ctx.fillStyle = "#e63946";
          ctx.beginPath();
          ctx.arc(anchorX, anchorY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Technical text badge
          const textX = dir < 0 ? tagEndX : elbowX + 4;
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10.5px Consolas, monospace";
          ctx.textAlign = dir < 0 ? "left" : "left";
          ctx.fillText(box.name, textX, elbowY - 6);

          ctx.fillStyle = "#8e9e96";
          ctx.font = "9px Consolas, monospace";
          ctx.fillText(box.subtitle, textX, elbowY + 12);
        }
      };

      // 4. Render All Objects Sorted by Camera Depth (Back to Front)
      const allObjects = [
        ...TOWERS.map(t => ({ box: t, isSwitch: false })),
        { box: SWITCH, isSwitch: true }
      ];

      // Compute camera distance for painter's depth sorting
      allObjects.forEach(obj => {
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
        obj.depth = obj.box.x * sinY + obj.box.z * cosY;
      });

      // Draw furthest objects first
      allObjects.sort((a, b) => a.depth - b.depth);
      allObjects.forEach(obj => draw3DBox(obj.box, obj.isSwitch));

      // 5. Canvas Bottom Blueprint Status Bar
      ctx.textAlign = "left";
      ctx.fillStyle = "#7e8f87";
      ctx.font = "11px Consolas, monospace";
      ctx.fillText("CAMPUS LAB INFRA // 3D TOPOLOGY // 10GbE FIBER MESH", 14, h - 12);

      frame++;
      this.animationFrameIds["servers_3d"] = requestAnimationFrame(render);
    };

    render();
  }
}

// Global instance
window.MainframeGraphics = MainframeGraphics;
