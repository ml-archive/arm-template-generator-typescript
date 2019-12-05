import { Component } from "react";
import ArmTemplate from "../../../models/ArmTemplate";
import Resource from "../../../models/Resource";
import Parameter from "../../../models/Parameter";
import React = require("react");
import ResourceInput from "../../Inputs/ResourceInput";

export interface ResourceFormProps<TResource extends Resource> {
    template: ArmTemplate;
    onSave: (resources: Resource[], parameters: Parameter[]) => void;
    resource?: TResource;
}

export abstract class ResourceFormState {
    name: string;
    nameParameterName: string;
}

export abstract class ResourceTypeForm<TResource extends Resource, TState extends ResourceFormState> extends Component<ResourceFormProps<TResource>, TState>  {
    protected abstract getNewState(): TState;

    constructor(props: ResourceFormProps<TResource>) {
        super(props);

        this.onNameUpdated = this.onNameUpdated.bind(this);
        this.onNameParameterNameUpdated = this.onNameParameterNameUpdated.bind(this);
    }

    protected getBaseState(props: ResourceFormProps<TResource>): TState {
        let state = this.getNewState();
        state.name = "";
        state.nameParameterName = "";
        if(props.resource) {
            if(props.resource.name)
                state.name = props.resource.name;
        }

        return state;
    }

    abstract getSpecificMarkup(): JSX.Element;

    abstract onSubmit(): void;

    onNameUpdated(value: string) {
        this.setState({
            name: value
        });
    }

    onNameParameterNameUpdated(name: string) {
        this.setState({
            nameParameterName: name
        });
    }

    render(): JSX.Element {
        const parameters = Object.keys(this.props.template.parameters);
        const variables = Object.keys(this.props.template.variables);

        return <form onSubmit={this.onSubmit}>
            <h3>Name</h3>
            <ResourceInput id="resource-name" parameters={parameters} variables={variables} value={this.state.name} onValueUpdated={this.onNameUpdated} onNewParameterNameChanged={this.onNameParameterNameUpdated}>
                <input type="text" id="resource-name" value={this.state.name} onChange={(e) => this.onNameUpdated(e.currentTarget.value)} className="form-control" required />
            </ResourceInput>

            {this.getSpecificMarkup()}
        </form>
    }
}