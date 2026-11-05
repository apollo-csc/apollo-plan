/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// Apollo: a instância é SÓ pt-BR. O "en" segue apenas como fallback interno de
// chave faltante (uma chave nova vinda do upstream mostraria o id cru na tela
// sem ele) — não aparece em nenhum seletor.
export type TLanguage = "en" | "pt-BR";

export interface ILanguageOption {
  label: string;
  value: TLanguage;
}
