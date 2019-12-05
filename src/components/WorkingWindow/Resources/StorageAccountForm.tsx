import { ResourceTypeForm, ResourceFormState, ResourceFormProps } from "./ResourceTypeForm";
import StorageAccount, { StorageAccountProperties } from "../../../models/Resources/StorageAccount";
import { Fragment } from "react";
import React = require("react");
import Select from "../../Inputs/Select";
import ResourceInput from "../../Inputs/ResourceInput";

class StorageAccountFormState extends ResourceFormState {
    kind: string;
    kindParameterName: string;
    accessTier: string;
    accessTierParameterName: string;
    httpsOnly: string | boolean;
    httpsOnlyString: string;
    httpsOnlyParameterName: string;
    blobEncryption: boolean | string;
    blobEncryptionString: string;
    blobEncryptionParameterName: string;
    fileEncryption: boolean | string;
    fileEncryptionString: string;
    fileEncryptionParameterName: string;
}

export class StorageAccountForm extends ResourceTypeForm<StorageAccount, StorageAccountFormState> {
    protected getNewState(): StorageAccountFormState {
        return new StorageAccountFormState();
    }

    constructor(props: ResourceFormProps<StorageAccount>) {
        super(props);

        this.onAccessTierParameterNameUpdated = this.onAccessTierParameterNameUpdated.bind(this);
        this.onAccessTierSelected = this.onAccessTierSelected.bind(this);
        this.onKindParameterNameUpdated = this.onKindParameterNameUpdated.bind(this);
        this.onKindSelected = this.onKindSelected.bind(this);
        this.onHttpsOnlyUpdated = this.onHttpsOnlyUpdated.bind(this);
        this.onHttpsOnlyParameterNameUpdated = this.onHttpsOnlyParameterNameUpdated.bind(this);
        this.onBlobEncryptionUpdated = this.onBlobEncryptionUpdated.bind(this);
        this.onBlobEncryptionParameterNameUpdated = this.onBlobEncryptionParameterNameUpdated.bind(this);
        this.onFileEncryptionUpdated = this.onFileEncryptionUpdated.bind(this);
        this.onFileEncryptionParameterNameUpdated = this.onFileEncryptionParameterNameUpdated.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        let state = this.getBaseState(props);
        state.kind = "";
        state.kindParameterName = "";
        state.accessTier = "";
        state.accessTierParameterName = "";
        state.httpsOnly = false;
        state.httpsOnlyString = "";
        state.httpsOnlyParameterName = "";
        state.blobEncryption = false;
        state.blobEncryptionString = "";
        state.blobEncryptionParameterName = "";
        state.fileEncryption = false;
        state.fileEncryptionString = "";
        state.fileEncryptionParameterName = "";

        if(props.resource) {
            if(props.resource.kind) {
                state.kind = props.resource.kind;
            }

            if(props.resource.properties) {
                if(props.resource.properties.accessTier) {
                    state.accessTier = props.resource.properties.accessTier;
                }

                if(props.resource.properties.supportsHttpsTrafficOnly !== null && props.resource.properties.supportsHttpsTrafficOnly !== undefined) {
                    state.httpsOnly = props.resource.properties.supportsHttpsTrafficOnly;
                    state.httpsOnlyString = String(props.resource.properties.supportsHttpsTrafficOnly);
                }

                if(props.resource.properties.encryption && props.resource.properties.encryption.services) {
                    if(props.resource.properties.encryption.services.blob) {
                        state.blobEncryption = props.resource.properties.encryption.services.blob.enabled;
                        state.blobEncryptionString = String(props.resource.properties.encryption.services.blob.enabled);
                    }

                    if(props.resource.properties.encryption.services.file) {
                        state.fileEncryption = props.resource.properties.encryption.services.file.enabled;
                        state.fileEncryptionString = String(props.resource.properties.encryption.services.file.enabled);
                    }
                }
            }
        }

        this.state = state;
    }

    onAccessTierSelected(option: string) {
        this.setState({
            accessTier: option
        });
    }

    onAccessTierParameterNameUpdated(name: string) {
        this.setState({
            accessTierParameterName: name
        });
    }

    onKindParameterNameUpdated(name: string) {
        this.setState({
            kindParameterName: name
        });
    }

    onKindSelected(option: string) {
        this.setState({
            kind: option
        });
    }

    onHttpsOnlyUpdated(value: boolean | string) {
        this.setState({
            httpsOnly: value === "" ? false : value,
            httpsOnlyString: String(value)
        });
    }

    onHttpsOnlyParameterNameUpdated(name: string) {
        this.setState({
            httpsOnlyParameterName: name
        });
    }

    onBlobEncryptionUpdated(value: boolean | string) {
        this.setState({
            blobEncryption: value === "" ? false : value,
            blobEncryptionString: String(value)
        });
    }

    onBlobEncryptionParameterNameUpdated(name: string) {
        this.setState({
            blobEncryptionParameterName: name
        });
    }

    onFileEncryptionUpdated(value: boolean | string) {
        this.setState({
            fileEncryption: value === "" ? false : value,
            fileEncryptionString: String(value)
        });
    }

    onFileEncryptionParameterNameUpdated(name: string) {
        this.setState({
            fileEncryptionParameterName: name
        });
    }

    onSubmit(): void {
        throw new Error("Method not implemented.");
    }

    getSpecificMarkup(): JSX.Element {
        const parameters = Object.keys(this.props.template.parameters);
        const variables = Object.keys(this.props.template.variables);

        let httpsOnly = this.state.httpsOnly === true;
        let blobEncryption = this.state.blobEncryption === true;
        let fileEncryption = this.state.fileEncryption === true;

        return (<Fragment>
            <h3>Kind*</h3>
            <ResourceInput id="resource-kind" value={this.state.kind} parameters={parameters} variables={variables} onValueUpdated={this.onKindSelected} onNewParameterNameChanged={this.onKindParameterNameUpdated}>
                <Select id="resource-kind" required={true} value={this.state.kind} values={StorageAccount.allowedKinds} onOptionSelect={this.onKindSelected}></Select>
            </ResourceInput>

            <h3>Access tier</h3>
            <ResourceInput id="resource-access-tier" value={this.state.accessTier} parameters={parameters} variables={variables} onValueUpdated={this.onAccessTierSelected} onNewParameterNameChanged={this.onAccessTierParameterNameUpdated}>
                <Select id="resource-access-tier" value={this.state.accessTier} values={StorageAccountProperties.allowedAccessTiers} onOptionSelect={this.onAccessTierSelected}></Select>
            </ResourceInput>

            <h3>Only allow HTTPS connections?</h3>
            <ResourceInput id="resource-https-only" value={this.state.httpsOnlyString} parameters={parameters} variables={variables} onValueUpdated={this.onHttpsOnlyUpdated} onNewParameterNameChanged={this.onHttpsOnlyParameterNameUpdated}>
                <label htmlFor="resource-https-only-bool">
                    <input type="checkbox" checked={httpsOnly} id="resource-https-only-bool" onChange={(e) => this.onHttpsOnlyUpdated(e.currentTarget.checked)} /> Only allow HTTPS connections
                </label>
            </ResourceInput>

            <h3>Encrypt blob storage?</h3>
            <ResourceInput id="resource-blob-encryption" value={this.state.blobEncryptionString} parameters={parameters} variables={variables} onValueUpdated={this.onBlobEncryptionUpdated} onNewParameterNameChanged={this.onBlobEncryptionParameterNameUpdated}>
                <label htmlFor="resource-blob-encryption-bool">
                    <input type="checkbox" checked={blobEncryption} id="resource-blob-encryption-bool" onChange={(e) => this.onBlobEncryptionUpdated(e.currentTarget.checked)} /> Encrypt blob storage
                </label>
            </ResourceInput>

            <h3>Encrypt file storage?</h3>
            <ResourceInput id="resource-file-encryption" value={this.state.fileEncryptionString} parameters={parameters} variables={variables} onValueUpdated={this.onFileEncryptionUpdated} onNewParameterNameChanged={this.onFileEncryptionParameterNameUpdated}>
                <label htmlFor="resource-file-encryption-bool">
                    <input type="checkbox" checked={fileEncryption} id="resource-file-encryption-bool" onChange={(e) => this.onFileEncryptionUpdated(e.currentTarget.checked)} /> Encrypt file storage
                </label>
            </ResourceInput>
        </Fragment>);
    }
}