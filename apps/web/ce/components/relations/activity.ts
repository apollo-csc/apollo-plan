/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TIssueActivity } from "@plane/types";

export const getRelationActivityContent = (activity: TIssueActivity | undefined): string | undefined => {
  if (!activity) return;

  switch (activity.field) {
    case "blocking":
      return activity.old_value === ""
        ? `marcou que este item está bloqueando o item `
        : `removeu o item bloqueado `;
    case "blocked_by":
      return activity.old_value === ""
        ? `marcou que este item está bloqueado por `
        : `removeu o bloqueio deste item pelo item `;
    case "duplicate":
      return activity.old_value === ""
        ? `marcou este item como duplicado de `
        : `removeu a marcação deste item como duplicado de `;
    case "relates_to":
      return activity.old_value === "" ? `marcou que este item está relacionado a ` : `removeu a relação com `;
  }

  return;
};
