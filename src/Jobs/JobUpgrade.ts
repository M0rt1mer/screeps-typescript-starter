import { AJob, JobStatus } from "Jobs/AJob";

export class JobUpgrade extends AJob {

  GetJobIcon(): string {
    return "⬆";
  }

  controllerId: string | undefined = undefined;

  Perform(creep: Creep, memory: CreepMemory): JobStatus {

    //check for finished
    if (creep.carry.energy == 0) {
      return JobStatus.FINISHED;
    }

    let controller: StructureController | undefined | null = undefined;
    if (this.controllerId) {
      controller = Game.getObjectById(this.controllerId);
    }
    else {
      controller = creep.room.find<StructureController>(FIND_MY_STRUCTURES)[0];
    }

    //do upgrading
    if (controller) {
      this.controllerId = controller.id;
      if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, { visualizePathStyle: { stroke: '#ff0000' } });
      }
      return JobStatus.CONTINUE;
    }
    //failed to find/load controller
    else {
      return JobStatus.FAILED;
    }

  }


}

JobUpgrade.RegisterVirtualClass();
