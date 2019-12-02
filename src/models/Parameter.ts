export class Parameter {
    Type: string;
    DefaultValue: any;
    MinLength: number;
    MaxLength: number;
    AllowedValues: any[];
    Metadata: ParameterMetadata;
}

export class ParameterMetadata {
    Description: string;
}