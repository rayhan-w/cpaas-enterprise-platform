'use client';

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Play,
  Terminal,
  Server,
  Zap,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

type Lang = 'curl' | 'node' | 'python' | 'php';

const CODE_EXAMPLES: Record<Lang, { title: string; code: string }> = {
  curl: {
    title: 'cURL',
    code: `curl -X POST https://api.solvear.in/v1/messages/dispatch \\
  -H "Authorization: Bearer sk_live_98214fa89b210" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "whatsapp",
    "recipient": "+919876543210",
    "template": "order_dispatch_update",
    "parameters": {
      "customer_name": "Sarah",
      "order_id": "#ORD-98214",
      "tracking_url": "https://track.solvear.in/pkg_8921"
    },
    "metadata": {
      "priority": "HIGH",
      "queue": "amazon-sqs-fifo"
    }
  }'`,
  },
  node: {
    title: 'TypeScript / Node.js',
    code: `import { SolvearClient } from '@solvear/cpaas-sdk';

const solvear = new SolvearClient({
  apiKey: process.env.SOLVEAR_API_KEY,
  region: 'ap-south-1', // HAProxy Edge
});

async function sendWhatsAppAlert() {
  const response = await solvear.messages.dispatch({
    channel: 'whatsapp',
    recipient: '+919876543210',
    template: 'order_dispatch_update',
    parameters: {
      customer_name: 'Sarah',
      order_id: '#ORD-98214',
      tracking_url: 'https://track.solvear.in/pkg_8921',
    },
  });

  console.log('Dispatched via SQS:', response.messageId, 'Latency:', response.latencyMs);
}`,
  },
  python: {
    title: 'Python (FastAPI SDK)',
    code: `from solvear import SolvearClient
import os

client = SolvearClient(api_key=os.getenv("SOLVEAR_API_KEY"))

# Asynchronous high-throughput dispatch
response = client.messages.dispatch(
    channel="whatsapp",
    recipient="+919876543210",
    template="order_dispatch_update",
    parameters={
        "customer_name": "Sarah",
        "order_id": "#ORD-98214",
        "tracking_url": "https://track.solvear.in/pkg_8921"
    },
    ai_smart_routing=True
)

print(f"Dispatched: {response.message_id} | Route: {response.carrier_route}")`,
  },
  php: {
    title: 'PHP / Laravel',
    code: `<?php

use Solvear\\CPaaS\\SolvearClient;

$solvear = new SolvearClient(env('SOLVEAR_API_KEY'));

$response = $solvear->messages()->dispatch([
    'channel' => 'whatsapp',
    'recipient' => '+919876543210',
    'template' => 'order_dispatch_update',
    'parameters' => [
        'customer_name' => 'Sarah',
        'order_id' => '#ORD-98214',
        'tracking_url' => 'https://track.solvear.in/pkg_8921'
    ]
]);

echo "Dispatched: " . $response['message_id'];`,
  },
};

export function DeveloperWorkbench() {
  const [activeLang, setActiveLang] = useState<Lang>('curl');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [responseOutput, setResponseOutput] = useState<any>({
    status: 200,
    statusText: '200 OK',
    time: '38ms',
    data: {
      success: true,
      messageId: 'msg_98214a90bcf129e8',
      channel: 'whatsapp_cloud_api',
      recipient: '+919876543210',
      status: 'QUEUED_IN_SQS',
      sqsJobId: 'sqs_msg_448912904',
      carrierLatencyMs: 38,
      dltScrubStatus: 'VERIFIED_CLEAN',
      creditsDeducted: 0.12,
      createdAt: '2026-08-27T10:05:00.000Z',
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeLang].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteRequest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setResponseOutput({
        status: 200,
        statusText: '200 OK',
        time: `${Math.floor(Math.random() * 15) + 32}ms`,
        data: {
          success: true,
          messageId: `msg_${Math.random().toString(36).substring(2, 12)}`,
          channel: 'whatsapp_cloud_api',
          recipient: '+919876543210',
          status: 'QUEUED_IN_SQS',
          sqsJobId: `sqs_msg_${Math.floor(Math.random() * 900000) + 100000}`,
          carrierLatencyMs: Math.floor(Math.random() * 10) + 35,
          dltScrubStatus: 'VERIFIED_CLEAN',
          creditsDeducted: 0.12,
          createdAt: new Date().toISOString(),
        },
      });
      setIsRunning(false);
    }, 600);
  };

  return (
    <section id="developer" className="py-20 md:py-28 relative bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-emerald-800 font-mono">
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span>Developer API Workbench</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Built for Developers. Integrates in Minutes.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Send WhatsApp, SMS, and Telegram messages programmatically using clean RESTful endpoints, native SDKs, and Webhooks.
          </p>
        </div>

        {/* Workbench Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Code Editor Box (Left 7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Top Toolbar */}
            <div className="bg-slate-900 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                {(['curl', 'node', 'python', 'php'] as Lang[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-extrabold transition ${
                      activeLang === lang
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {CODE_EXAMPLES[lang].title}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={handleExecuteRequest}
                  disabled={isRunning}
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-extrabold px-4 py-2 rounded-xl transition active:scale-95 disabled:opacity-50 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Sending...' : 'Run Request'}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-6 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto bg-slate-950/90 leading-relaxed max-h-[400px]">
              <pre>
                <code>{CODE_EXAMPLES[activeLang].code}</code>
              </pre>
            </div>
          </div>

          {/* Live Response Inspector (Right 5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl flex flex-col h-full">
            {/* Response Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Terminal className="w-5 h-5 text-slate-700" />
                <span className="text-sm sm:text-base font-extrabold text-slate-900">Live Response Inspector</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold">
                  {responseOutput.statusText}
                </span>
                <span className="text-slate-500 font-bold">{responseOutput.time}</span>
              </div>
            </div>

            {/* Response JSON Body */}
            <div className="p-6 font-mono text-xs sm:text-sm text-emerald-800 overflow-x-auto bg-slate-50/50 flex-1 leading-relaxed max-h-[350px]">
              <pre>{JSON.stringify(responseOutput.data, null, 2)}</pre>
            </div>

            {/* Micro specs */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs sm:text-sm text-slate-700 flex items-center justify-between font-semibold">
              <span className="font-mono text-slate-500">Rate Limit: 10,000 req/min</span>
              <span className="text-blue-700 font-extrabold">Webhooks Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
