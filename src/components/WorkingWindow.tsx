import * as React from "react";
import { Component, Fragment } from 'react'
import ArmTemplate from "../models/ArmTemplate";
import AddParameter from "./WorkingWindow/AddParameter";

export interface WorkingWindowProps {
    Template: ArmTemplate;
}

export class WorkingWindow extends Component<WorkingWindowProps> {
    constructor(props: WorkingWindowProps) {
        super(props);
    }

    render() {
        return (<Fragment>
            <h2>Working window</h2>
            <AddParameter parameter={null}></AddParameter>
            </Fragment>)
    }
}

export default WorkingWindow;