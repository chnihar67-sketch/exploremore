import React, { useState } from 'react';
import { X, Globe, CheckCircle, Copy, Check, ArrowRight, ShieldCheck, Server } from 'lucide-react';

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({ isOpen, onClose }) => {
  const [domain, setDomain] = useState('localora.org');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#faf7f2] w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2d5a43] text-white flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900">
                Custom Domain Configuration
              </h2>
              <div className="text-[11px] text-stone-500">Connect your custom domain for launch</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-800">
          <form onSubmit={handleSave} className="space-y-3">
            <label className="block font-semibold text-stone-700">
              Target Custom Domain
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value.toLowerCase().trim())}
                placeholder="e.g. explore.localora.in or yourdomain.com"
                className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#2d5a43]/30"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#2d5a43] hover:bg-[#1b4332] text-white rounded-lg font-semibold transition-colors shrink-0"
              >
                Connect Domain
              </button>
            </div>
            {isSaved && (
              <div className="p-2.5 bg-emerald-50 text-[#1b4332] rounded-lg font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#2d5a43]" />
                <span>Domain mapping target registered. Configure your DNS records below.</span>
              </div>
            )}
          </form>

          {/* DNS Configuration Table */}
          <div className="space-y-3">
            <div className="font-semibold text-stone-900 flex items-center justify-between">
              <span>Required DNS Records for {domain || 'your domain'}</span>
              <span className="text-[11px] font-normal text-stone-500">TTL: 3600</span>
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Host / Name</th>
                    <th className="p-2.5">Target Value</th>
                    <th className="p-2.5 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  <tr>
                    <td className="p-2.5 font-bold text-[#2d5a43]">CNAME</td>
                    <td className="p-2.5">www</td>
                    <td className="p-2.5 text-stone-700">ais-applet.localora.run.app</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleCopy('ais-applet.localora.run.app', 'cname')}
                        className="text-stone-400 hover:text-stone-700"
                        title="Copy value"
                      >
                        {copiedRecord === 'cname' ? <Check className="w-3.5 h-3.5 text-[#2d5a43]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#2d5a43]">A</td>
                    <td className="p-2.5">@</td>
                    <td className="p-2.5 text-stone-700">216.239.32.21</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleCopy('216.239.32.21', 'a1')}
                        className="text-stone-400 hover:text-stone-700"
                        title="Copy IP"
                      >
                        {copiedRecord === 'a1' ? <Check className="w-3.5 h-3.5 text-[#2d5a43]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#2d5a43]">A</td>
                    <td className="p-2.5">@</td>
                    <td className="p-2.5 text-stone-700">216.239.34.21</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleCopy('216.239.34.21', 'a2')}
                        className="text-stone-400 hover:text-stone-700"
                        title="Copy IP"
                      >
                        {copiedRecord === 'a2' ? <Check className="w-3.5 h-3.5 text-[#2d5a43]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SSL and Verification Checklist */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="font-semibold text-stone-900">Pre-Launch Verification Status</div>
            <div className="space-y-1.5 text-stone-600">
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle className="w-3.5 h-3.5 text-[#2d5a43]" />
                <span>Automatic Let&apos;s Encrypt SSL Certificate provisioning</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle className="w-3.5 h-3.5 text-[#2d5a43]" />
                <span>Custom Favicon installed (`/favicon.svg`)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle className="w-3.5 h-3.5 text-[#2d5a43]" />
                <span>Privacy Policy and Terms &amp; Conditions pages linked</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle className="w-3.5 h-3.5 text-[#2d5a43]" />
                <span>Zero AI watermarks or branding badges</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
