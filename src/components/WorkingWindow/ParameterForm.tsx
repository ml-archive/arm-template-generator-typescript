import { Component, Fragment, ChangeEvent } from "react";
import React = require("react");
import Select from "../Inputs/Select";
import Parameter, { ParameterMetadata } from "../../models/Parameter";
import ConditionalInput from "../Inputs/ConditionalInput";

interface ParameterFormProps {
    parameter?: Parameter;
    name?: string;
    onSubmit: (savedParameter: Parameter, parameterName: string) => void;
}

class ParameterFormState {
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

export class ParameterForm extends Component<ParameterFormProps, ParameterFormState> {
    constructor(props: ParameterFormProps) {
        super(props);

        this.setDefaultValue = this.setDefaultValue.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setName = this.setName.bind(this);
        this.setType = this.setType.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.state = this.initializeState(props);
    }

    initializeState(props: ParameterFormProps): ParameterFormState{
        let state = new ParameterFormState();

        if(props.parameter) {
            state.type = props.parameter.type;
            state.allowedValues = props.parameter.allowedValues;
            state.defaultValue = props.parameter.defaultValue;
            state.minLength = props.parameter.minLength;
            state.maxLength = props.parameter.maxLength;
            state.minValue = props.parameter.minValue;
            state.maxValue = props.parameter.maxValue;
            if(props.parameter.metadata) {
                state.description = props.parameter.metadata.description;
            } else {
                state.description = "";
            }
        } else {
            state.defaultValue = "";
            state.description = "";
        }

        if(props.name) {
            state.name = props.name;
        } else {
            state.name = "";
        }

        return state;
    }

    componentDidUpdate(prevProps: ParameterFormProps) {
        if(this.props.name === prevProps.name) {
            return;
        }

        this.setState(this.initializeState(this.props));
    }

    setDefaultValue(value: any): void {
        this.setState({
            defaultValue: value
        });
    }

    setDescription(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            description: event.currentTarget.value
        });
    }

    setName(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            name: event.currentTarget.value
        });
    }

    setType(type: string): void {
        this.setState({
            type: type,
            //Reset default value to make sure that the type is correct
            defaultValue: ""
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
            parameter.metadata = new ParameterMetadata();
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
            case "bool":
                defaultValueType = "bool";
        }

        return (
        <Fragment>
            <form onSubmit={this.submitForm}>
                <label htmlFor="parameter-name">Name</label>
                <div className="input-group">
                    <input type="text" className="form-control" required id="parameter-name" readOnly={this.props.name !== null && this.props.name !== undefined && this.props.name !== ""} value={this.state.name} onChange={this.setName} />
                </div>

                <label htmlFor="parameter-type">Type</label>
                <div className="input-group">
                    <Select id="parameter-type" required={true} values={Parameter.allowedTypes} onOptionSelect={this.setType} value={this.state.type}></Select>
                </div>

                {this.state.type && <ConditionalInput conditionalLabel="Set default value?" valueLabel="Default value" initialValue={this.state.defaultValue} type={defaultValueType} onChange={this.setDefaultValue} requiredWhenOpen={true}></ConditionalInput>}

                <label htmlFor="parameter-description">Description</label>
                <div className="input-group">
                    <input type="text" id="parameter-description" value={this.state.description} className="form-control" onChange={this.setDescription} />
                </div>

                <div className="input-group">
                    <button type="submit" className="btn btn-primary">Save</button>
                </div>
            </form>
        </Fragment>);
    }
}

export default ParameterForm;