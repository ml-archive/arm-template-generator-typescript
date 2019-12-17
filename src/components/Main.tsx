import * as React from "react";
import { Component } from 'react'
import Menu from "./Menu";
import WorkingWindow, { Windows } from "./WorkingWindow";
import TemplateViewer from "./TemplateViewer";
import ArmTemplate from "../models/ArmTemplate";
import Parameter from "../models/Parameter";
import EntryTypes from "../models/EntryTypes";
import FileLoader from "./FileLoader";
import Resource from "../models/Resource";
import ResourceManager from "../models/Resources/ResourceManager";

interface MainProps {}

class MainState {
    template: ArmTemplate;
    window: Windows;
    editKey?: string
}

export class Main extends Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);

        this.closeWindow = this.closeWindow.bind(this);
        this.loadFile = this.loadFile.bind(this);
        this.onSubmitParameter = this.onSubmitParameter.bind(this);
        this.onSubmitResource = this.onSubmitResource.bind(this);
        this.onSubmitVariable = this.onSubmitVariable.bind(this);
        this.onDeleteEntry = this.onDeleteEntry.bind(this);
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

    loadFile(fileContent: string): void {
        let dumbTemplate: ArmTemplate = JSON.parse(fileContent);

        let template = new ArmTemplate();

        Object.keys(dumbTemplate.parameters).forEach((key) => {
            template.parameters[key] = Object.assign(new Parameter(), dumbTemplate.parameters[key]);
        });
        
        template.variables = dumbTemplate.variables;

        dumbTemplate.resources.map(r => {
            template.resources.push(ResourceManager.getSpecificResource(r));
        });

        template.resources.map(r => {
            r.setDependantResources(template.resources);
        });

        this.setState({
            template: template
        });

        this.closeWindow();
    }

    onSubmitParameter(parameter: Parameter, name: string): void {
        let template = this.state.template;

        template.parameters[name] = parameter;

        this.setState({
            template: template
        });

        this.closeWindow();
    }

    onSubmitVariable(variable: string | object | object[], name: string): void {
        let template = this.state.template;

        template.variables[name] = variable;

        this.setState({
            template: template
        });

        this.closeWindow();
    }

    onSubmitResource(resources: Resource[], parameters: { [index: string]: Parameter }): ArmTemplate {
        let template = this.state.template;

        resources.forEach((resource: Resource) => {
            let index = template.resources.findIndex(r => r.name === resource.name);

            if(index < 0) {
                template.resources.push(resource);
            } else {
                template.resources[index] = resource;
            }
        });

        Object.keys(parameters).forEach(key => {
            template.parameters[key] = parameters[key];
        });

        this.closeWindow();
        this.setState({
            template: template
        });

        return template;
    }

    onDeleteEntry(entryType: EntryTypes, key: string): void {
        let template = this.state.template;

        if(entryType === EntryTypes.Parameter) {
            delete(template.parameters[key]);
        }

        if(entryType === EntryTypes.Variable) {
            delete(template.variables[key]);
        }

        if(entryType === EntryTypes.Output) {
            delete(template.outputs[key]);
        }

        if(entryType === EntryTypes.Resource) {
            let index = template.resources.findIndex(r => r.name === key);
            template.resources.splice(index, 1);
        }

        this.setState({
            template: template
        });

        if(key && this.state.editKey === key) {
            this.closeWindow();
        }
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
            <FileLoader text="Load file" onFileRead={this.loadFile}></FileLoader>
            <div className="row">
                <div className="col-md">
                    <Menu currentlyOpenWindow={this.state.window} deleteEntry={this.onDeleteEntry} openWindow={this.onOpenWindow} template={this.state.template}  />
                </div>
                <div className="col-md-6">
                    <WorkingWindow window={this.state.window} editKey={this.state.editKey} template={this.state.template} onSubmitParameter={this.onSubmitParameter} onSubmitVariable={this.onSubmitVariable} onSubmitResource={this.onSubmitResource} />
                </div>
                <div className="col-md">
                    <TemplateViewer template={this.state.template} />
                </div>
            </div>
        </div>)
    }
}

export default Main;