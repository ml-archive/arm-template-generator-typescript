import * as React from "react";
import { Component } from 'react'
import ArmTemplate from "../models/ArmTemplate";

export interface TemplateViewerProps {
    Template: ArmTemplate;
}

export class TemplateViewer extends Component<TemplateViewerProps> {
    Template: ArmTemplate;

    constructor(props: TemplateViewerProps) {
        super(props);

        this.Template = props.Template;
    }

    render() {
        const json = JSON.stringify(this.Template);

        return (<div>
            <h2>Template viewer</h2>

            <textarea className="form-control" readOnly>{json}</textarea>
            </div>)
    }
}

export default TemplateViewer;