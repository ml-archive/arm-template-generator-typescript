import * as React from "react";
import { Component, Fragment } from 'react'
import ArmTemplate from "../models/ArmTemplate";
import ParameterForm from "./WorkingWindow/ParameterForm";
import Parameter from "../models/Parameter";
import ScriptHelper, { ScriptContextType } from "./ScriptHelper/ScriptHelper";

export enum Windows {
    AddParameter,
    EditParameter,
    AddVariable,
    EditVariable,
    AddResource,
    EditResource,
    AddOutput,
    EditOutput,
    None
}

interface WorkingWindowProps {
    template: ArmTemplate;
    onAddParameter: (parameter: Parameter, name: string) => void;
    window: Windows;
    editKey?: string;
}

export class WorkingWindow extends Component<WorkingWindowProps> {
    constructor(props: WorkingWindowProps) {
        super(props);
    }

    getHeadline(currentWindow: Windows, key?: string): string {
        switch(currentWindow) {
            case Windows.AddOutput:
                return "Add output";
            case Windows.AddParameter:
                return "Add parameter";
            case Windows.AddResource:
                return "Add resource";
            case Windows.AddVariable:
                return "Add variable";
            case Windows.EditOutput:
                return "Edit output: " + key;
            case Windows.EditParameter:
                return "Edit parameter: " + key;
            case Windows.EditResource:
                return "Edit resource: " + key;
            case Windows.EditVariable:
                return "Edit variable: " + key;
            case Windows.None:
                return "Select something in the menu";
        }

        return "Unknown window selected";
    }

    render() {
        let headline: string = this.getHeadline(this.props.window, this.props.editKey);

        let showScriptHelper: boolean = false;
        let scriptContextType: ScriptContextType;

        if(this.props.window === Windows.AddVariable || this.props.window === Windows.EditVariable) {
            showScriptHelper = true;
            scriptContextType = ScriptContextType.Variables;
        }

        if(this.props.window === Windows.AddResource || this.props.window === Windows.EditResource) {
            showScriptHelper = true;
            scriptContextType = ScriptContextType.Resources;
        }

        return (<Fragment>
                {showScriptHelper && <ScriptHelper topLevel={true} template={this.props.template} context={scriptContextType}></ScriptHelper>}
                <h2>{headline}</h2>
                {this.props.window === Windows.AddParameter && <ParameterForm parameter={null} onSubmit={this.props.onAddParameter}></ParameterForm> }
                {this.props.window === Windows.EditParameter && <ParameterForm parameter={this.props.template.parameters[this.props.editKey]} name={this.props.editKey} onSubmit={this.props.onAddParameter}></ParameterForm>}
            </Fragment>)
    }
}

export default WorkingWindow;