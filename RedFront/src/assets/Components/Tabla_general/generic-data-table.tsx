"use client";

import type React from "react";
import { useState, useMemo } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Loader3 from "@/assets/Components/Loaders/Loader3";
import { Search, X } from "lucide-react";
import type {
  ColumnDefinition,
  SortConfig,
  TableAction,
} from "./type/generic-table";
import NoData from "./NoData";
import GenericActionsCell from "./generic-actions-cell";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface GenericDataTableProps<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  actions: TableAction[];
  loading: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (query: string) => void;
  onSearchClick: () => void;
  onClearFilters: () => void;
  onRefetch: () => void;
  idField: keyof T; // Campo que se usa como ID (ej: 'idempadronados', 'id_categoria')
  pageTitle?: string;
  emptyStateType?: "no-data" | "no-results";
}

export default function GenericDataTable<T>({
  columns,
  data,
  actions,
  loading,
  totalItems,
  currentPage,
  pageSize,
  searchQuery,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSearchClick,
  onClearFilters,
  onRefetch,
  idField,
}: GenericDataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const displayedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }
      return (
        String(aValue).localeCompare(String(bValue), undefined, {
          sensitivity: "base",
        }) * (sortConfig.direction === "asc" ? 1 : -1)
      );
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchClick();
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader3 />
        </div>
      ) : (
        <Card className="shadow-lg rounded-lg w-full">
          <CardHeader>
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full xs:w-64">
                    <Input
                      placeholder="Buscar (Enter o clic en botón)..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      onKeyPress={handleKeyPress}
                      className="w-full pr-8 text-sm"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSearchClick}
                    className="w-full xs:w-auto bg-transparent"
                  >
                    <Search className="w-4 h-4 mr-2 xs:mr-0" />
                    <span className="xs:hidden">Buscar</span>
                  </Button>
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center gap-2 justify-center sm:justify-end">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Mostrar:
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(val) => onPageSizeChange(Number(val))}
                  >
                    <SelectTrigger className="w-16 sm:w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    elementos
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border overflow-hidden">
              {data.length === 0 ? (
                <NoData
                  type={searchQuery ? "no-results" : "no-data"}
                  onClearFilters={onClearFilters}
                  onRefetch={onRefetch}
                />
              ) : (
                <>
                  {/* Table with horizontal scroll */}
                  <div className="overflow-x-auto min-w-full">
                    <div className="min-w-[800px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {columns.map((col) => (
                              <TableHead
                                key={String(col.key)}
                                className={`cursor-pointer select-none text-xs sm:text-sm whitespace-nowrap ${
                                  col.isSortable !== false
                                    ? "hover:bg-muted"
                                    : ""
                                }`}
                                onClick={() =>
                                  col.isSortable !== false &&
                                  handleSort(String(col.key))
                                }
                              >
                                {col.label}
                                {sortConfig?.key === String(col.key) && (
                                  <span className="ml-1 text-xs">
                                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                                  </span>
                                )}
                              </TableHead>
                            ))}
                            {actions.length > 0 && (
                              <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                                Acciones
                              </TableHead>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayedData.map((item) => (
                            <TableRow key={String(item[idField])}>
                              {columns.map((col) => (
                                <TableCell
                                  key={String(col.key)}
                                  className={`text-xs sm:text-sm whitespace-nowrap ${
                                    col.isNumeric ? "text-right" : ""
                                  }`}
                                >
                                  {col.render
                                    ? col.render(item[col.key], item)
                                    : String(item[col.key])}
                                </TableCell>
                              ))}
                              {actions.length > 0 && (
                                <TableCell className="whitespace-nowrap">
                                  <GenericActionsCell
                                    id={item[idField] as number | string}
                                    actions={actions}
                                  />
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </>
              )}
            </div>

            {data.length === 0 ? (
              <></>
            ) : (
              <>
                {/* Pagination */}
                <div className="flex flex-col gap-4 mt-4">
                  {/* Results info */}
                  <div className="text-sm text-muted-foreground text-center sm:text-left">
                    Mostrando {startIndex + 1} a {endIndex} de {totalItems}{" "}
                    resultados
                  </div>

                  {/* Pagination controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onPageChange(Math.max(currentPage - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="text-xs sm:text-sm"
                      >
                        Anterior
                      </Button>

                      {/* Page buttons */}
                      <div className="flex items-center gap-1">
                        {(() => {
                          const pages = [];
                          const maxVisiblePages =
                            typeof window !== "undefined" &&
                            window.innerWidth < 640
                              ? 3
                              : 5;
                          let startPage = Math.max(
                            1,
                            currentPage - Math.floor(maxVisiblePages / 2)
                          );
                          const endPage = Math.min(
                            totalPages,
                            startPage + maxVisiblePages - 1
                          );

                          if (endPage - startPage + 1 < maxVisiblePages) {
                            startPage = Math.max(
                              1,
                              endPage - maxVisiblePages + 1
                            );
                          }

                          if (startPage > 1) {
                            pages.push(
                              <Button
                                key={1}
                                variant={
                                  1 === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => onPageChange(1)}
                                className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                              >
                                1
                              </Button>
                            );
                            if (startPage > 2) {
                              pages.push(
                                <span
                                  key="ellipsis-start"
                                  className="px-1 sm:px-2 text-xs sm:text-sm text-muted-foreground"
                                >
                                  ...
                                </span>
                              );
                            }
                          }

                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Button
                                key={i}
                                variant={
                                  i === currentPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => onPageChange(i)}
                                className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                              >
                                {i}
                              </Button>
                            );
                          }

                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                              pages.push(
                                <span
                                  key="ellipsis-end"
                                  className="px-1 sm:px-2 text-xs sm:text-sm text-muted-foreground"
                                >
                                  ...
                                </span>
                              );
                            }
                            pages.push(
                              <Button
                                key={totalPages}
                                variant={
                                  totalPages === currentPage
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => onPageChange(totalPages)}
                                className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                              >
                                {totalPages}
                              </Button>
                            );
                          }

                          return pages;
                        })()}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onPageChange(Math.min(currentPage + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="text-xs sm:text-sm"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
