import type { ComponentType } from 'react';

export type CVEntry = {
  text: string;
  tooltip?: string;
};

export type MonthEntry = {
  year: number;
  month: number;
  id: string;
  label: string;
  factory: () => Promise<{ default: ComponentType }>;
};
