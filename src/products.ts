export const PRODUCT_IDS = [
  "puppet-cloud-ops",
  "puppet-enterprise",
  "helix-core",
  "perfecto",
  "blazemeter",
  "delphix",
] as const;

export type ProductId = (typeof PRODUCT_IDS)[number];

export interface ProductCore {
  id: ProductId;
  name: string;
  tagline: string;
  components: string[];
}

export const PRODUCTS: Record<ProductId, ProductCore> = {
  "puppet-cloud-ops": {
    id: "puppet-cloud-ops",
    name: "Puppet Cloud Ops",
    tagline: "Cloud-native infra ops",
    components: ["Operator Console", "Edge Connector", "Policy Engine", "Reporting", "Identity"],
  },
  "puppet-enterprise": {
    id: "puppet-enterprise",
    name: "Puppet Enterprise",
    tagline: "Infrastructure automation",
    components: ["Agent", "Server", "PuppetDB", "Bolt", "Forge", "Console UI"],
  },
  "helix-core": {
    id: "helix-core",
    name: "Helix Core (P4)",
    tagline: "Version control at scale",
    components: ["P4D", "Swarm", "TeamHub", "Proxy", "Broker", "Helix4Git"],
  },
  perfecto: {
    id: "perfecto",
    name: "Perfecto",
    tagline: "Continuous testing cloud",
    components: ["Mobile Lab", "Web Lab", "Scriptless", "Smart Reporting", "CI Integrations"],
  },
  blazemeter: {
    id: "blazemeter",
    name: "BlazeMeter",
    tagline: "Performance & API testing",
    components: ["Load Engine", "API Functional", "Mock Services", "Reporting", "CI Integrations"],
  },
  delphix: {
    id: "delphix",
    name: "Delphix",
    tagline: "Data masking & virtualization",
    components: ["Engine", "Masking", "Continuous Data", "Continuous Compliance", "Self-Service"],
  },
};

export interface SliderField {
  type: "slider";
  key: string;
  title: string;
  min: number;
  max: number;
  step?: number;
  default: number;
  unit?: string;
}

export interface DropdownField {
  type: "dropdown";
  key: string;
  title: string;
  options: string[];
  default?: string;
}

export type FormField = SliderField | DropdownField;

export function baseFieldsFor(product: ProductId): FormField[] {
  const def = PRODUCTS[product];
  return [
    {
      type: "slider",
      key: "priority",
      title: "Priority",
      min: 1,
      max: 5,
      step: 1,
      default: 3,
      unit: "/5",
    },
    {
      type: "slider",
      key: "effort_estimate",
      title: "Effort estimate",
      min: 1,
      max: 13,
      step: 1,
      default: 5,
      unit: " SP",
    },
    {
      type: "dropdown",
      key: "component",
      title: `${def.name} component`,
      options: def.components,
      default: def.components[0],
    },
  ];
}
