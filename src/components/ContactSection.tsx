import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from './AudioEngine';
import { Send, Mail, Instagram, ArrowUpRight, RotateCcw } from 'lucide-react';
import Reveal from './Reveal';
import LiquidEther from './LiquidEther';
import { useMagnetic } from '../hooks/useMagnetic';

interface ContactSectionProps {
  onRestartExperience: () => void;
}

export default function ContactSection({ onRestartExperience }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    audio.playShutter();
    setIsSubmitted(true);
    
    // Reset form
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Play microscopic dial ticks as they type to simulate vintage typewriter/camera clicks
    audio.playLensDial();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen swastik-aura-bg text-[#16151a] font-sans flex flex-col justify-between overflow-hidden px-8 py-12 md:p-24">
      {/* Background texture and soft vignette */}
      <div className="absolute inset-0 sketch-paper opacity-30 pointer-events-none z-0" />
      <div className="absolute inset-0 swastik-grain-heavy pointer-events-none z-0" />
      {/* Liquid Ether — adapted from react-bits, restyled in the site's own ink/red palette */}
      <LiquidEther className="z-0" intensity={0.35} mouseForce={0.35} />

      {/* TOP DECK STATUS */}
      <header className="relative z-10 flex justify-between items-center w-full">
        <span className="font-mono text-xs tracking-[0.3em] text-[#4a4852] uppercase">
          CLOSING CREDITS // SCENE IV
        </span>
        <button
          onClick={() => {
            audio.playShutter();
            onRestartExperience();
          }}
          data-cursor="link"
          className="flex items-center gap-2 border border-[#16151a]/20 hover:border-[#b3122a]/40 rounded-full px-5 py-2 font-mono text-[9px] text-[#4a4852] hover:text-[#b3122a] transition-all bg-white/70 backdrop-blur-sm swastik-elevated"
          id="restart-exhibit-btn"
        >
          <RotateCcw size={10} />
          <span>REPLAY EXPERIENCE</span>
        </button>
      </header>

      {/* CENTRAL SCENE: CINEMATIC FORM & CREDITS ROLL */}
      <main className="relative z-10 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-16 items-center my-12">
        
        {/* EDITORIAL CONTACT SHEET (Left 6 Columns) */}
        <div className="lg:col-span-6 space-y-12">
          <Reveal className="space-y-4">
            <span className="font-mono text-xs text-[#b3122a] tracking-widest uppercase">
              [THE CONVERSATION] INQUIRY SHEETS
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-[#16151a]">
              Let&apos;s Create.
            </h1>
            <p className="font-sans text-xs md:text-sm text-[#4a4852] leading-relaxed max-w-md">
              Whether you wish to co-direct an independent movie, license a structural print, or commission a raw brand identity system—send your coordinates.
            </p>
          </Reveal>

          {/* Minimal line-input contact form */}
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-8 max-w-lg"
              >
                <div className="space-y-1 relative">
                  <label className="font-mono text-[8px] text-[#4a4852] uppercase tracking-widest block">
                    01 // IDENTIFICATION
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="ENTER YOUR FULL NAME"
                    required
                    className="w-full bg-transparent border-b border-[#16151a]/20 py-3 text-sm text-[#16151a] placeholder-[#8a8790]/70 focus:border-[#b3122a] focus:outline-none transition-colors font-sans uppercase tracking-wider"
                  />
                </div>

                <div className="space-y-1 relative">
                  <label className="font-mono text-[8px] text-[#4a4852] uppercase tracking-widest block">
                    02 // DIGITAL ADDRESS
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ENTER EMAIL COORDINATES"
                    required
                    className="w-full bg-transparent border-b border-[#16151a]/20 py-3 text-sm text-[#16151a] placeholder-[#8a8790]/70 focus:border-[#b3122a] focus:outline-none transition-colors font-sans uppercase tracking-wider"
                  />
                </div>

                <div className="space-y-1 relative">
                  <label className="font-mono text-[8px] text-[#4a4852] uppercase tracking-widest block">
                    03 // CONTEXT STATEMENT
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="BRIEF THE CREATIVE VISION..."
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-[#16151a]/20 py-3 text-sm text-[#16151a] placeholder-[#8a8790]/70 focus:border-[#b3122a] focus:outline-none transition-colors font-sans resize-none uppercase tracking-wider"
                  />
                </div>

                <SubmitButton />
              </motion.form>
            ) : (
              <motion.div
                key="form-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 border border-[#b3122a]/20 rounded-2xl bg-[#b3122a]/5 max-w-lg space-y-4"
              >
                <div className="flex items-center gap-2 text-[#b3122a]">
                  <span className="w-2 h-2 rounded-full bg-[#b3122a] animate-ping" />
                  <span className="font-mono text-xs uppercase font-bold tracking-widest">
                    TRANSMISSION COMPLETED
                  </span>
                </div>
                <h3 className="font-sans text-xl font-bold uppercase tracking-tight text-[#16151a]">
                  SIGNAL ENGAGED // SHUTTER ACTIVE
                </h3>
                <p className="font-sans text-xs text-[#4a4852] leading-relaxed">
                  Thank you. Your signal coordinates have bypassed atmospheric noise and registered in the creator archive. Our calibration core will respond directly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FILM ROLLING CREDITS (Right 6 Columns) */}
        <div className="lg:col-span-6 h-96 relative overflow-hidden border-l border-[#16151a]/10 pl-8 lg:pl-16 flex items-center">
          
          {/* Subtle slow scrolling credit roll */}
          <div className="w-full h-full relative overflow-hidden">
            <motion.div
              initial={{ y: '80%' }}
              animate={{ y: '-100%' }}
              transition={{
                repeat: Infinity,
                duration: 25,
                ease: 'linear',
              }}
              className="space-y-8 text-center lg:text-left pointer-events-none"
            >
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#4a4852] block uppercase tracking-widest">EXHIBITION VISUALS</span>
                <span className="font-sans text-sm font-semibold text-[#16151a] uppercase tracking-widest">SWASTIK MANNA</span>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#4a4852] block uppercase tracking-widest">CREATIVE DIRECTION</span>
                <span className="font-sans text-sm font-semibold text-[#16151a] uppercase tracking-widest">SWASTIK MANNA</span>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#4a4852] block uppercase tracking-widest">DEVELOPMENT ARCHITECTURE</span>
                <span className="font-sans text-sm font-semibold text-[#16151a] uppercase tracking-widest">AI STUDIO CODING CONSTRUCT</span>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#4a4852] block uppercase tracking-widest">OPTICAL SYSTEM</span>
                <span className="font-sans text-sm font-semibold text-[#16151a] uppercase tracking-widest">DIGITAL MIRRORLESS ARCHIVE</span>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#4a4852] block uppercase tracking-widest">ATMOSPHERIC SOUNDSYNTH</span>
                <span className="font-sans text-sm font-semibold text-[#16151a] uppercase tracking-widest">HTML5 AUDIO ENGINE</span>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#4a4852] block uppercase tracking-widest">GRID ALIGNMENTS</span>
                <span className="font-sans text-sm font-semibold text-[#16151a] uppercase tracking-widest">SWISS LAYOUT PROTOCOLS</span>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#4a4852] block uppercase tracking-widest">THEME INSULATION</span>
                <span className="font-sans text-sm font-semibold text-[#16151a] uppercase tracking-widest">SWISS COLOR / GRAPHIC / EDITORIAL</span>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[8px] text-[#4a4852] block uppercase tracking-widest">SPECIAL COOPERATIONS</span>
                <span className="font-sans text-sm font-semibold text-[#4a4852] uppercase tracking-widest">FWA, AWWWARDS, CSSDA</span>
              </div>
            </motion.div>
          </div>

          {/* Vignette fade to hide scroll boundaries */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#faf9f6] to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#faf9f6] to-transparent pointer-events-none" />
        </div>
      </main>

      {/* FOOTER CO-ORDINATES: STATIC LINKS */}
      <footer className="relative z-10 border-t border-[#16151a]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Minimal Credits watermark */}
        <div className="flex items-center gap-3">
          <span className="font-sans text-xl font-bold uppercase tracking-widest text-[#16151a]">FIN.</span>
          <span className="font-mono text-[9px] text-[#4a4852] uppercase tracking-widest mt-1">THE PERSPECTIVE EXHIBITION</span>
        </div>

        {/* Social anchor link array */}
        <div className="flex flex-wrap gap-4 md:gap-8 font-mono text-[10px] text-[#4a4852]">
          <a
            href="mailto:swastikmanna2006@gmail.com"
            data-cursor="link"
            className="flex items-center gap-1.5 hover:text-[#b3122a] transition-colors"
          >
            <Mail size={11} />
            <span>swastikmanna2006@gmail.com</span>
            <ArrowUpRight size={8} />
          </a>
          <a
            href="https://www.instagram.com/heaven_swastik"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="flex items-center gap-1.5 hover:text-[#b3122a] transition-colors"
          >
            <Instagram size={11} />
            <span>INSTAGRAM</span>
            <ArrowUpRight size={8} />
          </a>
          <div className="flex items-center gap-1.5 cursor-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b3122a]" />
            <span>UTC_MARKER // ACTIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SubmitButton() {
  const magneticRef = useMagnetic<HTMLButtonElement>(0.2);
  return (
    <button
      ref={magneticRef}
      type="submit"
      data-cursor="gate"
      className="magnetic-target w-full md:w-auto px-8 py-4 bg-[#16151a] hover:bg-[#b3122a] text-white font-mono text-[10px] font-bold tracking-widest uppercase rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 swastik-elevated"
      id="submit-inquiry-btn"
    >
      <Send size={11} />
      <span>TRANSMIT SIGNAL</span>
    </button>
  );
}
