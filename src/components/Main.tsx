import * as React from "react";
import { Component } from 'react'
import Menu from "./Menu";
import WorkingWindow from "./WorkingWindow";
import TemplateViewer from "./TemplateViewer";

export class Main extends Component {
    render() {
        return (<div className="container-fluid">
            <h1>Welcome</h1>
            <div className="row">
                <div className="col-md">
                    <Menu />
                </div>
                <div className="col-md-6">
                    <WorkingWindow />
                </div>
                <div className="col-md">
                    <TemplateViewer />
                </div>
            </div>
        </div>)
    }
}

export default Main;