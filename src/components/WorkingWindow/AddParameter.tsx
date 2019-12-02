import { Component, Fragment } from "react";
import React = require("react");
import Select from "../Inputs/Select";
import Parameter from "../../models/Parameter";

export interface AddParameterProps {
    parameter?: Parameter;
    name?: string;
}

class AddParameterState {
    name: string;
    type: string;
    defaultValue: any;
    minLength: number;
    maxLength: number;
    minValue: number;
    maxValue: number;
    allowedValues: any[];
    description: string;
}

export class AddParameter extends Component<AddParameterProps, AddParameterState> {
    constructor(props: AddParameterProps) {
        super(props);

        this.setType = this.setType.bind(this);

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
        }

        if(props.name) {
            state.name = props.name;
        }

        this.state = state;
    }

    setType(type: string) {
        this.setState({
            type: type
        });
    }

    render() {
        const json = JSON.stringify(this.state);

        const allowedTypeValues = ["bool", "string", "securestring", "int", "object", "secureObject", "array"];

        return (
        <Fragment>
            <label htmlFor="parameter-name"></label>

            <label htmlFor="parameter-type">Type</label>
            <div className="input-group">
                <Select id="parameter-type" values={allowedTypeValues} onOptionSelect={this.setType} value={this.state.type}></Select>
            </div>

            <h3>JSON value (to be deleted)</h3>
            <p>{json}</p>
        </Fragment>);
    }
}

export default AddParameter;