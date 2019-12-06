import { Component } from "react";
import ArmTemplate from "../../../models/ArmTemplate";
import Resource, { ResourceTags } from "../../../models/Resource";
import Parameter from "../../../models/Parameter";
import React = require("react");
import ResourceInput from "../../Inputs/ResourceInput";
import DependantResourceInput from "../../Inputs/DependantResourceInput";
import ResourceDependency from "../../../models/Resources/ResourceDependency";
import StorageAccount from "../../../models/Resources/StorageAccount";
import StorageAccountBlobService from "../../../models/Resources/StorageAccountBlobService";

export interface ResourceTypeFormProps<TResource extends Resource> {
    template: ArmTemplate;
    onSave: (resources: Resource[], parameters: { [index: string]: Parameter }) => ArmTemplate;
    resource?: TResource;
}

export abstract class ResourceTypeFormState {
    name: string;
    nameParameterName: string;
    condition: string;
    displayName: string;
    dependency: ResourceDependency;
}

export abstract class ResourceTypeForm<TResource extends Resource, TState extends ResourceTypeFormState> extends Component<ResourceTypeFormProps<TResource>, TState>  {
    protected abstract getNewState(): TState;
    protected abstract getNewResource(): TResource;

    constructor(props: ResourceTypeFormProps<TResource>) {
        super(props);

        this.onNameUpdated = this.onNameUpdated.bind(this);
        this.onNameParameterNameUpdated = this.onNameParameterNameUpdated.bind(this);
        this.onConditionUpdated = this.onConditionUpdated.bind(this);
        this.onDependencyUpdated = this.onDependencyUpdated.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.setBaseInformation = this.setBaseInformation.bind(this);
        this.getBaseParametersToCreate = this.getBaseParametersToCreate.bind(this);
    }

    abstract getDependencies(): ResourceDependency;

    protected getBaseState(props: ResourceTypeFormProps<TResource>): TState {
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

        state.dependency = this.getDependencies();

        return state;
    }

    abstract getSpecificMarkup(): JSX.Element;

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

    onSubmit() {
        let resource = this.props.resource ? this.props.resource : this.getNewResource();

        resource.setName = this.state.nameParameterName
            ? this.getParameterString(this.state.nameParameterName)
            : this.state.name;

        if(this.state.condition) {
            resource.condition = this.state.condition;
        } else {
            resource.condition = undefined;
        }

        if(this.state.displayName) {
            resource.tags = new ResourceTags();
            resource.tags.displayName = this.state.displayName;
        } else {
            resource.tags = undefined;
        }

        this.setSpecificInformation(resource);

        let parametersToCreate = this.getSpecificNewParameters();

        this.createParameter(this.state.nameParameterName, this.state.name, "string", [], parametersToCreate);

        let resources = [resource];

        let existingResources = this.buildRequiredResources(this.state.dependency);

        resource.setDependencies(this.state.dependency, existingResources);

        this.props.onSave(resources, parametersToCreate);
    }

    protected abstract setSpecificInformation(resource: TResource): void;
    protected abstract getSpecificNewParameters(): { [index: string]: Parameter };

    protected setBaseInformation(resource: TResource) {
        resource.setName = this.state.nameParameterName
            ? this.getParameterString(this.state.nameParameterName)
            : this.state.name;

        if(this.state.condition) {
            resource.condition = this.state.condition;
        } else {
            resource.condition = undefined;
        }

        if(this.state.displayName) {
            resource.tags = new ResourceTags();
            resource.tags.displayName = this.state.displayName;
        } else {
            resource.tags = undefined;
        }
    }

    protected buildRequiredResources(dependency: ResourceDependency, existingResources?: Resource[]): Resource[] {
        let resources: Resource[] = [];

        dependency.required.forEach(r => {
            existingResources = this.buildRequiredResources(r, existingResources);
        });

        Object.keys(dependency.newResources).map((type) => {
            let name = dependency.newResources[type];

            switch (type) {
                case StorageAccount.resourceType:
                    resources.push.apply(resources, StorageAccount.getDefault(name));
                    break;
                case StorageAccountBlobService.resourceType:
                    resources.push.apply(resources, StorageAccountBlobService.getDefault(name, dependency.required.find(d => d.type === type)));
                    break;
            }
        });

        return this.props.onSave(resources, {}).resources;
    }

    protected getParameterString(parameterName: string): string {
        return "[parameters('" + parameterName + "')]";
    }

    protected getBaseParametersToCreate(): { [index: string]: Parameter } {
        var parametersToCreate: { [index: string]: Parameter } = {}

        this.createParameter(this.state.nameParameterName, this.state.name, "string", [], parametersToCreate);

        return parametersToCreate;
    }

    protected createParameter(name: string, defaultValue: boolean | number | string, type: string, allowedValues: number[] | string[], parameterList: { [index: string]: Parameter }): void {
        if(!name) {
            return null;
        }

        let parameter = new Parameter();
        if(defaultValue !== null && defaultValue !== undefined && defaultValue !== "") {
            parameter.defaultValue = defaultValue;
        }
        if(allowedValues && allowedValues.length > 0) {
            parameter.allowedValues = allowedValues
        }
        parameter.type = type;

        parameterList[name] = parameter;
    }

    onDependencyUpdated(dependency: ResourceDependency) {
        this.setState({
            dependency: dependency
        });
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

            <DependantResourceInput headline="Dependencies" resources={this.props.template.resources} dependency={this.state.dependency} onDependencyUpdated={this.onDependencyUpdated}></DependantResourceInput>

            <div className="input-group">
                <button type="submit" className="btn btn-primary">Save</button>
            </div>
        </form>
    }
}