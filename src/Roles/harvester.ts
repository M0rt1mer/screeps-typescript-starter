import { CreepRole } from "CreepRole";
import { VirtualClass, Construct_cast } from "utils/virtual";
import { AJob, JobStatus } from "Jobs/AJob";
import { JobSupply } from "Jobs/JobSupply";
import { JobHarvest } from "Jobs/JobHarvest";
import { Supply } from "Strategy/Supply";
import { JobUpgrade } from "Jobs/JobUpgrade";

export class Harvester extends CreepRole{

  job: AJob | undefined = undefined;

  Update(creep: Creep): void {

    if (!this.job) {
      this.job = this.DecideJob(creep);
    }

    if (this.job) {
      Construct_cast<AJob>(this.job);
      this.PerformJob(creep);
    }

  }

  PerformJob(creep: Creep) {
    if (this.job) {
      let status: JobStatus = this.job.Perform(creep, this);
      if (status == JobStatus.FINISHED) {
        this.job = this.DecideJob(creep);
        this.PerformJob(creep);
      }
      else if (status == JobStatus.FAILED) {
        this.job = this.DecideJob(creep);
      }
    }
  }

  DecideJob(creep: Creep): AJob {

    if (creep.carry.energy > 0) {
      if (Supply.ShouldUpgrade()) {
        return new JobUpgrade();
      }
      else {
        return new JobSupply();
      }
    }
    else {
      return new JobHarvest();
    }

  }

}

Harvester.RegisterVirtualClass();
