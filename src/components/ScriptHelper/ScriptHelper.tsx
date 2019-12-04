import { Component, Fragment, RefObject } from "react";
import ArmTemplate from "../../models/ArmTemplate";
import React = require("react");
import Select from "../Inputs/Select";
import ParametersVariablesScript, { ParametersVariablesScriptType } from "./ParametersVariablesScript";
import ConcatScript from "./ConcatScript";

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

        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.onChange = this.onChange.bind(this);
        this.typeChosen = this.typeChosen.bind(this);

        this.renderedInput = React.createRef();

        let state = new ScriptHelperState();
        state.chosenType = Types.None;
        state.renderedValue = "";

        this.state = state;
    }

    private renderedInput: RefObject<HTMLInputElement>;

    copyToClipboard(): void {
        this.renderedInput.current.focus();
        this.renderedInput.current.select();
        document.execCommand('copy');
        this.renderedInput.current.blur();
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
                Types[Types.Variables],
                Types[Types.Concat],
                Types[Types.Custom]
            ];
        }

        if(this.props.includeText === true) {
            options.push(Types[Types.Text])
        }

        return <Fragment>
            <Select values={options} onOptionSelect={this.typeChosen} hideEmpty={true}></Select>
            {this.state.chosenType === Types.Parameters && <ParametersVariablesScript type={ParametersVariablesScriptType.Parameters} onChange={this.onChange} parameters={this.props.template.parameters}></ParametersVariablesScript>}
            {this.state.chosenType === Types.Variables && <ParametersVariablesScript type={ParametersVariablesScriptType.Variables} onChange={this.onChange} variables={this.props.template.variables}></ParametersVariablesScript>}
            {this.state.chosenType === Types.Custom && <input type="text" onChange={(e) => this.onChange(e.currentTarget.value)} className="form-control" />}
            {this.state.chosenType === Types.Text && <input type="text" onChange={(e) => this.onChange("'" + e.currentTarget.value + "'")} className="form-control" />}
            {this.state.chosenType === Types.Concat && <ConcatScript template={this.props.template} onChange={this.onChange} context={this.props.context}></ConcatScript>}
            {this.props.topLevel === true && <Fragment>
            <label htmlFor="script-helper-result">Script:</label>
            <div className="input-group">
                <input type="text" ref={this.renderedInput} id="script-helper-result" className="form-control" readOnly={true} value={this.state.renderedValue} />
                <div className="input-group-prepend">
                    <button type="button" className="btn btn-outline-primary" onClick={this.copyToClipboard}>Copy</button>
                </div>
            </div>
            </Fragment>}
        </Fragment>
    }
}

export default ScriptHelper;