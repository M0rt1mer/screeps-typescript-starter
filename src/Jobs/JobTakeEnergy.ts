import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { MathUtils } from "utils/MathUtils";

export class JobTakeEnergy extends AJob {

  GetJobIcon(): string {
    return "⬆";
  }

  harvesterName: string | undefined = undefined;

  Perform(creep: Creep, memory: CreepMemory): JobStatus {

    //check for finished
    if (creep.carry.energy == creep.carryCapacity) {
      return JobStatus.FINISHED;
    }

    let harvester: Creep | undefined = undefined;
    if (!this.harvesterName) {
      this.harvesterName = MathUtils.PickRandom(Strategy.supplyStrategy.GetHarvesterList());
    }
    if (this.harvesterName) {
      harvester = Game.creeps[this.harvesterName];
    }

    if (harvester) {
      if (!creep.pos.inRangeTo(harvester.pos, 1)) {
        creep.moveTo(harvester);
      }
      harvester.transfer(creep, RESOURCE_ENERGY);

      return JobStatus.CONTINUE;
    }
    //failed to find/load controller
    else {
      return JobStatus.FAILED;
    }

  }

}

JobTakeEnergy.RegisterVirtualClass();
