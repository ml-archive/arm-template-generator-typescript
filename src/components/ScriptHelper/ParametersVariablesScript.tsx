import { Component, Fragment } from "react";
import React = require("react");
import Parameter from "../../models/Parameter";
import Select from "../Inputs/Select";

export enum ParametersVariablesScriptType {
    Parameters,
    Variables
}

interface ParametersVariablesScriptProps {
    parameters?: { [index: string]: Parameter };
    variables?: { [index: string]: string | object | object[] };
    type: ParametersVariablesScriptType;
    onChange: (output: string) => void;
}

export class ParametersVariablesScript extends Component<ParametersVariablesScriptProps> {
    constructor(props: ParametersVariablesScriptProps) {
        super(props);

        this.parameterChosen = this.parameterChosen.bind(this);
    }

    parameterChosen(parameter: string) {
        const type: string = this.props.type === ParametersVariablesScriptType.Parameters
            ? "parameters"
            : "variables";

        const output: string = type + "('" + parameter + "')";
        this.props.onChange(output);
    }

    render() {
        const keys: string[] = Object.keys(this.props.type === ParametersVariablesScriptType.Parameters ? this.props.parameters : this.props.variables);
        const label: string = this.props.type === ParametersVariablesScriptType.Parameters ? "Choose a parameter" : "Choose a variable";

        return <Fragment>
            <label>{label}</label>
            <Select values={keys} onOptionSelect={this.parameterChosen}></Select>
        </Fragment>
    }
}

export default ParametersVariablesScript;