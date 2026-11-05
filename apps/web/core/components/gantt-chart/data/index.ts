/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// types
import type { WeekMonthDataType, ChartDataType, TGanttViews } from "@plane/types";
import { EStartOfTheWeek } from "@plane/types";

// constants
export const generateWeeks = (startOfWeek: EStartOfTheWeek = EStartOfTheWeek.SUNDAY): WeekMonthDataType[] => [
  ...weeks.slice(startOfWeek),
  ...weeks.slice(0, startOfWeek),
];

export const weeks: WeekMonthDataType[] = [
  { key: 0, shortTitle: "sun", title: "domingo", abbreviation: "Dom" },
  { key: 1, shortTitle: "mon", title: "segunda-feira", abbreviation: "Seg" },
  { key: 2, shortTitle: "tue", title: "terça-feira", abbreviation: "Ter" },
  { key: 3, shortTitle: "wed", title: "quarta-feira", abbreviation: "Qua" },
  { key: 4, shortTitle: "thurs", title: "quinta-feira", abbreviation: "Qui" },
  { key: 5, shortTitle: "fri", title: "sexta-feira", abbreviation: "Sex" },
  { key: 6, shortTitle: "sat", title: "sábado", abbreviation: "Sáb" },
];

export const months: WeekMonthDataType[] = [
  { key: 0, shortTitle: "jan", title: "janeiro", abbreviation: "Jan" },
  { key: 1, shortTitle: "fev", title: "fevereiro", abbreviation: "Fev" },
  { key: 2, shortTitle: "mar", title: "março", abbreviation: "Mar" },
  { key: 3, shortTitle: "abr", title: "abril", abbreviation: "Abr" },
  { key: 4, shortTitle: "mai", title: "maio", abbreviation: "Mai" },
  { key: 5, shortTitle: "jun", title: "junho", abbreviation: "Jun" },
  { key: 6, shortTitle: "jul", title: "julho", abbreviation: "Jul" },
  { key: 7, shortTitle: "ago", title: "agosto", abbreviation: "Ago" },
  { key: 8, shortTitle: "set", title: "setembro", abbreviation: "Set" },
  { key: 9, shortTitle: "out", title: "outubro", abbreviation: "Out" },
  { key: 10, shortTitle: "nov", title: "novembro", abbreviation: "Nov" },
  { key: 11, shortTitle: "dez", title: "dezembro", abbreviation: "Dez" },
];

export const quarters: WeekMonthDataType[] = [
  { key: 0, shortTitle: "Q1", title: "Jan - Mar", abbreviation: "Q1" },
  { key: 1, shortTitle: "Q2", title: "Abr - Jun", abbreviation: "Q2" },
  { key: 2, shortTitle: "Q3", title: "Jul - Set", abbreviation: "Q3" },
  { key: 3, shortTitle: "Q4", title: "Out - Dez", abbreviation: "Q4" },
];

export const charCapitalize = (word: string) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`;

export const bindZero = (value: number) => (value > 9 ? `${value}` : `0${value}`);

export const timePreview = (date: Date) => {
  let hours = date.getHours();
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  let minutes: number | string = date.getMinutes();
  minutes = bindZero(minutes);

  return `${bindZero(hours)}:${minutes} ${amPm}`;
};

export const datePreview = (date: Date, includeTime: boolean = false) => {
  const day = date.getDate();
  let month: number | WeekMonthDataType = date.getMonth();
  month = months[month];
  const year = date.getFullYear();

  return `${charCapitalize(month?.shortTitle)} ${day}, ${year}${includeTime ? `, ${timePreview(date)}` : ``}`;
};

// context data
export const VIEWS_LIST: ChartDataType[] = [
  {
    key: "week",
    i18n_title: "common.week",
    data: {
      startDate: new Date(),
      currentDate: new Date(),
      endDate: new Date(),
      approxFilterRange: 4, // it will preview week dates with weekends highlighted with 1 week limitations ex: title (Wed 1, Thu 2, Fri 3)
      dayWidth: 60,
    },
  },
  {
    key: "month",
    i18n_title: "common.month",
    data: {
      startDate: new Date(),
      currentDate: new Date(),
      endDate: new Date(),
      approxFilterRange: 6, // it will preview monthly all dates with weekends highlighted with no limitations ex: title (1, 2, 3)
      dayWidth: 20,
    },
  },
  {
    key: "quarter",
    i18n_title: "common.quarter",
    data: {
      startDate: new Date(),
      currentDate: new Date(),
      endDate: new Date(),
      approxFilterRange: 24, // it will preview week starting dates all months data and there is 3 months limitation for preview ex: title (2, 9, 16, 23, 30)
      dayWidth: 5,
    },
  },
];

export const currentViewDataWithView = (view: TGanttViews = "month") =>
  VIEWS_LIST.find((_viewData) => _viewData.key === view);
