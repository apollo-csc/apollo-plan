/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TLanguage, ILanguageOption } from "../types";

export const FALLBACK_LANGUAGE: TLanguage = "en";

/* Apollo: idioma padrão da instância (novos usuários e telas não logadas).
   O FALLBACK_LANGUAGE segue "en" — é o fallback de CHAVE faltante na tradução. */
export const DEFAULT_LANGUAGE: TLanguage = "pt-BR";

// Apollo: só pt-BR é selecionável (os outros 17 idiomas do upstream foram removidos)
export const SUPPORTED_LANGUAGES: ILanguageOption[] = [{ label: "Português Brasil", value: "pt-BR" }];

/**
 * Enum for translation file names
 * These are the JSON files that contain translations each category
 */
export enum ETranslationFiles {
  TRANSLATIONS = "translations",
  ACCESSIBILITY = "accessibility",
  EDITOR = "editor",
  EMPTY_STATE = "empty-state",
}

export const LANGUAGE_STORAGE_KEY = "userLanguage";
