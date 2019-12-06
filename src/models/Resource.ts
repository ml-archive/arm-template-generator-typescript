export abstract class Resource {
    condition: string;
    type: string;
    name: string;
    apiVersion: string;
    tags: ResourceTags;
    dependsOn: string[];

    get getName(): string {
        return this.name;
    }

    set setName(name: string) {
        this.name = name;
    }

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

    protected getNameForConcat(name: string): string {
        let finalName: string;

        if(name.startsWith("[") && name.endsWith("]")){
            finalName = name.substr(1, name.length - 2);
        } else {
            finalName = "'" + name + "'";
        }

        return finalName;
    }
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