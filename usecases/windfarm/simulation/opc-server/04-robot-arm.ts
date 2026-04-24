// // 04-robot-arm.ts
// // Robotic Arm with two joints and a gripper
// import * as opcua from "node-opcua";

// export function setupRobotArmExample(server: opcua.OPCUAServer) {
//     let joint1Position = 0.0;
//     const addressSpace= server.engine.addressSpace;
//     if (!addressSpace) {
//         throw new Error("AddressSpace not initialized");
//     }
//     const rootObjects = addressSpace.rootFolder.objects;
//     const namespace = addressSpace.getOwnNamespace();


//     // Create RobotArm object
//     const robotArm = namespace.addObject({
//         browseName: "RobotArm",
//         organizedBy: rootObjects
//     });

//     namespace.addView({browseName: "RobotArmView", organizedBy: rootObjects});
//     // Create Joint1 variable
//     const joint1 = namespace.addVariable(
//         {
//             browseName: "Joint1",
//             dataType: opcua.DataType.Double,
//             componentOf: robotArm,
//             value: {
//                 get: () => {
//                     return new opcua.Variant({ dataType: opcua.DataType.Double, value: Math.random() * 180 });
//                 }
//             }
//         }
//     )

//     // Create Joint2 variable
//     let joint2Position = 0.0;
//     const joint2 = namespace.addVariable(
//         {
//             browseName: "Joint2",
//             dataType: opcua.DataType.Double,
//             componentOf: robotArm,
//             value: {
//                 get: () => {
//                     joint2Position += 1.0;
//                     if (joint2Position > 90.0) {
//                         joint2Position = 0.0;
//                     }
//                     return new opcua.Variant({ dataType: opcua.DataType.Double, value: joint2Position });
//                 },
//                 set: (variant: opcua.Variant) => {
//                     joint2Position = variant.value;
//                     return opcua.StatusCodes.Good;
//                 }
//             }
//         }
//     );

//     const folder = namespace.addFolder( rootObjects, { browseName: "Controls" });
//     folder.addReference({
//         referenceType: "Organizes",
//         nodeId: robotArm.nodeId
//     });

//     // Create Gripper variable
//     const gripper = namespace.addVariable(
//         {
//             browseName: "Gripper",
//             dataType: opcua.DataType.Boolean,
//             componentOf: robotArm,
//             accessLevel: opcua.makeAccessLevelFlag("CurrentRead | CurrentWrite"),
//             value: {
//                 get: () => {
//                     return new opcua.Variant({ dataType: opcua.DataType.Boolean, value: Math.random() > 0.5 });
//                 }
//             }
//         }
//     );


//    // add a method to reset the robot arm
//    namespace.addMethod(robotArm, {
//        browseName: "Reset",
//        inputArguments: [],
//        outputArguments: []
//      }).bindMethod((inputArguments: unknown[], context: unknown, callback: (err: Error | null, result: { statusCode: opcua.StatusCode; outputArguments: opcua.Variant[]; }) => void) => {
//        joint1Position = 0.0;
//        joint1.setValueFromSource({ dataType: opcua.DataType.Double, value: joint1Position });
//          joint2Position = 0.0;
//        gripper.setValueFromSource({ dataType: opcua.DataType.Boolean, value: false });

//        const callMethodResult = {
//            statusCode: opcua.StatusCodes.Good,
//            outputArguments: []
//        };
//        callback(null, callMethodResult);
//    });




// }


