import { IsTypeOf } from "utils/virtual";
import { Harvester } from "Roles/harvester";

export class Supply {


  static numHarvesters: number;

  static Precalculate() {

    this.numHarvesters = _(Memory.creeps).filter((memory: CreepMemory) => { return IsTypeOf(memory, Harvester); }).size();

  }

  static ShouldSpawnHarvester(): boolean{
    return this.numHarvesters < 3;
  }

  static ShouldUpgrade(): boolean {
    return !this.ShouldSpawnHarvester();
  }

}
