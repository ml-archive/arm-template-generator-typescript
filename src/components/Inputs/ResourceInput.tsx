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
    realValue: string;
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

        this.state = this.getState(props);
    }

    getState(props: ResourceInputProps): ResourceInputState {
        let state = new ResourceInputState();
        state.type = ResourceInputOptions.Custom;
        state.value = "";
        state.realValue = "";
        state.variableName = "";

        if(props.value.startsWith("[parameters('")) {
            state.type = ResourceInputOptions.Parameter;
        }

        if(props.value.startsWith("[variables('")) {
            state.type = ResourceInputOptions.Variable;
        }

        if(state.type !== ResourceInputOptions.Custom) {
            state.value = props.value.split("'")[1];
            state.realValue = props.value;
        }

        return state;
    }

    componentDidUpdate(prevProps: ResourceInputProps) {
        if(this.props.value === prevProps.value || this.props.value === this.state.realValue) {
            return;
        }

        this.setState(this.getState(this.props));
    }

    onTypeSelected(option: string): void {
        const key = option as keyof typeof ResourceInputOptions;

        this.setState({
            type: ResourceInputOptions[key],
            value: "",
            realValue: "",
            variableName: ""
        });

        this.props.onValueUpdated("");
        this.props.onNewParameterNameChanged("");
    }

    onValueSelected(option: string): void {
        const typeString = this.state.type === ResourceInputOptions.Parameter ? "parameters" : "variables";
        const realValue = "[" + typeString + "('" + option + "')]";

        this.setState({
            value: option,
            realValue: realValue
        });

        this.props.onValueUpdated(realValue);
    }

    setVariableName(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            variableName: event.currentTarget.value
        });

        this.props.onNewParameterNameChanged(event.currentTarget.value);
    }

    render() {
        let options: string[] = [];

        if(this.props.parameters && this.props.parameters.length > 0){
            options.push(ResourceInputOptions[ResourceInputOptions.Parameter]);
        }

        if(this.props.variables && this.props.variables.length > 0){
            options.push(ResourceInputOptions[ResourceInputOptions.Variable]);
        }

        options.push(ResourceInputOptions[ResourceInputOptions.Custom]);

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