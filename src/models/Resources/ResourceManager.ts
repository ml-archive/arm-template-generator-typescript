import Resource from "../Resource";
import StorageAccount from "./StorageAccount";
import StorageAccountBlobService from "./StorageAccountBlobService";
import StorageAccountBlobContainer from "./StorageAccountBlobContainer";

export class ResourceManager {
    static getSpecificResource(resource: Resource): Resource {
        switch(resource.type) {
            case StorageAccount.resourceType:
                return Object.assign(new StorageAccount(), resource);
            case StorageAccountBlobService.resourceType:
                return Object.assign(new StorageAccountBlobService(), resource);
            case StorageAccountBlobContainer.resourceType:
                return Object.assign(new StorageAccountBlobContainer(), resource);
            default:
                throw new Error("Unknown resource type: " + resource.type);
        }
    }
}

export default ResourceManager;