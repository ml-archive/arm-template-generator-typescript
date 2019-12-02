import * as React from "react";
import { Component, Fragment } from 'react'
import ArmTemplate from "../models/ArmTemplate";
import AddParameter from "./WorkingWindow/AddParameter";
import Parameter from "../models/Parameter";

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

export interface WorkingWindowProps {
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

        return (<Fragment>
                <h2>{headline}</h2>
                {this.props.window === Windows.AddParameter && <AddParameter parameter={null} onSubmit={this.props.onAddParameter}></AddParameter> }
            </Fragment>)
    }
}

export default WorkingWindow;