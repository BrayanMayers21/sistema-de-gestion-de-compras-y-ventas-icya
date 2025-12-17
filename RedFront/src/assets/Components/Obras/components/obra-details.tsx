"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Building2, Hash, Info } from "lucide-react";
import type { ObraItem } from "../type/type";

interface ObraDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  obra: ObraItem | null;
}

export function ObraDetails({ isOpen, onClose, obra }: ObraDetailsProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && obra) {
      setLoading(false);
    }
  }, [obra, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-3xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Detalles de la Obra
          </DialogTitle>
          <DialogDescription>
            Información completa de la obra.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Cargando detalles...</span>
            </div>
          ) : obra ? (
            <div className="space-y-6">
              {/* Información Principal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Información Principal
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      Código
                    </label>
                    <p className="text-lg font-mono font-semibold">
                      {obra.codigo}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      Nombre de la Obra
                    </label>
                    <p className="text-lg font-semibold">{obra.nom_obra}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      ID de Obra
                    </label>
                    <p className="text-sm text-muted-foreground font-mono">
                      #{obra.idobras}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                No se pudieron cargar los detalles de la obra.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
