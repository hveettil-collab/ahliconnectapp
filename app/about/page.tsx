'use client';
import AppShell from '@/components/layout/AppShell';
import {
  Code2,
  Cpu,
  Users,
  Zap,
  Search,
  Mic,
  Eye,
  Brain,
  Globe,
  Shield,
  Smartphone,
  Palette,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <AppShell title="About Ahli Connect" subtitle="Platform Architecture & Capabilities">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center pb-6 border-b border-[#E8E2D9]">
          <h1 className="text-4xl font-bold text-[#1A1A2E] mb-2">Ahli Connect</h1>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="px-3 py-1 bg-[#1B3A6B] text-white text-xs font-semibold rounded-full">
              v1.0.0
            </span>
            <span className="px-3 py-1 bg-[#E8EFF8] text-[#1B3A6B] text-xs font-semibold rounded-full">
              Built with Claude Code
            </span>
          </div>
        </div>

        {/* Platform Overview */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">Platform Overview</h2>
            <p className="text-base text-[#4B5563] leading-relaxed mb-4">
              A unified employee experience platform for IHC Group's 45,000+ employees across 30+ subsidiaries.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Pages', value: '13' },
              { label: 'Components', value: '10+' },
              { label: 'Companies', value: '7' },
              { label: 'AI Features', value: '3' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-[16px] border border-[#E8E2D9] p-4 text-center hover:shadow-md transition-all"
              >
                <div className="text-2xl font-bold text-[#1B3A6B] mb-1">{stat.value}</div>
                <div className="text-xs text-[#6B7280] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Technology Stack</h2>

          {/* Tech Stack Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 16', icon: Code2, color: '#000000' },
              { name: 'React 19', icon: Zap, color: '#61DAFB' },
              { name: 'TypeScript', icon: Code2, color: '#3178C6' },
              { name: 'Tailwind CSS 4', icon: Palette, color: '#06B6D4' },
            ].map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="bg-white rounded-[16px] border border-[#E8E2D9] p-4 flex items-center gap-3 hover:shadow-md transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: tech.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="font-semibold text-[#1A1A2E] text-sm">{tech.name}</div>
                </div>
              );
            })}
          </div>

          {/* Architecture Diagram */}
          <div className="bg-white rounded-[16px] border border-[#E8E2D9] p-6 mt-6">
            <h3 className="text-sm font-bold text-[#1A1A2E] mb-6">Application Architecture</h3>
            <div className="space-y-4">
              {/* Client Layer */}
              <div className="flex items-center justify-center">
                <div className="bg-[#E8EFF8] border border-[#1B3A6B] rounded-[12px] px-6 py-3 text-center">
                  <div className="text-sm font-semibold text-[#1B3A6B]">Client Layer</div>
                  <div className="text-xs text-[#6B7280] mt-1">React Components + UI</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="text-[#9CA3AF] rotate-90" size={20} />
              </div>

              {/* Next.js App Router */}
              <div className="flex items-center justify-center">
                <div className="bg-[#FFF4E6] border border-[#D97706] rounded-[12px] px-6 py-3 text-center">
                  <div className="text-sm font-semibold text-[#92400E]">Next.js App Router</div>
                  <div className="text-xs text-[#6B7280] mt-1">Server & Client Components</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="text-[#9CA3AF] rotate-90" size={20} />
              </div>

              {/* Providers */}
              <div className="flex items-center justify-center">
                <div className="bg-[#F3E8FF] border border-[#9333EA] rounded-[12px] px-6 py-3 text-center">
                  <div className="text-sm font-semibold text-[#6B21A8]">Context Providers</div>
                  <div className="text-xs text-[#6B7280] mt-1">Auth, Theme, State Management</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="text-[#9CA3AF] rotate-90" size={20} />
              </div>

              {/* Data Layer */}
              <div className="flex gap-3 justify-center flex-wrap">
                <div className="bg-[#DBEAFE] border border-[#3B82F6] rounded-[12px] px-6 py-3 text-center">
                  <div className="text-sm font-semibold text-[#1E40AF]">Mock API</div>
                  <div className="text-xs text-[#6B7280] mt-1">Development</div>
                </div>
                <div className="bg-[#DBEAFE] border border-[#3B82F6] rounded-[12px] px-6 py-3 text-center">
                  <div className="text-sm font-semibold text-[#1E40AF]">Real API</div>
                  <div className="text-xs text-[#6B7280] mt-1">Production</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">AI Features</h2>
          <p className="text-base text-[#4B5563]">Three intelligent assistants powered by AI to enhance the employee experience.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* AI Listing Assistant */}
            <div className="bg-gradient-to-br from-[#FFF4E6] to-white rounded-[16px] border border-[#D97706] p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#D97706] flex items-center justify-center text-white flex-shrink-0">
                  <Eye size={20} />
                </div>
                <h3 className="font-bold text-[#1A1A2E] text-sm">AI Listing Assistant</h3>
              </div>
              <p className="text-xs text-[#6B7280] mb-3">Intelligent image recognition and categorization</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <span className="text-[#D97706] font-bold mt-0.5">•</span>
                  <span>Image recognition via canvas pixel analysis</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <span className="text-[#D97706] font-bold mt-0.5">•</span>
                  <span>Voice-to-text via Web Speech API</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <span className="text-[#D97706] font-bold mt-0.5">•</span>
                  <span>Smart category detection</span>
                </li>
              </ul>
            </div>

            {/* AI HR Assistant */}
            <div className="bg-gradient-to-br from-[#E0E7FF] to-white rounded-[16px] border border-[#6366F1] p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#6366F1] flex items-center justify-center text-white flex-shrink-0">
                  <Brain size={20} />
                </div>
                <h3 className="font-bold text-[#1A1A2E] text-sm">AI HR Assistant</h3>
              </div>
              <p className="text-xs text-[#6B7280] mb-3">Natural language HR query processing</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <span className="text-[#6366F1] font-bold mt-0.5">•</span>
                  <span>Natural language query processing</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <span className="text-[#6366F1] font-bold mt-0.5">•</span>
                  <span>Intent detection & classification</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <span className="text-[#6366F1] font-bold mt-0.5">•</span>
                  <span>Intelligent service routing</span>
                </li>
              </ul>
            </div>

            {/* AI Smart Search */}
            <div className="bg-gradient-to-br from-[#DBEAFE] to-white rounded-[16px] border border-[#3B82F6] p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#3B82F6] flex items-center justify-center text-white flex-shrink-0">
                  <Search size={20} />
                </div>
                <h3 className="font-bold text-[#1A1A2E] text-sm">AI Smart Search</h3>
              </div>
              <p className="text-xs text-[#6B7280] mb-3">Intelligent cross-platform search</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <span className="text-[#3B82F6] font-bold mt-0.5">•</span>
                  <span>Cross-platform search capability</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <span className="text-[#3B82F6] font-bold mt-0.5">•</span>
                  <span>Natural language queries</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <span className="text-[#3B82F6] font-bold mt-0.5">•</span>
                  <span>Contextual suggestions</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Integration Roadmap */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Integration Roadmap</h2>
          <p className="text-base text-[#4B5563]">Planned features and enterprise integrations.</p>

          <div className="space-y-3">
            {[
              {
                phase: 'Phase 1',
                title: 'Current',
                date: 'Now',
                items: ['Mock data', 'Client-side auth', 'Demo mode'],
                completed: true,
              },
              {
                phase: 'Phase 2',
                title: 'Enhanced Backend',
                date: 'Q2 2026',
                items: ['Azure AD SSO', 'SuccessFactors HR sync', 'Real marketplace backend'],
                completed: false,
              },
              {
                phase: 'Phase 3',
                title: 'Integrations',
                date: 'Q3 2026',
                items: ['Microsoft Teams integration', 'Push notifications', 'Real AI vision API'],
                completed: false,
              },
              {
                phase: 'Phase 4',
                title: 'Scale & Localize',
                date: 'Q4 2026',
                items: ['Analytics dashboard', 'Multi-language (AR/EN)', 'Company admin panel'],
                completed: false,
              },
            ].map((phase, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[16px] border border-[#E8E2D9] p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {phase.completed ? (
                      <CheckCircle2 size={24} className="text-[#10B981]" />
                    ) : (
                      <Calendar size={24} className="text-[#6B7280]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-bold text-[#1A1A2E]">{phase.phase}</span>
                      <span className="text-sm text-[#1B3A6B] font-semibold">{phase.title}</span>
                      <span className="text-xs text-[#6B7280] ml-auto">{phase.date}</span>
                    </div>
                    <ul className="space-y-1">
                      {phase.items.map((item, i) => (
                        <li key={i} className="text-sm text-[#4B5563] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#6B7280] rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scalability Features */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Scalability Features</h2>
          <p className="text-base text-[#4B5563]">Built to scale across IHC Group's enterprise operations.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Globe,
                title: 'Multi-Tenant Architecture',
                description: '7 companies, extensible to support growth',
                color: '#3B82F6',
              },
              {
                icon: Shield,
                title: 'Role-Based Filtering',
                description: 'Content automatically filtered by user role',
                color: '#10B981',
              },
              {
                icon: Smartphone,
                title: 'Responsive Design',
                description: 'Mobile-first approach for all devices',
                color: '#F59E0B',
              },
              {
                icon: Palette,
                title: 'Theme System',
                description: 'Light and dark mode support',
                color: '#8B5CF6',
              },
              {
                icon: Cpu,
                title: 'Modular Components',
                description: 'Reusable component library structure',
                color: '#EC4899',
              },
              {
                icon: Users,
                title: 'Employee-Centric',
                description: '45,000+ employees across 30+ subsidiaries',
                color: '#06B6D4',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-[16px] border border-[#E8E2D9] p-5 hover:shadow-md transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white mb-3 flex-shrink-0"
                    style={{ backgroundColor: feature.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-[#1A1A2E] text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-[#6B7280]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Built with AI Section */}
        <section className="space-y-4">
          <div className="bg-gradient-to-br from-[#E8EFF8] to-[#F0F9FF] rounded-[16px] border border-[#1B3A6B] p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[12px] bg-[#1B3A6B] flex items-center justify-center text-white flex-shrink-0">
                <Code2 size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-3">Built with AI</h2>
                <p className="text-base text-[#4B5563] mb-4">
                  This entire platform was built collaboratively with Claude Code, demonstrating the power of AI-assisted development.
                </p>

                <div className="bg-white rounded-[12px] border border-[#E8E2D9] p-4 mb-4">
                  <p className="font-semibold text-[#1A1A2E] text-sm mb-2">Development Stats</p>
                  <p className="text-sm text-[#4B5563]">
                    <span className="font-bold text-[#1B3A6B]">13 pages</span>, <span className="font-bold text-[#1B3A6B]">10+ components</span>,{' '}
                    <span className="font-bold text-[#1B3A6B]">3 AI features</span>, <span className="font-bold text-[#1B3A6B]">2000+ lines of code</span> —
                    all developed in a single collaborative session.
                  </p>
                </div>

                <p className="text-sm font-semibold text-[#1A1A2E] mb-3">How AI Accelerated Development</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-[#4B5563]">
                    <span className="text-[#1B3A6B] font-bold mt-0.5">✓</span>
                    <span>Rapid prototyping with intelligent code generation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#4B5563]">
                    <span className="text-[#1B3A6B] font-bold mt-0.5">✓</span>
                    <span>Architecture design with best practices guidance</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#4B5563]">
                    <span className="text-[#1B3A6B] font-bold mt-0.5">✓</span>
                    <span>Component library implementation with consistency</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#4B5563]">
                    <span className="text-[#1B3A6B] font-bold mt-0.5">✓</span>
                    <span>Real-time feedback and iterative refinement</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-[#4B5563]">
                    <span className="text-[#1B3A6B] font-bold mt-0.5">✓</span>
                    <span>Full-stack feature development from design to deployment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer spacing */}
        <div className="h-8"></div>
      </div>
    </AppShell>
  );
}
