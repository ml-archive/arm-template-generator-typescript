import { Component, Fragment } from "react";
import ResourceDependency from "../../models/Resources/ResourceDependency";
import React = require("react");
import Resource from "../../models/Resource";
import Select from "./Select";

interface DependantResourceInputProps {
    dependency: ResourceDependency;
    resources: Resource[];
    currentResource?: Resource;
    onDependencyUpdated: (dependency: ResourceDependency) => void;
    headline?: string;
}

class DependantResourceInputState {
    dependency: ResourceDependency;
    createNew: boolean;
    newName: string;
}

export class DependantResourceInput extends Component<DependantResourceInputProps, DependantResourceInputState> {
    constructor(props: DependantResourceInputProps) {
        super(props);

        this.onNewNameChanged = this.onNewNameChanged.bind(this);
        this.onResourceSelected = this.onResourceSelected.bind(this);
        this.onSubRequiredUpdated = this.onSubRequiredUpdated.bind(this);

        let state = new DependantResourceInputState();
        state.dependency = props.dependency;
        state.createNew = false;
        state.newName = "";

        this.state = state;
    }

    onNewNameChanged(type: string, name: string): void {
        let dependency = this.state.dependency;
        dependency.newResources[type] = name;

        this.setState({
            dependency: dependency,
            newName: name
        });

        this.props.onDependencyUpdated(dependency);
    }

    onResourceSelected(type: string, name: string): void {
        let dependency = this.state.dependency;

        if(this.props.resources.filter(r => r.type === type).map(r => r.getName()).findIndex(n => n === name) < 0) {
            delete(dependency.existingResources[type]);

            this.setState({
                createNew: true
            });
        } else {
            delete(dependency.newResources[type]);

            this.setState({
                createNew: false,
                newName: ""
            });

            dependency.existingResources[type] = this.props.resources.find(r => r.getName() === name);
        }

        this.setState({
            dependency: dependency
        });

        this.props.onDependencyUpdated(dependency);
    }

    onSubRequiredUpdated(dependency: ResourceDependency): void {
        let localDependency = this.state.dependency;
        let index = localDependency.required.findIndex(r => r.type === dependency.type);

        localDependency.required[index] = dependency;

        this.setState({
            dependency: localDependency
        });

        this.props.onDependencyUpdated(localDependency);
    }

    render(): JSX.Element {
        if(this.props.dependency.required.length <= 0) {
            return null;
        }

        return <Fragment>
            {this.props.headline && <h3>{this.props.headline}</h3>}
            {this.props.dependency.required.map(req => {
                let availableResources = this.props.resources.filter(r => r.type === req.type);
                let values = availableResources.map(r => r.getName());
                values.push("Create new");

                let value: string = "";
                if(this.props.currentResource && this.props.currentResource.dependsOn && this.props.currentResource.dependsOn.length > 0) {
                    let dependentResource = this.props.resources.find(r => r.type === req.type && this.props.currentResource.dependsOn.findIndex(d => d === r.getResourceId()) >= 0);
                    if(dependentResource) {
                        value = dependentResource.getName();
                    }
                }

                return <Fragment key={req.displayName}>
                    <h4>{req.displayName}*</h4>
                    <Select values={values} required={true} value={value} onOptionSelect={(option) => { this.onResourceSelected(req.type, option) }}></Select>
                    {this.state.createNew && <Fragment>
                        <label>Name of new resource*</label>
                        <div className="input-group">
                            <input type="text" pattern="\w[\w\d]*" className="form-control" value={this.state.newName} onChange={(e) => { this.onNewNameChanged(req.type, e.currentTarget.value)} } />
                        </div>
                    </Fragment>}

                    {req.required.length > 0 && this.state.createNew && 
                        <DependantResourceInput key={req.type} dependency={req} onDependencyUpdated={this.onSubRequiredUpdated} resources={this.props.resources}></DependantResourceInput>
                    }
                </Fragment>
            })}
        </Fragment>
    }
}

export default DependantResourceInput;