"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { useEventroStore, type DiscountCode } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon, Pencil, Trash2, Tag } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function DiscountCodeManagement({ eventId }: { eventId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null)

  const [code, setCode] = useState("")
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE")
  const [value, setValue] = useState("")
  const [maxUses, setMaxUses] = useState("")
  const [active, setActive] = useState(true)

  const { toast } = useToast()

  // Get event data and discount codes from store
  const event = useEventroStore((state) => state.events.find((e) => e.id === eventId))
  const allDiscountCodes = useEventroStore((state) => state.discountCodes)

  // Filter discount codes for this event
  const discountCodes = useMemo(
    () => allDiscountCodes.filter((dc) => dc.eventId === eventId),
    [allDiscountCodes, eventId],
  )

  const addDiscountCode = useEventroStore((state) => state.addDiscountCode)
  const updateDiscountCode = useEventroStore((state) => state.updateDiscountCode)
  const deleteDiscountCode = useEventroStore((state) => state.deleteDiscountCode)

  const handleOpenDialog = useCallback((code?: DiscountCode) => {
    if (code) {
      setEditingCode(code)
      setCode(code.code)
      setDiscountType(code.discountType)
      setValue(code.value.toString())
      setMaxUses(code.maxUses?.toString() || "")
      setActive(code.active)
    } else {
      setEditingCode(null)
      setCode("")
      setDiscountType("PERCENTAGE")
      setValue("")
      setMaxUses("")
      setActive(true)
    }

    setDialogOpen(true)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      // Validar que el código no esté vacío
      if (!code.trim()) {
        toast({
          title: "Error",
          description: "El código de descuento no puede estar vacío",
          variant: "destructive",
        })
        return
      }

      // Validar que el valor sea un número válido
      const numValue = Number(value)
      if (isNaN(numValue) || numValue <= 0) {
        toast({
          title: "Error",
          description: "El valor del descuento debe ser un número positivo",
          variant: "destructive",
        })
        return
      }

      // Si es porcentaje, validar que no sea mayor a 100
      if (discountType === "PERCENTAGE" && numValue > 100) {
        toast({
          title: "Error",
          description: "El porcentaje de descuento no puede ser mayor a 100%",
          variant: "destructive",
        })
        return
      }

      // Validar que el código no esté duplicado (excepto si estamos editando)
      if (!editingCode && discountCodes.some((dc) => dc.code === code)) {
        toast({
          title: "Error",
          description: "Ya existe un código de descuento con ese nombre",
          variant: "destructive",
        })
        return
      }

      const discountCodeData = {
        code,
        discountType,
        value: numValue,
        maxUses: maxUses ? Number(maxUses) : undefined,
        eventId,
        createdBy: "npub1owner...", // En una implementación real, esto vendría del usuario autenticado
        active: editingCode ? editingCode.active : false, // Mantener el estado si es edición, false si es nuevo
      }

      if (editingCode) {
        updateDiscountCode(editingCode.id, discountCodeData)
        toast({
          title: "Código actualizado",
          description: "El código de descuento ha sido actualizado correctamente",
        })
      } else {
        addDiscountCode(discountCodeData)
        toast({
          title: "Código creado",
          description: "El código de descuento ha sido creado correctamente",
        })
      }

      setDialogOpen(false)
    },
    [
      code,
      discountType,
      value,
      maxUses,
      eventId,
      editingCode,
      discountCodes,
      addDiscountCode,
      updateDiscountCode,
      toast,
    ],
  )

  const handleDeleteCode = useCallback(
    (id: string) => {
      if (confirm("¿Estás seguro de que deseas eliminar este código de descuento?")) {
        deleteDiscountCode(id)
        toast({
          title: "Código eliminado",
          description: "El código de descuento ha sido eliminado correctamente",
        })
      }
    },
    [deleteDiscountCode, toast],
  )

  const handleToggleActive = useCallback(
    (id: string, currentActive: boolean) => {
      updateDiscountCode(id, { active: !currentActive })
      toast({
        title: currentActive ? "Código desactivado" : "Código activado",
        description: `El código de descuento ha sido ${currentActive ? "desactivado" : "activado"} correctamente`,
      })
    },
    [updateDiscountCode, toast],
  )

  // Show loading state if event not found
  if (!event) {
    return <div className="p-8 text-center">Cargando datos del evento...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Códigos de Descuento</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Crear Código
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingCode ? "Editar Código de Descuento" : "Crear Código de Descuento"}</DialogTitle>
                <DialogDescription>
                  {editingCode
                    ? "Modifica los detalles del código de descuento"
                    : "Define un nuevo código de descuento para este evento"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="code">Código</Label>
                    <Input
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Ej: EARLYBIRD"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="maxUses">Límite de Usos (opcional)</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                      placeholder="Dejar vacío para usos ilimitados"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discountType">Tipo de Descuento</Label>
                    <Select
                      value={discountType}
                      onValueChange={(value) => setDiscountType(value as "PERCENTAGE" | "FIXED")}
                    >
                      <SelectTrigger id="discountType">
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Porcentaje (%)</SelectItem>
                        <SelectItem value="FIXED">Monto Fijo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="value">
                      {discountType === "PERCENTAGE" ? "Porcentaje de Descuento" : "Monto de Descuento"}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={discountType === "PERCENTAGE" ? "Ej: 20" : "Ej: 1500"}
                      min="0"
                      max={discountType === "PERCENTAGE" ? "100" : undefined}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button className='w-full' type="submit">{editingCode ? "Guardar Cambios" : "Crear Código"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {discountCodes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Tag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay códigos de descuento</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Crea códigos de descuento para ofrecer promociones especiales a tus asistentes.
            </p>
            <Button onClick={() => handleOpenDialog()}>Crear tu Primer Código</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Códigos de Descuento</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discountCodes.map((discountCode) => {
                  const isActive = discountCode.active

                  return (
                    <TableRow key={discountCode.id}>
                      <TableCell className="font-medium">{discountCode.code}</TableCell>
                      <TableCell>{discountCode.discountType === "PERCENTAGE" ? "Porcentaje" : "Monto Fijo"}</TableCell>
                      <TableCell>
                        {discountCode.discountType === "PERCENTAGE"
                          ? `${discountCode.value}%`
                          : `$${discountCode.value}`}
                      </TableCell>
                      <TableCell>
                        {discountCode.used}
                        {discountCode.maxUses ? ` / ${discountCode.maxUses}` : ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={discountCode.active}
                            onCheckedChange={(checked) => handleToggleActive(discountCode.id, !checked)}
                            className="mr-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenDialog(discountCode)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteCode(discountCode.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
