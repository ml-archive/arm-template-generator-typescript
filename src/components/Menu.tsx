import * as React from "react";
import { Component } from 'react'
import ArmTemplate from "../models/ArmTemplate";

export interface MenuProps {
    Template: ArmTemplate;
}

export class Menu extends Component<MenuProps> {
    private Template: ArmTemplate;

    constructor(props: MenuProps) {
        super(props);

        this.Template = props.Template;
    }

    render() {
        return <h2>Menu</h2>
    }
}

export default Menu;