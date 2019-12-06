import { ResourceTypeForm, ResourceTypeFormState, ResourceTypeFormProps } from "./ResourceTypeForm";
import StorageAccountBlobService from "../../../models/Resources/StorageAccountBlobService";
import ResourceDependency from "../../../models/Resources/ResourceDependency";

class StorageAccountBlobServiceState extends ResourceTypeFormState {
    
}

export class StorageAccountBlobServiceForm extends ResourceTypeForm<StorageAccountBlobService, StorageAccountBlobServiceState> {
    getDependencies(): ResourceDependency {
        return StorageAccountBlobService.getResourceDependencyModel();
    }

    protected getNewState(): StorageAccountBlobServiceState {
        return new StorageAccountBlobServiceState();
    }

    constructor(props: ResourceTypeFormProps<StorageAccountBlobService>) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = this.getBaseState(props);
    }

    getSpecificMarkup(): JSX.Element {
        return null;
    }

    onSubmit(): void {
        let resource = this.props.resource ? this.props.resource : new StorageAccountBlobService();
        this.setBaseInformation(resource);

        let parameters = this.getBaseParametersToCreate();

        //TODO: handle required resources

        this.props.onSave([resource], parameters);
    }
}

export default StorageAccountBlobServiceForm;