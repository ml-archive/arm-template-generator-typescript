import { ResourceTypeForm, ResourceTypeFormState, ResourceTypeFormProps } from "./ResourceTypeForm";
import StorageAccountBlobContainer, { StorageAccountBlobContainerProperties } from "../../../models/Resources/StorageAccountBlobContainer";
import Parameter from "../../../models/Parameter";
import ResourceDependency from "../../../models/Resources/ResourceDependency";
import { Fragment } from "react";
import React = require("react");
import ResourceInput from "../../Inputs/ResourceInput";
import Select from "../../Inputs/Select";

class StorageAccountBlobContainerFormState extends ResourceTypeFormState {
    access: string;
    accessParameterName: string;
}

export class StorageAccountBlobContainerForm extends ResourceTypeForm<StorageAccountBlobContainer, StorageAccountBlobContainerFormState> {
    constructor(props: ResourceTypeFormProps<StorageAccountBlobContainer>) {
        super(props);

        this.onAccessUpdated = this.onAccessUpdated.bind(this);
        this.onAccessParameterNameChanged = this.onAccessParameterNameChanged.bind(this);

        let state = this.getBaseState(props);
        state.access = "";
        state.accessParameterName = "";

        if(props.resource && props.resource.properties && props.resource.properties.publicAccess) {
            state.access = props.resource.properties.publicAccess;
        }

        this.state = state;
    }

    protected getNewState(): StorageAccountBlobContainerFormState {
        return new StorageAccountBlobContainerFormState();
    }

    protected getNewResource(): StorageAccountBlobContainer {
        return new StorageAccountBlobContainer();
    }

    getDependencies(): ResourceDependency {
        return StorageAccountBlobContainer.getResourceDependencyModel();
    }

    onAccessUpdated(access: string): void {
        this.setState({
            access: access
        });
    }

    onAccessParameterNameChanged(name: string): void {
        this.setState({
            accessParameterName: name
        });
    }

    getSpecificMarkup(): JSX.Element {
        let parameters = Object.keys(this.props.template.parameters);
        let variables = Object.keys(this.props.template.variables);

        return <Fragment>
            <h3>Public access*</h3>
            <ResourceInput id="resource-public-access" parameters={parameters} variables={variables} value={this.state.access} onValueUpdated={this.onAccessUpdated} onNewParameterNameChanged={this.onAccessParameterNameChanged}>
                <Select hideEmpty={true} id="resource-public-access" onOptionSelect={this.onAccessUpdated} required={true} value={this.state.access} values={StorageAccountBlobContainerProperties.allowedPublicAccesses}></Select>
            </ResourceInput>
        </Fragment>
    }

    protected setSpecificInformation(resource: StorageAccountBlobContainer): void {
        if(this.state.access) {
            if(!resource.properties) {
                resource.properties = new StorageAccountBlobContainerProperties();
            }

            resource.properties.publicAccess = this.state.access;
        } else {
            resource.properties = undefined;
        }
    }

    protected getSpecificNewParameters(): { [index: string]: Parameter; } {
        let parameters: { [index: string]: Parameter } = {};

        this.createParameter(this.state.accessParameterName, this.state.access, "string", StorageAccountBlobContainerProperties.allowedPublicAccesses, parameters);

        return parameters;
    }
}

export default StorageAccountBlobContainerForm