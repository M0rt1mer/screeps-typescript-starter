import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { SimpleRole, DisabledJobsMap } from "./SimpleRole";
import { JobTakeEnergy } from "Jobs/JobTakeEnergy";
import { JobTransferTask } from "Jobs/JobTransferTask";
import { JobTaskWork } from "Jobs/JobTaskWork";

export class Transporter extends SimpleRole{

  DecideJob(creep: Creep, disabledJobs: DisabledJobsMap): AJob {

    if (creep.carry.energy > 0) {
      return new JobTransferTask();
    }
    else {
      return new JobTakeEnergy();
    }

  }

}

Transporter.RegisterVirtualClass();

export function DesignIdealTransporter(): BodyPartConstant[] {
  return [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY];
}
