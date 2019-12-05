export abstract class Resource {
    condition: string;
    type: string;
    name: string;
    apiVersion: Date;
    tags: ResourceTags;
    dependsOn: string[];
}

export class ResourceTags {
    displayName: string;
}

export default Resource;