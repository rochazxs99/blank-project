import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/dose-workspace";
export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda de aplicações | DoseCerta" },
      {
        name: "description",
        content: "Agenda administrativa de datas previstas, próximas e atrasadas.",
      },
      { property: "og:title", content: "Agenda de aplicações | DoseCerta" },
      {
        property: "og:description",
        content: "Agenda administrativa de datas previstas, próximas e atrasadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Workspace view="agenda" />;
}
