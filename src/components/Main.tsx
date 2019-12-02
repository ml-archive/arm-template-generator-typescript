import * as React from "react";
import { Component } from 'react'
import Menu from "./Menu";
import WorkingWindow from "./WorkingWindow";
import TemplateViewer from "./TemplateViewer";
import ArmTemplate from "../models/ArmTemplate";
import Parameter from "../models/Parameter";

export interface MainProps {}

export interface MainState {
    template: ArmTemplate;
}

export class Main extends Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);

        this.onAddParameter = this.onAddParameter.bind(this);

        this.state = {
            template: new ArmTemplate()
        };
    }

    onAddParameter(parameter: Parameter, name: string): void {
        let template = this.state.template;

        template.parameters[name] = parameter;

        this.setState({
            template: template
        });
    }

    render() {
        return (<div className="container-fluid">
            <h1>Welcome</h1>
            <div className="row">
                <div className="col-md">
                    <Menu template={this.state.template} />
                </div>
                <div className="col-md-6">
                    <WorkingWindow template={this.state.template} onAddParameter={this.onAddParameter} />
                </div>
                <div className="col-md">
                    <TemplateViewer template={this.state.template} />
                </div>
            </div>
        </div>)
    }
}

export default Main;