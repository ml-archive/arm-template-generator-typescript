export class Parameter {
    type: string;
    defaultValue: any;
    minLength: number;
    maxLength: number;
    minValue: number;
    maxValue: number;
    allowedValues: any[];
    metadata: ParameterMetadata;
}

export class ParameterMetadata {
    description: string;
}

export default Parameter;