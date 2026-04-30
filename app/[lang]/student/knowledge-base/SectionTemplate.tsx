"use client";

import Link from "next/link";
import React from "react";
import MaterialIcon from '@/components/MaterialIcon';

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
      <div className="bg-linear-to-r from-cyan to-dark-cyan text-white px-4 py-10 flex flex-col gap-5 sm:px-6 sm:py-16 md:px-24">
        <div className="text-sm opacity-80">
          <Link href={`${basePath}`}>{lang === "ru" ? "Главная" : "Home"}</Link>
          <span className="mx-2">/</span>
          <Link href={kbRoot}>{lang === "ru" ? "База знаний" : "Knowledge base"}</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold">{content.title}</span>
        </div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{content.title}</h1>
        <p className="max-w-4xl text-base leading-relaxed opacity-90 sm:text-lg">{content.intro}</p>
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

      <div className="flex flex-col gap-10 px-4 sm:px-6 md:px-24">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {content.guides.map((guide) => (
            <article
              key={guide.title}
              className="flex flex-col gap-4 rounded-2xl border border-gray/10 bg-white p-4 shadow-sm dark:border-medium-blue-gray/30 dark:bg-dark-gray sm:p-6"
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
                    <MaterialIcon name="arrow_outward" className="text-base" />
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="bg-white dark:bg-dark-gray text-dark-gray dark:text-white border border-gray/10 dark:border-medium-blue-gray/30 rounded-xl px-4 py-3 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <span>{link.label}</span>
                <MaterialIcon name="arrow_forward" className="text-sm" />
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl bg-dark-cyan p-6 text-white sm:p-8">
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
              <MaterialIcon name="chat" className="text-base" />
              {lang === "ru" ? "Открыть чат" : "Open chat"}
            </Link>
            <Link
              href={content.contactCta.href}
              className="border border-white/60 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <MaterialIcon name="support_agent" className="text-base" />
              {content.contactCta.label}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
