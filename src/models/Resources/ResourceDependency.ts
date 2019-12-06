import Resource from "../Resource";

export class ResourceDependency {
    displayName: string;
    type: string;
    // Required resource types
    required: ResourceDependency[];
    // Resource type to resource id mapping
    existingResources: { [type: string]: Resource };
    // Resource type to name mapping
    newResources: { [type: string]: string };

    constructor(displayName: string, type: string, requiredTypes: ResourceDependency[]) {
        this.displayName = displayName;
        this.type = type;
        this.required = requiredTypes;
        this.existingResources = {};
        this.newResources = {};
    }
}

export default ResourceDependency;