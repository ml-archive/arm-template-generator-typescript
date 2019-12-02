export class Parameter {
    type: string;
    defaultValue: any;
    minLength: number;
    maxLength: number;
    minValue: number;
    maxValue: number;
    allowedValues: any[];
    metadata: ParameterMetadata;

    static allowedTypes: string[] = ["bool", "string", "securestring", "int", "object", "secureObject", "array"];
}

export class ParameterMetadata {
    description: string;
}

export default Parameter;