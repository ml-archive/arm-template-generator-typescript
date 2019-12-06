import Resource from "../Resource";
import StorageAccount from "./StorageAccount";
import ResourceDependency from "./ResourceDependency";

export class StorageAccountBlobService extends Resource {
    static resourceType: string = "Microsoft.Storage/storageAccounts/blobServices";
    static displayName: string = "Storage account blob service";
    private storageAccount: StorageAccount;
    private simpleName: string;

    constructor() {
        super();

        this.type = StorageAccountBlobService.resourceType;
    }

    getResourceId(): string {
        return this.getResourceIdString(this.getNameForConcat(this.storageAccount.getName()), this.getNameForConcat(this.getName()));
    }

    getName(): string {
        return this.simpleName;
    }

    set setName(name: string) {
        this.simpleName = name;

        this.name = this.storageAccount ? this.getNameForConcat(this.storageAccount.name) + "/" + this.simpleName : this.simpleName;
    }

    set requiredResources(storageAccount: StorageAccount) {
        this.storageAccount = storageAccount;
        this.dependsOn = [storageAccount.getResourceId()];

        //Update full name as it depends on the storage account
        this.setName = this.simpleName;
    }

    setDependencies(dependency: ResourceDependency, resources: Resource[]): void {
        let resourceId = Object.keys(dependency.existingResources).find(k => k === StorageAccount.resourceType);

        if(resourceId) {
            this.dependsOn = [dependency.existingResources[resourceId].getResourceId()];
        } else {
            let name = dependency.newResources[StorageAccount.resourceType];
            this.dependsOn = [(resources.find(r => r.getName() === name) as StorageAccount).getResourceId()];
        }
    }

    static getDefault(name: string, dependencyModel: ResourceDependency): Resource[] {
        let resources: Resource[] = [];
        let storageAccount: StorageAccount;

        console.log(dependencyModel);

        Object.keys(dependencyModel.newResources).forEach(type => {
            const name: string = dependencyModel.newResources[type];
            if(type === StorageAccount.resourceType) {
                resources.push.apply(resources, StorageAccount.getDefault(name));

                storageAccount = resources.find(r => r.type === StorageAccount.resourceType) as StorageAccount;
            }
        });

        Object.keys(dependencyModel.existingResources).forEach(type => {
            let resource = dependencyModel.existingResources[type];
            if(resource.type === StorageAccount.resourceType) {
                storageAccount = resource as StorageAccount;
            }
        })

        let service = new StorageAccountBlobService();
        service.requiredResources = storageAccount;
        service.setName = name;
        service.dependsOn = [storageAccount.getResourceId()];

        resources.push(service);

        return resources;
    }

    static getAllRequiredResources(): ResourceDependency[] {
        return [StorageAccount.getResourceDependencyModel()];
    }
}

export default StorageAccountBlobService;