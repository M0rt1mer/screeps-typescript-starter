import { DesignIdealHarvester, Harvester } from "Roles/Harvester";
import { Strategy } from "Strategy/StrategyInterface";
import { DesignIdealTransporter, Transporter } from "Roles/Transporter";
import { DesignIdealWorker, Worker } from "Roles/Worker";

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
        let bodyParts = this.CalcBestPossibleFromTemplate(DesignIdealHarvester(), availableEnergy);
        if (spawner.spawnCreep(bodyParts, "H" + this.GetNextFreeId(), { memory: new Harvester() }) == OK) {
          this.BumpNextFreeId();
        }
      }
      else if (Strategy.supplyStrategy.ShouldSpawnWorker()) {
        let bodyParts = this.CalcBestPossibleFromTemplate(DesignIdealWorker(), availableEnergy);
        if (spawner.spawnCreep(bodyParts, "W" + this.GetNextFreeId(), { memory: new Worker() }) == OK) {
          this.BumpNextFreeId();
        }
      }
      else if (Strategy.supplyStrategy.ShouldSpawnTransporter()) {
        let bodyParts = this.CalcBestPossibleFromTemplate(DesignIdealTransporter(), availableEnergy);
        if (spawner.spawnCreep(bodyParts, "T" + this.GetNextFreeId(), { memory: new Transporter() }) == OK) {
          this.BumpNextFreeId();
        }
      }

    }

  }

  static GetNextFreeId(): number {
    if (!Memory.nextFreeId) {
      Memory.nextFreeId = 0;
    }
    return Memory.nextFreeId;
  }

  static BumpNextFreeId() {
    Memory.nextFreeId += 1;
  }

  static CalcBestPossibleFromTemplate(template: BodyPartConstant[], availableEnergy: number) : BodyPartConstant[] {
    let finalTemplate: BodyPartConstant[] = [];
    let remainingEnergy = availableEnergy;
    for (let bodyPart of template) {
      if (BODYPART_COST[bodyPart] <= remainingEnergy) {
        finalTemplate.push(bodyPart);
        remainingEnergy -= BODYPART_COST[bodyPart];
      }
    }
    return finalTemplate;
  }

}
