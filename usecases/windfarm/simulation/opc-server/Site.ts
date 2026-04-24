import { AccessRestrictionsFlag, AddReferenceOpts, AttributeIds, BaseNode, BrowseDescriptionOptions2, BrowseDirection, DataType, DataValue, IAddressSpace, INamespace, InstantiateObjectOptions, ISessionContext, LocalizedText, LocalizedTextLike, ModellingRuleType, Namespace, NodeId, NodeIdLike, NumericRange, QualifiedName, QualifiedNameLike, ReferenceDescription, RelativePathElement, RolePermissionType, RolePermissionTypeOptions, StatusCode, UAMethod, UAObject, UAObjectType, UAProperty, UAReference, UAReferenceType, UAString, WriteValueOptions } from "node-opcua";
import { Turbine } from "./Turbine";

export class Site {
  public node: UAObject;
  public type: UAObjectType;
  private turbines: Turbine[] = [];

  constructor(
    private namespace: Namespace,
    private parent: UAObject,
    public name: string
  ) {

    this.type = this.namespace.addObjectType({
      browseName: `Site`,
      organizedBy: parent,
      subtypeOf: "BaseObjectType",
      description: `A wind farm site containing multiple turbines`
    });

    this.node = this.namespace.addObject({
      browseName: this.name,
      typeDefinition: this.type,

    });
  }

  public addTurbine(name: string): Turbine {
    const turbine = new Turbine(this.namespace, this, name);
    this.turbines.push(turbine);
    return turbine;
  }

  public getTurbines(): Turbine[] {
    return this.turbines;
  }
}