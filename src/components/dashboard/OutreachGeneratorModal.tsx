import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Mail,
  Linkedin,
  MessageCircle,
  Copy,
  Check,
  RefreshCw,
  Send,
  BookmarkCheck,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { Lead, OutreachMessage } from '../../types';
import { generateOutreach } from '../../services/growthApi';
import { useToast } from '../../context/ToastContext';

interface OutreachGeneratorModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCampaign: (lead: Lead, message: OutreachMessage) => void;
  onSaveMessage?: (message: OutreachMessage) => void;
}

export const OutreachGeneratorModal: React.FC<OutreachGeneratorModalProps> = ({
  lead,
  isOpen,
  onClose,
  onAddToCampaign,
  onSaveMessage,
}) => {
  const { showToast } = useToast();
  const [channel, setChannel] = useState<'email' | 'linkedin' | 'dm'>('email');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'direct' | 'consultative'>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<OutreachMessage | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen && lead) {
      handleGenerate();
    }
  }, [isOpen, lead]);

  if (!isOpen || !lead) return null;

  const handleGenerate = async (selectedChannel = channel, selectedTone = tone) => {
    setIsGenerating(true);
    try {
      const msg = await generateOutreach({
        lead,
        channel: selectedChannel,
        tone: selectedTone,
        senderCompany: 'Andeola Growth AI',
        valueProposition: 'Connecting high-conviction brands with European boutique and retail partners.',
      });
      setGeneratedMessage(msg);
    } catch (err) {
      showToast('Generation error', 'Using local intelligence template', 'info');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage.fullText);
    setIsCopied(true);
    showToast('Copied to Clipboard', 'Personalized message copied and ready to send.');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    if (!generatedMessage) return;
    if (onSaveMessage) onSaveMessage(generatedMessage);
    showToast('Draft Saved', `Outreach saved for ${lead.contact} at ${lead.company}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  AI Outreach Generator
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-mono text-[10px] font-bold border border-blue-500/30 uppercase">
                  Free Trial (20 Leads Tier)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalized, multi-channel messaging grounded in verifiable company context
              </p>
            </div>
          </div>
        </div>

        {/* Prospect Details Strip */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Prospect
            </span>
            <span className="text-white font-semibold">{lead.contact}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Company
            </span>
            <span className="text-white font-semibold">{lead.company}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Role
            </span>
            <span className="text-slate-300 font-medium truncate block">{lead.role}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Reason for Contact
            </span>
            <span className="text-emerald-400 font-medium truncate block">
              {lead.matchScore}% ICP alignment
            </span>
          </div>
        </div>

        {/* Channel & Tone Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Channels */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Outreach Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setChannel('email');
                  handleGenerate('email', tone);
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'email'
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setChannel('linkedin');
                  handleGenerate('linkedin', tone);
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'linkedin'
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setChannel('dm');
                  handleGenerate('dm', tone);
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'dm'
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Short DM</span>
              </button>
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Tone of Voice
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['professional', 'friendly', 'direct', 'consultative'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTone(t);
                    handleGenerate(channel, t);
                  }}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-medium capitalize transition-all cursor-pointer ${
                    tone === t
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate / Refresh Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            Clicking regenerate re-evaluates angle with tone <strong>{tone}</strong>
          </span>
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="py-1.5 px-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Regenerate Angle'}</span>
          </button>
        </div>

        {/* Generated Structured Message Container */}
        {isGenerating ? (
          <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center animate-spin">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Synthesizing personalized observations for {lead.contact}...
            </p>
          </div>
        ) : generatedMessage ? (
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden shadow-inner space-y-4 p-5">
            {/* Subject Line (if email) */}
            {channel === 'email' && (
              <div className="pb-3 border-b border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Subject Line
                </span>
                <p className="text-xs font-semibold text-white font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {generatedMessage.subject}
                </p>
              </div>
            )}

            {/* Structured Elements Breakdown */}
            <div className="space-y-3 text-xs leading-relaxed">
              {/* Opening */}
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-0.5">
                  Opening
                </span>
                <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                  {generatedMessage.opening}
                </p>
              </div>

              {/* Personalized Observation */}
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-0.5">
                  Personalized Observation
                </span>
                <p className="text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 font-medium">
                  {generatedMessage.observation}
                </p>
              </div>

              {/* Value Proposition */}
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                  Value Proposition
                </span>
                <p className="text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                  {generatedMessage.valueProp}
                </p>
              </div>

              {/* Call to action */}
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                  Call to Action
                </span>
                <p className="text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 font-medium">
                  {generatedMessage.callToAction}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Actions Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              disabled={!generatedMessage}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Message</span>
                </>
              )}
            </button>

            <button
              onClick={handleSaveDraft}
              disabled={!generatedMessage}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Save Draft</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (generatedMessage) {
                onAddToCampaign(lead, generatedMessage);
                onClose();
              }
            }}
            disabled={!generatedMessage}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>⚡ Send & Add to Campaign</span>
          </button>
        </div>
      </div>
    </div>
  );
};
