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
    setDefaultValue: boolean;
}

export class AddParameter extends Component<AddParameterProps, AddParameterState> {
    constructor(props: AddParameterProps) {
        super(props);

        this.onSetDefaultValue = this.onSetDefaultValue.bind(this);
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
            state.setDefaultValue = props.parameter.defaultValue !== undefined && props.parameter.defaultValue !== null;
        } else {
            state.defaultValue = "";
            state.setDefaultValue = false;
        }

        if(props.name) {
            state.name = props.name;
        } else {
            state.name = "";
        }

        this.state = state;
    }

    onSetDefaultValue(event: ChangeEvent<HTMLInputElement>): void {
        if(event.currentTarget.checked === false) {
            this.setState({
                setDefaultValue: event.currentTarget.checked,
                defaultValue: ""
            });
        } else {
            this.setState({
                setDefaultValue: event.currentTarget.checked
            });
        }
    }

    setDefaultValue(event: ChangeEvent<HTMLInputElement>): void {
        if(this.state.type === "int") {
            this.setState({
                defaultValue: Number(event.currentTarget.value)
            });
        } else if(this.state.type === "bool") {
            this.setState({
                defaultValue: event.currentTarget.checked
            });
        } else {
            this.setState({
                defaultValue: event.currentTarget.value
            });
        }
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

                <div className="input-group">
                    <label htmlFor="parameter-set-default">
                        <input type="checkbox" id="parameter-set-default" checked={this.state.setDefaultValue} onChange={this.onSetDefaultValue} /> Set default value?
                    </label>
                </div>

                {this.state.setDefaultValue && defaultValueType &&
                <Fragment><label htmlFor="parameter-default-value">Default value</label>
                    <div className="input-group">
                        <input type={defaultValueType} id="parameter-default-value" value={this.state.defaultValue} className="form-control" onChange={this.setDefaultValue} />
                    </div>
                </Fragment>}

                {this.state.setDefaultValue && this.state.type === "bool" &&
                <div className="input-group">
                    <label htmlFor="parameter-default-value">
                        <input type="checkbox" id="parameter-default-value" checked={this.state.defaultValue} onChange={this.setDefaultValue} />
                    </label>
                </div>}

                <div className="input-group">
                    <button type="submit" className="btn btn-primary">Save</button>
                </div>
            </form>
        </Fragment>);
    }
}

export default AddParameter;