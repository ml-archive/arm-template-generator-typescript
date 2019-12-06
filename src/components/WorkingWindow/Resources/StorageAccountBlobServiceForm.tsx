import { ResourceTypeForm, ResourceTypeFormState, ResourceTypeFormProps } from "./ResourceTypeForm";
import StorageAccountBlobService from "../../../models/Resources/StorageAccountBlobService";
import ResourceDependency from "../../../models/Resources/ResourceDependency";
import Parameter from "../../../models/Parameter";

class StorageAccountBlobServiceState extends ResourceTypeFormState {
    
}

export class StorageAccountBlobServiceForm extends ResourceTypeForm<StorageAccountBlobService, StorageAccountBlobServiceState> {
    protected getNewResource(): StorageAccountBlobService {
        return new StorageAccountBlobService();
    }
    getDependencies(): ResourceDependency {
        return StorageAccountBlobService.getResourceDependencyModel();
    }

    protected getNewState(): StorageAccountBlobServiceState {
        return new StorageAccountBlobServiceState();
    }

    constructor(props: ResourceTypeFormProps<StorageAccountBlobService>) {
        super(props);

        this.state = this.getBaseState(props);
    }

    getSpecificMarkup(): JSX.Element {
        return null;
    }
    
    protected setSpecificInformation(_resource: StorageAccountBlobService): void {
        return;
    }

    protected getSpecificNewParameters(): { [index: string]: Parameter; } {
        return {};
    }
}

export default StorageAccountBlobServiceForm;