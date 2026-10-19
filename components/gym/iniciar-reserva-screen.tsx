"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock, MapPin, User } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COLORS, type Screen } from "./theme"
import { ScreenHeader } from "./screen-header"

const HORARIOS = [
  { hora: "08:00", lleno: false },
  { hora: "10:00", lleno: false },
  { hora: "12:00", lleno: true },
  { hora: "15:00", lleno: false },
  { hora: "18:00", lleno: true },
  { hora: "19:00", lleno: true },
  { hora: "20:00", lleno: false },
]

const ACTIVITY_DETAILS: Record<string, { profesor: string; sala: string }> = {
  Spinning: { profesor: "Prof. Marcos", sala: "Sala 1" },
  Funcional: { profesor: "Prof. Laura", sala: "Sala 2" },
  Musculación: { profesor: "Prof. Diego", sala: "Sala de Pesas" },
  Yoga: { profesor: "Prof. Sofía", sala: "Sala 3" },
}

const UNAVAILABLE_WEEKDAYS = [0, 2, 4, 6]

const isClassDay = (date: Date) => !UNAVAILABLE_WEEKDAYS.includes(date.getDay())

export function IniciarReservaScreen({
  activityName,
  onNavigate,
  onConfirm,
}: {
  activityName: string
  onNavigate: (s: Screen) => void
  onConfirm: () => void
}) {
  const [fecha, setFecha] = useState<Date | undefined>(undefined)
  const [hora, setHora] = useState<string>("")
  const [calendarOpen, setCalendarOpen] = useState(false)

  const labelStyle = { color: COLORS.poseidon }
  const details = ACTIVITY_DETAILS[activityName]

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="INICIAR RESERVA"
        onBack={() => onNavigate("reservar")}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-6">
        <div
          className="rounded-2xl px-4 py-3 text-center text-sm font-semibold text-white"
          style={{ backgroundColor: COLORS.norse }}
        >
          {activityName || "Actividad"}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold" style={labelStyle}>
            Fecha
          </span>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              className="flex w-full items-center gap-3 rounded-xl border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50"
              style={{ borderColor: COLORS.norse }}
            >
              <CalendarIcon className="h-5 w-5 shrink-0" style={{ color: COLORS.norse }} />
              <span className={fecha ? "font-medium text-foreground" : "text-muted-foreground"}>
                {fecha
                  ? format(fecha, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
                  : "Selecciona una fecha"}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fecha}
                onSelect={(d) => {
                  setFecha(d)
                  setCalendarOpen(false)
                }}
                locale={es}
                captionLayout="dropdown"
                disabled={(date) => !isClassDay(date)}
                modifiers={{ classDay: isClassDay }}
                modifiersClassNames={{ classDay: "font-semibold text-[#638FA9]" }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-muted-foreground">
            Clases disponibles: lunes, miércoles y viernes.
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold" style={labelStyle}>
            Hora
          </span>
          <Select value={hora} onValueChange={(v) => setHora(v ?? "")}>
            <SelectTrigger
              className="w-full rounded-xl px-4 py-6 text-sm text-[#2B3B4C] [&_[data-slot=select-value]]:text-[#2B3B4C]"
              style={{ borderColor: COLORS.norse }}
            >
              <SelectValue placeholder="Selecciona un horario" />
            </SelectTrigger>
            <SelectContent>
              {HORARIOS.map(({ hora: h, lleno }) => (
                <SelectItem key={h} value={h} disabled={lleno}>
                  {lleno ? `${h} - Lleno` : h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(fecha || hora) && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: `${COLORS.poseidon}14`, color: COLORS.poseidon }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wide opacity-70">
              Resumen de la reserva
            </p>
            <dl className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Clock className="size-4 shrink-0" style={{ color: COLORS.norse }} aria-hidden="true" />
                <dt className="sr-only">Fecha y hora</dt>
                <dd className="font-semibold">
                  {fecha ? format(fecha, "d MMM yyyy", { locale: es }) : "Sin fecha"}
                  {hora ? ` · ${hora}` : ""}
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <User className="size-4 shrink-0" style={{ color: COLORS.norse }} aria-hidden="true" />
                <dt className="sr-only">Profesor</dt>
                <dd>{details?.profesor ?? "Profesor a confirmar"}</dd>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0" style={{ color: COLORS.norse }} aria-hidden="true" />
                <dt className="sr-only">Sala</dt>
                <dd>{details?.sala ?? "Sala a confirmar"}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="px-5 py-5">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!fecha || !hora}
          className="w-full rounded-xl py-3 text-sm font-bold uppercase tracking-wide text-white transition-transform active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: COLORS.norse }}
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}
