import { CreepRole } from "CreepRole";
import { AJob, JobStatus } from "Jobs/AJob";

export type DisabledJobsMap = { [id: string]: number }

export abstract class SimpleRole extends CreepRole {

  //Decides on next job. May be called multiple times per frame, if previous job fails
  abstract DecideJob(creep: Creep, disabled: DisabledJobsMap ): AJob;

  job: AJob | undefined = undefined;

  disabledJobs: DisabledJobsMap = {};

  Update(creep: Creep): void {

    if (!this.disabledJobs) {
      this.disabledJobs = {};
    }

    for (var typeId in this.disabledJobs) {
      this.disabledJobs[typeId]--;
      if (this.disabledJobs[typeId] < 1) {
        delete this.disabledJobs[typeId];
      }
    }

    if (!this.job) {
      this.job = this.DecideJob(creep, this.disabledJobs);
    }

    if (this.job) {
      AJob.Construct(this.job);
      this.PerformJob(creep);
    }

  }

  PerformJob(creep: Creep) {
    if (this.job) {
      let status: JobStatus = this.job.Perform(creep, this);
      if (status == JobStatus.FINISHED) {
        console.log("Job " + this.job.GetTypeName() + " finished");
        this.job = this.DecideJob(creep, this.disabledJobs);
        //this.PerformJob(creep);
      }
      else if (status == JobStatus.FAILED) {
        this.disabledJobs[this.job.GetTypeName()] = 1;
        this.job = this.DecideJob(creep, this.disabledJobs);
      }
      else if (status == JobStatus.CONTINUE) {
        creep.room.visual.text(this.job.GetJobIcon(), creep.pos.x, creep.pos.y);
      }
    }
  }

  

}
