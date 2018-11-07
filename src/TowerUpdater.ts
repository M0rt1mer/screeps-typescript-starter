import { Strategy } from "Strategy/StrategyInterface";
import { TaskRepair } from "TaskSystem/Tasks/TaskRepair";

export function UpdateTowers() {

  for (let roomId in Game.rooms) {
    let room = Game.rooms[roomId];

    let enemies = room.find(FIND_HOSTILE_CREEPS);

    if (enemies.length > 0) {
      UpdateInCombat(room, enemies);
    }
    else {
      UpdateInCombat(room, enemies);
    }
   

  }
  

}

const TOWER_OPTIMAL_RANGE = 5;
const TOWER_FALLOFF_RANGE = 20;
const TOWER_MAX_DAMAGE = 600;
const TOWER_MIN_DAMAGE = 150;


function UpdateInCombat(room: Room, enemies: Creep[]) {

  let towers = room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: (structure: AnyOwnedStructure) => { return structure.structureType == STRUCTURE_TOWER } });

  let damagePotential: { [id: string]: number } = {};
  let priorityCreeps: string[] = [];

  for (let enemy of enemies) {
    damagePotential[enemy.id] = 0;
    for (let tower of towers) {
      let distance = tower.pos.getRangeTo(enemy);
      damagePotential[enemy.id] += (Math.min(Math.max(distance, TOWER_OPTIMAL_RANGE), TOWER_FALLOFF_RANGE) - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE) * TOWER_MAX_DAMAGE + TOWER_MIN_DAMAGE;
      if (enemy.getActiveBodyparts(HEAL) > 0) {
        priorityCreeps.push(enemy.id);
      }
    }
  }

  if (priorityCreeps.length > 0) {
    let target = _.max(Object.keys(damagePotential), (id: string) => { return _.contains(priorityCreeps, id) ? damagePotential[id] : 0; });
    let targetCreep = Game.getObjectById<Creep>(target);
    if (targetCreep) {
      for (let tower of towers) {
        tower.attack(targetCreep);
      }
    }
  }
  else {
    let target = _.max(Object.keys(damagePotential), (id: string) => { return damagePotential[id]; });
    let targetCreep = Game.getObjectById<Creep>(target);
    if (targetCreep) {
      for (let tower of towers) {
        tower.attack(targetCreep);
      }
    }
  }

}

function UpdateOutOfCombat( room : Room ) {
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
