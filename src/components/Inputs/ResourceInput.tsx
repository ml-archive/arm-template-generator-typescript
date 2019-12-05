import { Component, Fragment, ChangeEvent } from "react";
import React = require("react");
import Select from "./Select";

interface ResourceInputProps {
    id: string;
    value: string;
    variables: string[];
    parameters: string[];
    onValueUpdated: (value: string) => void;
    onNewParameterNameChanged: (name: string) => void;
}

class ResourceInputState {
    value: string;
    variableName: string;
    type: ResourceInputOptions;
}

enum ResourceInputOptions {
    Parameter,
    Variable,
    Custom
}

export class ResourceInput extends Component<ResourceInputProps, ResourceInputState> {
    constructor(props: ResourceInputProps) {
        super(props);

        this.onTypeSelected = this.onTypeSelected.bind(this);
        this.onValueSelected = this.onValueSelected.bind(this);
        this.setVariableName = this.setVariableName.bind(this);

        let state = new ResourceInputState();
        state.type = ResourceInputOptions.Custom;

        //TODO: make proper initialisation of type and value in case of parameter or variable

        this.state = state;
    }

    onTypeSelected(option: string): void {
        const key = option as keyof typeof ResourceInputOptions;

        this.setState({
            type: ResourceInputOptions[key],
            value: "",
            variableName: ""
        });

        this.props.onValueUpdated("");
        this.props.onNewParameterNameChanged("");
    }

    onValueSelected(option: string): void {
        const typeString = this.state.type === ResourceInputOptions.Parameter ? "parameter" : "variable";

        this.setState({
            value: option
        });

        this.props.onValueUpdated("[" + typeString + "('" + option + "')]");
    }

    setVariableName(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            variableName: event.currentTarget.value
        });

        this.props.onNewParameterNameChanged(event.currentTarget.value);
    }

    render() {
        const options = [
            ResourceInputOptions[ResourceInputOptions.Parameter],
            ResourceInputOptions[ResourceInputOptions.Variable],
            ResourceInputOptions[ResourceInputOptions.Custom]
        ];

        let typeValue = ResourceInputOptions[this.state.type];

        let valueLabel: string;

        switch(this.state.type) {
            case ResourceInputOptions.Variable:
                valueLabel = "Variable";
                break;
            case ResourceInputOptions.Parameter:
                valueLabel = "Parameter";
                break;
            case ResourceInputOptions.Custom:
            default:
                valueLabel = "Value";
                break;
        }

        return <Fragment>
            <label htmlFor={this.props.id + "-type"}>Type</label>
            <div className="input-group">
                <Select id={this.props.id + "-type"} values={options} value={typeValue} hideEmpty={true} onOptionSelect={this.onTypeSelected}></Select>
            </div>

            <label htmlFor={this.props.id}>{valueLabel}</label>
            <div className="input-group">
                {this.state.type === ResourceInputOptions.Custom && this.props.children}
                {this.state.type !== ResourceInputOptions.Custom && 
                    <Select value={this.state.value} values={this.state.type === ResourceInputOptions.Parameter ? this.props.parameters : this.props.variables} required={true} id={this.props.id} onOptionSelect={this.onValueSelected}></Select> }
            </div>

            {this.state.type === ResourceInputOptions.Custom && <Fragment>
                <label htmlFor={this.props.id + "-new-parameter-name"}>New parameter name ([a-Z][a-Z0-9]*). Leave empty if no parameter is to be made</label>
                <div className="input-group">
                    <input type="text" className="form-control" pattern="\w[\w\d]*" id={this.props.id + "-new-parameter-name"} value={this.state.variableName} onChange={this.setVariableName} />
                </div>
            </Fragment>}
        </Fragment>
    }
}

export default ResourceInput;