import { Component } from "react";
import React = require("react");

interface ModalProps {
    show: boolean;
    closeModal: () => void;
    headline: string;
}

export class Modal extends Component<ModalProps> {
    render(): JSX.Element {
        let modalClass = "modal fade";
        if(this.props.show) {
            modalClass += " show";
         }

        return <div className={modalClass} tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{this.props.headline}</h5>
                        <button type="button" className="close" onClick={this.props.closeModal} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {this.props.children}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-primary" type="button" onClick={this.props.closeModal}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Modal;