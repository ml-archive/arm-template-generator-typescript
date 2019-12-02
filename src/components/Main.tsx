import * as React from "react";
import { Component } from 'react'
import Menu from "./Menu";
import WorkingWindow, { Windows } from "./WorkingWindow";
import TemplateViewer from "./TemplateViewer";
import ArmTemplate from "../models/ArmTemplate";
import Parameter from "../models/Parameter";
import EntryTypes from "../models/EntryTypes";

export interface MainProps {}

export interface MainState {
    template: ArmTemplate;
    window: Windows,
    editKey?: string
}

export class Main extends Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);

        this.onAddParameter = this.onAddParameter.bind(this);
        this.onDeleteEntry = this.onDeleteEntry.bind(this);
        this.closeWindow = this.closeWindow.bind(this);
        this.onOpenWindow = this.onOpenWindow.bind(this);

        this.state = {
            template: new ArmTemplate(),
            window: Windows.None
        };
    }

    closeWindow(): void {
        this.setState({
            window: Windows.None,
            editKey: null
        });
    }

    onAddParameter(parameter: Parameter, name: string): void {
        let template = this.state.template;

        template.parameters[name] = parameter;

        this.setState({
            template: template
        });

        this.closeWindow();
    }

    onDeleteEntry(entryType: EntryTypes, key: string): void {
        let template = this.state.template;

        if(entryType === EntryTypes.Parameter) {
            delete(template.parameters[key]);
        }

        this.setState({
            template: template
        });
    }

    onOpenWindow(windowToOpen: Windows, key?: string): void {
        this.setState({
            window: windowToOpen,
            editKey: key
        });
    }

    render() {
        return (<div className="container-fluid">
            <h1>Welcome</h1>
            <div className="row">
                <div className="col-md">
                    <Menu deleteEntry={this.onDeleteEntry} openWindow={this.onOpenWindow} template={this.state.template}  />
                </div>
                <div className="col-md-6">
                    <WorkingWindow window={this.state.window} editKey={this.state.editKey} template={this.state.template} onAddParameter={this.onAddParameter} />
                </div>
                <div className="col-md">
                    <TemplateViewer template={this.state.template} />
                </div>
            </div>
        </div>)
    }
}

export default Main;