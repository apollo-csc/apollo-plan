/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { replaceUnderscoreIfSnakeCase } from "@plane/utils";
import type { TNotificationContentMap } from "@/components/workspace-notifications/sidebar/notification-card/content";

// Additional notification content map for CE (empty - EE extends this)
export const ADDITIONAL_NOTIFICATION_CONTENT_MAP: TNotificationContentMap = {};

// Fallback action renderer for fields not in the map
// Apollo: verbo e campo em pt-BR (a API manda "updated"/"state" etc.)
const VERBO: Record<string, string> = { created: "criou", updated: "atualizou", deleted: "excluiu", removed: "removeu" };
const CAMPO: Record<string, string> = {
  state: "o estado",
  priority: "a prioridade",
  name: "o título",
  description: "a descrição",
  estimate_point: "a estimativa",
  cycles: "o ciclo",
  modules: "o módulo",
  link: "o link",
  attachment: "o anexo",
  relates_to: "a relação",
  blocking: "o bloqueio",
  blocked_by: "o bloqueio",
  duplicate: "a duplicata",
  issue_type: "o tipo",
};
export const renderAdditionalAction = (notificationField: string, verb: string | undefined) => {
  const baseAction = !["comment", "archived_at"].includes(notificationField) ? (VERBO[verb ?? ""] ?? verb ?? "") : "";
  return `${baseAction} ${CAMPO[notificationField] ?? replaceUnderscoreIfSnakeCase(notificationField)}`;
};

// Fallback value renderer for fields not in the map
export const renderAdditionalValue = (
  _notificationField: string | undefined,
  newValue: string | undefined,
  _oldValue: string | undefined
) => newValue;

export const shouldShowConnector = (notificationField: string | undefined) =>
  !["comment", "archived_at", "None", "assignees", "labels", "start_date", "target_date", "parent"].includes(
    notificationField || ""
  );

export const shouldRender = (notificationField: string | undefined, verb: string | undefined) => verb !== "deleted";
