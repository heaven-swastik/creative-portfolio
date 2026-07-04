// ============================================================================
// Premium cinematic Web Audio engine for "Still Frames".
// Fully synthesized — zero external audio assets, zero network requests.
//
// WHAT CHANGED FROM THE PREVIOUS VERSION
// ---------------------------------------------------------------------------
// - The ambient bed is no longer two static pads at 0.024 gain. It's a real
//   score: a 4-voice chord pad that slowly moves through a minor-leaning
//   progression, a breathing sub-bass layer, and a filtered noise "grain"
//   texture — all tied together by a synthesized convolution reverb so
//   everything sits in one believable space instead of feeling dry and thin.
// - Every sound (score and SFX) shares that same reverb send and passes
//   through a single limiter, so nothing clips and nothing feels bolted on.
// - Added `setScene()` so the score's brightness/space/pulse subtly shifts
//   per page or section WITHOUT restarting — continuity across navigation
//   is the whole point of "sound throughout all pages".
// - Added SFX that were missing for full-app coverage: page transitions,
//   hover ticks, click confirms, reveal swells, success/error tones.
// - Added persisted volume + mute preference (localStorage), a limiter,
//   and a dispose() method for clean teardown.
//
// USAGE
// ---------------------------------------------------------------------------
// 1. On the first user gesture anywhere in the app, call:
//      audio.autoInitIfPreferred();
//    e.g. a one-time pointerdown listener in your root layout:
//
//      useEffect(() => {
//        const start = () => {
//          audio.autoInitIfPreferred();
//          window.removeEventListener('pointerdown', start);
//        };
//        window.addEventListener('pointerdown', start, { once: true });
//        return () => window.removeEventListener('pointerdown', start);
//      }, []);
//
// 2. On every route/section change, tell the engine where you are:
//      useEffect(() => { audio.setScene('gallery'); }, [pathname]);
//    The score keeps playing continuously; only its tone shifts.
//
// 3. Fire SFX from the relevant UI events — every method below is a safe
//    no-op if sound isn't on yet, so you can call them unconditionally:
//      onMouseEnter={() => audio.playHoverTick()}
//      onClick={() => audio.playClickConfirm()}
//      router events -> audio.playPageTransition('forward' | 'back')
//      hero/scroll reveal -> audio.playSwell()
//      form success -> audio.playSuccessChime()
//      form error -> audio.playErrorTone()
//      lightbox open / capture moment -> audio.playShutter()
// ============================================================================

export type Scene = 'hero' | 'gallery' | 'detail' | 'about' | 'contact' | 'default';

interface SceneConfig {
  padCutoffMin: number;
  padCutoffMax: number;
  padLfoRate: number;
  textureCutoff: number;
  reverbSend: number;
  subPulseRate: number;
}

// Warm, brighter, more intimate than a dark hall — a "cozy room" character
// rather than a cathedral, to match an old-retro / charming mood.
const SCENES: Record<Scene, SceneConfig> = {
  hero:    { padCutoffMin: 650, padCutoffMax: 1900, padLfoRate: 0.05,  textureCutoff: 4200, reverbSend: 0.24, subPulseRate: 0.12 },
  gallery: { padCutoffMin: 850, padCutoffMax: 2300, padLfoRate: 0.07,  textureCutoff: 5000, reverbSend: 0.18, subPulseRate: 0.16 },
  detail:  { padCutoffMin: 450, padCutoffMax: 1200, padLfoRate: 0.04,  textureCutoff: 3200, reverbSend: 0.3,  subPulseRate: 0.08 },
  about:   { padCutoffMin: 600, padCutoffMax: 1600, padLfoRate: 0.045, textureCutoff: 3800, reverbSend: 0.22, subPulseRate: 0.1 },
  contact: { padCutoffMin: 650, padCutoffMax: 1750, padLfoRate: 0.05,  textureCutoff: 4000, reverbSend: 0.22, subPulseRate: 0.1 },
  default: { padCutoffMin: 650, padCutoffMax: 1800, padLfoRate: 0.05,  textureCutoff: 4000, reverbSend: 0.22, subPulseRate: 0.12 },
};

// A warm, major-leaning "old records" progression — C6 - Am7 - F6 - G6 —
// the same family of 6th-chords behind countless nostalgic lounge and
// home-movie scores. Four voices spelling each chord low to high. Exact
// equal-temperament frequencies, A4 = 440Hz.
const CHORD_BANK: [number, number, number, number][] = [
  [130.81, 164.81, 196.0, 220.0], // C3 E3 G3 A3  — Cmaj6, warm and open
  [110.0, 130.81, 164.81, 196.0], // A2 C3 E3 G3  — Am7, a gentle wistful lift
  [87.31, 110.0, 130.81, 146.83], // F2 A2 C3 D3  — Fmaj6, soft glow
  [98.0, 123.47, 146.83, 164.81], // G2 B2 D3 E3  — G6, homecoming resolve
];

interface LFOHandle {
  lfo: OscillatorNode;
  depth: GainNode;
  offset: ConstantSourceNode;
}

function makeLimiter(ctx: AudioContext): DynamicsCompressorNode {
  const c = ctx.createDynamicsCompressor();
  const now = ctx.currentTime;
  c.threshold.setValueAtTime(-18, now);
  c.knee.setValueAtTime(24, now);
  c.ratio.setValueAtTime(3.5, now);
  c.attack.setValueAtTime(0.01, now);
  c.release.setValueAtTime(0.3, now);
  return c;
}

class AudioEngine {
  private static readonly VOL_KEY = 'sf_audio_volume';
  private static readonly MUTE_KEY = 'sf_audio_muted';

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverb: ConvolverNode | null = null;
  private reverbReturn: GainNode | null = null;

  // --- Cinematic score state ---
  private padOscs: OscillatorNode[] = [];
  private padChorusOscs: OscillatorNode[] = []; // detuned unison layer — warm vintage-synth chorus
  private padVoiceGains: GainNode[] = [];
  private padChorusGains: GainNode[] = [];
  private padPanners: StereoPannerNode[] = [];
  private padFilter: BiquadFilterNode | null = null;
  private padMasterGain: GainNode | null = null;
  private padFilterLfo: LFOHandle | null = null;
  private focusOffset: ConstantSourceNode | null = null;

  // Tape "wow" (slow) and "flutter" (fast) — subtle pitch imperfection that
  // reads as warm old-tape/vinyl character rather than a clean digital pad.
  private padWobbleLfo: { lfo: OscillatorNode; depth: GainNode } | null = null;
  private padFlutterLfo: { lfo: OscillatorNode; depth: GainNode } | null = null;

  // Occasional soft music-box/bell phrase for charm.
  private sparkleTimer: number | null = null;

  private subOsc: OscillatorNode | null = null;
  private subGain: GainNode | null = null;
  private subPulseLfo: LFOHandle | null = null;

  private textureNoise: AudioBufferSourceNode | null = null;
  private textureFilter: BiquadFilterNode | null = null;
  private textureGain: GainNode | null = null;
  private textureFilterLfo: LFOHandle | null = null;

  private reverbSendGain: GainNode | null = null;

  private chordIndex = 0;
  private chordTimer: number | null = null;
  private currentScene: Scene = 'default';

  private isSoundOn = false;
  private masterVolume = 0.85;
  private prefersSound = true;

  private lastGearTick = 0;
  private lastHoverTick = 0;

  constructor() {
    if (typeof window === 'undefined') return;
    try {
      const savedVol = window.localStorage.getItem(AudioEngine.VOL_KEY);
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (!Number.isNaN(v)) this.masterVolume = Math.min(1, Math.max(0, v));
      }
      this.prefersSound = window.localStorage.getItem(AudioEngine.MUTE_KEY) !== 'true';
    } catch (e) {
      // localStorage unavailable (private browsing, etc.) — defaults stand.
    }
  }

  // ==========================================================================
  // Lifecycle
  // ==========================================================================

  /** Call once on the first user gesture. Safe to call repeatedly. */
  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      const now = this.ctx.currentTime;

      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(this.masterVolume, now);
      this.master.connect(this.ctx.destination);

      this.compressor = makeLimiter(this.ctx);
      this.compressor.connect(this.master);

      this.reverb = this.ctx.createConvolver();
      this.reverb.buffer = this.buildImpulseResponse(1.8, 2.4);
      this.reverbReturn = this.ctx.createGain();
      this.reverbReturn.gain.setValueAtTime(0.9, now);
      this.reverb.connect(this.reverbReturn);
      this.reverbReturn.connect(this.compressor);

      this.isSoundOn = true;
      this.startCinematicScore();
    } catch (e) {
      console.warn('Web Audio API not supported on this browser', e);
    }
  }

  /** Calls init() only if the user hadn't previously muted. */
  public autoInitIfPreferred() {
    if (this.prefersSound && !this.ctx) this.init();
  }

  public prefersSoundOn(): boolean {
    return this.prefersSound;
  }

  public toggleSound(state?: boolean): boolean {
    const target = state !== undefined ? state : !this.isSoundOn;
    if (target) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      this.isSoundOn = true;
      if (!this.padOscs.length) this.startCinematicScore();
    } else {
      this.isSoundOn = false;
      this.stopCinematicScore();
    }
    this.prefersSound = target;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(AudioEngine.MUTE_KEY, (!target).toString());
      } catch (e) {}
    }
    return this.isSoundOn;
  }

  public getStatus(): boolean {
    return this.isSoundOn;
  }

  public setVolume(v: number) {
    this.masterVolume = Math.min(1, Math.max(0, v));
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(AudioEngine.VOL_KEY, this.masterVolume.toString());
      } catch (e) {}
    }
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public getScene(): Scene {
    return this.currentScene;
  }

  /** Tear everything down, e.g. on full app unmount. */
  public dispose() {
    this.stopCinematicScore();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
    this.master = null;
    this.compressor = null;
    this.reverb = null;
    this.reverbReturn = null;
    this.isSoundOn = false;
  }

  // ==========================================================================
  // Scene control — call on every route/section change. Shifts the score's
  // brightness, space, and pulse over ~3.5s without restarting anything.
  // ==========================================================================

  public setScene(scene: Scene) {
    this.currentScene = scene;
    if (!this.ctx || !this.isSoundOn) return;
    const cfg = SCENES[scene];
    const now = this.ctx.currentTime;
    const smoothing = 1.2;

    if (this.padFilterLfo) {
      this.padFilterLfo.depth.gain.setTargetAtTime((cfg.padCutoffMax - cfg.padCutoffMin) / 2, now, smoothing);
      this.padFilterLfo.offset.offset.setTargetAtTime((cfg.padCutoffMax + cfg.padCutoffMin) / 2, now, smoothing);
      this.padFilterLfo.lfo.frequency.setTargetAtTime(cfg.padLfoRate, now, smoothing);
    }
    if (this.textureFilterLfo) {
      this.textureFilterLfo.depth.gain.setTargetAtTime(cfg.textureCutoff * 0.3, now, smoothing);
      this.textureFilterLfo.offset.offset.setTargetAtTime(cfg.textureCutoff, now, smoothing);
    }
    if (this.subPulseLfo) {
      this.subPulseLfo.lfo.frequency.setTargetAtTime(cfg.subPulseRate, now, smoothing);
    }
    if (this.reverbSendGain) {
      this.reverbSendGain.gain.setTargetAtTime(cfg.reverbSend, now, smoothing);
    }
  }

  /**
   * Ties an on-screen focus/blur value directly to the score's brightness —
   * sharp focus brightens the pad, soft focus darkens it. Preserved from the
   * original engine's `adjustFocusPitch`, rewired into the new mix.
   */
  public adjustFocusPitch(blurValue: number) {
    if (!this.isSoundOn || !this.ctx || !this.focusOffset) return;
    const now = this.ctx.currentTime;
    const clamped = Math.min(Math.max(blurValue, 0), 40);
    const target = 260 - (clamped / 40) * 520; // +260Hz (sharp) .. -260Hz (soft)
    this.focusOffset.offset.setTargetAtTime(target, now, 0.2);
  }

  // ==========================================================================
  // The cinematic score
  // ==========================================================================

  private startCinematicScore() {
    if (!this.ctx || !this.compressor || !this.reverb || this.padOscs.length) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const scene = SCENES[this.currentScene];

    // --- Pad: four voices spelling the current chord, slow filter movement ---
    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.Q.setValueAtTime(0.6, now);
    this.padFilter.frequency.setValueAtTime((scene.padCutoffMin + scene.padCutoffMax) / 2, now);

    this.padMasterGain = ctx.createGain();
    this.padMasterGain.gain.setValueAtTime(0.0001, now);
    this.padMasterGain.gain.linearRampToValueAtTime(0.09, now + 3.5);

    this.padFilter.connect(this.padMasterGain);
    this.padMasterGain.connect(this.compressor);

    this.reverbSendGain = ctx.createGain();
    this.reverbSendGain.gain.setValueAtTime(scene.reverbSend, now);
    this.padMasterGain.connect(this.reverbSendGain);
    this.reverbSendGain.connect(this.reverb);

    const chord = CHORD_BANK[this.chordIndex];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((i - 1.5) * 3, now);

      // A slightly-sharp detuned unison layer — the classic warm chorus of
      // an old analog synth pad, gently thickening each voice.
      const oscChorus = ctx.createOscillator();
      oscChorus.type = 'sine';
      oscChorus.frequency.setValueAtTime(freq, now);
      oscChorus.detune.setValueAtTime((i - 1.5) * 3 + 7, now);

      const voiceGain = ctx.createGain();
      voiceGain.gain.setValueAtTime(0.9 - i * 0.08, now);

      const chorusGain = ctx.createGain();
      chorusGain.gain.setValueAtTime((0.9 - i * 0.08) * 0.55, now);

      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime((i - 1.5) * 0.2, now);
      this.createLFO(0.02 + i * 0.008, -0.35, 0.35, panner.pan);

      osc.connect(voiceGain);
      oscChorus.connect(chorusGain);
      voiceGain.connect(panner);
      chorusGain.connect(panner);
      panner.connect(this.padFilter!);
      osc.start(now);
      oscChorus.start(now);

      this.padOscs.push(osc);
      this.padChorusOscs.push(oscChorus);
      this.padVoiceGains.push(voiceGain);
      this.padChorusGains.push(chorusGain);
      this.padPanners.push(panner);
    });

    // Tape "wow" (slow, wide) and "flutter" (fast, subtle) riding on top of
    // every pad voice's detune — the small pitch imperfection that reads as
    // an old cassette or record rather than a clean digital pad.
    const wobble = ctx.createOscillator();
    wobble.type = 'sine';
    wobble.frequency.setValueAtTime(0.22, now);
    const wobbleDepth = ctx.createGain();
    wobbleDepth.gain.setValueAtTime(4.5, now);
    wobble.connect(wobbleDepth);
    wobble.start(now);

    const flutter = ctx.createOscillator();
    flutter.type = 'sine';
    flutter.frequency.setValueAtTime(4.8, now);
    const flutterDepth = ctx.createGain();
    flutterDepth.gain.setValueAtTime(1.4, now);
    flutter.connect(flutterDepth);
    flutter.start(now);

    [...this.padOscs, ...this.padChorusOscs].forEach((voice) => {
      wobbleDepth.connect(voice.detune);
      flutterDepth.connect(voice.detune);
    });

    this.padWobbleLfo = { lfo: wobble, depth: wobbleDepth };
    this.padFlutterLfo = { lfo: flutter, depth: flutterDepth };

    this.padFilterLfo = this.createLFO(scene.padLfoRate, scene.padCutoffMin, scene.padCutoffMax, this.padFilter.frequency);

    this.focusOffset = ctx.createConstantSource();
    this.focusOffset.offset.setValueAtTime(0, now);
    this.focusOffset.connect(this.padFilter.frequency);
    this.focusOffset.start(now);

    // --- Sub: slow-breathing low fundamental beneath the pad ---
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(chord[0] / 2, now);

    this.subGain = ctx.createGain();
    this.subGain.gain.setValueAtTime(0.05, now);

    this.subOsc.connect(this.subGain);
    this.subGain.connect(this.compressor);
    this.subOsc.start(now);

    this.subPulseLfo = this.createLFO(scene.subPulseRate, 0.02, 0.075, this.subGain.gain);

    // --- Texture: soft tape/vinyl hiss with sparse crackle pops, instead
    //     of a brooding noise-grain — this is what sells "old and loved"
    //     rather than "cinematic and dark". ---
    const noiseBuffer = ctx.createBuffer(2, ctx.sampleRate * 4, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = noiseBuffer.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.06 * white) / 1.06; // soft hiss bed
        let sample = last * 1.6;
        if (Math.random() < 0.00008) {
          sample += (Math.random() * 2 - 1) * (2.2 + Math.random() * 1.8); // a stray dust pop
        }
        data[i] = sample;
      }
    }
    this.textureNoise = ctx.createBufferSource();
    this.textureNoise.buffer = noiseBuffer;
    this.textureNoise.loop = true;

    this.textureFilter = ctx.createBiquadFilter();
    this.textureFilter.type = 'bandpass';
    this.textureFilter.Q.setValueAtTime(0.5, now);
    this.textureFilter.frequency.setValueAtTime(scene.textureCutoff, now);

    this.textureGain = ctx.createGain();
    this.textureGain.gain.setValueAtTime(0.012, now);

    this.textureNoise.connect(this.textureFilter);
    this.textureFilter.connect(this.textureGain);
    this.textureGain.connect(this.compressor);

    const textureSend = ctx.createGain();
    textureSend.gain.setValueAtTime(0.08, now);
    this.textureGain.connect(textureSend);
    textureSend.connect(this.reverb);

    this.textureNoise.start(now);
    this.textureFilterLfo = this.createLFO(0.03, scene.textureCutoff * 0.7, scene.textureCutoff * 1.3, this.textureFilter.frequency);

    this.scheduleChordEvolution();
    this.scheduleSparkle();
  }

  private scheduleChordEvolution() {
    if (this.chordTimer) window.clearTimeout(this.chordTimer);
    if (!this.ctx || !this.isSoundOn) return;

    const advance = () => {
      if (!this.ctx || !this.isSoundOn || !this.padOscs.length) return;
      this.chordIndex = (this.chordIndex + 1) % CHORD_BANK.length;
      const chord = CHORD_BANK[this.chordIndex];
      const now = this.ctx.currentTime;
      const rampTime = 7; // slow, deliberate voice-leading

      this.padOscs.forEach((osc, i) => {
        osc.frequency.linearRampToValueAtTime(chord[i], now + rampTime);
      });
      this.padChorusOscs.forEach((osc, i) => {
        osc.frequency.linearRampToValueAtTime(chord[i], now + rampTime);
      });
      if (this.subOsc) {
        this.subOsc.frequency.linearRampToValueAtTime(chord[0] / 2, now + rampTime);
      }
      this.chordTimer = window.setTimeout(advance, 26000 + Math.random() * 8000);
    };

    this.chordTimer = window.setTimeout(advance, 26000 + Math.random() * 8000);
  }

  /** Sparse, gentle music-box notes plucked from the current chord — the
   *  charm layer. Never insistent, just an occasional glint. */
  private scheduleSparkle() {
    if (this.sparkleTimer) window.clearTimeout(this.sparkleTimer);
    if (!this.ctx || !this.isSoundOn) return;

    const playOnce = () => {
      if (!this.ctx || !this.isSoundOn) return;
      const chord = CHORD_BANK[this.chordIndex];
      const now = this.ctx.currentTime;
      const noteCount = Math.random() < 0.5 ? 1 : 2;
      for (let n = 0; n < noteCount; n++) {
        const base = chord[Math.floor(Math.random() * chord.length)] * 4; // up two octaves
        const t = now + n * (0.18 + Math.random() * 0.12);
        this.playBellNote(base, t);
      }
      this.sparkleTimer = window.setTimeout(playOnce, 9000 + Math.random() * 14000);
    };

    this.sparkleTimer = window.setTimeout(playOnce, 6000 + Math.random() * 8000);
  }

  private playBellNote(freq: number, t: number) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();
    const overtoneGain = ctx.createGain();
    const pan = ctx.createStereoPanner();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2.76, t); // slightly inharmonic — bell-like

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + 1.8);

    overtoneGain.gain.setValueAtTime(0, t);
    overtoneGain.gain.linearRampToValueAtTime(0.015, t + 0.01);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0005, t + 0.9);

    pan.pan.setValueAtTime((Math.random() - 0.5) * 0.6, t);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(pan);
    overtoneGain.connect(pan);
    this.connectToMix(pan, 0.5);

    osc.start(t);
    overtone.start(t);
    osc.stop(t + 2);
    overtone.stop(t + 1);
  }

  private stopCinematicScore() {
    if (this.chordTimer) {
      window.clearTimeout(this.chordTimer);
      this.chordTimer = null;
    }

    this.padOscs.forEach((o) => this.safeStop(o));
    this.padChorusOscs.forEach((o) => this.safeStop(o));
    this.padVoiceGains.forEach((g) => this.safeDisconnect(g));
    this.padChorusGains.forEach((g) => this.safeDisconnect(g));
    this.padPanners.forEach((p) => this.safeDisconnect(p));
    this.padOscs = [];
    this.padChorusOscs = [];
    this.padVoiceGains = [];
    this.padChorusGains = [];
    this.padPanners = [];

    if (this.padWobbleLfo) {
      this.safeStop(this.padWobbleLfo.lfo);
      this.safeDisconnect(this.padWobbleLfo.depth);
      this.padWobbleLfo = null;
    }
    if (this.padFlutterLfo) {
      this.safeStop(this.padFlutterLfo.lfo);
      this.safeDisconnect(this.padFlutterLfo.depth);
      this.padFlutterLfo = null;
    }
    if (this.sparkleTimer) {
      window.clearTimeout(this.sparkleTimer);
      this.sparkleTimer = null;
    }

    if (this.padFilterLfo) {
      this.safeStop(this.padFilterLfo.lfo);
      this.safeStop(this.padFilterLfo.offset);
      this.safeDisconnect(this.padFilterLfo.depth);
      this.padFilterLfo = null;
    }
    this.safeStop(this.focusOffset);
    this.focusOffset = null;
    this.safeDisconnect(this.padFilter);
    this.safeDisconnect(this.padMasterGain);
    this.padFilter = null;
    this.padMasterGain = null;

    this.safeStop(this.subOsc);
    this.safeDisconnect(this.subGain);
    this.subOsc = null;
    this.subGain = null;
    if (this.subPulseLfo) {
      this.safeStop(this.subPulseLfo.lfo);
      this.safeStop(this.subPulseLfo.offset);
      this.safeDisconnect(this.subPulseLfo.depth);
      this.subPulseLfo = null;
    }

    this.safeStop(this.textureNoise);
    this.safeDisconnect(this.textureFilter);
    this.safeDisconnect(this.textureGain);
    this.textureNoise = null;
    this.textureFilter = null;
    this.textureGain = null;
    if (this.textureFilterLfo) {
      this.safeStop(this.textureFilterLfo.lfo);
      this.safeStop(this.textureFilterLfo.offset);
      this.safeDisconnect(this.textureFilterLfo.depth);
      this.textureFilterLfo = null;
    }

    this.safeDisconnect(this.reverbSendGain);
    this.reverbSendGain = null;
  }

  // ==========================================================================
  // Sound effects — every one routes through the shared reverb send so it
  // sits in the same space as the score instead of feeling pasted on top.
  // ==========================================================================

  /** Camera shutter — reserve for "capture" moments: opening a lightbox, etc. */
  public playShutter() {
    if (!this.isSoundOn || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const jitter = 1 + (Math.random() * 0.04 - 0.02);

    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200 * jitter, now);
    noiseFilter.Q.setValueAtTime(4, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.13, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    const noisePan = ctx.createStereoPanner();
    noisePan.pan.setValueAtTime((Math.random() - 0.5) * 0.15, now);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(noisePan);
    this.connectToMix(noisePan, 0.18);

    const oscClick = ctx.createOscillator();
    const clickGain = ctx.createGain();
    oscClick.type = 'sine';
    oscClick.frequency.setValueAtTime(3000 * jitter, now);
    oscClick.frequency.exponentialRampToValueAtTime(120, now + 0.015);
    clickGain.gain.setValueAtTime(0.16, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    oscClick.connect(clickGain);
    this.connectToMix(clickGain, 0.1);

    const oscBody = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    const bodyFilter = ctx.createBiquadFilter();
    oscBody.type = 'sawtooth';
    oscBody.frequency.setValueAtTime(180, now);
    oscBody.frequency.linearRampToValueAtTime(80, now + 0.05);
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(250, now);
    bodyGain.gain.setValueAtTime(0.06, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    oscBody.connect(bodyFilter);
    bodyFilter.connect(bodyGain);
    this.connectToMix(bodyGain, 0.15);

    noiseSource.start(now);
    oscClick.start(now);
    oscBody.start(now);
    noiseSource.stop(now + 0.06);
    oscClick.stop(now + 0.02);
    oscBody.stop(now + 0.09);
  }

  /** Tactile lens-scroll tick — for sliders, carousels, filter dials. */
  public playLensDial() {
    if (!this.isSoundOn || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const jitter = 1 + (Math.random() * 0.08 - 0.04);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const pan = ctx.createStereoPanner();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2200 * jitter, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.006);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, now);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);
    pan.pan.setValueAtTime((Math.random() - 0.5) * 0.3, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(pan);
    this.connectToMix(pan, 0.12);

    osc.start(now);
    osc.stop(now + 0.008);
  }

  /** Multi-tooth mechanical ratchet — hover states, scroll detents, phase-locks. */
  public playGearTick() {
    if (!this.isSoundOn || !this.ctx) return;
    const now0 = this.ctx.currentTime;
    if (now0 - this.lastGearTick < 0.09) return;
    this.lastGearTick = now0;
    const ctx = this.ctx;
    const now = now0;
    const teeth = 3;

    for (let i = 0; i < teeth; i++) {
      const t = now + i * 0.028;
      const bufferSize = Math.floor(ctx.sampleRate * 0.012);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let n = 0; n < bufferSize; n++) data[n] = (Math.random() * 2 - 1) * (1 - n / bufferSize);

      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2600 - i * 400, t);
      filter.Q.setValueAtTime(6, t);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.065 - i * 0.012, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      const pan = ctx.createStereoPanner();
      pan.pan.setValueAtTime(-0.3 + i * 0.3, t); // sweeps L->R across the "teeth"

      src.connect(filter);
      filter.connect(gain);
      gain.connect(pan);
      this.connectToMix(pan, 0.1);

      src.start(t);
      src.stop(t + 0.025);
    }
  }

  /** Soft glass chime — tour-guide commentary appearing on screen. */
  public playGuideChime() {
    if (!this.isSoundOn || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const notes = [1046.5, 1568.0]; // C6, G6

    notes.forEach((freq, i) => {
      const t = now + i * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain);
      this.connectToMix(gain, 0.35);
      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  /** Very light UI tick — nav items, thumbnails, anything on hover. */
  public playHoverTick() {
    if (!this.isSoundOn || !this.ctx) return;
    const now0 = this.ctx.currentTime;
    if (now0 - this.lastHoverTick < 0.05) return;
    this.lastHoverTick = now0;
    const ctx = this.ctx;
    const now = now0;
    const jitter = 1 + (Math.random() * 0.1 - 0.05);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const pan = ctx.createStereoPanner();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2600 * jitter, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.02);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    pan.pan.setValueAtTime((Math.random() - 0.5) * 0.4, now);

    osc.connect(gain);
    gain.connect(pan);
    this.connectToMix(pan, 0.15);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /** Soft physical "thock" — generic button/CTA clicks, saves, toggles. */
  public playClickConfirm() {
    if (!this.isSoundOn || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.02);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1800, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    this.connectToMix(noiseGain, 0.2);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);
    oscGain.gain.setValueAtTime(0.07, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(oscGain);
    this.connectToMix(oscGain, 0.15);

    noiseSrc.start(now);
    osc.start(now);
    noiseSrc.stop(now + 0.03);
    osc.stop(now + 0.07);
  }

  /** Cinematic whoosh — fire right as a route/page change begins. */
  public playPageTransition(direction: 'forward' | 'back' = 'forward') {
    if (!this.isSoundOn || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const dur = 0.9;
    const dir = direction === 'forward' ? 1 : -1;

    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.1, now);
    filter.frequency.setValueAtTime(dir > 0 ? 300 : 2600, now);
    filter.frequency.exponentialRampToValueAtTime(dir > 0 ? 2600 : 300, now + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + dur * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + dur);

    const pan = ctx.createStereoPanner();
    pan.pan.setValueAtTime(-0.6 * dir, now);
    pan.pan.linearRampToValueAtTime(0.6 * dir, now + dur);

    noiseSrc.connect(filter);
    filter.connect(gain);
    gain.connect(pan);
    this.connectToMix(pan, 0.4);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(dir > 0 ? 180 : 640, now);
    osc.frequency.exponentialRampToValueAtTime(dir > 0 ? 640 : 180, now + dur);
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.linearRampToValueAtTime(0.03, now + dur * 0.5);
    oscGain.gain.exponentialRampToValueAtTime(0.0005, now + dur);
    osc.connect(oscGain);
    this.connectToMix(oscGain, 0.35);

    noiseSrc.start(now);
    osc.start(now);
    noiseSrc.stop(now + dur + 0.05);
    osc.stop(now + dur + 0.05);
  }

  /** Slow riser — hero reveal, scroll-triggered image reveal, big moments. */
  public playSwell(duration = 2.4) {
    if (!this.isSoundOn || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.linearRampToValueAtTime(2200, now + duration * 0.85);
    filter.Q.setValueAtTime(0.7, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + duration * 0.75);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

    noiseSrc.connect(filter);
    filter.connect(gain);
    this.connectToMix(gain, 0.45);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.linearRampToValueAtTime(0.03, now + duration * 0.7);
    oscGain.gain.exponentialRampToValueAtTime(0.0005, now + duration);
    osc.connect(oscGain);
    this.connectToMix(oscGain, 0.4);

    noiseSrc.start(now);
    osc.start(now);
    noiseSrc.stop(now + duration + 0.1);
    osc.stop(now + duration + 0.1);
  }

  /** Warm three-note arpeggio — form submitted, item saved, task done. */
  public playSuccessChime() {
    if (!this.isSoundOn || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5

    notes.forEach((freq, i) => {
      const t = now + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      osc.connect(gain);
      this.connectToMix(gain, 0.4);
      osc.start(t);
      osc.stop(t + 1);
    });
  }

  /** Soft descending tone — validation errors. Deliberately not harsh. */
  public playErrorTone() {
    if (!this.isSoundOn || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const notes = [220, 207.65]; // A3 -> Ab3

    notes.forEach((freq, i) => {
      const t = now + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.045, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(filter);
      filter.connect(gain);
      this.connectToMix(gain, 0.2);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // ==========================================================================
  // Internals
  // ==========================================================================

  private buildImpulseResponse(duration = 1.8, decay = 2.4): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * duration);
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < length; i++) {
        // Gentle one-pole smoothing softens the top end — a warmer, more
        // vintage plate/spring character instead of a bright digital tail.
        const white = Math.random() * 2 - 1;
        last = (last + 0.35 * white) / 1.35;
        data[i] = last * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }

  private connectToMix(node: AudioNode, sendAmount = 0.25) {
    if (!this.compressor) return;
    node.connect(this.compressor);
    if (this.reverb && sendAmount > 0) {
      const send = this.ctx!.createGain();
      send.gain.setValueAtTime(sendAmount, this.ctx!.currentTime);
      node.connect(send);
      send.connect(this.reverb);
    }
  }

  private createLFO(rate: number, min: number, max: number, target: AudioParam): LFOHandle {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(rate, now);
    const depth = ctx.createGain();
    depth.gain.setValueAtTime((max - min) / 2, now);
    const offset = ctx.createConstantSource();
    offset.offset.setValueAtTime((max + min) / 2, now);
    lfo.connect(depth);
    depth.connect(target);
    offset.connect(target);
    lfo.start();
    offset.start();
    return { lfo, depth, offset };
  }

  private safeStop(node: OscillatorNode | AudioBufferSourceNode | ConstantSourceNode | null) {
    if (!node) return;
    try {
      node.stop();
    } catch (e) {}
    try {
      node.disconnect();
    } catch (e) {}
  }

  private safeDisconnect(node: AudioNode | null) {
    if (!node) return;
    try {
      node.disconnect();
    } catch (e) {}
  }
}

export const audio = new AudioEngine();
export default audio;