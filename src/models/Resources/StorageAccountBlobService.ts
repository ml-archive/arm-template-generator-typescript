import Resource, { ResourceType } from "../Resource";
import StorageAccount from "./StorageAccount";

export class StorageAccountBlobService extends Resource {
    static resourceTypeString: string = "Microsoft.Storage/storageAccounts/blobServices";
    private storageAccount: StorageAccount;
    private simpleName: string;

    constructor() {
        super();

        this.apiVersion = "2019-04-01";
        this.type = StorageAccountBlobService.resourceTypeString;
    }

    getRequiredTypes(): ResourceType[] {
        return [ResourceType.StorageAccount];
    }

    getResourceId(): string {
        return this.getResourceIdString(StorageAccountBlobService.resourceTypeString, "/", this.name);
    }

    get getName(): string {
        return this.simpleName;
    }

    set setName(name: string) {
        console.log('Hello world!');
        this.simpleName = name;

        this.name = this.storageAccount ? this.getNameForConcat(this.storageAccount.name) + "/" + this.simpleName : this.simpleName;
    }

    set requiredResources(storageAccount: StorageAccount) {
        this.storageAccount = storageAccount;
        this.dependsOn = [storageAccount.getResourceId()];

        //Update full name as it depends on the storage account
        this.setName = this.simpleName;
    }
}

export default StorageAccountBlobService;