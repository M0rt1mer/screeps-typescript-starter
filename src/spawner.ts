import { DesignHarvester } from "Roles/Harvester";
import { Strategy } from "Strategy/StrategyInterface";
import { DesignTransporter } from "Roles/Transporter";

export class MySpawner {

  static Run() : void {

    for (var name in Game.spawns) {

      let spawner = Game.spawns[name];
      let availableEnergy = Game.spawns[name].room.energyCapacityAvailable;
      //if low on harvesters, only use current energy
      if (Strategy.supplyStrategy.GetHarvesterList().length < 2) {
        availableEnergy = Math.max( Game.spawns[name].room.energyAvailable, 200);
      }

      if (spawner.spawning) {
        spawner.room.visual.text(spawner.spawning.name, spawner.pos.x, spawner.pos.y);
      }
      else if (Strategy.supplyStrategy.ShouldSpawnHarvester()) {
        //spawner.spawnCreep([WORK, WORK, MOVE, CARRY], "Creep" + this.GetNextFreeId(), { memory: new Harvester() });
        let [bodyParts, creepName, options] = DesignHarvester(availableEnergy, this.GetNextFreeId());
        spawner.spawnCreep(bodyParts, creepName, options);
      }
      else if (Strategy.supplyStrategy.ShouldSpawnTransporter()) {
        let [bodyParts, creepName, options] = DesignTransporter(availableEnergy, this.GetNextFreeId());
        spawner.spawnCreep(bodyParts, creepName, options);
      }

    }

  }

  static GetNextFreeId(): number {
    if (!Memory.nextFreeId) {
      Memory.nextFreeId = 0;
    }
    return ++Memory.nextFreeId;
  }

}
