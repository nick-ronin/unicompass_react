"use client";

import { useParams } from "next/navigation";
import SectionTemplate, { SectionContent } from "../SectionTemplate";

const buildContent = (basePath: string): Record<string, SectionContent> => ({
  ru: {
    title: "Контакты",
    intro: "Сохраните основные каналы связи: поддержка, деканат, библиотека и комендант. Ниже — моковые карточки.",
    guides: [
      {
        title: "Единый центр поддержки",
        summary: "Куда писать по вопросам обучения, оплаты и доступа.",
        steps: [
          "Откройте чат поддержки и выберите тему обращения.",
          "Опишите проблему и приложите скриншоты, если нужно.",
          "Получите ответ в чате, дублирование придет в уведомления.",
        ],
        action: { label: "Написать в чат", href: `${basePath}/chat` },
      },
      {
        title: "Деканат",
        summary: "Контакты по академическим вопросам и справкам.",
        steps: [
          "Запланируйте визит или напишите в чат деканата.",
          "Для официальных писем создайте задачу и прикрепите файлы.",
          "Статусы обращений отслеживаются в задачах.",
        ],
        action: { label: "Связаться", href: `${basePath}/chat` },
      },
      {
        title: "Библиотека и читальные залы",
        summary: "Как продлить книгу и забронировать место.",
        steps: [
          "Проверьте срок возврата в уведомлениях или задачах.",
          "Напишите в чат, чтобы продлить книгу онлайн.",
          "Для брони места укажите дату, время и корпус.",
        ],
        action: { label: "Чат библиотеки", href: `${basePath}/chat` },
      },
    ],
    quickLinks: [
      { label: "Чат поддержки", href: `${basePath}/chat` },
      { label: "Задачи", href: `${basePath}/tasks` },
      { label: "Главная студент", href: `${basePath}` },
    ],
    contactCta: { label: "Написать в поддержку", href: `${basePath}/chat` },
  },
  en: {
    title: "Contacts",
    intro: "Keep the main contact channels handy: support, dean's office, library, and dorm manager. Cards below are mock data.",
    guides: [
      {
        title: "Unified support desk",
        summary: "Where to message about studies, payments, and access issues.",
        steps: [
          "Open the support chat and pick a topic.",
          "Describe the issue and attach screenshots if needed.",
          "Replies arrive in chat and are duplicated to notifications.",
        ],
        action: { label: "Message support", href: `${basePath}/chat` },
      },
      {
        title: "Dean's office",
        summary: "Contacts for academic questions and certificates.",
        steps: [
          "Schedule a visit or use the dean's chat channel.",
          "For formal letters create a task and attach files.",
          "Track request statuses in tasks.",
        ],
        action: { label: "Contact", href: `${basePath}/chat` },
      },
      {
        title: "Library and reading rooms",
        summary: "How to extend a book and reserve a seat.",
        steps: [
          "Check due dates in notifications or tasks.",
          "Message the library chat to extend a book online.",
          "For seat booking specify date, time, and building.",
        ],
        action: { label: "Library chat", href: `${basePath}/chat` },
      },
    ],
    quickLinks: [
      { label: "Support chat", href: `${basePath}/chat` },
      { label: "Tasks", href: `${basePath}/tasks` },
      { label: "Student home", href: `${basePath}` },
    ],
    contactCta: { label: "Write to support", href: `${basePath}/chat` },
  },
});

export default function ContactsPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "ru";
  const basePath = `/${lang}/student`;
  const contentMap = buildContent(basePath);
  const content = contentMap[lang] || contentMap.ru;

  return <SectionTemplate lang={lang} basePath={basePath} content={content} />;
}
