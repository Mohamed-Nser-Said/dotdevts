import { OPCUAServer } from "node-opcua";
import { registerWindFarm } from "./registerWindFarm";

async function main(): Promise<void> {
  const server = new OPCUAServer({
    port: 4840,
    resourcePath: "/ua/windfarm",
    buildInfo: {
      productName: "WindFarmServer",
      buildNumber: "1",
      buildDate: new Date()
    }
  });

  await server.initialize();

  registerWindFarm(server);

  await server.start();

  console.log("OPC UA server is running");
  console.log("Endpoint:", server.getEndpointUrl());
}

main().catch((error) => {
  console.error("Failed to start server:", error);
});