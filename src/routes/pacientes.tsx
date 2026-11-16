import { createFileRoute } from '@tanstack/react-router';
import { Workspace } from '@/components/dose-workspace';
export const Route = createFileRoute('/pacientes')({
  head: () => ({meta:[{title:'Pacientes | DoseCerta'},{name:'description',content:'Cadastros fictícios de pacientes e acompanhamentos administrativos.'},{property:'og:title',content:'Pacientes | DoseCerta'},{property:'og:description',content:'Cadastros fictícios de pacientes e acompanhamentos administrativos.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
  component: Page,
});
function Page() { return <Workspace view="patients"/>; }
