"use client";

import Link from "next/link";
import { useState } from "react";
import { ImmagrateHeader } from "../../ImmagreatHeader";
import { Lang } from "../../LanguageToggle";

const navCopy: Record<
  Lang,
  { immigration: string; company: string; services: string }
> = {
  en: {
    immigration: "Immigration",
    company: "Company",
    services: "Other services",
  },
  pt: {
    immigration: "Imigração",
    company: "Empresa",
    services: "Outros serviços",
  },
};

export default function FareSearchPage() {
  const [lang, setLang] = useState<Lang>("en");
  const nav = navCopy[lang];

  return (
    <div className="min-h-screen overflow-auto bg-white text-[#4D4D4D]">
      <ImmagrateHeader lang={lang} onLangChange={setLang} nav={nav} />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        <div className="text-sm font-semibold text-[#C52D2F]">
          Other Services
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold text-[#1A1A1A]">Fare Search</h1>
          <p className="text-base text-[#4D4D4D]">
            Tell us the essentials and we’ll build a clean shortlist with
            timing, fare rules, and baggage tradeoffs.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6">
            <p className="text-sm font-semibold text-[#4D4D4D]">Trip details</p>
            <form className="mt-6 space-y-6">
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-[#1A1A1A]">
                  Trip type
                </legend>
                <div className="flex flex-wrap gap-4 text-sm text-[#4D4D4D]">
                  <label className="flex items-center gap-2">
                    <input
                      className="h-4 w-4 accent-[#C52D2F]"
                      type="radio"
                      name="tripType"
                      defaultChecked
                    />
                    Round trip
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      className="h-4 w-4 accent-[#C52D2F]"
                      type="radio"
                      name="tripType"
                    />
                    One way
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      className="h-4 w-4 accent-[#C52D2F]"
                      type="radio"
                      name="tripType"
                    />
                    Multi-city
                  </label>
                </div>
              </fieldset>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Origin city or airport
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    placeholder="e.g., São Paulo (GRU)"
                    type="text"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Destination city or airport
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    placeholder="e.g., Toronto (YYZ)"
                    type="text"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Departure date
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    type="date"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Return date
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    type="date"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Flexible?
                  <select className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]">
                    <option>Exact dates</option>
                    <option>± 1 day</option>
                    <option>± 3 days</option>
                    <option>± 7 days</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Adults
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    type="number"
                    min={1}
                    defaultValue={1}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Children (2-11)
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    type="number"
                    min={0}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Infants (&lt;2)
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    type="number"
                    min={0}
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Cabin class
                  <select className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]">
                    <option>Economy</option>
                    <option>Premium economy</option>
                    <option>Business</option>
                    <option>First</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Preferred departure time
                  <select className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]">
                    <option>No preference</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Overnight</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Maximum stops
                  <select className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]">
                    <option>No preference</option>
                    <option>Nonstop only</option>
                    <option>Up to 1 stop</option>
                    <option>Up to 2 stops</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Airlines to include/exclude
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    placeholder="e.g., Include Air Canada; avoid overnight layovers"
                    type="text"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Checked bags
                  <select className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3+</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Carry-ons
                  <select className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]">
                    <option>1 per traveler</option>
                    <option>1 total</option>
                    <option>No carry-ons</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Budget per ticket
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    placeholder="e.g., $650"
                    type="text"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                Notes or constraints
                <textarea
                  className="min-h-[110px] rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                  placeholder="Visa timing, preferred layover cities, accessibility needs, or must-arrive-by time."
                />
              </label>

              <div className="rounded-xl border border-dashed border-[#E6E6E6] bg-[#FAFAFA] p-4 text-sm text-[#4D4D4D]">
                We’ll confirm availability and share 2–4 options with fare
                rules, refundability, and baggage notes.
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6">
              <p className="text-sm font-semibold text-[#4D4D4D]">
                Contact details
              </p>
              <div className="mt-4 grid gap-4">
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Full name
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    type="text"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Email
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    placeholder="you@email.com"
                    type="email"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Phone / WhatsApp
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    type="tel"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[#1A1A1A]">
                  Preferred contact window
                  <input
                    className="rounded-lg border border-[#E6E6E6] px-3 py-2 text-sm text-[#1A1A1A]"
                    placeholder="e.g., 9–11am BRT"
                    type="text"
                  />
                </label>
              </div>
              <button
                className="mt-6 w-full rounded-lg bg-[#C52D2F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#B32729]"
                type="button"
              >
                Request fare shortlist
              </button>
              <p className="mt-3 text-xs text-[#7A7A7A]">
                By submitting, you agree to be contacted about fare options. We
                only use your info for this request.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6">
              <p className="text-sm font-semibold text-[#4D4D4D]">
                What you get
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5A5A5A]">
                <li>
                  Route and timing comparison based on your travel window.
                </li>
                <li>Fare rule summaries and baggage considerations.</li>
                <li>
                  Shortlist of best-value options within your constraints.
                </li>
                <li>
                  Notes on refundability, change fees, and deadline holds.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#E6E6E6] bg-[#FFF7F7] p-6">
              <p className="text-sm font-semibold text-[#C52D2F]">
                Not a ticketing service
              </p>
              <p className="mt-2 text-sm text-[#4D4D4D]">
                We help you compare and decide. Ticket purchase happens with the
                airline or your chosen agency.
              </p>
            </div>
          </div>
        </section>

        <Link
          className="text-sm font-semibold text-[#C52D2F] hover:underline"
          href="/immagreat"
        >
          Back to Immagreat
        </Link>
      </main>
    </div>
  );
}
