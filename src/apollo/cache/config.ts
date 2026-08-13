import { makeVar } from "@apollo/client";
import Cookies from "js-cookie";
import moment from "moment";
import config from "../../config";
export enum Theme {
  Dark = "dark",
  Light = "light",
}

export const DefaultDateFormat = "DD/MM/YYYY";
export const DateFormats = [
  "DD/MM/YYYY",
  "YYYY/MM/DD",
  "DD/MM/YY",
  "YY/MM/DD",
  "DD-MM-YYYY",
  "YYYY-MM-DD",
  "DD MMM, YYYY",
  "Do MMM, YYYY",
].map((value) => ({
  label: `${value} (${moment().format(value)})`,
  value,
}));

export const DefaultNumberFormat = "0,0.0000";
export const NumberFormats = [
  { label: "No Decimal Places", value: "0,0" },
  { label: "1 Decimal Place", value: "0,0.0" },
  { label: "2 Decimal Places", value: "0,0.00" },
  { label: "3 Decimal Places", value: "0,0.000" },
  { label: "4 Decimal Places", value: "0,0.0000" },
];

export const DefaultPollingInterval = 60 * 1000;
export const PollingIntervals = [
  { label: "Turn Off", value: 0 },
  { label: "Every 5 Seconds", value: 5 * 1000 },
  { label: "Every 30 Seconds", value: 30 * 1000 },
  { label: "Every 1 Minute", value: 60 * 1000 },
  { label: "Every 5 Minutes", value: 5 * 60 * 1000 },
];

export const DefaultLanguage = "en";
export const Languages = [{ label: "English", value: "en" }];

export interface ICurrentConfig {
  dateFormat?: (typeof DateFormats)[number]["value"];
  language?: (typeof Languages)[number]["value"];
  pollInterval?: (typeof PollingIntervals)[number]["value"];
  moneyFormat?: (typeof NumberFormats)[number]["value"];
  theme?: Theme;
}

export const currentConfigVar = makeVar<ICurrentConfig>(
  JSON.parse(
    Cookies.get(`subs:config`) ??
      '{"dateFormat":"DD/MM/YYYY","language":"en","pollInterval":5000,"moneyFormat":"0,0.0000","theme":"light"}'
  ) ?? {
    dateFormat: "DD/MM/YYYY",
    language: "en",
    pollInterval: 5000,
    moneyFormat: "0,0.0000",
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Theme.Dark
      : Theme.Light,
  }
);

export const setConfig = (newConfig: ICurrentConfig) => {
  currentConfigVar(newConfig);
  Cookies.set(`${config.name}:config`, JSON.stringify(newConfig), {
    ...config.cookies,
  });
};
