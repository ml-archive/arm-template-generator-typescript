import Resource from "../Resource";
import StorageAccount from "./StorageAccount";
import ResourceDependency from "./ResourceDependency";

export class StorageAccountBlobService extends Resource {
    static resourceType: string = "Microsoft.Storage/storageAccounts/blobServices";
    static displayName: string = "Storage account blob service";
    private requiredService: StorageAccount;
    private simpleName: string;

    constructor() {
        super();

        this.type = StorageAccountBlobService.resourceType;
    }

    getResourceId(): string {
        return this.getResourceIdString(this.getNameForConcat(this.requiredService.getName()), this.getNameForConcat(this.getName()));
    }

    setDependantResources(allResources: Resource[]): void {
        if(!this.dependsOn || this.dependsOn.length <= 0) {
            return;
        }

        let accountDependency: string = this.dependsOn.find(d => d.includes("'" + StorageAccount.resourceType + "'"));

        if(accountDependency) {
            let accounts: StorageAccount[] = allResources.filter(r => r.type === StorageAccount.resourceType).map(r => r as StorageAccount);

            this.requiredService = accounts.find(a => a.getResourceId() === accountDependency);

            if(this.requiredService) {
                let name: string = this.simpleName;

                if(!name) {
                    let splitName: string[] = this.name.split('/');
                    name = splitName[splitName.length - 1];
                }

                this.setName = name;
            }
        }
    }

    getName(): string {
        return this.simpleName;
    }

    set setName(name: string) {
        this.simpleName = name;

        this.name = this.requiredService ? this.getNameForConcat(this.requiredService.name, true) + "/" + this.simpleName : this.simpleName;
    }

    set requiredResources(storageAccount: StorageAccount) {
        this.requiredService = storageAccount;
        this.dependsOn = [storageAccount.getResourceId()];

        //Update full name as it depends on the storage account
        this.setName = this.simpleName;
    }

    setDependencies(dependency: ResourceDependency, resources: Resource[]): void {
        let resourceId = Object.keys(dependency.existingResources).find(k => k === StorageAccount.resourceType);

        if(resourceId) {
            this.requiredService = dependency.existingResources[resourceId] as StorageAccount;
            this.setName = this.simpleName;
            this.dependsOn = [dependency.existingResources[resourceId].getResourceId()];
        } else {
            let name = dependency.newResources[StorageAccount.resourceType];
            this.requiredService = (resources.find(r => r.getName() === name) as StorageAccount);
            this.setName = this.simpleName;
            this.dependsOn = [this.requiredService.getResourceId()];
        }
    }

    static getDefault(name: string, dependencyModel: ResourceDependency): Resource[] {
        let resources: Resource[] = [];
        let storageAccount: StorageAccount;

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