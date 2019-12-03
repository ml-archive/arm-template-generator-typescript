import * as React from "react";
import { Component, Fragment, ChangeEvent } from "react";

interface FileLoaderProps {
    text: string;
    onFileRead: (content: string) => void;
}

export class FileLoader extends Component<FileLoaderProps> {
    constructor(props: FileLoaderProps) {
        super(props);

        this.clickFileLoader = this.clickFileLoader.bind(this);
        this.loadFile = this.loadFile.bind(this);
    }

    private fileInput: HTMLInputElement;

    clickFileLoader() {
        this.fileInput.click();
    }

    loadFile(event: ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        reader.onload = () => {
            this.props.onFileRead(String(reader.result));
        }

        reader.readAsText(event.currentTarget.files[0]);
    }

    render() {
    return <Fragment>
        <input ref={fileInput => this.fileInput = fileInput} type="file" className="hidden" onChange={this.loadFile} accept=".json" />
        <button className="btn btn-primary" onClick={this.clickFileLoader}>{this.props.text}</button>
        </Fragment>
    }
}

export default FileLoader;