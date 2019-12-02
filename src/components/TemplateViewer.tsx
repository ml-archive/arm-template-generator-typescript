import * as React from "react";
import { Component } from 'react'
import ArmTemplate from "../models/ArmTemplate";

export interface TemplateViewerProps {
    Template: ArmTemplate;
}

export class TemplateViewer extends Component<TemplateViewerProps> {
    constructor(props: TemplateViewerProps) {
        super(props);
    }

    render() {
        const json = JSON.stringify(this.props.Template, (_key, value) => { if(value !== null) return value;}, 2);
        const style = {
            height: "500px"
        };

        return (<div>
            <h2>Template viewer</h2>

            <textarea className="form-control" readOnly value={json} style={style}></textarea>
            </div>)
    }
}

export default TemplateViewer;