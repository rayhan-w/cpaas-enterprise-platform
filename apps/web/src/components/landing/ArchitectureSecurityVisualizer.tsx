'use client';

import React, { useState } from 'react';
import {
  Layers,
  Shield,
  Server,
  Database,
  Cpu,
  Zap,
  Globe,
  Radio,
  Lock,
  Workflow,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Terminal,
} from 'lucide-react';

interface LayerSpec {
  id: string;
  name: string;
  badge: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  summary: string;
  techStack: string[];
  keySpecs: { label: string; value: string }[];
  securityRole: string;
}

const ARCHITECTURE_LAYERS: LayerSpec[] = [
  {
    id: 'edge',
    name: '1. Cloudflare Edge Security Layer',
    badge: 'Edge Layer • Global Anycast',
    icon: Globe,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    summary: 'First line of defense protecting against Layer 3/4 and Layer 7 DDoS attacks, bot scrapers, and malicious traffic before reaching origins.',
    techStack: ['Cloudflare Enterprise', 'Anycast CDN', 'Cloudflare WAF', 'Managed Challenge Bot Shield', 'SSL Full Strict TLS 1.3'],
    keySpecs: [
      { label: 'DDoS Capacity', value: '192+ Tbps Global Scrubbing' },
      { label: 'DNS Latency', value: '< 10ms Anycast Routing' },
      { label: 'WAF Rule Sets', value: 'OWASP Core + Zero-Day Rules' },
    ],
    securityRole: 'Blocks 99.8% of automated attacks, malicious scrapers, and bad actors at 300+ global edge data centers.',
  },
  {
    id: 'proxy',
    name: '2. HAProxy & Nginx Gateway Layer',
    badge: 'High-Performance Load Balancer',
    icon: Server,
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    summary: 'Ultra-low-latency reverse proxy and API Gateway performing SSL termination, circuit breaking, dynamic upstream load balancing, and rate throttling.',
    techStack: ['HAProxy (Layer 4/7)', 'Nginx Reverse Proxy', 'Certbot Automated TLS', 'Sticky Sessions', 'IP Conntrack Throttling'],
    keySpecs: [
      { label: 'Throughput', value: '100,000+ Concurrent Requests/sec' },
      { label: 'Upstream Balance', value: 'Round-Robin & Least-Conn' },
      { label: 'Rate Limiting', value: 'Token Bucket (1,000 req/min/IP)' },
    ],
    securityRole: 'Hardens API boundaries, verifies TLS certificates, scrubs malicious HTTP headers, and insulates backend clusters.',
  },
  {
    id: 'app',
    name: '3. Modular Monolith & Dual AI Core',
    badge: 'NestJS + FastAPI Hybrid Engine',
    icon: Cpu,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    summary: 'Unified Modular Monolith architecture combining enterprise CPaaS business logic in NestJS with ultra-fast Python AI vector inference in FastAPI.',
    techStack: ['Node.js + NestJS (TypeScript)', 'FastAPI (Python AI Engine)', 'WebSockets Gateway', 'JWT & RBAC Guards', 'Prisma ORM'],
    keySpecs: [
      { label: 'Core Architecture', value: 'Domain-Driven Modular Monolith' },
      { label: 'Real-Time Sync', value: 'Bidirectional WebSocket Streaming' },
      { label: 'AI Inference', value: 'FastAPI + OpenAI/Gemini Agent RAG' },
    ],
    securityRole: 'Applies Strict RBAC permissions, input schema validation via Zod/Class-Validator, API key authentication, and audit tracing.',
  },
  {
    id: 'queue',
    name: '4. Amazon SQS Distributed Queue Layer',
    badge: 'Zero-Loss Message Orchestration',
    icon: Workflow,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    summary: 'AWS-managed message queue guaranteeing zero message drops during high-volume flash sales, marketing broadcasts, and telco rate limit spikes.',
    techStack: ['Amazon SQS (Standard / FIFO)', 'BullMQ Redis Workers', 'Dead Letter Queue (DLQ)', 'Exponential Backoff Retries'],
    keySpecs: [
      { label: 'Delivery Guarantee', value: 'At-Least-Once Delivery SLA' },
      { label: 'Burst Throughput', value: 'Virtually Unlimited Horizontal Scaling' },
      { label: 'DLT / DND Filter', value: 'Real-time TRAI scrub prior to dispatch' },
    ],
    securityRole: 'Isolates burst traffic, buffers spike loads, and prevents backend cascading failures under massive volume bursts.',
  },
  {
    id: 'data',
    name: '5. PostgreSQL Data Security & Storage Layer',
    badge: 'Enterprise Relational Database',
    icon: Database,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    summary: 'ACID-compliant storage engine featuring Row-Level Security (RLS), column-level PII encryption, time-series telemetry partitioning, and MySQL compatibility.',
    techStack: ['PostgreSQL 16 (Primary)', 'MySQL 8 Support', 'pgvector (AI Embeddings)', 'Row-Level Security (RLS)', 'Timescale Partitioning'],
    keySpecs: [
      { label: 'Data Encryption', value: 'AES-256 at Rest & TLS 1.3 in Transit' },
      { label: 'Multi-Tenancy', value: 'Strict Workspace Tenant Isolation' },
      { label: 'Telemetry Partitions', value: 'High-speed message logs with 90-day retention' },
    ],
    securityRole: 'Safeguards sensitive contact numbers, message content, and API credentials with hardware-level encryption and strict tenant fences.',
  },
];

export function ArchitectureSecurityVisualizer() {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('app');
  const activeLayer = ARCHITECTURE_LAYERS.find((l) => l.id === selectedLayerId) || ARCHITECTURE_LAYERS[2];

  return (
    <section id="architecture" className="py-20 md:py-28 relative bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3.5 py-1 rounded-full text-xs font-bold text-indigo-700 font-mono">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>High-Throughput Modular Monolith</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Million-Scale Telemetry &amp; 4-Layer Security
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A high-performance technical stack built on <strong>Next.js + NestJS + FastAPI Dual AI + PostgreSQL + HAProxy + Amazon SQS</strong>, secured at every tier from Edge to Data.
          </p>
        </div>

        {/* 4-Layer Security Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Layer Selector Stack (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
              Select Architecture Tier:
            </div>

            {ARCHITECTURE_LAYERS.map((layer) => {
              const Icon = layer.icon;
              const isSelected = selectedLayerId === layer.id;

              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? `${layer.bgColor} ${layer.borderColor} shadow-md scale-[1.02]`
                      : 'bg-white border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isSelected ? 'bg-white border border-slate-200 shadow-xs' : 'bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${layer.color}`} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                        {layer.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{layer.badge}</div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition ${
                      isSelected ? `${layer.color} translate-x-1` : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                </button>
              );
            })}

            {/* Quick Architectural Latency Breakdown */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2 shadow-sm">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Total Pipeline Latency</span>
                <span className="font-mono text-emerald-700">&lt; 42ms end-to-end</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200">
                <div className="bg-amber-500 w-[15%]" title="Cloudflare Edge (8ms)" />
                <div className="bg-cyan-500 w-[20%]" title="HAProxy Load Balancer (4ms)" />
                <div className="bg-blue-500 w-[35%]" title="NestJS + FastAPI AI (18ms)" />
                <div className="bg-indigo-500 w-[15%]" title="Amazon SQS Queue (6ms)" />
                <div className="bg-emerald-500 w-[15%]" title="PostgreSQL RLS (6ms)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Edge</span>
                <span>Gateway</span>
                <span>Dual AI Core</span>
                <span>SQS Queue</span>
                <span>PostgreSQL</span>
              </div>
            </div>
          </div>

          {/* Active Layer Deep Dive Card (Right 7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <activeLayer.icon className={`w-6 h-6 ${activeLayer.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{activeLayer.name}</h3>
                  <span className={`text-xs font-mono font-bold ${activeLayer.color}`}>{activeLayer.badge}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
                Status: Operational
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {activeLayer.summary}
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeLayer.keySpecs.map((spec, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{spec.label}</div>
                  <div className="text-xs font-bold text-slate-900 font-mono mt-1">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Engine Technologies:</div>
              <div className="flex flex-wrap gap-2">
                {activeLayer.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Security &amp; Compliance Guarantee</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {activeLayer.securityRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
