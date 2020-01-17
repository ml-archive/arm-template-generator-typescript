import Resource from "../Resource";

export class ApplicationInsights extends Resource {
    static resourceType: string = "Microsoft.Insights/components";
    static displayName: string = "Application Insights";

    kind: string;
    properties: ApplicationInsightsProperties;

    static allowedKinds: string[] = ["web", "ios", "other", "store", "java", "phone"];

    constructor() {
        super();

        this.type = ApplicationInsights.resourceType;
        this.apiVersion = "2015-05-01";
    }

    getResourceId(): string {
        return this.getResourceIdString(this.getNameForConcat(this.name));
    }

    static getDefault(name: string): Resource[] {
        let insights = new ApplicationInsights();

        insights.location = Resource.allowedLocations[0];
        insights.name = name;
        insights.kind = ApplicationInsights.allowedKinds[0];
        insights.properties = new ApplicationInsightsProperties();
        insights.properties.Application_Type = ApplicationInsightsProperties.allowedApplicationTypes[0];

        return [insights];
    }
}

export class ApplicationInsightsProperties {
    Application_Type: string;

    static allowedApplicationTypes: string[] = ["web", "other"]
}

export default ApplicationInsights;