import { AJob, JobStatus } from "Jobs/AJob";
import { Strategy } from "Strategy/StrategyInterface";
import { TaskHarvest } from "TaskSystem/Tasks/TaskHarvest";
import { TaskStatus, Task } from "TaskSystem/Task";
import { JobSimpleTask } from "./JobSimpleTask";
import { MathUtils } from "utils/MathUtils";

export class JobHarvestTask extends JobSimpleTask<TaskHarvest> {

  GetJobIcon(): string {
    return "⛏";
  }

  FindTask(creep: Creep, memory: CreepMemory): [TaskHarvest | undefined, number] {
    console.log("Searching for harvest tasks");
    let task = MathUtils.PickRandom(Strategy.taskManager.FindTaskTyped(TaskHarvest));
    let myWorkCapacity = _.sum(creep.body, (body: BodyPartDefinition) => { return body.type == WORK ? 1 : 0; });
    return [task, myWorkCapacity];
  }

}

JobHarvestTask.RegisterVirtualClass();
