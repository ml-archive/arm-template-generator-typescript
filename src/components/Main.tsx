import * as React from "react";
import { Component } from 'react'
import Menu from "./Menu";
import WorkingWindow from "./WorkingWindow";
import TemplateViewer from "./TemplateViewer";
import ArmTemplate from "../models/ArmTemplate";

export interface MainProps {}

export interface MainState {
    template: ArmTemplate;
}

export class Main extends Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);

        this.state = {
            template: new ArmTemplate()
        };
    }

    render() {
        return (<div className="container-fluid">
            <h1>Welcome</h1>
            <div className="row">
                <div className="col-md">
                    <Menu template={this.state.template} />
                </div>
                <div className="col-md-6">
                    <WorkingWindow Template={this.state.template} />
                </div>
                <div className="col-md">
                    <TemplateViewer Template={this.state.template} />
                </div>
            </div>
        </div>)
    }
}

export default Main;