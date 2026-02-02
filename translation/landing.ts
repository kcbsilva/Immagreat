import {
  Briefcase,
  Clock3,
  Compass,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { Lang } from "../app/landing/LanguageToggle";

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
    regulatedTitle: "Regulated process guardrails",
    regulatedBody: "Built with RCIC-aligned compliance and evidence standards.",
    chooseLane: "Choose the lane",
    tracksHeading: "Readiness tracks we guide",
    prepOnly: "Preparation only — you file when ready",
    pathwaysLabel: "Pathways",
    coverageLabel: "Coverage",
    stepLabel: "Step",
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
    transparencyNote: "Transparency on every decision",
    translationEyebrow: "Sworn translation",
    translationHeading: "Certified translations (EN ↔ PT)",
    translationBody:
      "Sworn/Certified translators for academic records, birth & marriage certificates, police clearances, and financial documents.",
    translationAccepted:
      "Accepted for Canadian immigration, study, and work processes.",
    translationItems: [
      "Academic transcripts & diplomas",
      "Civil docs: birth, marriage, divorce",
      "Police certificates",
      "Bank letters & proof of funds",
      "Employment letters & contracts",
      "Medical letters (non-diagnostic)",
    ],
    translationFoot:
      "Available in English and Portuguese with notarization guidance when required.",
    intakeEyebrow: "Intake",
    intakeHeading: "Build your Canada plan in 45 minutes",
    intakeBody:
      "We map your options, share a risk note, and give you a documented sequence of actions to start immediately—no obligation to continue.",
    intakePrimary: "Book the call",
    intakeSecondary: "Download prep list",
    toolsIncluded: "Tools and templates included",
    navServices: "Our Services",
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
    regulatedTitle: "Trilhos regulatórios alinhados",
    regulatedBody: "Construído com padrões de compliance alinhados a RCIC.",
    chooseLane: "Escolha a trilha",
    tracksHeading: "Trilhas de preparo que guiamos",
    prepOnly: "Só preparação — você protocola quando pronto",
    pathwaysLabel: "Caminhos",
    coverageLabel: "Cobertura",
    stepLabel: "Passo",
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
    transparencyNote: "Transparência em cada decisão",
    translationEyebrow: "Tradução juramentada",
    translationHeading: "Traduções certificadas (EN ↔ PT)",
    translationBody:
      "Tradutores juramentados para históricos escolares, certidões, antecedentes criminais e documentos financeiros.",
    translationAccepted:
      "Aceitas em processos de imigração, estudo e trabalho no Canadá.",
    translationItems: [
      "Históricos e diplomas acadêmicos",
      "Certidões: nascimento, casamento, divórcio",
      "Atestados de antecedentes",
      "Cartas bancárias e prova de fundos",
      "Cartas de emprego e contratos",
      "Laudos médicos (não diagnósticos)",
    ],
    translationFoot:
      "Disponível em inglês e português com orientação de notarização quando preciso.",
    intakeEyebrow: "Intake",
    intakeHeading: "Monte seu plano Canadá em 45 minutos",
    intakeBody:
      "Mapeamos opções, entregamos nota de risco e uma sequência de ações imediatas — sem obrigação de seguir.",
    intakePrimary: "Agendar chamada",
    intakeSecondary: "Baixar lista de preparo",
    toolsIncluded: "Ferramentas e modelos inclusos",
    navServices: "Nossos Serviços",
    companyEyebrow: "Empresas",
    companyHeading: "Abrir ou trazer sua empresa",
    companyBody:
      "Roteiros de preparo para empreendedorismo e Startup Visa: elegibilidade, documentação e próximos passos claros (sem protocolo ainda).",
  },
} as const;

export const landingContent = {
  pathways,
  steps,
  highlights,
  englishPrograms,
  jobReadiness,
  coverageTags,
  chips,
  companyServices,
  copy,
};
