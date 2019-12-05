import Resource from "../Resource";

export class StorageAccount extends Resource {
    static resourceType: string = "Microsoft.Storage/storageAccounts";
    kind: string;
    properties: StorageAccountProperties;

    static allowedKinds:string[] = ["Storage", "StorageV2", "BlobStorage", "FileStorage", "BlockBlobStorage"];

    constructor() {
        super();

        this.type = StorageAccount.resourceType;
        this.apiVersion = "2019-04-01";
    }

    getResourceId(): string {
        return this.getResourceIdString(this.name);
    }
}

export class StorageAccountProperties {
    supportsHttpsTrafficOnly: boolean;
    encryption: StorageAccountEncryption;
    accessTier: string;

    static allowedAccessTiers: string[] = ["Hot", "Cool"];
}

export class StorageAccountEncryption {
    services: StorageAccountEncryptionServices;
}

export class StorageAccountEncryptionServices {
    file: StorageAccountEncryptionService;
    blob: StorageAccountEncryptionService;
}

export class StorageAccountEncryptionService {
    enabled: boolean;
}

export default StorageAccount;