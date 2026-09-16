import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Tag,
  ArrowUpRight,
  Sparkles,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import type { CampaignOpportunity, ContentCategory } from '../../types.ts';

const ALL_CATEGORIES = [
  'All',
  'Gaming',
  'Technology',
  'Music',
  'Dance',
  'Education',
  'Entertainment',
  'Others',
];

interface OpportunitiesCardProps {
  opportunities: CampaignOpportunity[];
  creatorCategory?: ContentCategory;
}

export const OpportunitiesCard: React.FC<OpportunitiesCardProps> = ({
  opportunities,
  creatorCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedOppId, setAppliedOppId] = useState<string | null>(null);
  const [selectedOppForPitch, setSelectedOppForPitch] = useState<CampaignOpportunity | null>(null);

  const filteredOpps = opportunities.filter((opp) => {
    const matchesCategory =
      selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="opportunities-section" className="space-y-5">
      {/* Section Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Brand Collaboration Opportunities
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified brand briefs currently accepting pitches from active creators.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search briefs or brands..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {ALL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const isCreatorNiche = cat === creatorCategory;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80'
              }`}
            >
              <span>{cat}</span>
              {isCreatorNiche && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* List / Empty State */}
      {filteredOpps.length === 0 ? (
        /* PRD 3.6 Default empty state: "No opportunities yet. Check back later for new opportunities." */
        <div
          id="opportunities-empty-state"
          className="p-12 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto border border-slate-700">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">
            No opportunities yet. Check back later for new opportunities.
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Brand briefs matching your selected category are updated regularly by partnering marketing teams and agencies.
          </p>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              View all categories
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredOpps.map((opp) => {
            const hasApplied = appliedOppId === opp.id;
            return (
              <div
                key={opp.id}
                id={`opp-card-${opp.id}`}
                className="p-5 rounded-xl bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
                        {opp.brandName}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 mt-0.5 leading-snug">
                        {opp.title}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-700 shrink-0">
                      {opp.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Budget Range:</span>
                      <span className="font-bold text-emerald-400">{opp.budgetRange}</span>
                    </div>
                    {opp.deliverables && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Deliverables:</span>
                        <span className="text-slate-200 truncate max-w-[180px]">{opp.deliverables}</span>
                      </div>
                    )}
                    {opp.deadline && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Deadline:</span>
                        <span className="text-slate-300">{opp.deadline}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Accepting Creator Pitches
                  </span>

                  <button
                    onClick={() => {
                      setSelectedOppForPitch(opp);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                      hasApplied
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow'
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Pitch Submitted</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Pitch</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pitch Modal */}
      {selectedOppForPitch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSelectedOppForPitch(null)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-800 border border-slate-700 p-5 sm:p-6 shadow-2xl space-y-4 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[11px] font-semibold text-indigo-400 uppercase">
                {selectedOppForPitch.brandName}
              </span>
              <h3 className="text-lg font-bold text-slate-50 mt-0.5">
                Submit Pitch: {selectedOppForPitch.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your verified Creator Bridge badge and portfolio will be attached automatically.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Creative Angle / Idea Note
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline your proposed concept, filming format, and angle for this brand brief..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  defaultValue="Hello! I would love to collaborate on this campaign. My content specializes in high-retention visuals and engaged audience interactions."
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Proposed Commercials (Optional Quote)
                </label>
                <input
                  type="text"
                  placeholder={selectedOppForPitch.budgetRange}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedOppForPitch(null)}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[40px] rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAppliedOppId(selectedOppForPitch.id);
                  setSelectedOppForPitch(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[40px] rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Send Pitch to Brand</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
