import { Component } from "react";
import React = require("react");

class BadgeProps {
    value: string;
}

export class Badge extends Component<BadgeProps> {
    constructor(props: BadgeProps) {
        super(props);
    }

    render() {
        return (<span className="badge badge-secondary badge-pill">{this.props.value}</span>)
    }
}

export default Badge;