import {
  Namespace,
  UAObject,
  UAMethod,
  UAVariable,
  Variant,
  DataType,
  StatusCodes
} from "node-opcua";
import type { Site } from "./Site";

export class Turbine {
  public node: UAObject;
  public runningNode: UAVariable;

  private startMethod: UAMethod;
  private stopMethod: UAMethod;

  private running = false;

  constructor(
    private namespace: Namespace,
    private site: Site,
    public name: string
  ) {
    this.node = this.namespace.addObject({
      componentOf: this.site.node,
      browseName: this.name
    });

    const status = this.namespace.addObject({
      componentOf: this.node,
      browseName: "Status"
    });

    this.runningNode = this.namespace.addVariable({
      componentOf: status,
      browseName: "Running",
      dataType: "Boolean",
      value: {
        get: () =>
          new Variant({
            dataType: DataType.Boolean,
            value: this.running
          })
      }
    });

    this.startMethod = this.namespace.addMethod(this.node, {
      browseName: "Start",
      inputArguments: [],
      outputArguments: [
        {
          name: "Success",
          dataType: DataType.Boolean
        }
      ]
    });

    this.stopMethod = this.namespace.addMethod(this.node, {
      browseName: "Stop",
      inputArguments: [],
      outputArguments: [
        {
          name: "Success",
          dataType: DataType.Boolean
        }
      ]
    });

    this.startMethod.bindMethod((_inputArguments, _context, callback) => {
      this.start();
      callback(null, {
        statusCode: StatusCodes.Good,
        outputArguments: [
          new Variant({
            dataType: DataType.Boolean,
            value: true
          })
        ]
      });
    });

    this.stopMethod.bindMethod((_inputArguments, _context, callback) => {
      this.stop();
      callback(null, {
        statusCode: StatusCodes.Good,
        outputArguments: [
          new Variant({
            dataType: DataType.Boolean,
            value: true
          })
        ]
      });
    });
  }

  public start(): void {
    this.running = true;
    console.log(`${this.name} started`);
  }

  public stop(): void {
    this.running = false;
    console.log(`${this.name} stopped`);
  }

  public isRunning(): boolean {
    return this.running;
  }
}