import { Strategy } from "Strategy/StrategyInterface";
import { TaskRepair } from "TaskSystem/Tasks/TaskRepair";

export function UpdateTowers() {

  for (let roomId in Game.rooms) {
    let room = Game.rooms[roomId];
    let towers = room.find(FIND_MY_STRUCTURES);
    for (let tower of towers) {

      if (!(tower instanceof StructureTower)) {
        continue;
      }

      let repairTasks = Strategy.taskManager.FindTaskTyped(TaskRepair);
      let closestRepair = _.min(repairTasks, (task: TaskRepair) => {
        return (<Structure>Game.getObjectById(task.structureId)).pos.getRangeTo(tower.pos);
      });

      if (closestRepair) {
        let repairTarget = Game.getObjectById(closestRepair.structureId);
        if (repairTarget instanceof Structure) {
          tower.repair(repairTarget);
        }
      }
    }

  }
  

}
