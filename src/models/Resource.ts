export abstract class Resource {
    Type: string;
    Name: string;
    ApiVersion: Date;
    Tags: ResourceTags;
}

export class ResourceTags {
    DisplayName: string;
}

export default Resource;