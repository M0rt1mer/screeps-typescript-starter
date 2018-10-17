import { ErrorMapper } from "utils/ErrorMapper";
import { MySpawner } from "spawner";
import { CreepRole } from "CreepRole";
import { VirtualClass, Construct_cast } from "utils/virtual";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  //console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
    else {
      console.log("Updateing " + name);
      let role: CreepRole | undefined = Construct_cast<CreepRole>(Memory.creeps[name]);
      if (role) {
        role.Update(Game.creeps[name]);
      }
    }
  }

  MySpawner.Run();

});
