import { createFileRoute } from '@tanstack/react-router';
import { Workspace } from '@/components/dose-workspace';
export const Route = createFileRoute('/')({
  head: () => ({meta:[{title:'Visão geral | DoseCerta'},{name:'description',content:'Painel administrativo de aplicações, próximas datas e acompanhamentos da farmácia.'},{property:'og:title',content:'Visão geral | DoseCerta'},{property:'og:description',content:'Painel administrativo de aplicações, próximas datas e acompanhamentos da farmácia.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
  component: Page,
});
function Page() { return <Workspace view="dashboard"/>; }
