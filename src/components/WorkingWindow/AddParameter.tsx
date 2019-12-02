import { Component, Fragment, ChangeEvent } from "react";
import React = require("react");
import Select from "../Inputs/Select";
import Parameter from "../../models/Parameter";

export interface AddParameterProps {
    parameter?: Parameter;
    name?: string;
    onSubmit: (savedParameter: Parameter, parameterName: string) => void;
}

class AddParameterState {
    name: string;
    type: string;
    defaultValue: any;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    allowedValues: any[];
    description: string;
}

export class AddParameter extends Component<AddParameterProps, AddParameterState> {
    constructor(props: AddParameterProps) {
        super(props);

        this.setDefaultValue = this.setDefaultValue.bind(this);
        this.setName = this.setName.bind(this);
        this.setType = this.setType.bind(this);
        this.submitForm = this.submitForm.bind(this);

        let state = new AddParameterState();

        if(props.parameter) {
            state.type = props.parameter.type;
            state.allowedValues = props.parameter.allowedValues;
            state.defaultValue = props.parameter.defaultValue;
            state.minLength = props.parameter.minLength;
            state.maxLength = props.parameter.maxLength;
            state.minValue = props.parameter.minValue;
            state.maxValue = props.parameter.maxValue;
            state.description = props.parameter.metadata.description;
        } else {
            state.defaultValue = "";
        }

        if(props.name) {
            state.name = props.name;
        } else {
            state.name = "";
        }

        this.state = state;
    }

    setDefaultValue(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            defaultValue: event.currentTarget.value
        });
    }

    setName(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            name: event.currentTarget.value
        });
    }

    setType(type: string): void {
        this.setState({
            type: type
        });
    }

    submitForm(): void {
        let parameter = new Parameter();

        if(this.state.defaultValue) {
            parameter.defaultValue = this.state.defaultValue;
        }

        if(this.state.allowedValues) {
            parameter.allowedValues = this.state.allowedValues;
        }

        if(this.state.description) {
            parameter.metadata.description = this.state.description;
        }

        if(this.state.maxLength !== undefined) {
            parameter.maxLength = this.state.maxLength;
        }

        if(this.state.maxValue !== undefined) {
            parameter.maxValue = this.state.maxValue;
        }

        if(this.state.minLength !== undefined) {
            parameter.minLength = this.state.minLength;
        }

        if(this.state.minValue !== undefined) {
            parameter.minValue = this.state.minValue;
        }

        parameter.type = this.state.type;

        this.props.onSubmit(parameter, this.state.name);
    }

    render() {
        const json = JSON.stringify(this.state);
        let defaultValueType: string;

        switch(this.state.type) {
            case "string":
            case "securestring":
            case "object":
            case "secureObject":
            case "array":
                defaultValueType = "text";
                break;
            case "int":
                defaultValueType = "number";
                break;
        }

        return (
        <Fragment>
            <form onSubmit={this.submitForm}>
                <label htmlFor="parameter-name">Name</label>
                <div className="input-group">
                    <input type="text" className="form-control" required id="parameter-name" value={this.state.name} onChange={this.setName} />
                </div>

                <label htmlFor="parameter-type">Type</label>
                <div className="input-group">
                    <Select id="parameter-type" required={true} values={Parameter.allowedTypes} onOptionSelect={this.setType} value={this.state.type}></Select>
                </div>

                <label htmlFor="parameter-default-value">Default value</label>
                <div className="input-group">
                    {defaultValueType && <input type={defaultValueType} id="parameter-default-value" value={this.state.defaultValue} className="form-control" onChange={this.setDefaultValue} />}
                </div>

                <button type="submit" className="btn btn-primary">Save</button>

                <h3>JSON value (to be deleted)</h3>
                <p>{json}</p>
            </form>
        </Fragment>);
    }
}

export default AddParameter;