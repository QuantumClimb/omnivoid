'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RetroWindow, Tab } from '@/components/RetroWindow';
import { SplashScreen } from '@/components/SplashScreen';
import { AgentSystem } from '@/components/AgentSystem';

interface ContentItem {
  id: string;
  type: string;
  title: string;
  path: string;
  category?: string;
  linkType?: string;
  metadata?: any;
  editionId?: string;
  content?: string;
  excerpt?: string;
}

interface ContentStructure {
  audio: ContentItem[];
  gallery: ContentItem[];
  gigs: ContentItem[];
  links: ContentItem[];
  documents: ContentItem[];
  resources: any[];
  editions: { id: string; name: string; slug: string; isActive: boolean; sortOrder: number }[];
  latestGig: any | null;
  currentEdition: any | null;
}

interface MenuSection {
  id: string;
  label: string;
  icon: string;
  type: 'documents' | 'audio' | 'gallery' | 'gigs' | 'links' | 'resources';
  categoryId?: string;
  resourceType?: string;
  docType?: string;
  windowPosition: { top: string; left: string };
}

const windowGridPositions: Record<string, { top: string; left: string }> = {
  'research': { top: '15%', left: '15%' },
  'rituals': { top: '15%', left: '40%' },
  'transmissions': { top: '15%', left: '65%' },
  'radio': { top: '50%', left: '15%' },
  'labs': { top: '50%', left: '40%' },
  'gallery': { top: '50%', left: '65%' },
  'conundrum': { top: '70%', left: '20%' },
  'contact': { top: '70%', left: '45%' },
};

const menuSections: MenuSection[] = [
  { id: 'research', label: 'RESEARCH', icon: '📚', type: 'documents', docType: 'RESEARCH', windowPosition: windowGridPositions['research'] },
  { id: 'rituals', label: 'RITUALS', icon: '🎸', type: 'gigs', windowPosition: windowGridPositions['rituals'] },
  { id: 'transmissions', label: 'TRANSMISSIONS', icon: '📡', type: 'links', categoryId: 'live_transmissions', windowPosition: windowGridPositions['transmissions'] },
  { id: 'radio', label: 'RADIO', icon: '🎵', type: 'resources', resourceType: 'AUDIO', windowPosition: windowGridPositions['radio'] },
  { id: 'gallery', label: 'GALLERY', icon: '🖼️', type: 'resources', resourceType: 'GALLERY', windowPosition: windowGridPositions['gallery'] },
  { id: 'labs', label: 'LABS', icon: 'ℹ️', type: 'links', categoryId: 'labs', windowPosition: windowGridPositions['labs'] },
  { id: 'conundrum', label: 'CONUNDRUM', icon: '🧩', type: 'documents', docType: 'CONUNDRUM', windowPosition: windowGridPositions['conundrum'] },
  { id: 'contact', label: 'CONTACT', icon: '📧', type: 'documents', docType: 'CONTACT', windowPosition: windowGridPositions['contact'] },
];

export default function Home() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [content, setContent] = useState<ContentStructure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openWindows, setOpenWindows] = useState<Record<string, boolean>>({});
  const [windowContents, setWindowContents] = useState<Record<string, string>>({});
  const [windowTabs, setWindowTabs] = useState<Record<string, Tab[]>>({});
  const [selectedEditionId, setSelectedEditionId] = useState<string | null>(null);
  const [showLatestRituals, setShowLatestRituals] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  
  const agentSystemRef = useRef<AgentSystem | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContent(data.data);
          if (data.data.currentEdition) {
            setSelectedEditionId(data.data.currentEdition.id);
          } else if (data.data.editions.length > 0) {
            setSelectedEditionId(data.data.editions[0].id);
          }
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load content:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isSplashComplete && !agentSystemRef.current) {
      agentSystemRef.current = AgentSystem.getInstance();
    }
  }, [isSplashComplete]);

  // Expose global function for YouTube links
  useEffect(() => {
    (window as any).openYouTube = (url: string) => {
      setActiveVideoUrl(url);
    };
  }, []);

  useEffect(() => {
    if (content) {
      const updatedContents: Record<string, string> = {};
      const updatedTabs: Record<string, Tab[]> = {};
      
      menuSections.forEach(section => {
        if (openWindows[section.id]) {
          const { content: c, tabs: t } = formatSectionContent(section);
          updatedContents[section.id] = c;
          updatedTabs[section.id] = t;
        }
      });
      
      setWindowContents(prev => ({ ...prev, ...updatedContents }));
      setWindowTabs(prev => ({ ...prev, ...updatedTabs }));
    }
  }, [selectedEditionId, content]);

  const formatSectionContent = (section: MenuSection): { content: string; tabs: Tab[] } => {
    if (!content) return { content: '', tabs: [] };

    let items: any[] = [];
    let html = '';

    switch (section.type) {
      case 'documents':
        items = content.documents.filter(d => 
          (d.editionId === selectedEditionId || !d.editionId) && 
          d.type === section.docType
        );
        
        if (section.docType === 'CONUNDRUM' || section.docType === 'CONTACT') {
          const doc = items[0];
          html = doc ? `
            <div class="prose prose-invert max-w-none font-mono text-xs leading-relaxed text-[#99ccff]">
              <h3 class="text-lg font-bold text-white mb-4 border-b border-[#99ccff]/20 pb-2">${doc.title}</h3>
              <div class="whitespace-pre-wrap">${doc.content}</div>
            </div>
          ` : '<p class="text-white/40">Knowledge base record not found.</p>';
        } else {
          html = `
            <div class="space-y-4">
              ${items.length === 0 ? '<p class="text-white/40">No research papers available for this iteration.</p>' : ''}
              ${items.map(doc => `
                <div class="p-4 bg-white/5 border border-white/10 rounded group hover:border-[#99ccff]/50 transition-all">
                  <h4 class="text-[#99ccff] font-bold mb-1">${doc.title}</h4>
                  <p class="text-[10px] text-white/40 mb-3">${doc.excerpt || 'Research artifact from the OMNIVOID repository.'}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-[9px] text-white/20 font-mono tracking-tighter uppercase">ID: ${doc.id.slice(-8)}</span>
                    <button class="text-[10px] px-2 py-1 bg-[#99ccff]/10 text-[#99ccff] border border-[#99ccff]/20 rounded">ACCESS DATA</button>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        }
        return { content: html, tabs: [] };

      case 'resources':
        items = content.resources.filter(r => r.editionId === selectedEditionId && r.type === section.resourceType?.toLowerCase());
        html = `
          <div class="grid grid-cols-1 gap-2">
             ${items.length === 0 ? '<p class="text-white/40">No media assets found in this sector.</p>' : ''}
             ${items.map(res => `
              <div class="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded group hover:border-[#99ccff]/40 transition-all cursor-pointer">
                <div class="w-10 h-10 bg-black flex items-center justify-center border border-white/5 rounded text-xl">
                  ${section.resourceType === 'AUDIO' ? '🎵' : '🖼️'}
                </div>
                <div>
                  <div class="text-[11px] font-bold text-white">${res.title}</div>
                  <div class="text-[9px] text-[#99ccff]/40 font-mono">HASH: ${res.id.slice(0, 12)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        return { content: html, tabs: [] };

      case 'links':
        items = content.links.filter(l => l.category === section.categoryId);
        html = `
          <div class="space-y-3">
            ${items.length === 0 ? '<p class="text-white/40">No transmission links active.</p>' : ''}
            ${items.map(link => `
              <div 
                onclick="window.openYouTube('${link.path}')"
                class="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded hover:bg-[#99ccff]/10 hover:border-[#99ccff]/40 transition-all cursor-pointer group"
              >
                <div class="flex items-center gap-3">
                  <span class="text-lg opacity-40 group-hover:opacity-100">${link.linkType === 'YOUTUBE' ? '📺' : '📡'}</span>
                  <span class="text-xs font-mono tracking-tight">${link.title}</span>
                </div>
                <span class="text-[10px] text-[#99ccff] opacity-0 group-hover:opacity-100 transition-opacity">PLAY ▶</span>
              </div>
            `).join('')}
          </div>
        `;
        return { content: html, tabs: [] };

      case 'gigs':
        html = `
          <div class="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
            <div class="w-32 h-32 border border-[#99ccff]/20 rounded-full flex items-center justify-center animate-pulse">
               <img src="/logo.svg" class="w-16 opacity-30" />
            </div>
            <div>
              <p class="text-sm font-bold text-[#99ccff] mb-1 uppercase tracking-widest">Ritual Protocol</p>
              <p class="text-[10px] text-white/40 font-mono">Synchronizing edition data with live performance history...</p>
            </div>
            <button class="px-6 py-2 bg-white/5 border border-white/10 rounded font-mono text-[10px] text-white/60 hover:text-[#99ccff] hover:border-[#99ccff]/40 transition-all">VIEW ARCHIVE</button>
          </div>
        `;
        return { content: html, tabs: [] };

      default:
        return { content: 'CONTENT_UNAVAILABLE', tabs: [] };
    }
  };

  const openWindow = (section: MenuSection) => {
    setIsMenuOpen(false);
    if (openWindows[section.id]) {
      setOpenWindows(prev => ({ ...prev, [section.id]: false }));
      return;
    }
    
    const { content: c, tabs: t } = formatSectionContent(section);
    setWindowContents(prev => ({ ...prev, [section.id]: c }));
    setWindowTabs(prev => ({ ...prev, [section.id]: t }));
    setOpenWindows(prev => ({ ...prev, [section.id]: true }));
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (!isSplashComplete) {
    return <SplashScreen onComplete={() => setIsSplashComplete(true)} />;
  }

  return (
    <main className="fixed inset-0 bg-[#050505] overflow-hidden flex flex-col">
      <canvas id="agents" className="fixed inset-0 z-0 opacity-30 pointer-events-none" />
      
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.img 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 2 }}
          src="/logo.svg" 
          alt="OMNIVOID" 
          style={{ 
            width: '15vw',
            maxWidth: '250px',
            filter: 'brightness(1.5)',
          }}
        />
      </div>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex gap-8 z-[100]">
        {content?.editions.slice(0, 3).map((edition, idx) => (
          <motion.button
            key={edition.id}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(153, 204, 255, 0.4)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedEditionId(edition.id)}
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-mono text-xl transition-all duration-500 shadow-lg backdrop-blur-md ${
              selectedEditionId === edition.id 
                ? 'bg-[#99ccff] text-[#050505] border-[#99ccff]' 
                : 'bg-black/60 text-[#99ccff] border-[#99ccff]/40 hover:border-[#99ccff]'
            }`}
          >
            {idx + 1}
          </motion.button>
        ))}
      </div>

      <div className="relative z-50 flex-1">
        {menuSections.map(section => (
          <RetroWindow
            key={section.id}
            id={section.id}
            title={`${section.label} - ${content?.editions.find(e => e.id === selectedEditionId)?.name || '...'}`}
            content={windowContents[section.id] || ''}
            isOpen={openWindows[section.id] || false}
            onClose={() => setOpenWindows(prev => ({ ...prev, [section.id]: false }))}
            position={section.windowPosition}
            tabs={windowTabs[section.id] || []}
          />
        ))}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-black/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-8 z-[200]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 text-[#99ccff] font-mono text-[10px] tracking-[0.2em] hover:text-white transition-colors"
          >
            <span className="text-sm">▦</span> START
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="text-[10px] text-white/30 font-mono tracking-widest uppercase">
            {content?.editions.find(e => e.id === selectedEditionId)?.name || 'INITIALIZING...'}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-[10px] text-[#99ccff]/40 font-mono">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </div>
          <a href="https://www.quantum-climb.com/" target="_blank" className="opacity-40 hover:opacity-100 transition-opacity">
            <img src="/qc.png" alt="QC" className="w-5 h-5 grayscale invert" />
          </a>
        </div>
      </footer>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-14 left-4 w-64 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl z-[201] overflow-hidden backdrop-blur-2xl"
          >
            <div className="p-4 bg-[#99ccff]/10 border-b border-white/5">
              <div className="text-[10px] text-[#99ccff] font-bold tracking-[0.3em]">OMNIVOID OS v1.0</div>
            </div>
            <div className="p-2">
              {menuSections.map(item => (
                <button
                  key={item.id}
                  onClick={() => openWindow(item)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-white/60 hover:text-[#99ccff] hover:bg-white/5 rounded transition-all text-xs font-mono text-left"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Modal Overlay */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black border border-[#99ccff]/30 shadow-2xl rounded-xl overflow-hidden"
            >
              <button 
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/50 border border-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all"
              >
                ✕
              </button>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYouTubeId(activeVideoUrl)}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body { background-color: #050505; margin: 0; padding: 0; overflow: hidden; color: white; font-family: 'Space Mono', monospace; }
        canvas#agents { width: 100vw !important; height: 100vh !important; }
      `}</style>
    </main>
  );
}