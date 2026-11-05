/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// Export all locale files to make them accessible from the package root
export { default as enCore } from "./en/core";
export { default as enTranslations } from "./en/translations";
export { default as enAccessibility } from "./en/accessibility";
export { default as enEditor } from "./en/editor";
export { default as enEmptyState } from "./en/empty-state";

// Export locale data for all supported languages
// Eager: o pt-BR vai no pacote principal para a PRIMEIRA tela já sair em
// português (antes o en era o único carregado de saída e o pt-BR chegava depois)
export { default as ptBRTranslations } from "./pt-BR/translations";
export { default as ptBRAccessibility } from "./pt-BR/accessibility";
export { default as ptBREditor } from "./pt-BR/editor";
export { default as ptBREmptyState } from "./pt-BR/empty-state";

// Apollo: só en (fallback interno) e pt-BR
export const locales = {
  en: {
    core: () => import("./en/core"),
    translations: () => import("./en/translations"),
    accessibility: () => import("./en/accessibility"),
    editor: () => import("./en/editor"),
    "empty-state": () => import("./en/empty-state"),
  },
  "pt-BR": {
    translations: () => import("./pt-BR/translations"),
    accessibility: () => import("./pt-BR/accessibility"),
    editor: () => import("./pt-BR/editor"),
    "empty-state": () => import("./pt-BR/empty-state"),
  },
};
