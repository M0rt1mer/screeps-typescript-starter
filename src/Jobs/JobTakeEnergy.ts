import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { MathUtils } from "utils/MathUtils";

export class JobTakeEnergy extends AJob {

  GetJobIcon(): string {
    return "🔋";
  }

  containerId: string | undefined = undefined;

  Perform(creep: Creep, memory: CreepMemory): JobStatus {

    //check for finished
    if (creep.carry.energy == creep.carryCapacity) {
      return JobStatus.FINISHED;
    }

    let container: StructureContainer | null = null;
    if (!this.containerId) {
      let filter = (structure: AnyStructure) => { return structure instanceof StructureContainer; };
      let containers = creep.room.find<StructureContainer>(FIND_STRUCTURES, { filter: filter });
      console.log("# containers: " + containers.length);
      container = MathUtils.PickRandom(containers);
      if (container) {
        this.containerId = container.id;
      }
    }
    else{
      container = Game.getObjectById<StructureContainer>(this.containerId);
    }

    if (container) {
      if (!creep.pos.inRangeTo(container.pos, 1)) {
        creep.moveTo(container);
      }
      creep.withdraw(container, RESOURCE_ENERGY);

      return JobStatus.CONTINUE;
    }
    //failed to find/load controller
    else {
      return JobStatus.FAILED;
    }

  }

}

JobTakeEnergy.RegisterVirtualClass();
