import { distinctValues } from "./activities";

// Taxonomia completa de níveis/anos que o app pretende cobrir. Hoje só tem
// atividades curadas pra Educação Infantil e 1º-3º ano — o resto aparece na
// tela como "em breve" até a gente curar e popular o banco (ver
// atividades-seed.json). Assim que uma faixa_etaria daqui ganhar atividades
// no banco, ela liga sozinha, sem precisar mexer em código de novo.
export type Ano = { label: string; faixaEtaria: string };
export type Nivel = {
  slug: string;
  titulo: string;
  subtitulo: string;
  // Educação Infantil não tem "anos" — clica e já cai direto nas atividades.
  linkDireto?: string;
  anos?: Ano[];
  cor: NivelCor;
};

// Uma cor de identidade por nível, só usada quando o nível tem conteúdo --
// "Em breve" continua cinza de propósito, pra reforçar visualmente o que já
// dá pra usar. Cores dos hex em globals.css (--color-*).
export type NivelCor = "amarelo" | "azul" | "laranja" | "vermelho";

export const COR_CLASSES: Record<
  NivelCor,
  { bg: string; border: string; icon: string; hoverText: string }
> = {
  amarelo: {
    bg: "bg-brand-yellow/10",
    border: "border-brand-yellow/50",
    icon: "bg-brand-yellow",
    hoverText: "group-hover:text-[#8a6110]",
  },
  azul: {
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/50",
    icon: "bg-brand-blue",
    hoverText: "group-hover:text-brand-blue",
  },
  laranja: {
    bg: "bg-brand-orange/10",
    border: "border-brand-orange/50",
    icon: "bg-brand-orange",
    hoverText: "group-hover:text-brand-orange",
  },
  vermelho: {
    bg: "bg-brand-red/10",
    border: "border-brand-red/50",
    icon: "bg-brand-red",
    hoverText: "group-hover:text-brand-red",
  },
};

export const NIVEIS: Nivel[] = [
  {
    slug: "educacao-infantil",
    titulo: "Educação Infantil",
    subtitulo: "Atividades pra turma toda, sem separar por ano.",
    linkDireto: "Educação Infantil",
    cor: "amarelo",
  },
  {
    slug: "fundamental-iniciais",
    titulo: "Ensino Fundamental — Anos Iniciais",
    subtitulo: "1º ao 5º ano",
    cor: "azul",
    anos: [
      { label: "1º ano", faixaEtaria: "1º ano" },
      { label: "2º ano", faixaEtaria: "2º ano" },
      { label: "3º ano", faixaEtaria: "3º ano" },
      { label: "4º ano", faixaEtaria: "4º ano" },
      { label: "5º ano", faixaEtaria: "5º ano" },
    ],
  },
  {
    slug: "fundamental-finais",
    titulo: "Ensino Fundamental — Anos Finais",
    subtitulo: "6º ao 9º ano",
    cor: "laranja",
    anos: [
      { label: "6º ano", faixaEtaria: "6º ano" },
      { label: "7º ano", faixaEtaria: "7º ano" },
      { label: "8º ano", faixaEtaria: "8º ano" },
      { label: "9º ano", faixaEtaria: "9º ano" },
    ],
  },
  {
    slug: "ensino-medio",
    titulo: "Ensino Médio",
    subtitulo: "1ª à 3ª série",
    cor: "vermelho",
    anos: [
      { label: "1ª série", faixaEtaria: "1ª série EM" },
      { label: "2ª série", faixaEtaria: "2ª série EM" },
      { label: "3ª série", faixaEtaria: "3ª série EM" },
    ],
  },
];

export function getNivel(slug: string): Nivel | undefined {
  return NIVEIS.find((n) => n.slug === slug);
}

// Quais faixa_etaria já têm atividade de verdade no banco.
export function faixasDisponiveis(): Set<string> {
  return new Set(distinctValues("faixa_etaria"));
}

export function nivelTemConteudo(nivel: Nivel, disponiveis: Set<string>): boolean {
  if (nivel.linkDireto) return disponiveis.has(nivel.linkDireto);
  return (nivel.anos ?? []).some((a) => disponiveis.has(a.faixaEtaria));
}
