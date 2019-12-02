import * as React from "react";
import { Component } from 'react'
import ArmTemplate from "../models/ArmTemplate";

export interface WorkingWindowProps {
    Template: ArmTemplate;
}

export class WorkingWindow extends Component<WorkingWindowProps> {
    Template: ArmTemplate;

    constructor(props: WorkingWindowProps) {
        super(props);

        this.Template = props.Template;
    }

    render() {
        return <h2>Working window</h2>
    }
}

export default WorkingWindow;