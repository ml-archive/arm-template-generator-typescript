import * as React from "react";
import { Component } from 'react'
import Menu from "./Menu";
import WorkingWindow from "./WorkingWindow";
import TemplateViewer from "./TemplateViewer";
import ArmTemplate from "../models/ArmTemplate";
import { Parameter, ParameterMetadata } from "../models/Parameter";

export interface MainProps {}

export class Main extends Component<MainProps> {
    private Template: ArmTemplate;

    constructor(props: MainProps) {
        super(props);

        this.Template = new ArmTemplate();

        let parameter = new Parameter();
        parameter.Type = "bool";
        parameter.DefaultValue = true;
        parameter.AllowedValues = [true, false];
        parameter.Metadata = new ParameterMetadata();
        parameter.Metadata.Description = "This is just a test";

        this.Template.Parameters["armTemplateTest"] = parameter;
    }

    render() {
        return (<div className="container-fluid">
            <h1>Welcome</h1>
            <div className="row">
                <div className="col-md">
                    <Menu Template={this.Template} />
                </div>
                <div className="col-md-6">
                    <WorkingWindow Template={this.Template} />
                </div>
                <div className="col-md">
                    <TemplateViewer Template={this.Template} />
                </div>
            </div>
        </div>)
    }
}

export default Main;