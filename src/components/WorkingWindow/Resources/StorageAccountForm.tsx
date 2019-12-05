import { ResourceTypeForm, ResourceFormState, ResourceFormProps } from "./ResourceTypeForm";
import StorageAccount from "../../../models/Resources/StorageAccount";
import { Fragment } from "react";
import React = require("react");
import Select from "../../Inputs/Select";

class StorageAccountFormState extends ResourceFormState {
    kind: string;
}

export class StorageAccountForm extends ResourceTypeForm<StorageAccount, StorageAccountFormState> {
    protected getNewState(): StorageAccountFormState {
        return new StorageAccountFormState();
    }

    constructor(props: ResourceFormProps<StorageAccount>) {
        super(props);

        let state = this.getBaseState(props);
        state.kind = "";

        if(props.resource) {
            if(props.resource.kind) {
                state.kind = props.resource.kind;
            }
        }

        this.state = state;
    }

    onKindSelected(option: string) {
        this.setState({
            kind: option
        });
    }

    onSubmit(): void {
        throw new Error("Method not implemented.");
    }

    getSpecificMarkup(): JSX.Element {
        return (<Fragment>
            <label htmlFor="resource-kind">Kind</label>
            <div className="input-group">
                <Select hideEmpty={true} id="resource-kind" required={true} value={this.state.kind} values={StorageAccount.allowedKinds} onOptionSelect={this.onKindSelected}></Select>
            </div>
        </Fragment>);
    }
}