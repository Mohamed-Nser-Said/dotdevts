import { OPCUAServer } from "node-opcua";
import { Site } from "./Site";

export function registerWindFarm(server: OPCUAServer): void {
  const addressSpace = server.engine.addressSpace;
  if (!addressSpace) {
    throw new Error("AddressSpace is not initialized");
  }

  const namespace = addressSpace.getOwnNamespace();
  const objectsFolder = addressSpace.rootFolder.objects;

  const site = new Site(namespace, objectsFolder, "WindFarm_01");

  const t1 = site.addTurbine("Turbine_01");
  const t2 = site.addTurbine("Turbine_02");

  // local control still works too
  t1.start();
  t2.stop();
}