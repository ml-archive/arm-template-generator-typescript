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
import StorageAccountBlobContainer from "../../../models/Resources/StorageAccountBlobContainer";
import Select from "../../Inputs/Select";

export interface ResourceTypeFormProps<TResource extends Resource> {
    template: ArmTemplate;
    onSave: (resources: Resource[], parameters: { [index: string]: Parameter }) => ArmTemplate;
    resource?: TResource;
}

export abstract class ResourceTypeFormState {
    name: string;
    nameParameterName: string;
    location: string;
    locationParameterName: string;
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
        this.onLocationUpdated = this.onLocationUpdated.bind(this);
        this.onLocationParameterNameUpdated = this.onLocationParameterNameUpdated.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
    }

    abstract getDependencies(): ResourceDependency;

    protected getBaseState(props: ResourceTypeFormProps<TResource>): TState {
        let state = this.getNewState();

        state.name = "";
        state.nameParameterName = "";

        state.condition = "";
        state.displayName = "";
        state.location = "";
        state.locationParameterName = "";

        if(props.resource) {
            if(props.resource.name) {
                state.name = props.resource.name;
            }

            if(props.resource.condition) {
                state.condition = props.resource.condition;
            }

            if(props.resource.location) {
                state.location = props.resource.location;
            }

            if(props.resource.tags && props.resource.tags.displayName) {
                state.displayName = props.resource.tags.displayName;
            }
        }

        state.dependency = this.getDependencies();

        return state;
    }

    abstract getSpecificMarkup(): JSX.Element;

    onNameUpdated(value: string): void {
        this.setState({
            name: value
        });
    }

    onNameParameterNameUpdated(name: string): void {
        this.setState({
            nameParameterName: name
        });
    }

    onConditionUpdated(value: string): void {
        this.setState({
            condition: value
        });
    }

    onDisplayNameUpdated(value: string): void {
        this.setState({
            displayName: value
        });
    }

    onSubmit(): void {
        let resource = this.props.resource ? this.props.resource : this.getNewResource();

        resource.setName = this.state.nameParameterName
            ? this.getParameterString(this.state.nameParameterName)
            : this.state.name;

        if(this.state.condition) {
            resource.condition = this.state.condition;
        } else {
            resource.condition = undefined;
        }

        resource.location = this.state.locationParameterName 
            ? this.getParameterString(this.state.locationParameterName)
            : this.state.location;

        if(this.state.displayName) {
            resource.tags = new ResourceTags();
            resource.tags.displayName = this.state.displayName;
        } else {
            resource.tags = undefined;
        }

        this.setSpecificInformation(resource);

        let parametersToCreate = this.getSpecificNewParameters();

        this.createParameter(this.state.nameParameterName, this.state.name, "string", [], parametersToCreate);

        this.createParameter(this.state.locationParameterName, this.state.location, "string", [], parametersToCreate);

        let resources = [resource];

        let existingResources = this.buildRequiredResources(this.state.dependency);

        resource.setDependencies(this.state.dependency, existingResources);

        this.props.onSave(resources, parametersToCreate);
    }

    protected abstract setSpecificInformation(resource: TResource): void;
    protected abstract getSpecificNewParameters(): { [index: string]: Parameter };

    protected buildRequiredResources(dependency: ResourceDependency, existingResources?: Resource[]): Resource[] {
        let resources: Resource[] = [];

        dependency.required.forEach(r => {
            existingResources = this.buildRequiredResources(r, existingResources);
        });

        Object.keys(dependency.newResources).map((type) => {
            let name = dependency.newResources[type];
            let dependencyModel = dependency.required.find(d => d.type === type);

            switch (type) {
                case StorageAccount.resourceType:
                    resources.push.apply(resources, StorageAccount.getDefault(name));
                    break;
                case StorageAccountBlobService.resourceType:
                    resources.push.apply(resources, StorageAccountBlobService.getDefault(name, dependencyModel));
                    break;
                case StorageAccountBlobContainer.resourceType:
                    resources.push.apply(resources, StorageAccountBlobContainer.getDefault(name, dependencyModel));
                    break;
            }
        });

        return this.props.onSave(resources, {}).resources;
    }

    protected getParameterString(parameterName: string): string {
        return "[parameters('" + parameterName + "')]";
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

    onDependencyUpdated(dependency: ResourceDependency): void {
        this.setState({
            dependency: dependency
        });
    }

    onLocationUpdated(location: string): void {
        this.setState({
            location: location
        });
    }

    onLocationParameterNameUpdated(name: string): void {
        this.setState({
            locationParameterName: name
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

            <h3>Location*</h3>
            <ResourceInput id="resource-location" parameters={parameters} variables={variables} value={this.state.location} onValueUpdated={this.onLocationUpdated} onNewParameterNameChanged={this.onLocationParameterNameUpdated}>
                <Select id="resource-location" required={true} values={Resource.allowedLocations} value={this.state.location} onOptionSelect={this.onLocationUpdated}></Select>
            </ResourceInput>

            <h3>Condition (to deploy)</h3>
            <input type="text" id="resource-condition" value={this.state.condition} onChange={(e) => this.onConditionUpdated(e.currentTarget.value)} className="form-control" />

            <h3>Display name</h3>
            <input type="text" id="resource-display-name" value={this.state.displayName} onChange={(e) => this.onDisplayNameUpdated(e.currentTarget.value)} className="form-control" />

            {this.getSpecificMarkup()}

            <DependantResourceInput headline="Dependencies" resources={this.props.template.resources} currentResource={this.props.resource} dependency={this.state.dependency} onDependencyUpdated={this.onDependencyUpdated}></DependantResourceInput>

            <div className="input-group">
                <button type="submit" className="btn btn-primary">Save</button>
            </div>
        </form>
    }
}