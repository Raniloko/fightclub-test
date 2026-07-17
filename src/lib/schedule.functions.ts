import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as publicSupabase } from "@/integrations/supabase/client";

export type WeekDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type ScheduleClass = {
  id: string;
  day: WeekDay;
  start_time: string;
  end_time: string;
  discipline: string;
  age: string;
  note: string | null;
  cancelled_today: boolean;
  sort_index: number;
};

const DAY_ENUM = z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]);
const TIME = z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM");

const classSchema = z.object({
  day: DAY_ENUM,
  start_time: TIME,
  end_time: TIME,
  discipline: z.string().trim().min(1).max(120),
  age: z.string().trim().max(60).default(""),
  note: z.string().trim().max(300).nullable().optional(),
  cancelled_today: z.boolean().default(false),
  sort_index: z.number().int().min(0).max(9999).default(0),
});

export const listSchedule = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicSupabase
    .from("schedule_classes")
    .select("*")
    .order("day", { ascending: true })
    .order("sort_index", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as ScheduleClass[];
});

export const createScheduleClass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => classSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("schedule_classes")
      .insert({ ...data, note: data.note ?? null })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row as ScheduleClass;
  });

export const updateScheduleClass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid() }).extend(classSchema.partial().shape).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...rest } = data;
    const { data: row, error } = await context.supabase
      .from("schedule_classes")
      .update(rest)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row as ScheduleClass;
  });

export const deleteScheduleClass = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("schedule_classes")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
