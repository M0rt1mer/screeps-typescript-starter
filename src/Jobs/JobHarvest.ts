import { AJob, JobStatus } from "./AJob";

export class JobHarvest extends AJob {

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
      source = creep.room.find(FIND_SOURCES)[0];
      this.targetId = source.id;
    }

    //do harvesting
    if (source) {
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
