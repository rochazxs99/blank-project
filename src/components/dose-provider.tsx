import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { makeDemo, storageKey, storeSchema, type Store } from '@/lib/dosecerta';

type DoseContext = { store: Store; ready: boolean; change: (update: (previous: Store) => Store) => boolean };
const Context = createContext<DoseContext | null>(null);
export function DoseProvider({children}: {children: ReactNode}) {
  const [store,setStore] = useState<Store>({patients:[],treatments:[],history:[]});
  const [ready,setReady] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem(storageKey); const initial = saved ? storeSchema.parse(JSON.parse(saved)) : makeDemo(); setStore(initial); if (!saved) localStorage.setItem(storageKey, JSON.stringify(initial)); }
    catch { toast.error('Não foi possível carregar os dados locais. Nenhum dado foi sobrescrito.'); }
    setReady(true);
  },[]);
  function change(update: (previous: Store) => Store) {
    try { const next = storeSchema.parse(update(store)); localStorage.setItem(storageKey,JSON.stringify(next)); setStore(next); return true; }
    catch(error) { toast.error(error instanceof Error ? error.message : 'Não foi possível salvar neste navegador.'); return false; }
  }
  return <Context.Provider value={{store,ready,change}}>{children}</Context.Provider>;
}
export function useDose() { const context = useContext(Context); if (!context) throw new Error('DoseProvider missing'); return context; }