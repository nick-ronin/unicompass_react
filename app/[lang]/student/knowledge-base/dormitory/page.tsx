"use client";

import { useParams } from "next/navigation";
import SectionTemplate, { SectionContent } from "../SectionTemplate";

const buildContent = (basePath: string): Record<string, SectionContent> => ({
  ru: {
    title: "Общежитие",
    intro: "Подача на поселение, продление и правила проживания. Контент демонстрационный, ссылки ведут на существующие страницы.",
    guides: [
      {
        title: "Заселение",
        summary: "Как подать заявку на место и какие документы нужны.",
        steps: [
          "Создайте обращение на заселение и приложите паспорт, справку о зачислении и фото 3×4.",
          "Укажите даты прибытия и предпочтительный блок или этаж.",
          "Получите подтверждение и оплатите квитанцию в срок.",
        ],
        action: { label: "Открыть задачи", href: `${basePath}/tasks` },
      },
        {
        title: "Продление проживания",
        summary: "Шаги для продления договора на следующий семестр.",
        steps: [
          "Проверьте отсутствие задолженностей по оплате.",
          "Отправьте запрос на продление и укажите предполагаемый срок.",
          "Дождитесь обновления статуса и подпишите новый договор.",
        ],
        action: { label: "Документы для продления", href: `${basePath}/knowledge-base/documents` },
      },
      {
        title: "Правила и безопасность",
        summary: "Базовые ограничения и контакты дежурных.",
        steps: [
          "Ознакомьтесь с правилами пользования кухней и тишиной после 23:00.",
          "Запишите контакты вахты и номер дежурного по этажу.",
          "Сообщайте о неисправностях через задачу или чат с комендантом.",
        ],
        action: { label: "Написать в чат", href: `${basePath}/chat` },
      },
    ],
    quickLinks: [
      { label: "Задачи", href: `${basePath}/tasks` },
      { label: "Документы", href: `${basePath}/knowledge-base/documents` },
      { label: "Чат с комендантом", href: `${basePath}/chat` },
    ],
    contactCta: { label: "Задать вопрос коменданту", href: `${basePath}/chat` },
  },
  en: {
    title: "Dormitory",
    intro: "Apply for housing, extend your stay, and follow basic rules. Content is mock; links point to existing pages.",
    guides: [
      {
        title: "Move-in request",
        summary: "Submit an application and required documents.",
        steps: [
          "Create a housing task and attach passport, enrollment proof, and a 3×4 photo.",
          "Specify arrival dates and preferred block or floor.",
          "Wait for confirmation and pay the invoice on time.",
        ],
        action: { label: "Open tasks", href: `${basePath}/tasks` },
      },
      {
        title: "Extend your stay",
        summary: "Steps to renew the dorm contract for the next term.",
        steps: [
          "Make sure there are no outstanding payments.",
          "Send a renewal request with the desired end date.",
          "Wait for status update and sign the renewed contract.",
        ],
        action: { label: "Docs for renewal", href: `${basePath}/knowledge-base/documents` },
      },
      {
        title: "Rules and safety",
        summary: "Key restrictions and duty contacts.",
        steps: [
          "Review kitchen usage rules and quiet hours after 11 p.m.",
          "Save the duty desk phone and your floor manager number.",
          "Report issues via a task or chat with the dorm manager.",
        ],
        action: { label: "Message the manager", href: `${basePath}/chat` },
      },
    ],
    quickLinks: [
      { label: "Tasks", href: `${basePath}/tasks` },
      { label: "Documents", href: `${basePath}/knowledge-base/documents` },
      { label: "Dorm chat", href: `${basePath}/chat` },
    ],
    contactCta: { label: "Ask the dorm manager", href: `${basePath}/chat` },
  },
});

export default function DormitoryPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "ru";
  const basePath = `/${lang}/student`;
  const contentMap = buildContent(basePath);
  const content = contentMap[lang] || contentMap.ru;

  return <SectionTemplate lang={lang} basePath={basePath} content={content} />;
}
