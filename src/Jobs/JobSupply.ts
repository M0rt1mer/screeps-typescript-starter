import { AJob, JobStatus } from "./AJob";

export class JobSupply extends AJob {

    targetId: string | undefined = undefined;

    Perform(creep: Creep, memory: CreepMemory): JobStatus {

      //check for finished
      if (creep.carry.energy == 0) {
        return JobStatus.FINISHED;
      }

      let sink: StructureExtension | StructureSpawn | undefined | null = undefined;
      if (this.targetId) {
        sink = Game.getObjectById(this.targetId);
      }
      else {
        var filterFunc = (structure: AnyOwnedStructure) => {
          if (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION ) {
            return structure.energy < structure.energyCapacity;
          }
          return false;
        }
        sink = <StructureSpawn>creep.room.find(FIND_MY_STRUCTURES, { filter: filterFunc })[0];
        this.targetId = sink.id;
      }

      //do supply
      if (sink) {
        if (creep.transfer(sink, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sink, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
        return JobStatus.CONTINUE;
      }
      //failed to find/load source
      else {
        return JobStatus.FAILED;
      }

    }

}

JobSupply.RegisterVirtualClass();
