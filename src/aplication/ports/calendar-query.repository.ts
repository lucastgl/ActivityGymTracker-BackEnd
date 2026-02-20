import { DateOnly } from '../../domain/value-objects/date-only.vo';
import { Id } from '../../domain/value-objects/id.vo';
import { SessionStatus } from '../../domain/enums/session-status.enum';
import { MuscleCategory } from '../../domain/enums/muscle-category.enum';
import { Equipment } from '../../domain/enums/equipment.enum';
import { SideType } from '../../domain/enums/side-type.enum';
import { OriginType } from '../../domain/enums/origin-type.enum';
import { SetType } from '../../domain/enums/set-type.enum';
import type {
  WorkoutRepository,
  WorkoutSessionDetail,
} from '../../domain/repositories/workout.repository';
import type {
  RunRepository,
  RunSessionDetail,
} from '../../domain/repositories/run.repository';

/** Estado de sesión (status + injuryMode). Reutilizado en workout y run. */
export type SessionStatusMeta = {
  status: SessionStatus;
  injuryMode: boolean;
};

/** Drop en read model (con id para UI). */
export type DropData = {
  dropId: Id;
  order: number;
  weightKg: number;
  reps: number;
};

/** Set simple en read model. */
export type SimpleSetData = {
  setId: Id;
  type: SetType;
  order: number;
  weightKg: number;
  reps: number;
};

/** Set dropset en read model. */
export type DropSetData = {
  setId: Id;
  type: SetType;
  order: number;
  drops: DropData[];
};

export type WorkoutSetData = SimpleSetData | DropSetData;

/** Split en read model (con id para UI). */
export type SplitData = {
  splitId: Id;
  order: number;
  distanceKm: number;
  durationSec: number;
};

export type CalendarDayOverview = {
  date: DateOnly;
  workout?: SessionStatusMeta;
  run?: SessionStatusMeta;
  /** Estado combinado para UI. */
  combinedStatus?: SessionStatus;
  /** InjuryMode combinado para UI. */
  combinedInjury?: boolean;
};

export type DayWorkoutData = {
  sessionId: Id;
  date: DateOnly;
  status: SessionStatus;
  injuryMode: boolean;
  note?: string;
  routine?: { routineId: Id; routineName: string; dayKey: string };
  exercises: Array<{
    workoutExerciseId: Id;
    exerciseId: Id;
    name: string;
    muscleCategory: MuscleCategory;
    equipment: Equipment;
    sideType: SideType;
    origin: OriginType;
    order: number;
    sets: WorkoutSetData[];
  }>;
};

export type DayRunData = {
  runSessionId: Id;
  date: DateOnly;
  status: SessionStatus;
  injuryMode: boolean;
  note?: string;
  distanceKm: number;
  durationSec: number;
  splits: SplitData[];
};

export type CalendarDayData = {
  date: DateOnly;
  workout?: DayWorkoutData;
  run?: DayRunData;
};

export interface CalendarQueryRepository {
  getDayOverview(userId: Id, date: DateOnly): Promise<CalendarDayOverview>;
  getDayData(userId: Id, date: DateOnly): Promise<CalendarDayData>;
  /** Devuelve overview de cada día del mes (1..lastDay). */
  getCalendarMonth(
    userId: Id,
    year: number,
    month: number,
  ): Promise<CalendarDayOverview[]>;
}

export class CalendarQueryRepositoryImpl implements CalendarQueryRepository {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly runRepository: RunRepository,
  ) {}

  async getDayOverview(
    userId: Id,
    date: DateOnly,
  ): Promise<CalendarDayOverview> {
    const [workout, run] = await Promise.all([
      this.workoutRepository.getByDate(userId, date),
      this.runRepository.getByDate(userId, date),
    ]);

    const overview: CalendarDayOverview = { date };
    if (workout) {
      overview.workout = {
        status: workout.status,
        injuryMode: workout.injuryMode,
      };
    }
    if (run) {
      overview.run = {
        status: run.status,
        injuryMode: run.injuryMode,
      };
    }
    if (overview.workout || overview.run) {
      overview.combinedStatus =
        overview.workout?.status === SessionStatus.COMPLETED &&
        overview.run?.status === SessionStatus.COMPLETED
          ? SessionStatus.COMPLETED
          : SessionStatus.DRAFT;
      overview.combinedInjury =
        (overview.workout?.injuryMode ?? false) ||
        (overview.run?.injuryMode ?? false);
    }
    return overview;
  }

  async getDayData(userId: Id, date: DateOnly): Promise<CalendarDayData> {
    const [workout, run] = await Promise.all([
      this.workoutRepository.getByDate(userId, date),
      this.runRepository.getByDate(userId, date),
    ]);

    const data: CalendarDayData = { date };

    if (workout) {
      data.workout = this.mapWorkoutToDayData(workout);
    }
    if (run) {
      data.run = this.mapRunToDayData(run);
    }

    return data;
  }

  async getCalendarMonth(
    userId: Id,
    year: number,
    month: number,
  ): Promise<CalendarDayOverview[]> {
    const lastDay = new Date(year, month, 0).getDate();
    const results: CalendarDayOverview[] = [];
    for (let day = 1; day <= lastDay; day++) {
      const date = DateOnly.fromDate(new Date(year, month - 1, day));
      const overview = await this.getDayOverview(userId, date);
      results.push(overview);
    }
    return results;
  }

  private mapWorkoutToDayData(session: WorkoutSessionDetail): DayWorkoutData {
    return {
      sessionId: session.id,
      date: session.date,
      status: session.status,
      injuryMode: session.injuryMode,
      note: session.note,
      exercises: session.exercises.map((ex) => ({
        workoutExerciseId: ex.id,
        exerciseId: ex.exerciseId,
        // TODO: enriquecer con ExerciseRepository (name, muscleCategory, equipment, sideType)
        name: '',
        muscleCategory: MuscleCategory.ARM,
        equipment: Equipment.BARBELL,
        sideType: SideType.BILATERLA,
        origin: ex.origin,
        order: ex.order,
        sets: ex.sets.map(
          (s): WorkoutSetData =>
            s.drops.length > 0
              ? {
                  setId: s.id,
                  type: s.type,
                  order: s.order,
                  drops: s.drops.map((d) => ({
                    dropId: d.id,
                    order: d.order,
                    weightKg: d.weightKg,
                    reps: d.reps,
                  })),
                }
              : {
                  setId: s.id,
                  type: s.type,
                  order: s.order,
                  weightKg: s.weightKg ?? 0,
                  reps: s.reps ?? 0,
                },
        ),
      })),
    };
  }

  private mapRunToDayData(session: RunSessionDetail): DayRunData {
    return {
      runSessionId: session.id,
      date: session.date,
      status: session.status,
      injuryMode: session.injuryMode,
      note: session.note,
      distanceKm: session.distanceKm,
      durationSec: session.durationSec,
      splits: session.splits.map((s) => ({
        splitId: s.id,
        order: s.order,
        distanceKm: s.distanceKm,
        durationSec: s.durationSec,
      })),
    };
  }
}
