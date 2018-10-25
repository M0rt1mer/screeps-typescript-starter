import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { SimpleRole, DisabledJobsMap } from "./SimpleRole";
import { JobTakeEnergy } from "Jobs/JobTakeEnergy";
import { JobTransferTask } from "Jobs/JobTransferTask";
import { JobTaskWork } from "Jobs/JobTaskWork";

export class Transporter extends SimpleRole{

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

Transporter.RegisterVirtualClass();

export function DesignTransporter(maxEnergy: number, creepId: number): [BodyPartConstant[], string, SpawnOptions] {
  let numWorks = Math.floor((maxEnergy - 100) / 100);
  numWorks = Math.min(numWorks, 7);
  let result: BodyPartConstant[] = Array<BodyPartConstant>(numWorks);
  _.fill(result, WORK, 0, numWorks + 1)
  result = result.concat([MOVE, CARRY]);
  let options = { memory: new Transporter() };
  return [result, "Transporter" + creepId, options];
}
