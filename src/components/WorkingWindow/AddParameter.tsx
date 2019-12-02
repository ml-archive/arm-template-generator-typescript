import { Component, Fragment, ChangeEvent } from "react";
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

        this.setName = this.setName.bind(this);
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
        } else {
            state.name = "";
        }

        this.state = state;
    }

    setName(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: event.currentTarget.value
        });
    }

    setType(type: string) {
        this.setState({
            type: type
        });
    }

    render() {
        const json = JSON.stringify(this.state);

        return (
        <Fragment>
            <label htmlFor="parameter-name">Name</label>
            <div className="input-group">
                <input type="text" className="form-control" required id="parameter-name" value={this.state.name} onChange={this.setName} />
            </div>

            <label htmlFor="parameter-type">Type</label>
            <div className="input-group">
                <Select id="parameter-type" required={true} values={Parameter.allowedTypes} onOptionSelect={this.setType} value={this.state.type}></Select>
            </div>

            <h3>JSON value (to be deleted)</h3>
            <p>{json}</p>
        </Fragment>);
    }
}

export default AddParameter;