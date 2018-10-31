import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { SimpleRole, DisabledJobsMap } from "./SimpleRole";
import { JobHarvestTask } from "Jobs/JobHarvestTask";
import { JobTransferTask } from "Jobs/JobTransferTask";
import { JobTaskWork } from "Jobs/JobTaskWork";

export class Harvester extends SimpleRole{

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
      return new JobHarvestTask();
    }

  }

}

Harvester.RegisterVirtualClass();

export function DesignHarvester(maxEnergy: number, creepId : number): [BodyPartConstant[], string, SpawnOptions] {
  let numWorks = Math.floor((maxEnergy - 100) / 100);
  numWorks = Math.min(numWorks, 7);
  let result: BodyPartConstant[] = Array<BodyPartConstant>(numWorks);
  _.fill(result, WORK, 0, numWorks + 1)
  result = result.concat([MOVE, CARRY]);
  let options = { memory: new Harvester() };
  return [result, "H" + creepId, options];
}
