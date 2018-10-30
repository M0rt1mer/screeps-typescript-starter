import { Task, TaskStatus } from "TaskSystem/Task";
import { TaskWork } from "./TaskWork";

export class TaskUpgrade extends TaskWork {

  controllerId: string;

  constructor(controller: StructureController) {
    super();
    this.controllerId = controller.id;
  }

  CalculateTaskCapacity(): number {
    return 15;
  }

  GetTaskCreepCapacity(): number {
    return 5;
  }

  PerformTask(creep: Creep): TaskStatus {

    if (creep.carry.energy == 0) {
      return TaskStatus.Done;
    }

    let controller = Game.getObjectById<StructureController>(this.controllerId);
    if (controller) {
      if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
      return TaskStatus.NotDone;
    }

    //if all else fails
    return TaskStatus.Failed;
  }

  GetCreepCapacity(creep: Creep): number {
    return _.sum(creep.body, (body: BodyPartDefinition) => { return body.type == WORK ? 1 : 0; });
  }


  CheckStillValid(): boolean {
    return Game.getObjectById(this.controllerId) !== undefined;
  }

  // TASK ID
  GetTaskId(): string {
    return TaskUpgrade.GetTaskIdFromControllerId(this.controllerId);
  }

  static GetTaskIdFromController(controller: StructureController) {
    return this.GetTaskIdFromControllerId(controller.id);
  }

  static GetTaskIdFromControllerId(controllerId: string) {
    return controllerId;
  }

}

TaskUpgrade.RegisterVirtualClass();
