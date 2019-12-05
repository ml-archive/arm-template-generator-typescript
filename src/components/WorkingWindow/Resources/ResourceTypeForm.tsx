import { Component } from "react";
import ArmTemplate from "../../../models/ArmTemplate";
import Resource, { ResourceTags } from "../../../models/Resource";
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
    condition: string;
    displayName: string;
}

export abstract class ResourceTypeForm<TResource extends Resource, TState extends ResourceFormState> extends Component<ResourceFormProps<TResource>, TState>  {
    protected abstract getNewState(): TState;

    constructor(props: ResourceFormProps<TResource>) {
        super(props);

        this.onNameUpdated = this.onNameUpdated.bind(this);
        this.onNameParameterNameUpdated = this.onNameParameterNameUpdated.bind(this);
        this.onConditionUpdated = this.onConditionUpdated.bind(this);
    }

    protected getBaseState(props: ResourceFormProps<TResource>): TState {
        let state = this.getNewState();

        state.name = "";
        state.nameParameterName = "";

        state.condition = "";
        state.displayName = "";

        if(props.resource) {
            if(props.resource.name) {
                state.name = props.resource.name;
            }

            if(props.resource.condition) {
                state.condition = props.resource.condition;
            }

            if(props.resource.tags && props.resource.tags.displayName) {
                state.displayName = props.resource.tags.displayName;
            }
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

    onConditionUpdated(value: string) {
        this.setState({
            condition: value
        });
    }

    onDisplayNameUpdated(value: string) {
        this.setState({
            displayName: value
        });
    }

    protected setBaseInformation(resource: TResource) {
        resource.name = this.state.name;

        if(this.state.condition) {
            resource.condition = this.state.condition;
        }

        if(this.state.displayName) {
            resource.tags = new ResourceTags();
            resource.tags.displayName = this.state.displayName;
        }
    }

    render(): JSX.Element {
        const parameters = Object.keys(this.props.template.parameters);
        const variables = Object.keys(this.props.template.variables);

        return <form onSubmit={this.onSubmit}>
            <h3>Name*</h3>
            <ResourceInput id="resource-name" parameters={parameters} variables={variables} value={this.state.name} onValueUpdated={this.onNameUpdated} onNewParameterNameChanged={this.onNameParameterNameUpdated}>
                <input type="text" id="resource-name" value={this.state.name} onChange={(e) => this.onNameUpdated(e.currentTarget.value)} className="form-control" required />
            </ResourceInput>

            <h3>Condition (to deploy)</h3>
            <input type="text" id="resource-condition" value={this.state.condition} onChange={(e) => this.onConditionUpdated(e.currentTarget.value)} className="form-control" />

            <h3>Display name</h3>
            <input type="text" id="resource-display-name" value={this.state.displayName} onChange={(e) => this.onDisplayNameUpdated(e.currentTarget.value)} className="form-control" />

            {this.getSpecificMarkup()}

            <div className="input-group">
                <button type="submit" className="btn btn-primary">Save</button>
            </div>
        </form>
    }
}