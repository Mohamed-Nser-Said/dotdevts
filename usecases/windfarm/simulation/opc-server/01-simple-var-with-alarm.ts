import { DataType, Variant, OPCUAServer, standardUnits } from "node-opcua";

export function NodeWithAlarm(server: OPCUAServer): NodeJS.Timeout {
  const addressSpace = server.engine.addressSpace;
  if (!addressSpace) {
    throw new Error("AddressSpace not initialized");
  }
  const namespace = addressSpace.getOwnNamespace();
  const rootObjects = addressSpace.rootFolder.objects;

  // Setup ConditionRefresh method
  const method = addressSpace.findNode("ns=0;i=3875");


  // Create temperature variable
  const temperature = namespace.addAnalogDataItem({
    browseName: "Temperature",
    dataType: DataType.Double,
    organizedBy: rootObjects,
    engineeringUnits: standardUnits.degree_celsius,
    accessLevel: "CurrentRead | HistoryRead | HistoryWrite",
    userAccessLevel: "CurrentRead | HistoryRead | HistoryWrite",
    value: new Variant({ dataType: DataType.Double, value: 25.0 })
  });

   addressSpace.installHistoricalDataNode(temperature, {maxOnlineValues: 5000});

  // Start event generation (every 15 seconds)
  let alarmNumber = 0;
  const interval = setInterval(() => {
    alarmNumber++;
    const newTemp = 20 + Math.random() * 25;
    temperature.setValueFromSource(new Variant({
      dataType: DataType.Double,
      value: newTemp
    }));
    addressSpace.rootFolder.objects.server.raiseEvent("BaseEventType", {
      message: new Variant({
        dataType: DataType.LocalizedText,
        value: {
          locale: "en",
          text: `Alarm #${alarmNumber}: Temperature is ${newTemp.toFixed(1)}°C`
        }
      })
    });
  }, 15000);

  return interval;
}

