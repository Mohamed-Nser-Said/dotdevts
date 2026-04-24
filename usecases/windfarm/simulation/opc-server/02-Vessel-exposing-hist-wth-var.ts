import * as opcua from "node-opcua";
import { OPCUAServer } from "node-opcua";

export function setupHistoricalDataNode(server: OPCUAServer): void {
  const addressSpace = server.engine.addressSpace;
  if (!addressSpace) {
    throw new Error("AddressSpace not initialized");
  }


  
  
  const namespace = addressSpace.getOwnNamespace();

  const vessel = namespace.addObject({
    browseName: "VesselX",
    organizedBy: addressSpace.rootFolder.objects
  });

  const vesselPressure = namespace.addAnalogDataItem({
    browseName: "Pressure",
    engineeringUnitsRange: {
      low: 0,
      high: 10.0
    },
    engineeringUnits: opcua.standardUnits.bar,
    componentOf: vessel,
    accessLevel: "CurrentRead | HistoryRead | HistoryWrite",
    userAccessLevel: "CurrentRead | HistoryRead | HistoryWrite",
    dataType: "Double",
  });

  addressSpace.installHistoricalDataNode(vesselPressure, {maxOnlineValues: 5000});

  // simulate pressure change
  let t = 0;
  setInterval(function () {

    const value = (Math.sin(t / 50) * 0.70 + Math.random() * 0.20) * 5.0 + 5.0;
    vesselPressure.setValueFromSource({ dataType: "Double", value: value }, opcua.StatusCodes.Good, new Date());
    t = t + 1;
  }, 200);
}

