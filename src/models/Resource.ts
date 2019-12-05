export abstract class Resource {
    condition: string;
    type: string;
    name: string;
    apiVersion: string;
    tags: ResourceTags;
    dependsOn: string[];

    protected getResourceIdString(...parts: string[]) {
        if(parts.length > 0) {
            return "[resourceId('" + this.type + "', " + parts.join(", ") + ")]";
        } else {
            return "";
        }
    }

    abstract getResourceId(): string;
    getRequiredTypes(): ResourceType[] {
        return [];
    };
}

export enum ResourceType {
    None,
    StorageAccount,
    StorageAccountBlobService,
    StorageAccountBlobContainer
}

export class ResourceTags {
    displayName: string;
}

export default Resource;