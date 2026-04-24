// 03-create-references.ts
import { DataType, OPCUAServer } from "node-opcua";

/**
 * Create a minimal reference structure:
 *   ObjectsFolder -(Organizes)-> Demo
 *   Demo -(Organizes)-> Device1
 *   Device1 -(HasComponent)-> Temperature
 *   Temperature -(HasProperty)-> EngineeringUnits
 */
export function setupReferenceExamples(server: OPCUAServer): {
  demoFolder: any;
  device1: any;
  temperature: any;
  engUnits: any;
} {
  const addressSpace = server.engine.addressSpace;
  if (!addressSpace) throw new Error("AddressSpace not initialized yet");
  const namespace = addressSpace.getOwnNamespace();

  // 1) A folder under Objects (creates an "Organizes" reference)
  const demoFolder = namespace.addFolder(addressSpace.rootFolder.objects, {
    browseName: "Demo",
  });

  // 2) A device object inside Demo (also "Organizes")
  const device1 = namespace.addObject({
    organizedBy: demoFolder,      // -> Demo Organizes Device1
    browseName: "Device1",
    nodeId: "ns=1;s=Device1",     // optional stable NodeId
  });

  // 3) A temperature variable that is a PART of Device1 ("HasComponent")
  const temperature = namespace.addVariable({
    componentOf: device1,                           // -> Device1 HasComponent Temperature
    browseName: "Temperature",
    nodeId: "ns=1;s=Device1.Temperature",           // optional stable NodeId
    dataType: "Double",
    value: { dataType: DataType.Double, value: 23.5 },
  });

  // 4) A simple property attached to Temperature ("HasProperty")
  const engUnits = namespace.addVariable({
    propertyOf: temperature,                        // -> Temperature HasProperty EngineeringUnits
    browseName: "EngineeringUnits",
    dataType: "String",
    value: { dataType: DataType.String, value: "°C" },
  });

  // (Optional) make Temperature writable from clients:
  // temperature.writeValue = ... (or use a get/set valueFactory); keeping it simple here.

  // Helpful console output
  console.log("Created reference demo:");
  console.log("  Demo folder           :", demoFolder.nodeId.toString());
  console.log("  Device1 object        :", device1.nodeId.toString());
  console.log("  Temperature variable  :", temperature.nodeId.toString());
  console.log("  EngineeringUnits prop :", engUnits.nodeId.toString());

  return { demoFolder, device1, temperature, engUnits };
}

