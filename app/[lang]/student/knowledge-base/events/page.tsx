"use client";

import { useParams } from "next/navigation";
import SectionTemplate, { SectionContent } from "../SectionTemplate";

const buildContent = (basePath: string): Record<string, SectionContent> => ({
  ru: {
    title: "Мероприятия",
    intro: "Расскажите студентам, как найти ближайшие события, подать заявку на участие и получить сертификат. Данные ниже — мок для демо.",
    guides: [
      {
        title: "Поиск событий",
        summary: "Где смотреть календарь мероприятий и фильтровать по интересам.",
        steps: [
          "Откройте календарь и выберите фильтр: онлайн, офлайн, карьерные, хакатоны.",
          "Добавьте событие в личный календарь, чтобы не пропустить напоминание.",
          "Проверьте ограничения по количеству мест и дедлайн регистрации.",
        ],
        action: { label: "Календарь", href: `${basePath}/calendar` },
      },
      {
        title: "Регистрация на участие",
        summary: "Как подать заявку и загрузить сопроводительные материалы.",
        steps: [
          "Выберите событие и нажмите \"Участвовать\".",
          "Заполните короткую форму: контакт, курс, факультет, мотивация.",
          "Отслеживайте статус заявки в задачах и в уведомлениях.",
        ],
        action: { label: "Открыть задачи", href: `${basePath}/tasks` },
      },
      {
        title: "Получение сертификата",
        summary: "Как скачать подтверждение участия после мероприятия.",
        steps: [
          "Дождитесь письма или пуша о публикации сертификата.",
          "Скачайте PDF из раздела \"Документы\" или запросите через чат.",
          "При необходимости отправьте копию в деканат через задачу.",
        ],
        action: { label: "Документы", href: `${basePath}/knowledge-base/documents` },
      },
    ],
    quickLinks: [
      { label: "Календарь", href: `${basePath}/calendar` },
      { label: "Задачи", href: `${basePath}/tasks` },
      { label: "Чат сообществ", href: `${basePath}/chat` },
    ],
    contactCta: { label: "Спросить об участии", href: `${basePath}/chat` },
  },
  en: {
    title: "Events",
    intro: "Show students how to find events, apply, and receive certificates. Everything below is mock demo data.",
    guides: [
      {
        title: "Find events",
        summary: "Where to browse the calendar and filter by interest.",
        steps: [
          "Open the calendar and filter by online, offline, career, or hackathons.",
          "Add an event to your personal calendar to get reminders.",
          "Check seat limits and the registration deadline.",
        ],
        action: { label: "Calendar", href: `${basePath}/calendar` },
      },
      {
        title: "Apply to join",
        summary: "Submit an application and upload supporting info.",
        steps: [
          "Select an event and click \"Attend\".",
          "Fill a short form: contact, year, school, motivation.",
          "Track the request status in tasks and notifications.",
        ],
        action: { label: "Open tasks", href: `${basePath}/tasks` },
      },
      {
        title: "Get your certificate",
        summary: "Download proof of participation after the event.",
        steps: [
          "Wait for the email or push that certificates are published.",
          "Download the PDF from \"Documents\" or ask via chat.",
          "If needed, forward a copy to the dean's office via a task.",
        ],
        action: { label: "Documents", href: `${basePath}/knowledge-base/documents` },
      },
    ],
    quickLinks: [
      { label: "Calendar", href: `${basePath}/calendar` },
      { label: "Tasks", href: `${basePath}/tasks` },
      { label: "Community chat", href: `${basePath}/chat` },
    ],
    contactCta: { label: "Ask about participation", href: `${basePath}/chat` },
  },
});

export default function EventsPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "ru";
  const basePath = `/${lang}/student`;
  const contentMap = buildContent(basePath);
  const content = contentMap[lang] || contentMap.ru;

  return <SectionTemplate lang={lang} basePath={basePath} content={content} />;
}
