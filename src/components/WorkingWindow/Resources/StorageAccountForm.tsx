import { ResourceTypeForm, ResourceFormState, ResourceFormProps } from "./ResourceTypeForm";
import StorageAccount from "../../../models/Resources/StorageAccount";
import { Fragment } from "react";
import React = require("react");
import Select from "../../Inputs/Select";
import ResourceInput from "../../Inputs/ResourceInput";

class StorageAccountFormState extends ResourceFormState {
    kind: string;
    kindParameterName: string;
}

export class StorageAccountForm extends ResourceTypeForm<StorageAccount, StorageAccountFormState> {
    protected getNewState(): StorageAccountFormState {
        return new StorageAccountFormState();
    }

    constructor(props: ResourceFormProps<StorageAccount>) {
        super(props);

        this.onKindParameterNameUpdated = this.onKindParameterNameUpdated.bind(this);
        this.onKindSelected = this.onKindSelected.bind(this);

        let state = this.getBaseState(props);
        state.kind = "";
        state.kindParameterName = "";

        if(props.resource) {
            if(props.resource.kind) {
                state.kind = props.resource.kind;
            }
        }

        this.state = state;
    }

    onKindParameterNameUpdated(name: string) {
        this.setState({
            kindParameterName: name
        });
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
            <ResourceInput id="resource-kind" value={this.state.kind} parameters={Object.keys(this.props.template.parameters)} variables={Object.keys(this.props.template.variables)} onValueUpdated={this.onKindSelected} onNewParameterNameChanged={this.onKindParameterNameUpdated}>
                <Select id="resource-kind" required={true} value={this.state.kind} values={StorageAccount.allowedKinds} onOptionSelect={this.onKindSelected}></Select>
            </ResourceInput>
        </Fragment>);
    }
}