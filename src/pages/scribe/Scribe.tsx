import React, { useState } from 'react';
import { 
  Calendar, Mic, Play, Pause, Square, ExternalLink, Sparkles, 
  ChevronDown, Settings2, Share, Plus, Globe, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/shared/lib/cn';

export default function Scribe() {
  const [showSettings, setShowSettings] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full h-full"
    >
      
      {/* Secondary Sidebar (Sessions) */}
      <div className="w-[280px] xl:w-[320px] 2xl:w-[360px] h-full bg-white border-r border-[#EAE5E3] flex flex-col flex-shrink-0">
        <div className="flex border-b border-[#EAE5E3] px-2 py-2">
          <button className="flex-1 py-1.5 text-sm font-medium text-[#2C2627] bg-[#F5F2F0] rounded-md">Upcoming 1</button>
          <button className="flex-1 py-1.5 text-sm font-medium text-[#8A8284] hover:bg-[#F5F2F0] rounded-md transition-colors">Past</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-xs font-semibold text-[#8A8284] mb-3">01/29/2026</div>
          <div className="bg-[#EEF1FF] border border-[#D9E2FF] rounded-md p-3 cursor-pointer group relative">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-white border border-[#D9E2FF] flex items-center justify-center shrink-0">
                <Mic className="w-4 h-4 text-[#7C66FF]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#2C2627]">Untitled session</span>
                <span className="text-xs text-[#8A8284] mt-0.5">8:27PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 h-full bg-[#FAF9F7] flex flex-col relative overflow-hidden">
        
        {/* Editor Header */}
        <div className="h-16 border-b border-[#EAE5E3] bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-dashed border-[#D5C9C6] flex items-center justify-center text-[#8A8284]">
              <UserIcon />
            </div>
            <h2 className="text-lg font-semibold text-[#2C2627]">Add patient details</h2>
            <button className="p-1 text-[#8A8284] hover:bg-[#F5F2F0] rounded-md"><TrashIcon /></button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[#5A5254] bg-[#F5F2F0] px-3 py-1.5 rounded-full">
              <Pause className="w-3.5 h-3.5" /> 00:58
            </div>
            <div className="text-sm font-medium text-[#2C2627] flex items-center gap-2 cursor-pointer hover:bg-[#F5F2F0] px-2 py-1 rounded-md">
              Default - MacBook... <ChevronDown className="w-4 h-4 text-[#8A8284]" />
            </div>
            <div className="flex items-center gap-1 text-[#00C853]">
              <WaveIcon />
            </div>
            <div className="h-5 w-px bg-[#EAE5E3]"></div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#E53E3E] bg-[#FFEBEB] rounded-md hover:bg-[#FFD6D6] transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#E53E3E]"></div>
              Stop transcribing
            </button>
          </div>
        </div>

        {/* Editor Sub-Header (Tags/Tabs) */}
        <div className="px-6 py-4 border-b border-[#EAE5E3] bg-[#FCFBF9] shrink-0">
          <div className="flex items-center gap-4 mb-4 text-sm text-[#5A5254]">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Today 08:27PM</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> English</span>
            <span className="px-2 py-0.5 bg-[#8B5CF6] text-white rounded text-xs font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3" /> 14 days</span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <button className="pb-2 text-[#8A8284] hover:text-[#2C2627] flex items-center gap-1.5"><Mic className="w-4 h-4" /> Transcript</button>
            <button className="pb-2 text-[#8A8284] hover:text-[#2C2627] flex items-center gap-1.5"><FileText className="w-4 h-4" /> Context</button>
            <button className="pb-2 border-b-2 border-[#4C2D33] text-[#4C2D33] flex items-center gap-1.5"><PencilIcon /> SOAP Progress Note</button>
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center relative">
          
          {/* Main Card */}
          <div className="bg-white border border-[#EAE5E3] rounded-md w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl min-h-[400px] p-6 relative transition-all duration-300">
            <div className="flex items-center gap-2 mb-6 border-b border-[#F5F2F0] pb-4">
              <button className="px-3 py-1.5 text-sm font-medium text-[#4C2D33] bg-[#F5F2F0] rounded-md flex items-center gap-2">
                SOAP Progress Note <ChevronDown className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="px-3 py-1.5 text-sm font-medium text-[#4C2D33] bg-[#F5F2F0] rounded-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Goldilocks <RefreshIcon />
              </button>
              <button className="p-1.5 text-[#8A8284] hover:bg-[#F5F2F0] rounded-md border border-[#EAE5E3] ml-auto">
                <MoreHorizontalIcon />
              </button>
            </div>

            {/* Simulated Content */}
            <div className="text-[#8A8284] text-center mt-20">
              <p>the session concluding</p>
            </div>

            {/* Settings Popover (Absolute positioned for demonstration) */}
            <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ opacity: 0, y: -10, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -10, x: '-50%' }}
                transition={{ duration: 0.2 }}
                className="absolute top-20 left-1/2 w-[340px] bg-white border border-[#EAE5E3] rounded-md p-5 z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-[#2C2627]">Customize style</h3>
                  <a href="#" className="text-xs text-[#8A8284] flex items-center gap-1 hover:text-[#2C2627]">Learn more <ExternalLink className="w-3 h-3" /></a>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-semibold text-[#2C2627] mb-2">Scribe</div>
                  <div className="flex gap-2">
                    <div className="flex-1 border border-[#EAE5E3] rounded-md p-3 cursor-pointer hover:border-[#4C2D33] transition-colors">
                      <div className="flex items-center gap-2 font-medium text-[#2C2627] mb-1"><PencilIcon /> Free</div>
                      <div className="text-xs text-[#8A8284]">Fast for simple sessions</div>
                    </div>
                    <div className="flex-1 border-2 border-[#2C2627] rounded-md p-3 cursor-pointer relative bg-[#FCFBF9]">
                      <div className="flex items-center gap-2 font-medium text-[#2C2627] mb-1"><Settings2 className="w-4 h-4" /> Pro</div>
                      <div className="text-xs text-[#8A8284]">Best for complex sessions</div>
                      <Sparkles className="w-3 h-3 text-[#8B5CF6] absolute top-2 right-2" />
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="text-xs font-semibold text-[#2C2627] mb-2">Voice</div>
                  <div className="border border-[#4C2D33] rounded-md px-3 py-2 flex justify-between items-center text-sm font-medium text-[#2C2627] bg-[#FCFBF9]">
                    Goldilocks <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                <div className="bg-[#FCFBF9] -mx-5 px-5 py-4 border-y border-[#EAE5E3]">
                  <div className="mb-6">
                    <div className="text-sm font-medium text-[#2C2627] mb-3">Detail</div>
                    <div className="relative h-1 bg-[#EAE5E3] rounded-full mx-2">
                      <div className="absolute h-full bg-[#4C2D33] rounded-full" style={{ width: '50%' }}></div>
                      <div className="absolute h-4 w-4 bg-white border-[2.5px] border-[#4C2D33] rounded-full top-1/2 -translate-y-1/2 cursor-pointer" style={{ left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium text-[#8A8284] mt-2">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ToggleRow label="Bullet points" active={false} />
                    <ToggleRow label="Quotes" active={false} />
                    <ToggleRow label="Abbreviations" active={true} />
                  </div>
                  
                  <button className="text-xs font-medium text-[#8A8284] flex items-center gap-1.5 mt-5 hover:text-[#2C2627]">
                    <RefreshIcon className="w-3 h-3" /> Reset to default
                  </button>
                </div>
                
                <div className="mt-4 flex justify-between items-center text-xs">
                  <span className="text-[#8A8284]">Template instructions are prioritized</span>
                  <div className="flex items-center gap-2 font-medium text-[#2C2627]">
                    Save as default <div className="w-4 h-4 rounded-full border border-[#D5C9C6]"></div>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
          
        </div>

        {/* Floating Input Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[700px] xl:max-w-[800px] 2xl:max-w-[1000px] bg-white border border-[#EAE5E3] rounded-md p-3 flex items-center gap-3 transition-all duration-300">
          <div className="p-1.5 bg-[#FFF4D4] rounded-md">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <input 
            type="text" 
            placeholder="Ask iDap anything" 
            className="flex-1 text-sm outline-none placeholder:text-[#8A8284] text-[#2C2627]"
          />
        </div>

      </div>
    </motion.div>
  );
}

// Helpers
function ToggleRow({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-[#2C2627]">{label}</span>
      <div className={cn(
        "w-9 h-5 rounded-full flex items-center p-[2px] transition-colors cursor-pointer",
        active ? "bg-[#4C2D33]" : "bg-[#EAE5E3]"
      )}>
        <div className={cn(
          "w-4 h-4 rounded-full bg-white transition-transform",
          active ? "translate-x-4" : "translate-x-0"
        )} />
      </div>
    </div>
  );
}

// Minimal Icons
function UserIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>; }
function TrashIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>; }
function WaveIcon() { return <div className="flex gap-[2px] items-center h-4"><div className="w-[3px] h-2 bg-current rounded-full" /><div className="w-[3px] h-3 bg-current rounded-full" /><div className="w-[3px] h-4 bg-current rounded-full" /><div className="w-[3px] h-2 bg-current rounded-full" /></div>; }
function PencilIcon({ className }: { className?: string }) { return <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>; }
function RefreshIcon({ className }: { className?: string }) { return <svg className={className || "w-3 h-3"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.27l-5.36 5.36"></path></svg>; }
function MoreHorizontalIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>; }
