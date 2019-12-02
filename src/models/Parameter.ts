export class Parameter {
    type: string;
    defaultValue: any;
    minLength: number;
    maxLength: number;
    allowedValues: any[];
    metadata: ParameterMetadata;
}

export class ParameterMetadata {
    description: string;
}