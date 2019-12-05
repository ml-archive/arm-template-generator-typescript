import { Component } from "react";
import ArmTemplate from "../../../models/ArmTemplate";
import Resource from "../../../models/Resource";
import Parameter from "../../../models/Parameter";
import React = require("react");

export interface ResourceFormProps<TResource extends Resource> {
    template: ArmTemplate;
    onSave: (resources: Resource[], parameters: Parameter[]) => void;
    resource?: TResource;
}

export abstract class ResourceFormState {
    name: string;
}

export abstract class ResourceTypeForm<TResource extends Resource, TState extends ResourceFormState> extends Component<ResourceFormProps<TResource>, TState>  {
    protected abstract getNewState(): TState;

    constructor(props: ResourceFormProps<TResource>) {
        super(props);
    }

    protected getBaseState(props: ResourceFormProps<TResource>): TState {
        let state = this.getNewState();
        state.name = "";
        if(props.resource) {
            if(props.resource.name)
                state.name = props.resource.name;
        }

        return state;
    }

    abstract getSpecificMarkup(): JSX.Element;

    abstract onSubmit(): void;

    render(): JSX.Element {
        return <form onSubmit={this.onSubmit}>
            <label htmlFor="resource-name">Name</label>
            <div className="input-group">
                
            </div>

            {this.getSpecificMarkup()}
        </form>
    }
}