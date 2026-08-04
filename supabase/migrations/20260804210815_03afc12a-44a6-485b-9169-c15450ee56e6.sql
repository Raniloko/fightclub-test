
UPDATE public.schedule_classes SET discipline = 'MMA / Ground and Pound' WHERE day = 'TUE' AND discipline = 'MMA-Grappling';
UPDATE public.schedule_classes SET discipline = 'Submission Grappling' WHERE day = 'THU' AND discipline = 'MMA-Grappling';
UPDATE public.schedule_classes SET discipline = 'Wing Fight / Selfdefense' WHERE discipline = 'Self-Defense / Wing-Fight';
UPDATE public.schedule_classes SET discipline = 'Mini-Wing-Fight / Mini-Selbstverteidigung' WHERE discipline = 'Mini-Wing-Fight';
DELETE FROM public.schedule_classes WHERE day = 'WED' AND discipline = 'Fighter-Fitness';
UPDATE public.schedule_classes SET age = '', discipline = 'Personal Training (nach Vereinbarung)' WHERE day = 'SAT' AND start_time = '13:00';
DELETE FROM public.schedule_classes WHERE day = 'SUN' AND start_time = '11:00';
UPDATE public.schedule_classes SET start_time = '10:00', end_time = '22:00', age = '', sort_index = 1, discipline = 'Personal Training (nach Vereinbarung)' WHERE day = 'SUN';
