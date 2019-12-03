import { Component, Fragment } from "react";
import ArmTemplate from "../../models/ArmTemplate";
import React = require("react");
import Select from "../Inputs/Select";
import ParametersVariablesScript, { ParametersVariablesScriptType } from "./ParametersVariablesScript";

export enum ScriptContextType {
    Variables,
    Resources,
    Outputs
}

enum Types {
    Concat,
    Variables,
    Parameters,
    Resources,
    Text,
    Custom,
    None
}

interface ScriptHelperProps {
    template: ArmTemplate;
    context: ScriptContextType;
    onChange?: (value: string) => void;
    topLevel: boolean;
    includeText?: boolean;
}

class ScriptHelperState {
    chosenType: Types;
    renderedValue: string;
}

export class ScriptHelper extends Component<ScriptHelperProps, ScriptHelperState> {
    constructor(props: ScriptHelperProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.typeChosen = this.typeChosen.bind(this);

        let state = new ScriptHelperState();
        state.chosenType = Types.None;
        state.renderedValue = "";

        this.state = state;
    }

    onChange(value: string) {
        let renderedValue = this.props.topLevel
            ? "[" + value + "]"
            : value;

        if(this.props.onChange) {
            this.props.onChange(renderedValue);
        }

        this.setState({
            renderedValue: renderedValue
        });
    }

    typeChosen(option: string): void {
        if(option === "") {
            this.setState({
                chosenType: Types.None
            });

            return;
        }

        let key = option as keyof typeof Types;
        this.setState({
            chosenType: Types[key]
        });

        this.onChange("");
    }

    render() {
        let options: string[];

        if(this.props.context == ScriptContextType.Variables) {
            options = [
                Types[Types.None],
                Types[Types.Parameters],
                Types[Types.Concat],
                Types[Types.Custom]
            ];
        }

        return <Fragment>
            <Select values={options} onOptionSelect={this.typeChosen} hideEmpty={true}></Select>
            {this.state.chosenType === Types.Parameters && <ParametersVariablesScript type={ParametersVariablesScriptType.Parameters} onChange={this.onChange} parameters={this.props.template.parameters}></ParametersVariablesScript>}
            {this.state.chosenType === Types.Variables && <ParametersVariablesScript type={ParametersVariablesScriptType.Variables} onChange={this.onChange} variables={this.props.template.variables}></ParametersVariablesScript>}
            {this.state.chosenType === Types.Custom && <input type="text" onChange={(e) => this.onChange(e.currentTarget.value)} className="form-control" />}
            {this.props.topLevel === true && <Fragment>
            <label htmlFor="script-helper-result">Script:</label>
            <div className="input-group">
                <input type="text" id="script-helper-result" className="form-control" readOnly={true} value={this.state.renderedValue} />
            </div>
            </Fragment>}
        </Fragment>
    }
}

export default ScriptHelper;