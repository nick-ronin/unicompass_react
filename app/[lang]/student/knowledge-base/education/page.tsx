"use client";

import { useParams } from "next/navigation";
import SectionTemplate, { SectionContent } from "../SectionTemplate";

const buildContent = (basePath: string): Record<string, SectionContent> => ({
  ru: {
    title: "Учеба",
    intro: "Подбор курсов, смена группы и базовые шаги по подготовке к экзаменам. Все инструкции — моковые и подходят для демо.",
    guides: [
      {
        title: "Запись на курс",
        summary: "Как выбрать предмет и отправить заявку на зачисление.",
        steps: [
          "Откройте каталог дисциплин и отфильтруйте по направлению.",
          "Проверьте соответствие пререквизитов и доступные слоты.",
          "Нажмите \"Записаться\" и дождитесь подтверждения от деканата.",
        ],
        action: { label: "Каталог еКурсов", href: "https://e.sfu-kras.ru", external: true },
      },
      {
        title: "Смена учебной группы",
        summary: "Алгоритм для перевода в другую группу в рамках потока.",
        steps: [
          "Соберите согласование куратора и старосты новой группы.",
          "Создайте обращение с причиной смены и приложите согласование.",
          "Ожидайте уведомление в задачах — статус обновится автоматически.",
        ],
        action: { label: "Открыть задачи", href: `${basePath}/tasks` },
      },
      {
        title: "Подготовка к сессии",
        summary: "Что проверить перед экзаменами и где найти расписание.",
        steps: [
          "Сверьте даты экзаменов и дедлайны курсовых в календаре.",
          "Уточните формат экзамена у преподавателя или через чат группы.",
          "Подготовьте документы: студбилет, ведомость и чек об оплате (если требуется).",
        ],
        action: { label: "Расписание экзаменов", href: `${basePath}/calendar` },
      },
    ],
    quickLinks: [
      { label: "Расписание", href: `${basePath}/calendar` },
      { label: "Задачи", href: `${basePath}/tasks` },
      { label: "Документы", href: `${basePath}/knowledge-base/documents` },
    ],
    contactCta: { label: "Создать учебное обращение", href: `${basePath}/tasks` },
  },
  en: {
    title: "Study",
    intro: "Course enrollment, group changes, and exam prep steps. Content is mock data for demo purposes.",
    guides: [
      {
        title: "Enroll in a course",
        summary: "Choose a subject and submit an enrollment request.",
        steps: [
          "Open the course catalog and filter by your program.",
          "Check prerequisites and available slots.",
          "Click \"Enroll\" and wait for the dean's confirmation.",
        ],
        action: { label: "eCourses catalog", href: "https://e.sfu-kras.ru", external: true },
      },
      {
        title: "Change your study group",
        summary: "Steps to move to another group within your cohort.",
        steps: [
          "Collect approval from your curator and the new group lead.",
          "Create a request with the reason and attach approvals.",
          "Watch your tasks — status updates are reflected automatically.",
        ],
        action: { label: "Open tasks", href: `${basePath}/tasks` },
      },
      {
        title: "Exam preparation",
        summary: "Checklist before exam week and where to find schedules.",
        steps: [
          "Verify exam dates and coursework deadlines in the calendar.",
          "Confirm exam format with the instructor or via group chat.",
          "Prepare documents: student ID, grade sheet, and payment receipt if needed.",
        ],
        action: { label: "Exam schedule", href: `${basePath}/calendar` },
      },
    ],
    quickLinks: [
      { label: "Calendar", href: `${basePath}/calendar` },
      { label: "Tasks", href: `${basePath}/tasks` },
      { label: "Documents", href: `${basePath}/knowledge-base/documents` },
    ],
    contactCta: { label: "Create an academic ticket", href: `${basePath}/tasks` },
  },
});

export default function EducationPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "ru";
  const basePath = `/${lang}/student`;
  const contentMap = buildContent(basePath);
  const content = contentMap[lang] || contentMap.ru;

  return <SectionTemplate lang={lang} basePath={basePath} content={content} />;
}
