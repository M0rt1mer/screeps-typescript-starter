import { AJob, JobStatus } from "Jobs/AJob";

export class JobBuild extends AJob {

    GetJobIcon(): string {
      return "⚒";
    }

    constrSiteId: string | undefined = undefined;

    Perform(creep: Creep, memory: CreepMemory): JobStatus {

      //check for finished
      if (creep.carry.energy == 0) {
        return JobStatus.FINISHED;
      }

      let constrSite: ConstructionSite | undefined | null = undefined;
      if (this.constrSiteId) {
        constrSite = Game.getObjectById(this.constrSiteId);
      }
      else {
        constrSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
      }

      //do upgrading
      if (constrSite) {
        this.constrSiteId = constrSite.id;
        if (creep.build(constrSite) === ERR_NOT_IN_RANGE) {
          creep.moveTo(constrSite, { visualizePathStyle: { stroke: '#00ffff' } });
        }
        return JobStatus.CONTINUE;
      }
      //failed to find/load controller
      else {
        return JobStatus.FAILED;
      }

    }


}

JobBuild.RegisterVirtualClass();
