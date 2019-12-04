import { Component, Fragment, ChangeEvent } from "react";
import React = require("react");
import Select from "../Inputs/Select";
import Parameter, { ParameterMetadata } from "../../models/Parameter";
import ConditionalInput from "../Inputs/ConditionalInput";
import ListInput from "../Inputs/ListInput";

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

        this.setAllowedValues = this.setAllowedValues.bind(this);
        this.setDefaultValue = this.setDefaultValue.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setMinimumLength = this.setMinimumLength.bind(this);
        this.setMaximumLength = this.setMaximumLength.bind(this);
        this.setMinimumValue = this.setMinimumValue.bind(this);
        this.setMaximumValue = this.setMaximumValue.bind(this);
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

    setAllowedValues(values: any[]): void {
        this.setState({
            allowedValues: values
        });
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

    setMinimumLength(value: number): void {
        this.setState({
            minLength: value
        });
    }

    setMaximumLength(value: number): void {
        this.setState({
            maxLength: value
        });
    }

    setMinimumValue(value: number): void {
        this.setState({
            minValue: value
        });
    }

    setMaximumValue(value: number): void {
        this.setState({
            maxValue: value
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
            let allowedValues = this.state.allowedValues.filter(v => v !== "");

            if(allowedValues.length >= 1) {
                parameter.allowedValues = allowedValues;
            }
        }

        if(this.state.description) {
            parameter.metadata = new ParameterMetadata();
            parameter.metadata.description = this.state.description;
        }

        if(typeof(this.state.maxLength) === "number") {
            parameter.maxLength = this.state.maxLength;
        }

        if(typeof(this.state.maxValue) === "number") {
            parameter.maxValue = this.state.maxValue;
        }

        if(typeof(this.state.minLength) === "number") {
            parameter.minLength = this.state.minLength;
        }

        if(typeof(this.state.minValue) === "number") {
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

        const allowedValuesType = this.state.type === "int" ? "number" : "text";

        let defaultValue: string | number | boolean = null;
        let minValue: number = null;
        let maxValue: number = null;
        let minLength: number = null;
        let maxLength: number = null;
        let allowedValues: any[] = [];

        if(this.props.parameter) {
            defaultValue = this.props.parameter.defaultValue;
            minValue = this.props.parameter.minValue;
            maxValue = this.props.parameter.maxValue;
            minLength = this.props.parameter.minLength;
            maxLength = this.props.parameter.maxLength;
            allowedValues = this.props.parameter.allowedValues
        }

        return (
        <Fragment>
            <form onSubmit={this.submitForm}>
                <label htmlFor="parameter-name">Name ([a-Z][a-Z0-9]*)</label>
                <div className="input-group">
                    <input type="text" className="form-control" pattern="\w[\w\d]*" required id="parameter-name" readOnly={this.props.name !== null && this.props.name !== undefined && this.props.name !== ""} value={this.state.name} onChange={this.setName} />
                </div>

                <label htmlFor="parameter-type">Type</label>
                <div className="input-group">
                    <Select id="parameter-type" required={true} values={Parameter.allowedTypes} onOptionSelect={this.setType} value={this.state.type}></Select>
                </div>

                {defaultValueType && <ConditionalInput id="parameter-default-value" conditionalLabel="Set default value?" valueLabel="Default value" initialValue={defaultValue} type={defaultValueType} onChange={this.setDefaultValue} requiredWhenOpen={true}></ConditionalInput>}

                <label htmlFor="parameter-description">Description</label>
                <div className="input-group">
                    <input type="text" id="parameter-description" value={this.state.description} className="form-control" onChange={this.setDescription} />
                </div>

                {this.state.type === "int" && <Fragment>
                    <ConditionalInput id="parameter-minimum-value" conditionalLabel="Set minimum value?" valueLabel="Minimum value" initialValue={minValue} type="number" onChange={this.setMinimumValue} requiredWhenOpen={true}></ConditionalInput>
                    <ConditionalInput id="parameter-maximum-value" conditionalLabel="Set maximum value?" valueLabel="Maximum value" initialValue={maxValue} type="number" onChange={this.setMaximumValue} requiredWhenOpen={true}></ConditionalInput>
                </Fragment>}

                {(this.state.type === "string" || this.state.type === "securestring" || this.state.type === "array") && <Fragment>
                <ConditionalInput id="parameter-minimum-length" conditionalLabel="Set minimum length?" valueLabel="Minimum length" initialValue={minLength} type="number" onChange={this.setMinimumLength} requiredWhenOpen={true}></ConditionalInput>
                    <ConditionalInput id="parameter-maximum-length" conditionalLabel="Set maximum length?" valueLabel="Maximum length" initialValue={maxLength} type="number" onChange={this.setMaximumLength} requiredWhenOpen={true}></ConditionalInput>
                    </Fragment>}

                {(this.state.type === "string" || this.state.type === "securestring" || this.state.type === "int") &&
                <ListInput initialValue={allowedValues} label="Allowed values" onChange={this.setAllowedValues} type={allowedValuesType}></ListInput>}

                <div className="input-group">
                    <button type="submit" className="btn btn-primary">Save</button>
                </div>
            </form>
        </Fragment>);
    }
}

export default ParameterForm;