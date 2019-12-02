import { Component } from "react";
import React = require("react");
import Select from "../Inputs/Select";
import Parameter from "../../models/Parameter";

export interface AddParameterProps {
    parameter: Parameter;
}

class AddParameterState {
    parameter: Parameter;
}

export class AddParameter extends Component<AddParameterProps, AddParameterState> {
    constructor(props: AddParameterProps) {
        super(props);

        let state = new AddParameterState();
        state.parameter = props.parameter;

        this.state = state;
    }

    render() {
        const allowedTypeValues = ["bool", "string", "securestring", "int", "object", "secureObject", "array"];

        return (<div className="input-group">
            <Select values={allowedTypeValues}></Select>
        </div>);
    }
}

export default AddParameter;