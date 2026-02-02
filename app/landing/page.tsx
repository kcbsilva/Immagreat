"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Clock3,
  Compass,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { ImmagrateHeader } from "./ImmagreatHeader";
import { Lang } from "./LanguageToggle";
import logo from "./assets/logo.png";

type Pathway = {
  title: string;
  blurb: string;
  tag: string;
  icon: typeof Compass;
};

type Step = { title: string; detail: string; icon: typeof Clock3 };

type Program = { title: string; focus: string };

type CompanyService = { title: string; detail: string };

const pathways: Record<Lang, Pathway[]> = {
  en: [
    {
      title: "Study to Stay Ready",
      blurb:
        "Admissions targeting, SOP coaching, and proof-of-funds prep so you can move quickly when offers land.",
      tag: "Students & Graduates",
      icon: GraduationCap,
    },
    {
      title: "Skilled Work Ready",
      blurb:
        "Resume localization, LinkedIn optimization, and interview coaching tuned to Canadian hiring norms.",
      tag: "Job market",
      icon: Briefcase,
    },
    {
      title: "Express Entry Prep",
      blurb:
        "CRS uplift plan, language score targets, and document pre-collection for faster filing when eligible.",
      tag: "Future PR",
      icon: Compass,
    },
    {
      title: "Family Landing Prep",
      blurb:
        "Relationship proof guidance, checklists, and landing logistics for spouses and kids.",
      tag: "Family",
      icon: HeartHandshake,
    },
  ],
  pt: [
    {
      title: "Pré Estudo para Ficar",
      blurb:
        "Alvo de admissões, coaching de carta de intenção e comprovação financeira para agir rápido quando sair a oferta.",
      tag: "Estudantes e formados",
      icon: GraduationCap,
    },
    {
      title: "Pronto para Trabalho Qualificado",
      blurb:
        "Currículo para o padrão canadense, LinkedIn otimizado e treino de entrevistas.",
      tag: "Mercado de trabalho",
      icon: Briefcase,
    },
    {
      title: "Preparação Express Entry",
      blurb:
        "Plano de aumento de CRS, metas de idioma e coleta de documentos para aplicar rápido quando elegível.",
      tag: "Futuro PR",
      icon: Compass,
    },
    {
      title: "Preparação Familiar",
      blurb:
        "Orientação de provas de relacionamento, checklists e logística de chegada para cônjuge e filhos.",
      tag: "Família",
      icon: HeartHandshake,
    },
  ],
};

const steps: Record<Lang, Step[]> = {
  en: [
    {
      title: "Profile Signal",
      detail:
        "We translate your experience and language baseline into likely pathways and priorities—no filings yet.",
      icon: Sparkles,
    },
    {
      title: "Document Spine",
      detail:
        "A living checklist with templates and examples so you can assemble proof before any application.",
      icon: FileCheck2,
    },
    {
      title: "Language Lift",
      detail:
        "Personalized English track (kids, teens, adults) with CLB/IELTS targets and daily practice rhythm.",
      icon: Clock3,
    },
    {
      title: "Job Market Ready",
      detail:
        "Market-aligned resume, outreach cadence, and mock interviews aimed at Canadian hiring norms.",
      icon: MapPin,
    },
  ],
  pt: [
    {
      title: "Sinal do Perfil",
      detail:
        "Traduzimos sua experiência e nível de inglês em caminhos prováveis e prioridades — sem protocolos agora.",
      icon: Sparkles,
    },
    {
      title: "Espinha Documental",
      detail:
        "Checklist vivo com modelos e exemplos para reunir provas antes de qualquer aplicação.",
      icon: FileCheck2,
    },
    {
      title: "Impulso de Inglês",
      detail:
        "Trilha personalizada (kids, teens, adultos) com metas CLB/IELTS e ritmo diário de prática.",
      icon: Clock3,
    },
    {
      title: "Pronto para o Mercado",
      detail:
        "Currículo alinhado ao mercado, cadência de contatos e simulações de entrevista no padrão canadense.",
      icon: MapPin,
    },
  ],
};

const highlights: Record<Lang, string[]> = {
  en: [
    "Officer-style clarity in every document template, even before you file.",
    "Evidence-first checklists to prevent last-minute scrambles.",
    "Weekly readiness beats with risk notes and next actions.",
    "Privacy-first: encrypted storage, least-access handling.",
  ],
  pt: [
    "Clareza estilo oficial em cada modelo de documento, antes mesmo de protocolar.",
    "Checklists focados em evidências para evitar correria de última hora.",
    "Ritmo semanal de prontidão com riscos e próximos passos.",
    "Privacidade primeiro: armazenamento criptografado e acesso mínimo.",
  ],
};

const englishPrograms: Record<Lang, Program[]> = {
  en: [
    {
      title: "Kids (8-12)",
      focus:
        "Confidence and vocabulary through stories and games; foundations for CLB growth.",
    },
    {
      title: "Teens (13-17)",
      focus:
        "Academic writing, speaking fluency, and test prep habits for future study permits.",
    },
    {
      title: "Adults",
      focus:
        "IELTS/CLB score lift with task-based speaking, listening labs, and writing clinics.",
    },
  ],
  pt: [
    {
      title: "Kids (8-12)",
      focus:
        "Vocabulário e confiança com histórias e jogos; base para crescer no CLB.",
    },
    {
      title: "Teens (13-17)",
      focus:
        "Escrita acadêmica, fala fluente e hábitos de prova para futuros estudos.",
    },
    {
      title: "Adultos",
      focus:
        "Ganho de nota IELTS/CLB com speaking prático, escuta guiada e clínicas de writing.",
    },
  ],
};

const jobReadiness: Record<Lang, string[]> = {
  en: [
    "NOC mapping of your roles to target titles and provinces.",
    "Resume + LinkedIn localization with metrics and Canadian formatting.",
    "Outreach cadence: warm intros, recruiter scripts, and follow-up timers.",
    "Interview prep with behavioral drills and case-style practice for tech/non-tech roles.",
    "Credential recognition guidance and bridging program suggestions.",
  ],
  pt: [
    "Mapeamento NOC do seu histórico para cargos e províncias-alvo.",
    "Currículo e LinkedIn no formato canadense, com métricas claras.",
    "Cadência de contatos: roteiros, recruiters e lembretes de follow-up.",
    "Treino de entrevistas comportamentais e cases para tech e não-tech.",
    "Orientação sobre credenciamento e programas de bridging.",
  ],
};

const coverageTags: Record<Lang, string[]> = {
  en: ["Federal", "Provincial", "Atlantic", "Quebec", "Startup"],
  pt: ["Federal", "Provincial", "Atlântico", "Quebec", "Startup"],
};

const chips: Record<Lang, string[]> = {
  en: ["CRS & PNP mapping", "Risk notes", "Weekly status", "Arrival runway"],
  pt: [
    "Mapeamento CRS & PNP",
    "Notas de risco",
    "Status semanal",
    "Roteiro de chegada",
  ],
};

const companyServices: Record<Lang, CompanyService[]> = {
  en: [
    {
      title: "Startup visa prep (readiness)",
      detail:
        "Eligibility mapping, team gaps, and document prep before engaging a designated organization.",
    },
    {
      title: "Incorporation runway",
      detail:
        "Steps, timelines, and referrals for Canadian incorporation and banking (informational only).",
    },
  ],
  pt: [
    {
      title: "Startup Visa (preparo)",
      detail:
        "Mapeamento de elegibilidade, lacunas do time e documentos antes de falar com uma organização designada.",
    },
    {
      title: "Roteiro de abertura da empresa",
      detail:
        "Passos, prazos e indicações para abrir empresa e banco no Canadá (somente informativo).",
    },
  ],
};

const copy = {
  en: {
    badge: "Canada, tailored",
    languagesNote: "English & Português",
    heroTitle1: "Canada immigration,",
    heroTitle2: "delivered with clarity.",
    subtitle:
      "We get you ready for Canada—language scores, job-market fit, and documentation—so when it’s time to file, you move fast and confidently.",
    ctaPrimary: "Start your readiness session",
    ctaSecondary: "Talk to an advisor",
    statProcessing: "Processing views",
    statTimeline: "Timeline",
    statSecurity: "Security",
    statProcessingValue: "Officer-minded narratives",
    statTimelineValue: "Weekly check-ins",
    statSecurityValue: "Encrypted vault",
    prepNote:
      "We are a preparation service; filings happen later with a licensed RCIC/lawyer of your choice.",
    chooseLane: "Choose the lane",
    tracksHeading: "Readiness tracks we guide",
    prepOnly: "Preparation only — you file when ready",
    methodEyebrow: "Method",
    methodHeading: "A calm, accountable process",
    methodBody:
      "Built for people who want fewer surprises: we make timelines visible, label risks early, and keep evidence organized for the officer who will actually read it.",
    englishEyebrow: "English tracks",
    englishHeading: "Practical English for every age",
    englishBody:
      "We pair teaching with immigration goals: early fluency for kids, academic readiness for teens, and CLB/IELTS lift for adults. Services in English and Portuguese.",
    jobEyebrow: "Job search",
    jobHeading: "A runway to the Canadian job market",
    jobBody:
      "We build a repeatable search system—positioning, outreach, and interview readiness—so you can secure offers faster. Services in English and Portuguese.",
    highlightsEyebrow: "What changes the outcome",
    highlightsHeading: "We obsess over the details",
    translationEyebrow: "Sworn translation",
    translationHeading: "Certified translations (EN ↔ PT)",
    translationBody:
      "Sworn/Certified translators for academic records, birth & marriage certificates, police clearances, and financial documents.",
    translationAccepted:
      "Accepted for Canadian immigration, study, and work processes.",
    translationFoot:
      "Available in English and Portuguese with notarization guidance when required.",
    intakeEyebrow: "Intake",
    intakeHeading: "Build your Canada plan in 45 minutes",
    intakeBody:
      "We map your options, share a risk note, and give you a documented sequence of actions to start immediately—no obligation to continue.",
    intakePrimary: "Book the call",
    intakeSecondary: "Download prep list",
    toolsIncluded: "Tools and templates included",
    navImmigration: "Your Immigration Journey",
    navCompany: "Start a company",
    navServices: "Other services",
    companyEyebrow: "Companies",
    companyHeading: "Start or bring your company",
    companyBody:
      "Readiness playbooks for entrepreneurship and Startup Visa: eligibility, documentation, and clear next steps (no filing yet).",
  },
  pt: {
    badge: "Canadá, sob medida",
    languagesNote: "English & Português",
    heroTitle1: "Imigração para o Canadá,",
    heroTitle2: "com clareza e preparo.",
    subtitle:
      "Preparamos você para o Canadá — inglês, empregabilidade e documentação — para aplicar com segurança quando chegar a hora.",
    ctaPrimary: "Começar sua sessão de preparo",
    ctaSecondary: "Falar com um consultor",
    statProcessing: "Visão do oficial",
    statTimeline: "Linha do tempo",
    statSecurity: "Segurança",
    statProcessingValue: "Narrativas pensadas para o officer",
    statTimelineValue: "Check-ins semanais",
    statSecurityValue: "Cofre criptografado",
    prepNote:
      "Somos uma consultoria de preparação; o protocolo acontece depois com um RCIC/advogado licenciado.",
    chooseLane: "Escolha a trilha",
    tracksHeading: "Trilhas de preparo que guiamos",
    prepOnly: "Só preparação — você protocola quando pronto",
    methodEyebrow: "Método",
    methodHeading: "Um processo calmo e responsável",
    methodBody:
      "Para quem quer menos surpresas: deixamos prazos visíveis, riscos claros e evidências organizadas para quem vai analisar.",
    englishEyebrow: "Trilhas de inglês",
    englishHeading: "Inglês prático para cada fase",
    englishBody:
      "Ensinamos com foco migratório: fluência inicial para kids, preparo acadêmico para teens e ganho de nota CLB/IELTS para adultos. Atendimento em inglês e português.",
    jobEyebrow: "Busca de emprego",
    jobHeading: "Pista para o mercado canadense",
    jobBody:
      "Montamos um sistema repetível — posicionamento, contatos e entrevistas — para acelerar propostas. Atendimento em inglês e português.",
    highlightsEyebrow: "O que muda o resultado",
    highlightsHeading: "Obsessão pelos detalhes",
    translationEyebrow: "Tradução juramentada",
    translationHeading: "Traduções certificadas (EN ↔ PT)",
    translationBody:
      "Tradutores juramentados para históricos escolares, certidões, antecedentes criminais e documentos financeiros.",
    translationAccepted:
      "Aceitas em processos de imigração, estudo e trabalho no Canadá.",
    translationFoot:
      "Disponível em inglês e português com orientação de notarização quando preciso.",
    intakeEyebrow: "Intake",
    intakeHeading: "Monte seu plano Canadá em 45 minutos",
    intakeBody:
      "Mapeamos opções, entregamos nota de risco e uma sequência de ações imediatas — sem obrigação de seguir.",
    intakePrimary: "Agendar chamada",
    intakeSecondary: "Baixar lista de preparo",
    toolsIncluded: "Ferramentas e modelos inclusos",
    navImmigration: "Sua Jornada de Imigração",
    navCompany: "Abrir empresa",
    navServices: "Outros serviços",
    companyEyebrow: "Empresas",
    companyHeading: "Abrir ou trazer sua empresa",
    companyBody:
      "Roteiros de preparo para empreendedorismo e Startup Visa: elegibilidade, documentação e próximos passos claros (sem protocolo ainda).",
  },
} as const;

export default function ImmagratePage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = copy[lang];

  return (
    <main className="relative isolate min-h-screen overflow-auto bg-white text-[#4D4D4D]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-10 h-64 w-64 rounded-full bg-[#C52D2F]/10 blur-[120px]" />
        <div className="absolute top-28 right-[-12%] h-[280px] w-[280px] rounded-full bg-[#C52D2F]/6 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(197,45,47,0.08)_0,_white_55%)]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
      </div>

      <ImmagrateHeader
        lang={lang}
        onLangChange={setLang}
        nav={{
          immigration: t.navImmigration,
          company: t.navCompany,
          services: t.navServices,
        }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-16 md:px-10 md:py-20">
        {/* Hero */}
        <section className="relative grid gap-10 rounded-3xl border border-[#E6E6E6] bg-white/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white/80 p-1.5">
                <Image
                  src={logo}
                  alt="Immagrate logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#C52D2F] leading-tight">
                  Immagrate
                </p>
                <p className="text-xs text-[#808080] leading-tight">
                  Canada Readiness
                </p>
              </div>
            </div>

            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#C52D2F]/20 bg-[#C52D2F]/5 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#4D4D4D]">
              <span className="h-2 w-2 rounded-full bg-[#C52D2F] shadow-[0_0_0_6px_rgba(197,45,47,0.15)]" />
              <span>{t.badge}</span>
              <span className="text-[#808080]">• {t.languagesNote}</span>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#C52D2F] uppercase tracking-[0.25em]">
                Immagrate
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                <span className="block bg-gradient-to-r from-[#C52D2F] via-[#4D4D4D] to-[#C52D2F] bg-clip-text text-transparent">
                  {t.heroTitle1}
                </span>
                <span className="block bg-gradient-to-r from-[#4D4D4D] via-[#C52D2F] to-[#4D4D4D] bg-clip-text text-transparent">
                  {t.heroTitle2}
                </span>
              </h1>
              <p className="max-w-2xl text-base text-[#4D4D4D] sm:text-lg">
                {t.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#intake"
                className="group inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
              >
                {t.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="mailto:intake@immagrate.ca"
                className="inline-flex items-center gap-2 rounded-full border border-[#C52D2F] px-5 py-3 text-sm font-semibold text-[#C52D2F] transition hover:-translate-y-0.5 hover:bg-[#C52D2F]/5"
              >
                {t.ctaSecondary}
              </a>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm text-[#4D4D4D] sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E6E6E6] bg-[#FFF5F5] px-4 py-3 shadow-inner shadow-black/5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
                  {t.statProcessing}
                </p>
                <p className="text-lg font-semibold text-[#C52D2F]">
                  {t.statProcessingValue}
                </p>
              </div>
              <div className="rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 shadow-inner shadow-black/5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
                  {t.statTimeline}
                </p>
                <p className="text-lg font-semibold text-[#4D4D4D]">
                  {t.statTimelineValue}
                </p>
              </div>
              <div className="rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 shadow-inner shadow-black/5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
                  {t.statSecurity}
                </p>
                <p className="text-lg font-semibold text-[#4D4D4D]">
                  {t.statSecurityValue}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#808080]">{t.prepNote}</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#E6E6E6] bg-gradient-to-b from-white via-white to-[#FFF5F5] p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(197,45,47,0.12),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(77,77,77,0.08),transparent_32%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center gap-3 rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3">
                <ShieldCheck className="h-10 w-10 text-[#C52D2F]" />
                <div>
                  <p className="text-sm font-semibold text-[#4D4D4D]">
                    {lang === "en"
                      ? "Regulated process guardrails"
                      : "Trilhos regulatórios alinhados"}
                  </p>
                  <p className="text-xs text-[#808080]">
                    {lang === "en"
                      ? "Built with RCIC-aligned compliance and evidence standards."
                      : "Construído com padrões de compliance alinhados a RCIC."}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E6E6E6] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
                  {lang === "en" ? "Pathways" : "Caminhos"}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  {pathways[lang].map((pathway) => {
                    const Icon = pathway.icon;
                    return (
                      <div
                        key={pathway.title}
                        className="group rounded-xl border border-[#E6E6E6] bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#C52D2F]"
                      >
                        <div className="mb-2 flex items-center gap-2 text-[#C52D2F]">
                          <Icon className="h-4 w-4" />
                          <span className="text-[11px] uppercase tracking-[0.18em] text-[#808080]">
                            {pathway.tag}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#4D4D4D]">
                          {pathway.title}
                        </p>
                        <p className="text-xs text-[#808080]">
                          {pathway.blurb}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E6E6E6] bg-white p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
                  {lang === "en" ? "Coverage" : "Cobertura"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4D4D4D]">
                  {coverageTags[lang].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#FFF5F5] px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Readiness tracks */}
        <section id="immigration" className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
                {t.chooseLane}
              </p>
              <h2 className="text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
                {t.tracksHeading}
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#E6E6E6] px-4 py-2 text-xs text-[#4D4D4D]">
              <ShieldCheck className="h-4 w-4 text-[#C52D2F]" />
              {t.prepOnly}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pathways[lang].map((pathway) => {
              const Icon = pathway.icon;
              return (
                <div
                  key={pathway.title}
                  className="relative overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white p-5 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-[#C52D2F]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F5] via-transparent to-transparent opacity-80" />
                  <div className="relative flex items-start gap-3">
                    <div className="mt-1 rounded-xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[12px] uppercase tracking-[0.2em] text-[#808080]">
                        {pathway.tag}
                      </p>
                      <h3 className="text-lg font-semibold text-[#4D4D4D]">
                        {pathway.title}
                      </h3>
                      <p className="text-sm text-[#4D4D4D]">{pathway.blurb}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Process */}
        <section className="grid gap-8 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
              {t.methodEyebrow}
            </p>
            <h2 className="text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              {t.methodHeading}
            </h2>
            <p className="text-sm text-[#4D4D4D]">{t.methodBody}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#4D4D4D]">
              {chips[lang].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[#E6E6E6] px-3 py-1"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#C52D2F] via-[#C52D2F]/10 to-transparent md:left-6" />
            <div className="space-y-5">
              {steps[lang].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="relative flex gap-4 rounded-2xl border border-[#E6E6E6] bg-[#FFF8F8] p-4"
                  >
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#C52D2F] ring-1 ring-[#C52D2F]/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#808080]">
                        {lang === "en" ? "Step" : "Passo"} {index + 1}
                      </p>
                      <h3 className="text-lg font-semibold text-[#4D4D4D]">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[#4D4D4D]">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* English programs */}
        <section
          id="services"
          className="grid gap-6 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:grid-cols-[1fr_1.1fr]"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
              {t.englishEyebrow}
            </p>
            <h2 className="text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              {t.englishHeading}
            </h2>
            <p className="text-sm text-[#4D4D4D]">{t.englishBody}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {englishPrograms[lang].map((program) => (
              <div
                key={program.title}
                className="rounded-2xl border border-[#E6E6E6] bg-[#FFF8F8] p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-[#C52D2F]">
                  <Users className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.18em] text-[#808080]">
                    {program.title}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#4D4D4D]">
                  {program.focus}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Job search */}
        <section className="grid gap-6 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:grid-cols-[1fr_1.1fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
              {t.jobEyebrow}
            </p>
            <h2 className="text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              {t.jobHeading}
            </h2>
            <p className="text-sm text-[#4D4D4D]">{t.jobBody}</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-[#FFF5F5] px-4 py-2 text-xs text-[#4D4D4D]">
              <Search className="h-4 w-4 text-[#C52D2F]" />
              {t.toolsIncluded}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {jobReadiness[lang].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#E6E6E6] bg-white p-4"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#C52D2F]" />
                  <p className="text-sm text-[#4D4D4D]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company readiness */}
        <section
          id="company"
          className="grid gap-6 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:grid-cols-[1fr_1.1fr]"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
              {t.companyEyebrow}
            </p>
            <h2 className="text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              {t.companyHeading}
            </h2>
            <p className="text-sm text-[#4D4D4D]">{t.companyBody}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {companyServices[lang].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E6E6E6] bg-[#FFF8F8] p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-[#C52D2F]">
                  <Compass className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.18em] text-[#808080]">
                    {item.title}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[#4D4D4D]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section className="grid gap-6 rounded-3xl border border-[#E6E6E6] bg-gradient-to-r from-[#FFF5F5] via-white to-[#FFF5F5] p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
                {t.highlightsEyebrow}
              </p>
              <h2 className="text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
                {t.highlightsHeading}
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs text-[#4D4D4D]">
              <ShieldCheck className="h-4 w-4 text-[#C52D2F]" />
              {lang === "en"
                ? "Transparency on every decision"
                : "Transparência em cada decisão"}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {highlights[lang].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-[#E6E6E6] bg-white p-4"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-[#C52D2F]" />
                <p className="text-sm text-[#4D4D4D]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sworn translation */}
        <section className="grid gap-6 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:grid-cols-[1fr_1.1fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#808080]">
              {t.translationEyebrow}
            </p>
            <h2 className="text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              {t.translationHeading}
            </h2>
            <p className="text-sm text-[#4D4D4D]">{t.translationBody}</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-[#FFF5F5] px-4 py-2 text-xs text-[#4D4D4D]">
              <ShieldCheck className="h-4 w-4 text-[#C52D2F]" />
              {t.translationAccepted}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {(lang === "en"
                ? [
                    "Academic transcripts & diplomas",
                    "Civil docs: birth, marriage, divorce",
                    "Police certificates",
                    "Bank letters & proof of funds",
                    "Employment letters & contracts",
                    "Medical letters (non-diagnostic)",
                  ]
                : [
                    "Históricos e diplomas acadêmicos",
                    "Certidões: nascimento, casamento, divórcio",
                    "Atestados de antecedentes",
                    "Cartas bancárias e prova de fundos",
                    "Cartas de emprego e contratos",
                    "Laudos médicos (não diagnósticos)",
                  ]
              ).map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#E6E6E6] bg-white p-4"
                >
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#C52D2F]" />
                  <p className="text-sm text-[#4D4D4D]">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#808080]">{t.translationFoot}</p>
          </div>
        </section>

        {/* Intake CTA */}
        <section
          id="intake"
          className="relative overflow-hidden rounded-3xl border border-[#E6E6E6] bg-white p-8 text-[#4D4D4D] shadow-[0_10px_60px_rgba(0,0,0,0.08)] md:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#C52D2F]/14 via-white to-[#C52D2F]/10" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
                {t.intakeEyebrow}
              </p>
              <h3 className="text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
                {t.intakeHeading}
              </h3>
              <p className="max-w-2xl text-sm text-[#4D4D4D]">{t.intakeBody}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="mailto:intake@immagrate.ca?subject=Intake%20Call%20Request"
                className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#a92325]"
              >
                {t.intakePrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="mailto:intake@immagrate.ca?subject=Prep%20List%20Request"
                className="inline-flex items-center gap-2 rounded-full border border-[#C52D2F] px-5 py-3 text-sm font-semibold text-[#C52D2F] transition hover:-translate-y-0.5 hover:bg-[#C52D2F]/5"
              >
                {t.intakeSecondary}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
