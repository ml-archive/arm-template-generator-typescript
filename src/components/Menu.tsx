import * as React from "react";
import { Component, Fragment } from 'react'
import ArmTemplate from "../models/ArmTemplate";
import Parameter from "../models/Parameter";
import { Windows } from "./WorkingWindow";
import EntryTypes from "../models/EntryTypes";
import Badge from "./Badge";

export interface MenuProps {
    template: ArmTemplate;
    openWindow: (window: Windows, key?: string) => void,
    deleteEntry: (entryType: EntryTypes, key: string) => void
}

enum MenuOption {
    Parameters,
    Variables,
    Resources,
    Outputs
}

class MenuState {
    activeGroup: MenuOption;
    activeKey: string;
    parameterCount: number;
    variableCount: number;
    resourceCount: number;
    outputCount: number;
}

export class Menu extends Component<MenuProps, MenuState> {
    constructor(props: MenuProps) {
        super(props);

        this.onAddParameter = this.onAddParameter.bind(this);
        this.onAddVariable = this.onAddVariable.bind(this);
        this.onAddResource = this.onAddResource.bind(this);
        this.onAddOutput = this.onAddOutput.bind(this);

        this.onDeleteParameter = this.onDeleteParameter.bind(this);

        this.onEditParameter = this.onEditParameter.bind(this);

        this.renderParameters = this.renderParameters.bind(this);
        this.renderParameter = this.renderParameter.bind(this);

        this.state = new MenuState();
    }

    componentDidUpdate(nextProps: MenuProps) {
        let parameterCount = Object.keys(nextProps.template.parameters).length;
        let variableCount = Object.keys(nextProps.template.variables).length;
        let resourceCount = nextProps.template.resources.length;
        let outputCount = Object.keys(nextProps.template.outputs).length;

        if(parameterCount != this.state.parameterCount
            || variableCount != this.state.variableCount
            || resourceCount != this.state.resourceCount
            || outputCount != this.state.outputCount) {
            this.setState({
                parameterCount: Object.keys(nextProps.template.parameters).length,
                variableCount: Object.keys(nextProps.template.variables).length,
                resourceCount: nextProps.template.resources.length,
                outputCount: Object.keys(nextProps.template.outputs).length
            });
        }
    }

    onAddParameter() {
        this.setState({
            activeGroup: MenuOption.Parameters,
            activeKey: null
        });

        this.props.openWindow(Windows.AddParameter);
    }

    onAddVariable() {
        this.setState({
            activeGroup: MenuOption.Variables,
            activeKey: null
        });

        this.props.openWindow(Windows.AddVariable);
    }

    onAddResource() {
        this.setState({
            activeGroup: MenuOption.Resources,
            activeKey: null
        });

        this.props.openWindow(Windows.AddResource);
    }

    onAddOutput() {
        this.setState({
            activeGroup: MenuOption.Outputs,
            activeKey: null
        });

        this.props.openWindow(Windows.AddOutput);
    }

    onDeleteParameter(parameterName: string) {
        if(window.confirm('Are you sure you want to delete ' + parameterName + '?')) {
            this.props.deleteEntry(EntryTypes.Parameter, parameterName);
        }
    }

    onEditParameter(parameterName: string) {
        this.setState({
            activeGroup: MenuOption.Parameters,
            activeKey: parameterName
        });

        this.props.openWindow(Windows.EditParameter, parameterName);
    }

    renderParameter(parameterName: string) {
        let className = "list-group-item sub-item d-flex justify-content-between"
        if(this.state.activeKey === parameterName)
            className += " active";

        return <li key={parameterName} className={className}>
            {parameterName} <span><a href="#" onClick={() => this.onEditParameter(parameterName)}>Edit</a>
            <a href="#" onClick={() => this.onDeleteParameter(parameterName)}>Delete</a></span>
        </li>
    }

    renderParameters(parameters: { [index: string]: Parameter }) {
        if(this.state.parameterCount <= 0)
            return null;

        return (<Fragment>
            {Object.keys(parameters).map((key) => {
                return this.renderParameter(key);
            })}
            </Fragment>)
    }

    render() {
        const baseClassName: string = "list-group-item d-flex justify-content-between";

        let parametersMenuClass: string = baseClassName;
        let variablesMenuClass: string = baseClassName;
        let resourcesMenuClass: string = baseClassName;
        let outputsMenuClass: string = baseClassName;
        if(this.state.activeGroup == MenuOption.Parameters)
            parametersMenuClass += " active";

        else if(this.state.activeGroup == MenuOption.Variables)
            variablesMenuClass += " active";
        

        else if(this.state.activeGroup == MenuOption.Resources)
            resourcesMenuClass += " active";

        else if(this.state.activeGroup == MenuOption.Outputs)
            outputsMenuClass += " active";

        return (<Fragment>
            <h2>Menu</h2>

            <ul className="list-group">
                <li key="parameters" className={parametersMenuClass}>
                    <span>Parameters <a href="#" onClick={() => this.onAddParameter()}>Add</a></span>
                    <Badge value={String(Object.keys(this.props.template.parameters).length)}></Badge>
                </li>
                
                {this.renderParameters(this.props.template.parameters)}

                <li key="variables" className={variablesMenuClass}>
                    <span>Variables <a href="#" onClick={() => this.onAddVariable()}>Add</a></span>
                    <Badge value={String(Object.keys(this.props.template.variables).length)}></Badge>
                </li>

                <li key="resources" className={resourcesMenuClass}>
                    <span>Resources <a href="#" onClick={() => this.onAddResource()}>Add</a></span>
                    <Badge value={String(this.props.template.resources.length)}></Badge>
                </li>

                <li key="outputs" className={outputsMenuClass}>
                    <span>Outputs <a href="#" onClick={() => this.onAddOutput()}>Add</a></span>
                    <Badge value={String(Object.keys(this.props.template.outputs).length)}></Badge>
                </li>
            </ul>
            </Fragment>)
    }
}

export default Menu;