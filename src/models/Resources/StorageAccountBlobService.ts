import Resource from "../Resource";

export class StorageAccountBlobService extends Resource {
    static resourceTypeString: string = "Microsoft.Storage/storageAccounts/blobServices";

    constructor() {
        super();

        this.apiVersion = "2019-04-01";
        this.type = StorageAccountBlobService.resourceTypeString;
    }

    getResourceId(): string {
        return this.getResourceIdString(StorageAccountBlobService.resourceTypeString, "/", this.name);
    }
}

export default StorageAccountBlobService;