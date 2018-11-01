import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { SimpleRole, DisabledJobsMap } from "./SimpleRole";
import { JobTakeEnergy } from "Jobs/JobTakeEnergy";
import { JobTransferTask } from "Jobs/JobTransferTask";
import { JobTaskWork } from "Jobs/JobTaskWork";

export class Worker extends SimpleRole{

  DecideJob(creep: Creep, disabledJobs: DisabledJobsMap): AJob {

    if (creep.carry.energy > 0) {
      if (Strategy.supplyStrategy.ShouldUpgrade()) {
        return new JobTaskWork();
      }
      else {
        return new JobTransferTask();
      }
    }
    else {
      return new JobTakeEnergy();
    }

  }

}

Worker.RegisterVirtualClass();

export function DesignIdealWorker(): BodyPartConstant[] {
  return [MOVE,CARRY,WORK,MOVE,CARRY,WORK,CARRY,WORK,MOVE,CARRY,WORK];
}
