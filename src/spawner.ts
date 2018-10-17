import { Harvester } from "Roles/Harvester";
import { Supply } from "Strategy/Supply";

export class MySpawner {

  static Run() : void {

    for (var name in Game.spawns) {

      let spawner = Game.spawns[name];
      if (spawner.spawning) {
        spawner.room.visual.text(spawner.spawning.name, spawner.pos.x, spawner.pos.y);
      }
      else if (Supply.ShouldSpawnHarvester()) {
        spawner.spawnCreep([MOVE, WORK, CARRY], "Creep" + this.GetNextFreeId(), { memory : new Harvester() } );
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
