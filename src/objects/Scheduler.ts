import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";

export type SchedulerRecurrence =
        | { kind: "second"; every: number; start?: string; end?: string }
        | { kind: "minute"; every: number; start?: string; end?: string }
        | { kind: "hour"; every: number; start?: string; end?: string }
        | { kind: "day"; every: number; start?: string; end?: string; weekdayOnly?: boolean };

export type SchedulerItemOptions = {
        description?: string;
        localTime?: boolean;
        edgeDuration?: number;
        recurrence?: SchedulerRecurrence;
        attachments?: string;
        hmUsecases?: string;
};

export class SchedulerItem extends IObject {
        type = "SchedulerItem";

        constructor(path: string | number | Path, opts?: SchedulerItemOptions) {
                super(path, syslib.model.classes.SchedulerItem);

                if (!syslib.getobject(this.path.absolutePath())) {
                        syslib.mass([this.buildMassObject(
                                syslib.model.codes.MassOp.UPSERT,
                                this.withDefaults(opts)
                        )]);
                }
        }

        private withDefaults(opts?: SchedulerItemOptions): SchedulerItemOptions {
                return {
                        description: opts?.description ?? "",
                        localTime: opts?.localTime ?? true,
                        edgeDuration: opts?.edgeDuration ?? 1,
                        recurrence: opts?.recurrence ?? {
                                kind: "second",
                                every: 10,
                                start: "0001-01-01T00:00:00.000Z",
                        },
                        attachments: opts?.attachments,
                        hmUsecases: opts?.hmUsecases,
                };
        }

        private buildMassObject(operation: number, opts: SchedulerItemOptions): Record<string, unknown> {
                const rec = opts.recurrence!;
                const start = rec.start ?? "0001-01-01T00:00:00.000Z";
                const end = rec.end ?? undefined;

                return {
                        class: syslib.model.classes.SchedulerItem,
                        operation,
                        type: syslib.model.codes.SysObjectType.OT_OBJECT,
                        path: this.path.absolutePath(),

                        ObjectName: this.path.name(),
                        ObjectDescription: opts.description,

                        EdgeDuration: opts.edgeDuration,
                        ScheduleLocalTime: opts.localTime,

                        ["Schedule.RecurYearly.RecurEnd"]: undefined,
                        ["Schedule.RecurYearly.RecurStart"]: syslib.gettime("0001-01-01T00:00:00.000Z"),
                        ["Schedule.RecurYearly.RecurYearDistance"]: 1,

                        ["Schedule.RecurMonthly.RecurEnd"]: undefined,
                        ["Schedule.RecurMonthly.RecurStart"]: syslib.gettime("0001-01-01T00:00:00.000Z"),
                        ["Schedule.RecurMonthly.RecurMonthDistance"]: 1,

                        ["Schedule.RecurWeekly.RecurEnd"]: undefined,
                        ["Schedule.RecurWeekly.RecurStart"]: syslib.gettime("0001-01-01T00:00:00.000Z"),
                        ["Schedule.RecurWeekly.RecurWeekDistance"]: 1,

                        ["Schedule.RecurDaily.RecurEnd"]: rec.kind === "day" ? (end ? syslib.gettime(end) : undefined) : undefined,
                        ["Schedule.RecurDaily.RecurStart"]: syslib.gettime(start),
                        ["Schedule.RecurDaily.RecurDayWeekday"]: rec.kind === "day" ? (rec.weekdayOnly ?? false) : false,
                        ["Schedule.RecurDaily.RecurDayDistance"]: rec.kind === "day" ? rec.every : 1,

                        ["Schedule.RecurHourly.RecurEnd"]: rec.kind === "hour" ? (end ? syslib.gettime(end) : undefined) : undefined,
                        ["Schedule.RecurHourly.RecurStart"]: syslib.gettime(start),
                        ["Schedule.RecurHourly.RecurHourDistance"]: rec.kind === "hour" ? rec.every : 1,

                        ["Schedule.RecurByMinute.RecurEnd"]: rec.kind === "minute" ? (end ? syslib.gettime(end) : undefined) : undefined,
                        ["Schedule.RecurByMinute.RecurStart"]: syslib.gettime(start),
                        ["Schedule.RecurByMinute.RecurMinDistance"]: rec.kind === "minute" ? rec.every : 1,

                        ["Schedule.RecurBySecond.RecurEnd"]: rec.kind === "second" ? (end ? syslib.gettime(end) : undefined) : undefined,
                        ["Schedule.RecurBySecond.RecurStart"]: syslib.gettime(start),
                        ["Schedule.RecurBySecond.RecurSecDistance"]: rec.kind === "second" ? rec.every : 1,

                        ["Schedule.ScheduleRecurrence"]: this.toRecurrenceType(rec.kind),

                        ["ScheduleFrame.ScheduleToYear"]: 0,
                        ["ScheduleFrame.ScheduleFromYear"]: 0,
                        ["ScheduleFrame.ScheduleToMonth"]: 12,
                        ["ScheduleFrame.ScheduleFromMonth"]: 1,
                        ["ScheduleFrame.ScheduleToDoWinMonth"]: syslib.model.codes.DaysInMonth.WDIM_LAST,
                        ["ScheduleFrame.ScheduleFromDoWinMonth"]: syslib.model.codes.DaysInMonth.WDIM_FIRST,
                        ["ScheduleFrame.ScheduleToDay"]: 31,
                        ["ScheduleFrame.ScheduleFromDay"]: 1,
                        ["ScheduleFrame.ScheduleToDoW"]: syslib.model.codes.DaysOfWeek.SATURDAY,
                        ["ScheduleFrame.ScheduleFromDoW"]: syslib.model.codes.DaysOfWeek.SUNDAY,
                        ["ScheduleFrame.ScheduleToHour"]: 23,
                        ["ScheduleFrame.ScheduleFromHour"]: 0,
                        ["ScheduleFrame.ScheduleToMinute"]: 59,
                        ["ScheduleFrame.ScheduleFromMinute"]: 0,
                        ["ScheduleFrame.ScheduleToSecond"]: 59,
                        ["ScheduleFrame.ScheduleFromSecond"]: 0,

                        ["CustomOptions.CustomTables.TableData"]: [],
                        ["CustomOptions.CustomTables.CustomTableName"]: [],
                        ["CustomOptions.CustomProperties.CustomPropertyValue"]: [],
                        ["CustomOptions.CustomProperties.CustomPropertyName"]: [],
                        ["CustomOptions.CustomString"]: "",

                        Attachments: opts.attachments,
                        HMUsecases: opts.hmUsecases,
                };
        }

        private toRecurrenceType(kind: SchedulerRecurrence["kind"]): number {
                switch (kind) {
                        case "second":
                                return syslib.model.codes.RecurrenceType.SECOND;
                        case "minute":
                                return syslib.model.codes.RecurrenceType.MINUTE;
                        case "hour":
                                return syslib.model.codes.RecurrenceType.HOUR;
                        case "day":
                                return syslib.model.codes.RecurrenceType.DAY;
                }
        }

        getBackRef(){
                const backRef = syslib.getbackreferences(this.path.absolutePath());

                return backRef;
        }
        update(opts: SchedulerItemOptions): SchedulerItem {
                syslib.mass([this.buildMassObject(
                        syslib.model.codes.MassOp.UPDATE,
                        this.withDefaults(opts)
                )]);
                return this;
        }

        everySeconds(seconds: number, start?: string): SchedulerItem {
                return this.update({
                        recurrence: {
                                kind: "second",
                                every: seconds,
                                start,
                        },
                });
        }

        everyMinutes(minutes: number, start?: string): SchedulerItem {
                return this.update({
                        recurrence: {
                                kind: "minute",
                                every: minutes,
                                start,
                        },
                });
        }

        everyHours(hours: number, start?: string): SchedulerItem {
                return this.update({
                        recurrence: {
                                kind: "hour",
                                every: hours,
                                start,
                        },
                });
        }

        everyDays(days: number, start?: string, weekdayOnly?: boolean): SchedulerItem {
                return this.update({
                        recurrence: {
                                kind: "day",
                                every: days,
                                start,
                                weekdayOnly,
                        },
                });
        }

        setDescription(description: string): SchedulerItem {
                syslib.mass([{
                        class: syslib.model.classes.SchedulerItem,
                        operation: syslib.model.codes.MassOp.UPDATE,
                        path: this.path.absolutePath(),
                        ObjectDescription: description,
                }]);
                return this;
        }

        static seconds(path: string | number | Path, every: number, start?: string): SchedulerItem {
                return new SchedulerItem(path, {
                        recurrence: {
                                kind: "second",
                                every,
                                start,
                        },
                });
        }

        static minutes(path: string | number | Path, every: number, start?: string): SchedulerItem {
                return new SchedulerItem(path, {
                        recurrence: {
                                kind: "minute",
                                every,
                                start,
                        },
                });
        }

        static hours(path: string | number | Path, every: number, start?: string): SchedulerItem {
                return new SchedulerItem(path, {
                        recurrence: {
                                kind: "hour",
                                every,
                                start,
                        },
                });
        }

        static days(path: string | number | Path, every: number, start?: string, weekdayOnly?: boolean): SchedulerItem {
                return new SchedulerItem(path, {
                        recurrence: {
                                kind: "day",
                                every,
                                start,
                                weekdayOnly,
                        },
                });
        }

        static appendable(parent: IObject, name: string, opts?: SchedulerItemOptions): SchedulerItem {
                return new SchedulerItem(parent.path.absolutePath() + "/" + name, opts);
        }
}