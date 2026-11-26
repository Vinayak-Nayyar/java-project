import React, { useState } from 'react';
import { ResumeAnalyzerTab } from './ResumeAnalyzerTab';
import { JobReadinessTab } from './JobReadinessTab';
import { SkillGapAnalysisTab } from './SkillGapAnalysisTab';
import { LearningRoadmapTab } from './LearningRoadmapTab';
import { ResumeAssistantTab } from './ResumeAssistantTab';

export type CareerTabType = 'analyzer' | 'readiness' | 'gaps' | 'roadmap' | 'assistant';

interface TabConfig {
  id: CareerTabType;
  title: string;
  icon: string;
  subtitle: string;
  badge?: string;
}

const TABS: TabConfig[] = [
  {
    id: 'analyzer',
    title: 'Resume Analyzer',
    icon: '📄',
    subtitle: 'Score, structure & content critique',
    badge: 'AI Evaluator'
  },
  {
    id: 'readiness',
    title: 'Job Readiness',
    icon: '🎯',
    subtitle: 'Opportunity compatibility match',
    badge: 'Live Cut-offs'
  },
  {
    id: 'gaps',
    title: 'Skill Gap Analysis',
    icon: '📊',
    subtitle: 'Curriculum & industry missing skills',
    badge: '6 Tech Roles'
  },
  {
    id: 'roadmap',
    title: 'Learning Roadmap',
    icon: '🗺️',
    subtitle: 'Milestone-based preparation guide',
    badge: 'Interactive'
  },
  {
    id: 'assistant',
    title: 'Resume Assistant',
    icon: '✍️',
    subtitle: 'Bullet rewrites & action verbs',
    badge: 'Impact Booster'
  }
];

export const CareerIntelligenceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CareerTabType>('analyzer');
  const [roadmapRoleId, setRoadmapRoleId] = useState<string>('backend-dev');

  const handleSelectRoleForRoadmap = (roleId: string) => {
    setRoadmapRoleId(roleId);
    setActiveTab('roadmap');
  };

  return (
    <section className="career-intelligence-section mb-5" aria-label="Career Intelligence Suite">
      {/* SECTION HEADER CARD */}
      <div
        className="p-4 rounded-4 border border-2 border-dark mb-4 text-white"
        style={{
          backgroundColor: '#0F4A37',
          boxShadow: '4px 4px 0px #1E293B',
          backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(254, 224, 84, 0.12) 0%, transparent 60%)'
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span className="badge-pill-yellow text-dark fw-bold">
                🚀 NEXUS Career Intelligence Suite
              </span>
              <span className="badge-pill-lilac text-dark small">
                Career-Readiness & ATS Optimization
              </span>
            </div>
            <h2 className="fw-bolder mb-1 text-white">
              Career Readiness & Placement Intelligence
            </h2>
            <p className="text-white-50 mb-0 small" style={{ maxWidth: '780px' }}>
              Evaluate your profile against live campus openings, uncover target curriculum gaps, formulate step-by-step learning roadmaps, and craft high-impact resume bullet points.
            </p>
          </div>
          <div className="d-none d-lg-block text-end">
            <div className="d-inline-flex flex-column align-items-end p-2 px-3 rounded-3 bg-white bg-opacity-10 border border-1 border-white border-opacity-25">
              <span className="text-warning small fw-bold">Active Modules</span>
              <span className="text-white fw-bolder fs-5">5 / 5 Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL TAB NAVIGATION BAR */}
      <div className="mb-4">
        <div
          className="d-flex flex-nowrap gap-2 pb-2 overflow-x-auto"
          style={{
            scrollbarWidth: 'thin',
            WebkitOverflowScrolling: 'touch'
          }}
          role="tablist"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className="btn text-start p-3 rounded-3 flex-shrink-0 transition-all"
                style={{
                  minWidth: '220px',
                  flex: '1 1 0px',
                  border: '2px solid #1E293B',
                  backgroundColor: isActive ? '#FEE054' : '#FFFFFF',
                  color: '#1E293B',
                  boxShadow: isActive ? '3px 3px 0px #1E293B' : '2px 2px 0px #E2E8F0',
                  transform: isActive ? 'translate(-1px, -1px)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fs-5">{tab.icon}</span>
                  {tab.badge && (
                    <span
                      className="badge-pill-lilac"
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        backgroundColor: isActive ? '#FFFFFF' : '#DDD6FE'
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <div className="fw-bolder" style={{ fontSize: '0.95rem', color: isActive ? '#0F4A37' : '#0F172A' }}>
                  {tab.title}
                </div>
                <div
                  className="text-muted text-truncate mt-1"
                  style={{ fontSize: '0.74rem', maxWidth: '210px' }}
                >
                  {tab.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT CONTAINER */}
      <div
        className="p-3 p-md-4 rounded-4 border border-2 border-dark bg-white"
        style={{
          boxShadow: '4px 4px 0px #1E293B',
          minHeight: '400px',
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        {activeTab === 'analyzer' && <ResumeAnalyzerTab />}
        {activeTab === 'readiness' && <JobReadinessTab />}
        {activeTab === 'gaps' && (
          <SkillGapAnalysisTab onSelectRoleForRoadmap={handleSelectRoleForRoadmap} />
        )}
        {activeTab === 'roadmap' && (
          <LearningRoadmapTab initialRoleId={roadmapRoleId} />
        )}
        {activeTab === 'assistant' && <ResumeAssistantTab />}
      </div>
    </section>
  );
};
