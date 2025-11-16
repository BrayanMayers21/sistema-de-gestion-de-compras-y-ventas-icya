import type React from "react";
// Generic types for reusable data tables across all modules

export interface ColumnDefinition<T> {
  key: keyof T;
  label: string;
  isNumeric?: boolean;
  isSortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  permission?: string | string[];
  onClick: (id: number | string) => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
  showOnMobile?: boolean; // true = mostrar en móvil, false = ocultar en menú dropdown
}

export interface GenericListResponse<T> {
  message: string;
  data: T[];
  total: number;
}

export interface GenericListParams {
  Limite_inferior: number;
  Limite_Superior: number;
  Buscar?: string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}
