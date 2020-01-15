import Resource from "../Resource";
import StorageAccountBlobService from "./StorageAccountBlobService";
import ResourceDependency from "./ResourceDependency";

export class StorageAccountBlobContainer extends Resource {
    static resourceType = "Microsoft.Storage/storageAccounts/blobServices/containers";
    private requiredService : StorageAccountBlobService;
    private simpleName: string;
    properties: StorageAccountBlobContainerProperties;

    constructor() {
        super();

        this.type = StorageAccountBlobContainer.resourceType;
    }

    getResourceId(): string {
        return this.getResourceIdString(this.requiredService.getName(), "/", this.getName());
    }

    static needLocation(): boolean {
        return false;
    }

    setDependantResources(allResources: Resource[]): void {
        if(!this.dependsOn || this.dependsOn.length <= 0) {
            return;
        }

        let accountDependency: string = this.dependsOn.find(d => d.includes("'" + StorageAccountBlobService.resourceType + "'"));

        if(accountDependency) {
            let services: StorageAccountBlobService[] = allResources.filter(r => r.type === StorageAccountBlobService.resourceType).map(r => r as StorageAccountBlobService);

            this.requiredService = services.find(a => a.getResourceId() === accountDependency);

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

    set requiredResources(blobService: StorageAccountBlobService) {
        this.requiredService = blobService;
        this.dependsOn = [blobService.getResourceId()];

        //Update full name as it depends on the storage account
        this.setName = this.simpleName;
    }

    setDependencies(dependency: ResourceDependency, resources: Resource[]): void {
        let resourceId = Object.keys(dependency.existingResources).find(k => k === StorageAccountBlobService.resourceType);

        if(resourceId) {
            this.requiredResources = dependency.existingResources[resourceId] as StorageAccountBlobService;
            this.setName = this.simpleName;
            this.dependsOn = [dependency.existingResources[resourceId].getResourceId()];
        } else {
            let name = dependency.newResources[StorageAccountBlobService.resourceType];
            let blobService = resources.find(r => r.getName() === name) as StorageAccountBlobService
            this.requiredResources = blobService;
            this.setName = this.simpleName;
            this.dependsOn = [blobService.getResourceId()];
        }
    }

    static getDefault(name: string, dependencyModel: ResourceDependency): Resource[] {
        let resources: Resource[] = [];
        let blobService: StorageAccountBlobService;

        Object.keys(dependencyModel.newResources).forEach(type => {
            const name: string = dependencyModel.newResources[type];
            if(type === StorageAccountBlobService.resourceType) {
                resources.push.apply(resources, StorageAccountBlobService.getDefault(name, dependencyModel.required.find(r => r.type === StorageAccountBlobService.resourceType)));

                blobService = resources.find(r => r.type === StorageAccountBlobService.resourceType) as StorageAccountBlobService;
            }
        });

        Object.keys(dependencyModel.existingResources).forEach(type => {
            let resource = dependencyModel.existingResources[type];
            if(resource.type === StorageAccountBlobService.resourceType) {
                blobService = resource as StorageAccountBlobService;
            }
        });

        let service = new StorageAccountBlobContainer();
        service.requiredResources = blobService;
        service.setName = name;
        service.dependsOn = [blobService.getResourceId()];

        resources.push(service);

        return resources;
    }

    static getAllRequiredResources(): ResourceDependency[] {
        return [StorageAccountBlobService.getResourceDependencyModel()];
    }
}

export class StorageAccountBlobContainerProperties {
    publicAccess: string;

    static allowedPublicAccesses: string[] = ["None", "Container", "Blob"];
}

export default StorageAccountBlobContainer;