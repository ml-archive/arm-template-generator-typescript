export class Parameter {
    type: string;
    defaultValue: boolean | string | number;
    minLength: number;
    maxLength: number;
    minValue: number;
    maxValue: number;
    allowedValues: string[] | number[];
    metadata: ParameterMetadata;

    static allowedTypes: string[] = ["bool", "string", "securestring", "int", "object", "secureObject", "array"];
}

export class ParameterMetadata {
    description: string;
}

export default Parameter;