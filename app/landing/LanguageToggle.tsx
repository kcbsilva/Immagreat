"use client";

export type Lang = "en" | "pt";

type Props = {
  lang: Lang;
  onChange: (lang: Lang) => void;
};

export function LanguageToggle({ lang, onChange }: Props) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-2 py-1 text-xs font-semibold text-[#4D4D4D] shadow-sm">
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`relative flex items-center gap-1 rounded-full px-3 py-1 transition ${
          lang === "en"
            ? "bg-[#C52D2F] text-white shadow-[0_6px_18px_rgba(197,45,47,0.25)]"
            : ""
        }`}
        aria-pressed={lang === "en"}
      >
        <span className="text-base leading-none">🇨🇦</span>
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("pt")}
        className={`relative flex items-center gap-1 rounded-full px-3 py-1 transition ${
          lang === "pt"
            ? "bg-[#C52D2F] text-white shadow-[0_6px_18px_rgba(197,45,47,0.25)]"
            : ""
        }`}
        aria-pressed={lang === "pt"}
      >
        <span className="text-base leading-none">🇧🇷</span>
        PT
      </button>
    </div>
  );
}
