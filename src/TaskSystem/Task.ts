import { VirtualClass } from "utils/VirtualClass";

export enum TaskStatus {
  Done = 1,
  NotDone = 2,
  Failed = 3
}

export abstract class Task extends VirtualClass{

  abstract CalculateTaskCapacity(): number;

  abstract GetTaskCreepCapacity(): number;

  abstract PerformTask(creep: Creep): TaskStatus;

  abstract GetTaskId(): string;

  abstract GetCreepCapacity(creep: Creep): number;

}
