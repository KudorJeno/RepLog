export type Lang = 'en' | 'ro';

export const MUSCLES = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'legs',
  'glutes',
  'calves',
  'core',
] as const;
export type Muscle = (typeof MUSCLES)[number];

export const EQUIPMENT = ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight'] as const;
export type Equipment = (typeof EQUIPMENT)[number];

export type Localized = Record<Lang, string>;

export interface Exercise {
  id: string;
  name: string;
  muscle: Muscle;
  equipment: Equipment;
  howto: string;
  custom: boolean;
}

export const WORKOUT_TAGS = ['push', 'pull', 'legs', 'upper', 'lower', 'full'] as const;
export type WorkoutTag = (typeof WORKOUT_TAGS)[number];
