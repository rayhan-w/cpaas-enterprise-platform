import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  Radio,
  Copyright,
  ShieldCheck,
  CheckCircle2,
  Building,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Solvear — Master Service Agreement",
  description:
    "Terms and Conditions of Solvear. Read our Master Service Agreement, communication consent, copyright stipulations, and data protection policies.",
};

export default function TermsPage() {
  return (
    <div className="font-sans bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. Top Page Hero */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800 py-16 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-500">Legal &amp; Compliance</p>
          <h1 className="mt-3 font-extrabold text-3xl sm:text-4xl md:text-5xl text-white">
            Terms and Conditions
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-400">
            Master Service Agreement and communication terms governing the use of Solvear CPaaS, Bulk SMS, WhatsApp Business API, RCS, and Digital Marketing platforms.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition"
            >
              Schedule a Consultation
            </Link>
            <a
              href="tel:+918016081188"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Call Sales: +91 80160 81188</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Breadcrumb bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 py-3">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-rose-400 transition font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-white font-bold">Terms and Conditions</span>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Legal Clauses */}
            <div className="lg:col-span-8 space-y-8">
              {/* Introduction Box */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10 shadow-lg space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                    <Scale className="h-6 w-6" />
                  </span>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                      Terms of Service
                    </span>
                    <h2 className="text-2xl font-extrabold text-white">
                      Terms and Conditions
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p>
                    <strong>Solvear (SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED)</strong> perceives the significance of ensuring privacy. Our security strategy portrays what individual data we might gather and how we might utilize and ensure any close to home data that is made accessible to us.
                  </p>
                  <p>
                    This site is owned by <strong>Solvear (SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED)</strong>. We are focused on keeping up with the classification, respectability and security of individual data and we will take all fitting specialized and authoritative safety efforts to guarantee that where any close to home data is given to us it will be ensured against loss, destruction and harm, and against unapproved or unintentional access, processing, deletion, move, use, alteration, revelation or other abuse.
                  </p>
                </div>
              </div>

              {/* Express Consent for Communications Clause */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                    <Radio className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Communication &amp; Messaging Consent
                  </h3>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p>
                    By providing your contact details, you expressly consent to receiving communications from us, including but not limited to transactional notifications, reminders, updates, promotional messages, and advertisements via RCS (Rich Communication Services), SMS, and other electronic communication methods. These communications may be sent to the mobile number or email address you have provided.
                  </p>
                  <p>
                    You can opt out of receiving promotional messages at any time by following the unsubscribe instructions provided in the communication or by contacting us directly. However, you may continue to receive transactional or service-related messages that are essential for providing our services.
                  </p>
                </div>
              </div>

              {/* Copyright Clause */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                    <Copyright className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Copyright &amp; Intellectual Property
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  All data showed and communicated on solvear.in is secured by copyright along with other licensed innovation laws. In any prospect your are not permitted to repost, rewrite or use the display of this website. If we come across any such misuse can go for legal steps thereby.
                </p>
              </div>

              {/* Service Terms & Fair Usage */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Platform Fair Usage &amp; DLT Compliance
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>DLT Entity &amp; Template Approval:</strong> All commercial and transactional SMS traffic terminated in India must comply with TRAI DLT guidelines and registered sender headers.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Meta WhatsApp Business Policy:</strong> Outbound WhatsApp campaign templates must comply with official Meta WhatsApp Business Messaging terms and recipient opt-in rules.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>SLA &amp; Support Guarantee:</strong> We maintain enterprise-grade 99.99% high availability with automatic multi-carrier failover routing and 24/7 technical monitoring.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Office Locations & Fast Contact */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Contact Box */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-rose-500" />
                  <span>Contact Our Legal Desk</span>
                </h4>
                <p className="text-xs text-slate-400">
                  For compliance inquiries, master agreements, or DLT registration support, reach out to our legal department.
                </p>

                <div className="pt-2 border-t border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <p className="font-bold text-white">+91 80160 81188</p>
                      <p className="text-[11px] text-slate-400">Mon - Sat, 9:30 AM - 7:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <p className="font-bold text-white">care@solvear.in</p>
                      <p className="text-[11px] text-slate-400">Official Compliance &amp; Support</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Registered Corporate Office</p>
                      <p className="text-[11px] text-slate-400">
                        C/O Dilip Kumar Ghosh, Gholapara, PO Sukchar, Kolkata, North 24 Parganas, West Bengal 700115, India
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="block w-full py-2.5 text-center rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
                >
                  Get in Touch
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg space-y-3">
                <h4 className="text-sm font-bold text-white">
                  Legal Documents
                </h4>
                <div className="space-y-2 text-xs">
                  <Link
                    href="/terms-and-conditions"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 text-rose-400 font-bold"
                  >
                    <span>Terms and Conditions</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 font-semibold transition"
                  >
                    <span>Privacy Policy</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
