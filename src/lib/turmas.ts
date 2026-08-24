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
};

export const NIVEIS: Nivel[] = [
  {
    slug: "educacao-infantil",
    titulo: "Educação Infantil",
    subtitulo: "Atividades pra turma toda, sem separar por ano.",
    linkDireto: "Educação Infantil",
  },
  {
    slug: "fundamental-iniciais",
    titulo: "Ensino Fundamental — Anos Iniciais",
    subtitulo: "1º ao 5º ano",
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
