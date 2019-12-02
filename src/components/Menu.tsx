import * as React from "react";
import { Component } from 'react'
import ArmTemplate from "../models/ArmTemplate";

export interface MenuProps {
    template: ArmTemplate;
}

enum MenuOption {
    Parameters,
    Variables,
    Resources,
    Outputs
}

class MenuState {
    activeGroup: MenuOption
}

export class Menu extends Component<MenuProps, MenuState> {
    constructor(props: MenuProps) {
        super(props);

        this.onAddParameter = this.onAddParameter.bind(this);
        this.onAddVariable = this.onAddVariable.bind(this);
        this.onAddResource = this.onAddResource.bind(this);
        this.onAddOutput = this.onAddOutput.bind(this);

        this.state = new MenuState();
    }

    onAddParameter() {
        this.setState({activeGroup: MenuOption.Parameters});
    }

    onAddVariable() {
        this.setState({activeGroup: MenuOption.Variables});
    }

    onAddResource() {
        this.setState({activeGroup: MenuOption.Resources});
    }

    onAddOutput() {
        this.setState({activeGroup: MenuOption.Outputs});
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

        return (<div>
            <h2>Menu</h2>

            <ul className="list-group">
                <li className={parametersMenuClass}>
                    <span>Parameters <a href="#" onClick={() => this.onAddParameter()}>Add</a></span>
                    <span className="badge badge-danger badge-pill">{Object.keys(this.props.template.parameters).length}</span>
                </li>

                <li className={variablesMenuClass}>
                    <span>Variables <a href="#" onClick={() => this.onAddVariable()}>Add</a></span>
                    <span className="badge badge-danger badge-pill">{Object.keys(this.props.template.variables).length}</span>
                </li>

                <li className={resourcesMenuClass}>
                    <span>Resources <a href="#" onClick={() => this.onAddResource()}>Add</a></span>
                    <span className="badge badge-danger badge-pill">{this.props.template.resources.length}</span>
                </li>

                <li className={outputsMenuClass}>
                    <span>Outputs <a href="#" onClick={() => this.onAddOutput()}>Add</a></span>
                    <span className="badge badge-danger badge-pill">{Object.keys(this.props.template.outputs).length}</span>
                </li>
            </ul>
            </div>)
    }
}

export default Menu;