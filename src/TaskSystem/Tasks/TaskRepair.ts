import { TaskStatus } from "TaskSystem/Task";
import { TaskWork } from "./TaskWork";

declare const energyToHPRepairRation = 20;

export class TaskRepair extends TaskWork {

  structureId: string;

  constructor(site: AnyStructure) {
    super();
    this.structureId = site.id;
  }

  CalculateTaskCapacity(): number {
    let site = <AnyStructure>Game.getObjectById(this.structureId);
    return (site.hitsMax - site.hits) / energyToHPRepairRation;
  }

  GetTaskCreepCapacity(): number {
    return 1;
  }

  PerformTask(creep: Creep): TaskStatus {

    if (creep.carry.energy == 0) {
      return TaskStatus.Done;
    }

    let structure = Game.getObjectById<AnyStructure>(this.structureId);
    if (structure) {
      if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
        creep.moveTo(structure, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
      return TaskStatus.NotDone;
    }

    //if all else fails
    return TaskStatus.Failed;
  }

  GetCreepCapacity(creep: Creep): number {
    return creep.carry.energy;
  }

  // TASK ID
  GetTaskId(): string {
    return TaskRepair.GetTaskIdFromStructureId(this.structureId);
  }

  static GetTaskIdFromStructure(structure: AnyStructure) {
    return this.GetTaskIdFromStructureId(structure.id);
  }

  static GetTaskIdFromStructureId(structureId: string) {
    return structureId;
  }


}

TaskRepair.RegisterVirtualClass();
