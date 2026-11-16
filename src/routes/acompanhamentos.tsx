import { createFileRoute } from '@tanstack/react-router';
import { Workspace } from '@/components/dose-workspace';
export const Route = createFileRoute('/acompanhamentos')({
  head: () => ({meta:[{title:'Acompanhamentos | DoseCerta'},{name:'description',content:'Acompanhamentos ativos, encerrados e histórico de aplicações.'},{property:'og:title',content:'Acompanhamentos | DoseCerta'},{property:'og:description',content:'Acompanhamentos ativos, encerrados e histórico de aplicações.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
  component: Page,
});
function Page() { return <Workspace view="treatments"/>; }
