"use client";

import { useParams } from "next/navigation";
import SectionTemplate, { SectionContent } from "../SectionTemplate";

const buildContent = (basePath: string): Record<string, SectionContent> => ({
  ru: {
    title: "Документы",
    intro: "Где запросить справки, получить студбилет и загрузить квитанции. Все тексты — моковые для прототипа.",
    guides: [
      {
        title: "Заказать справку",
        summary: "Как подать запрос на академическую справку или форму 095-У.",
        steps: [
          "Откройте раздел документов и выберите тип справки.",
          "Укажите язык, цель и способ выдачи (PDF или бумажная копия).",
          "Статус заявки появится в задачах, готовый файл — в этом же разделе.",
        ],
        action: { label: "Список заявок", href: `${basePath}/tasks` },
      },
      {
        title: "Восстановить студбилет",
        summary: "Порядок действий при утере или порче студенческого билета.",
        steps: [
          "Создайте обращение на перевыпуск и приложите заявление об утере.",
          "Оплатите пошлину и загрузите чек, чтобы ускорить обработку.",
          "Заберите готовый билет в деканате, статус придет в уведомления.",
        ],
        action: { label: "Чат с деканатом", href: `${basePath}/chat` },
      },
      {
        title: "Квитанции и оплаты",
        summary: "Где хранить чеки и подтверждения об оплате обучения или проживания.",
        steps: [
          "Загрузите чек в карточку задачи, чтобы он прикрепился к заявке.",
          "Отслеживайте подтверждение оплаты в уведомлениях.",
          "При необходимости скачайте единый PDF с подписью бухгалтера.",
        ],
        action: { label: "Открыть задачи", href: `${basePath}/tasks` },
      },
    ],
    quickLinks: [
      { label: "Создать заявку", href: `${basePath}/tasks` },
      { label: "Связаться с деканатом", href: `${basePath}/chat` },
      { label: "Главная студент", href: `${basePath}` },
    ],
    contactCta: { label: "Спросить о статусе справки", href: `${basePath}/chat` },
  },
  en: {
    title: "Documents",
    intro: "Request certificates, replace your student ID, and upload receipts. Text is mock for the prototype.",
    guides: [
      {
        title: "Request a certificate",
        summary: "How to ask for an academic certificate or medical form.",
        steps: [
          "Open the documents area and choose the certificate type.",
          "Set language, purpose, and delivery method (PDF or paper).",
          "Track the request in tasks; the file appears in the same section when ready.",
        ],
        action: { label: "View requests", href: `${basePath}/tasks` },
      },
      {
        title: "Replace student ID",
        summary: "Steps to restore a lost or damaged student card.",
        steps: [
          "Create a reissue ticket and attach the loss statement.",
          "Pay the fee and upload the receipt to speed up processing.",
          "Pick up the card at the dean's office; status will arrive via notifications.",
        ],
        action: { label: "Dean's chat", href: `${basePath}/chat` },
      },
      {
        title: "Receipts and payments",
        summary: "Where to keep proofs of tuition or dorm payments.",
        steps: [
          "Upload the receipt to the related task so it sticks to the request.",
          "Watch for payment confirmation in notifications.",
          "Download a consolidated PDF with accountant signature if needed.",
        ],
        action: { label: "Open tasks", href: `${basePath}/tasks` },
      },
    ],
    quickLinks: [
      { label: "Create a request", href: `${basePath}/tasks` },
      { label: "Contact dean's office", href: `${basePath}/chat` },
      { label: "Student home", href: `${basePath}` },
    ],
    contactCta: { label: "Ask about certificate status", href: `${basePath}/chat` },
  },
});

export default function DocumentsPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "ru";
  const basePath = `/${lang}/student`;
  const contentMap = buildContent(basePath);
  const content = contentMap[lang] || contentMap.ru;

  return <SectionTemplate lang={lang} basePath={basePath} content={content} />;
}
