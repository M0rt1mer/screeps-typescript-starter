import { ErrorMapper } from "utils/ErrorMapper";
import { MySpawner } from "spawner";
import { CreepRole } from "CreepRole";
import { Strategy } from "Strategy/StrategyInterface";
import "main-include";
import { DebugTasks } from "TaskSystem/TaskDebug";
import { UpdateTowers } from "TowerUpdater";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  //console.log(`Current game tick is ${Game.time}`);

  //clear memory
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  //clear tasks
  Strategy.taskManager.RefreshState();

  //precalculate
  Strategy.supplyStrategy.Precalculate();

  UpdateTowers();
  for (const name in Memory.creeps) {
    let role = CreepRole.Construct(Memory.creeps[name]);
    if (role) {
      role.Update(Game.creeps[name])
    }
  }

  MySpawner.Run();

  DebugTasks();

});
