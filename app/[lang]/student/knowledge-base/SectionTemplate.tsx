"use client";

import Link from "next/link";
import React from "react";

export type SectionGuide = {
  title: string;
  summary: string;
  steps: string[];
  action?: { label: string; href: string; external?: boolean };
};

export type QuickLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type SectionContent = {
  title: string;
  intro: string;
  guides: SectionGuide[];
  quickLinks: QuickLink[];
  contactCta: { label: string; href: string };
};

export type SectionTemplateProps = {
  basePath: string;
  lang: string;
  content: SectionContent;
};

export default function SectionTemplate({ basePath, lang, content }: SectionTemplateProps) {
  const kbRoot = `${basePath}/knowledge-base`;

  return (
    <div className="pb-16 flex flex-col gap-12">
      <div className="bg-gradient-to-r from-cyan to-dark-cyan text-white px-10 md:px-24 py-16 flex flex-col gap-6">
        <div className="text-sm opacity-80">
          <Link href={`${basePath}`}>{lang === "ru" ? "Главная" : "Home"}</Link>
          <span className="mx-2">/</span>
          <Link href={kbRoot}>{lang === "ru" ? "База знаний" : "Knowledge base"}</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">{content.title}</span>
        </div>
        <h1 className="text-4xl font-extrabold">{content.title}</h1>
        <p className="text-lg max-w-4xl leading-relaxed opacity-90">{content.intro}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href={kbRoot}
            className="bg-white text-dark-gray px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            {lang === "ru" ? "Вернуться в базу" : "Back to knowledge base"}
          </Link>
          <Link
            href={`${basePath}/chat`}
            className="border border-white/40 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/10 transition-colors"
          >
            {lang === "ru" ? "Спросить у поддержки" : "Ask support"}
          </Link>
        </div>
      </div>

      <div className="px-6 md:px-24 flex flex-col gap-10">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {content.guides.map((guide) => (
            <article
              key={guide.title}
              className="bg-white dark:bg-dark-gray rounded-2xl shadow-sm border border-gray/10 dark:border-medium-blue-gray/30 p-6 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-dark-gray dark:text-white">{guide.title}</h2>
                  <p className="text-medium-blue-gray dark:text-gray text-sm leading-relaxed">{guide.summary}</p>
                </div>
              </div>
              <ul className="list-disc list-inside text-dark-gray dark:text-white/80 text-sm flex flex-col gap-2">
                {guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              {guide.action && (
                <div>
                  <Link
                    href={guide.action.href}
                    target={guide.action.external ? "_blank" : undefined}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-dark-yellow hover:underline"
                  >
                    <span className="material-symbols-outlined text-base">arrow_outward</span>
                    {guide.action.label}
                  </Link>
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="bg-light-gray/40 dark:bg-dark-gray border border-gray/10 dark:border-medium-blue-gray/30 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-xl font-semibold text-dark-gray dark:text-white">
              {lang === "ru" ? "Быстрые ссылки" : "Quick links"}
            </h3>
            <span className="text-sm text-medium-blue-gray dark:text-gray">
              {lang === "ru" ? "Моковые данные для навигации" : "Mock navigation data"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {content.quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="bg-white dark:bg-dark-gray text-dark-gray dark:text-white border border-gray/10 dark:border-medium-blue-gray/30 rounded-xl px-4 py-3 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <span>{link.label}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-dark-cyan text-white rounded-2xl p-8 flex flex-col gap-4">
          <h3 className="text-2xl font-bold">{lang === "ru" ? "Не нашли ответ?" : "Need more help?"}</h3>
          <p className="text-white/90 max-w-3xl">
            {lang === "ru"
              ? "Напишите в чат поддержки или создайте обращение — мы подставили ссылки на действующие страницы, чтобы вы могли быстро перейти."
              : "Send a message in chat or create a ticket — links below point to existing pages so you can navigate quickly."}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href={`${basePath}/chat`}
              className="bg-white text-dark-yellow px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              {lang === "ru" ? "Открыть чат" : "Open chat"}
            </Link>
            <Link
              href={content.contactCta.href}
              className="border border-white/60 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-base">support_agent</span>
              {content.contactCta.label}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
