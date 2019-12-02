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

        this.state = new MenuState();
    }

    onAddParameter() {
        this.setState({activeGroup: MenuOption.Parameters});
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
                    Variables
                </li>

                <li className={resourcesMenuClass}>
                    Resources
                </li>

                <li className={outputsMenuClass}>
                    Outputs
                </li>
            </ul>
            </div>)
    }
}

export default Menu;