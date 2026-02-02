"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Baby,
  Briefcase,
  FileText,
  GraduationCap,
  Plane,
  Users,
  User,
} from "lucide-react";
import { FaChild } from "react-icons/fa";
import logo from "./assets/logo.png";
import { Lang, LanguageToggle } from "./LanguageToggle";

type Props = {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  nav: {
    immigration: string;
    company: string;
    services: string;
  };
};

export function ImmagrateHeader({ lang, onLangChange, nav }: Props) {
  const menuCopy = {
    en: {
      eyebrow: "Our Services",
      english: "English",
      french: "French",
      soon: "Soon",
      documents: "Documents",
      sworn: "Sworn Documents",
      authenticated: "Authenticated Documents",
      otherServices: "Other Services",
      fareSearch: "Fare Search",
      liaison: "Liaison",
      employer: "Employer",
      school: "School",
      early: "Early 3 - 5",
      kids: "Kids 6 - 11",
      teens: "Teens 12 - 17",
      adults: "Adults 18+",
    },
    pt: {
      eyebrow: "Nossos Serviços",
      english: "Inglês",
      french: "Francês",
      soon: "Em breve",
      documents: "Documentos",
      sworn: "Tradução Juramentada",
      authenticated: "Autenticação",
      otherServices: "Outros Serviços",
      fareSearch: "Busca de Tarifas",
      liaison: "Intermediação",
      employer: "Trabalho",
      school: "Escolar",
      early: "Infantil 3 - 5",
      kids: "Crianças 6 - 11",
      teens: "Adolescentes 12 - 17",
      adults: "Adultos 18+",
    },
  } as const;

  const menuText = menuCopy[lang];

  return (
    <header className="sticky top-0 z-30 border-b border-[#E6E6E6] bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 md:px-10 relative z-20">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#E6E6E6] bg-white/80 p-1">
            <Image
              src={logo}
              alt="Immagrate logo"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#C52D2F] leading-tight">
              Immagrate
            </p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#808080]">
              Canada Readiness
            </p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
          <nav className="hidden items-center gap-4 text-sm font-semibold text-[#4D4D4D] md:flex">
            <div className="group relative">
              <a
                className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                href="#immigration"
              >
                {nav.immigration}
                <span className="text-[10px] text-[#9A9A9A] group-hover:text-[#C52D2F] transition">
                  ▼
                </span>
              </a>
              <div className="absolute left-1/2 top-full z-0 w-[68rem] -translate-x-1/2 opacity-0 pointer-events-none translate-y-6 transition duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-6 before:absolute before:-top-6 before:left-0 before:h-6 before:w-full before:content-['']">
                <div className="rounded-xl border border-[#E6E6E6] bg-gradient-to-br from-[#FFE2DC] via-[#FFF7F5] to-[#DCEBFF] shadow-lg p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#808080]">
                    {menuText.eyebrow}
                  </p>
                  <div className="mt-3 grid grid-cols-5 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-[#4D4D4D]">
                        {menuText.english}
                      </p>
                      <div className="mt-2 flex flex-col gap-2 text-sm font-medium text-[#5A5A5A]">
                        <Link
                          className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                          href="/immagrate/english-classes/early-3-5"
                        >
                          <Baby className="h-4 w-4 text-[#9A9A9A]" />
                          {menuText.early}
                        </Link>
                        <Link
                          className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                          href="/immagrate/english-classes/kids-6-11"
                        >
                          <FaChild className="h-4 w-4 text-[#9A9A9A]" />
                          {menuText.kids}
                        </Link>
                        <Link
                          className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                          href="/immagrate/english-classes/teens-12-17"
                        >
                          <Users className="h-4 w-4 text-[#9A9A9A]" />
                          {menuText.teens}
                        </Link>
                        <Link
                          className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                          href="/immagrate/english-classes/adults-18-plus"
                        >
                          <User className="h-4 w-4 text-[#9A9A9A]" />
                          {menuText.adults}
                        </Link>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#4D4D4D]">
                        {menuText.french}{" "}
                        <span className="ml-2 rounded-full bg-[#C52D2F] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white">
                          {menuText.soon}
                        </span>
                      </p>
                      <div className="mt-2 flex flex-col gap-2 text-sm font-medium text-[#A0A0A0]">
                        <span
                          className="flex items-center gap-2 cursor-not-allowed"
                          aria-disabled="true"
                        >
                          <Baby className="h-4 w-4 text-[#B0B0B0]" />
                          {menuText.early}
                        </span>
                        <span
                          className="flex items-center gap-2 cursor-not-allowed"
                          aria-disabled="true"
                        >
                          <FaChild className="h-4 w-4 text-[#B0B0B0]" />
                          {menuText.kids}
                        </span>
                        <span
                          className="flex items-center gap-2 cursor-not-allowed"
                          aria-disabled="true"
                        >
                          <Users className="h-4 w-4 text-[#B0B0B0]" />
                          {menuText.teens}
                        </span>
                        <span
                          className="flex items-center gap-2 cursor-not-allowed"
                          aria-disabled="true"
                        >
                          <User className="h-4 w-4 text-[#B0B0B0]" />
                          {menuText.adults}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#4D4D4D]">
                        {menuText.documents}
                      </p>
                      <div className="mt-2 flex flex-col gap-2 text-sm font-medium text-[#5A5A5A]">
                        <Link
                          className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                          href="/immagrate/documents/sworn-documents"
                        >
                          <FileText className="h-4 w-4 text-[#9A9A9A]" />
                          {menuText.sworn}
                        </Link>
                        <Link
                          className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                          href="/immagrate/documents/authenticated-documents"
                        >
                          <FileText className="h-4 w-4 text-[#9A9A9A]" />
                          {menuText.authenticated}
                        </Link>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#4D4D4D]">
                        {menuText.liaison}
                      </p>
                      <div className="mt-2 flex flex-col gap-2 text-sm font-medium text-[#5A5A5A]">
                        <Link
                          className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                          href="/immagrate/liaison/employer"
                        >
                          <Briefcase className="h-4 w-4 text-[#9A9A9A]" />
                          {menuText.employer}
                        </Link>
                        <Link
                          className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                          href="/immagrate/liaison/school"
                        >
                          <GraduationCap className="h-4 w-4 text-[#9A9A9A]" />
                          {menuText.school}
                        </Link>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#4D4D4D]">
                        {menuText.otherServices}
                      </p>
                      <div className="mt-2 flex flex-col gap-2 text-sm font-medium text-[#5A5A5A]">
                        <Link
                          className="flex items-center gap-2 hover:text-[#C52D2F] transition"
                          href="/immagreat/other-services/fare-search"
                        >
                          <Plane className="h-4 w-4 text-[#9A9A9A]" />
                          {menuText.fareSearch}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a className="hover:text-[#C52D2F] transition" href="#company">
              {nav.company}
            </a>
            <a className="hover:text-[#C52D2F] transition" href="#services">
              {nav.services}
            </a>
          </nav>
          <LanguageToggle lang={lang} onChange={onLangChange} />
        </div>
      </div>
    </header>
  );
}
