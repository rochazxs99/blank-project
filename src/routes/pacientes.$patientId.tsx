import { createFileRoute } from '@tanstack/react-router';
import { Workspace } from '@/components/dose-workspace';
export const Route = createFileRoute('/pacientes/$patientId')({
  head: () => ({meta:[{title:'Detalhe do paciente | DoseCerta'},{name:'description',content:'Dados administrativos e histórico de aplicações do paciente fictício.'},{property:'og:title',content:'Detalhe do paciente | DoseCerta'},{property:'og:description',content:'Dados administrativos e histórico de aplicações do paciente fictício.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
  component: Page,
});
function Page() { return <Workspace view="detail" patientId={Route.useParams().patientId}/>; }
