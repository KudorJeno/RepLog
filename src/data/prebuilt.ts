import type { Lang, Localized, Muscle, WorkoutTag } from './types';

export interface PrebuiltWorkout {
  id: string;
  name: Localized;
  tags: WorkoutTag[];
  muscles: Muscle[];
  /** [exerciseId, sets] */
  exercises: [string, number][];
}

export const PREBUILT_WORKOUTS: PrebuiltWorkout[] = [
  {
    id: 'push_a',
    name: { en: 'Push Day A (Chest focus)', ro: 'Ziua Push A (accent piept)' },
    tags: ['push', 'upper'],
    muscles: ['chest', 'shoulders', 'triceps'],
    exercises: [
      ['bench_press', 4],
      ['incline_db_press', 3],
      ['overhead_press', 3],
      ['lateral_raise', 3],
      ['tricep_pushdown', 3],
      ['overhead_tricep_ext', 3],
    ],
  },
  {
    id: 'push_b',
    name: { en: 'Push Day B (Shoulder focus)', ro: 'Ziua Push B (accent umeri)' },
    tags: ['push', 'upper'],
    muscles: ['shoulders', 'chest', 'triceps'],
    exercises: [
      ['overhead_press', 4],
      ['incline_bench_press', 3],
      ['db_fly', 3],
      ['lateral_raise', 4],
      ['skull_crusher', 3],
      ['dips', 3],
    ],
  },
  {
    id: 'pull_a',
    name: { en: 'Pull Day A (Back focus)', ro: 'Ziua Pull A (accent spate)' },
    tags: ['pull', 'upper'],
    muscles: ['back', 'biceps'],
    exercises: [
      ['deadlift', 3],
      ['pull_up', 4],
      ['barbell_row', 3],
      ['face_pull', 3],
      ['barbell_curl', 3],
      ['hammer_curl', 3],
    ],
  },
  {
    id: 'pull_b',
    name: { en: 'Pull Day B (Lats & biceps)', ro: 'Ziua Pull B (dorsali și biceps)' },
    tags: ['pull', 'upper'],
    muscles: ['back', 'biceps', 'shoulders'],
    exercises: [
      ['lat_pulldown', 4],
      ['seated_cable_row', 3],
      ['db_row', 3],
      ['rear_delt_fly', 3],
      ['incline_db_curl', 3],
      ['cable_curl', 3],
    ],
  },
  {
    id: 'legs_a',
    name: { en: 'Leg Day A (Quad focus)', ro: 'Ziua de picioare A (accent cvadriceps)' },
    tags: ['legs', 'lower'],
    muscles: ['legs', 'calves', 'core'],
    exercises: [
      ['squat', 4],
      ['leg_press', 3],
      ['leg_extension', 3],
      ['leg_curl', 3],
      ['standing_calf_raise', 4],
      ['hanging_leg_raise', 3],
    ],
  },
  {
    id: 'legs_b',
    name: { en: 'Leg Day B (Hamstrings & glutes)', ro: 'Ziua de picioare B (femurali și fesieri)' },
    tags: ['legs', 'lower'],
    muscles: ['legs', 'glutes', 'calves'],
    exercises: [
      ['romanian_deadlift', 4],
      ['hip_thrust', 3],
      ['bulgarian_split_squat', 3],
      ['leg_curl', 3],
      ['seated_calf_raise', 4],
    ],
  },
  {
    id: 'upper_body',
    name: { en: 'Upper Body', ro: 'Corp superior' },
    tags: ['upper'],
    muscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
    exercises: [
      ['bench_press', 3],
      ['barbell_row', 3],
      ['overhead_press', 3],
      ['lat_pulldown', 3],
      ['db_curl', 2],
      ['tricep_pushdown', 2],
    ],
  },
  {
    id: 'lower_body',
    name: { en: 'Lower Body', ro: 'Corp inferior' },
    tags: ['lower'],
    muscles: ['legs', 'glutes', 'calves'],
    exercises: [
      ['squat', 4],
      ['romanian_deadlift', 3],
      ['leg_press', 3],
      ['hip_thrust', 3],
      ['standing_calf_raise', 3],
    ],
  },
  {
    id: 'full_body_a',
    name: { en: 'Full Body A', ro: 'Corp întreg A' },
    tags: ['full'],
    muscles: ['legs', 'chest', 'back', 'shoulders', 'core'],
    exercises: [
      ['squat', 3],
      ['bench_press', 3],
      ['barbell_row', 3],
      ['overhead_press', 2],
      ['plank', 3],
    ],
  },
  {
    id: 'full_body_b',
    name: { en: 'Full Body B', ro: 'Corp întreg B' },
    tags: ['full'],
    muscles: ['legs', 'back', 'chest', 'biceps', 'triceps'],
    exercises: [
      ['deadlift', 3],
      ['incline_db_press', 3],
      ['lat_pulldown', 3],
      ['lunge', 3],
      ['db_curl', 2],
      ['tricep_pushdown', 2],
    ],
  },
  {
    id: 'chest_triceps',
    name: { en: 'Chest & Triceps', ro: 'Piept și triceps' },
    tags: ['push', 'upper'],
    muscles: ['chest', 'triceps'],
    exercises: [
      ['bench_press', 4],
      ['incline_db_press', 3],
      ['cable_crossover', 3],
      ['close_grip_bench', 3],
      ['tricep_pushdown', 3],
    ],
  },
  {
    id: 'back_biceps',
    name: { en: 'Back & Biceps', ro: 'Spate și biceps' },
    tags: ['pull', 'upper'],
    muscles: ['back', 'biceps'],
    exercises: [
      ['pull_up', 4],
      ['barbell_row', 3],
      ['seated_cable_row', 3],
      ['barbell_curl', 3],
      ['hammer_curl', 3],
    ],
  },
  {
    id: 'shoulders_arms',
    name: { en: 'Shoulders & Arms', ro: 'Umeri și brațe' },
    tags: ['upper'],
    muscles: ['shoulders', 'biceps', 'triceps'],
    exercises: [
      ['db_shoulder_press', 3],
      ['lateral_raise', 4],
      ['rear_delt_fly', 3],
      ['db_curl', 3],
      ['skull_crusher', 3],
    ],
  },
  {
    id: 'core_finisher',
    name: { en: 'Core Finisher', ro: 'Abdomen (finisher)' },
    tags: ['full'],
    muscles: ['core'],
    exercises: [
      ['hanging_leg_raise', 3],
      ['cable_crunch', 3],
      ['russian_twist', 3],
      ['plank', 3],
    ],
  },
];

/** Prebuilt workouts available without Pro: one push, one pull and one legs day. */
export const FREE_PREBUILT_IDS: ReadonlySet<string> = new Set(['push_a', 'pull_a', 'legs_a']);

export function prebuiltName(w: PrebuiltWorkout, lang: Lang) {
  return w.name[lang];
}
