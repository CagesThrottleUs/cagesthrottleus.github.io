import type { ComponentType, LazyExoticComponent } from 'react';

export interface CVEntry {
  text: string;
  tooltip?: string;
}

export interface MonthEntry {
  year: number;
  month: number;
  id: string;
  label: string;
  Component: LazyExoticComponent<ComponentType>;
}
