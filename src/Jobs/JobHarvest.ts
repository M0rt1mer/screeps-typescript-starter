import { AJob, JobStatus } from "Jobs/AJob";
import { MathUtils } from "utils/MathUtils";

export class JobHarvest extends AJob {

  GetJobIcon(): string {
    return "⛏";
  }

  targetId: string | undefined = undefined;

  Perform(creep: Creep, memory: CreepMemory): JobStatus {

    //check for finished
    if (creep.carry.energy == creep.carryCapacity) {
      return JobStatus.FINISHED;
    }

    let source: Source | undefined | null = undefined;
    if (this.targetId) {
      source = Game.getObjectById(this.targetId);
    }
    else {
      let sources = creep.room.find(FIND_SOURCES);
      source = MathUtils.PickRandom(sources);
    }

    //do harvesting
    if (source) {
      this.targetId = source.id;
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
      return JobStatus.CONTINUE;
    }
    //failed to find/load source
    else {
      return JobStatus.FAILED;
    }

  }

}

JobHarvest.RegisterVirtualClass();
