import { ResourceTypeForm, ResourceTypeFormState } from "./ResourceTypeForm";
import StorageAccountBlobService from "../../../models/Resources/StorageAccountBlobService";

class StorageAccountBlobServiceState extends ResourceTypeFormState {
    
}

export class StorageAccountBlobServiceForm extends ResourceTypeForm<StorageAccountBlobService, StorageAccountBlobServiceState> {
    protected getNewState(): StorageAccountBlobServiceState {
        return new StorageAccountBlobServiceState();
    }

    getSpecificMarkup(): JSX.Element {
        return null;
    }

    onSubmit(): void {
        throw new Error("Method not implemented.");
    }
}

export default StorageAccountBlobServiceForm;