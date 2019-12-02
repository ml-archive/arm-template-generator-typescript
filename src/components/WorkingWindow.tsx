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

    render() {
        return (<Fragment>
                <h2>Working window</h2>
                {this.props.window === Windows.AddParameter && <AddParameter parameter={null} onSubmit={this.props.onAddParameter}></AddParameter> }
            </Fragment>)
    }
}

export default WorkingWindow;