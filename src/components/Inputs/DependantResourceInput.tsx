import { Component, Fragment } from "react";
import ResourceDependency from "../../models/Resources/ResourceDependency";
import React = require("react");
import Resource from "../../models/Resource";
import Select from "./Select";

interface DependantResourceInputProps {
    dependency: ResourceDependency;
    resources: Resource[];
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

    onResourceSelected(type: string, name: string) {
        let dependency = this.state.dependency;

        if(name === "Create new") {
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

            dependency.existingResources[type] = this.props.resources.find(r => (r.getName ? r.getName() : r.name) === name);
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

    render() {
        if(this.props.dependency.required.length <= 0) {
            return null;
        }

        return <Fragment>
            {this.props.headline && <h3>{this.props.headline}</h3>}
            {this.props.dependency.required.map(req => {
                //Temporary fix with getName check until load file loads into correct classes with functions available
                let values = this.props.resources.filter(r => r.type === req.type).map(r => r.getName ? r.getName() : r.name);
                values.push("Create new");

                return <Fragment key={req.displayName}>
                    <h4>{req.displayName}*</h4>
                    <Select values={values} required={true} onOptionSelect={(option) => { this.onResourceSelected(req.type, option) }}></Select>
                    {this.state.createNew && <Fragment>
                        <label>Name of new resource*</label>
                        <div className="input-group">
                            <input type="text" pattern="\w[\w\d]*" className="form-control" value={this.state.newName} onChange={(e) => { this.onNewNameChanged(req.type, e.currentTarget.value)} } />
                        </div>
                    </Fragment>}

                    {req.required.map((r) => {
                        <DependantResourceInput key={r.type} dependency={r} onDependencyUpdated={this.onSubRequiredUpdated} resources={this.props.resources}></DependantResourceInput>
                    })}
                </Fragment>
            })}
        </Fragment>
    }
}

export default DependantResourceInput;