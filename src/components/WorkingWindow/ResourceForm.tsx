import { Component, Fragment } from "react";
import ArmTemplate from "../../models/ArmTemplate";
import Resource, { ResourceType } from "../../models/Resource";
import StorageAccount from "../../models/Resources/StorageAccount";
import React = require("react");
import Select from "../Inputs/Select";
import { StorageAccountForm } from "./Resources/StorageAccountForm";
import Parameter from "../../models/Parameter";

interface ResourceFormProps {
    template: ArmTemplate;
    resource?: Resource;
    onSubmit: (resources: Resource[], parameters: Parameter[]) => void;
}

class ResourceFormState {
    type: ResourceType;
}

export class ResourceForm extends Component<ResourceFormProps, ResourceFormState> {
    constructor(props: ResourceFormProps) {
        super(props);

        this.typeSelected = this.typeSelected.bind(this);

        let state = new ResourceFormState();
        state.type = ResourceType.None;

        if(this.props.resource) {
            if(this.props.resource as StorageAccount) {
                state.type = ResourceType.StorageAccount;
            }
        }

        this.state = state;
    }

    typeSelected(option: string) {
        if(option === "") {
            this.setState({
                type: ResourceType.None
            });
        } else {
            let key = option as keyof typeof ResourceType;

            this.setState({
                type: ResourceType[key]
            });
        }
    }

    render() {
        const types = [
            ResourceType[ResourceType.None],
            ResourceType[ResourceType.StorageAccount],
            ResourceType[ResourceType.StorageAccountBlobService],
            ResourceType[ResourceType.StorageAccountBlobContainer]
        ];

        let value: string = this.state.type ? ResourceType[this.state.type] : ResourceType[ResourceType.None];

        return <Fragment>
            <label htmlFor="resource-type">Type</label>
            <div className="input-group">
                <Select onOptionSelect={this.typeSelected} hideEmpty={true} value={value} values={types}></Select>
            </div>

            {this.state.type === ResourceType.StorageAccount && <StorageAccountForm template={this.props.template} resource={this.props.resource as StorageAccount} onSave={this.props.onSubmit}></StorageAccountForm>}
        </Fragment>
    }
}