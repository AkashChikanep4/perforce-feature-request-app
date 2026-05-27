export const PRODUCT_IDS = [
  "puppet",
  "puppet-cloud",
  "delphix",
  "helix",
  "perfecto",
] as const;

export type ProductId = (typeof PRODUCT_IDS)[number];

export interface ProductCore {
  id: ProductId;
  name: string;
  tagline: string;
  components: string[];
}

export const PRODUCTS: Record<ProductId, ProductCore> = {
  puppet: {
    id: "puppet",
    name: "Puppet",
    tagline: "Infrastructure automation",
    components: ["Agent", "Server", "PuppetDB", "Bolt", "Forge", "Console UI"],
  },
  "puppet-cloud": {
    id: "puppet-cloud",
    name: "Puppet Cloud",
    tagline: "SaaS configuration management",
    components: ["Workspace", "Edge Connector", "Policy Engine", "Reporting", "Identity"],
  },
  delphix: {
    id: "delphix",
    name: "Delphix",
    tagline: "Data masking & virtualization",
    components: ["Engine", "Masking", "Continuous Data", "Continuous Compliance", "Self-Service"],
  },
  helix: {
    id: "helix",
    name: "Helix",
    tagline: "Version control & DevOps",
    components: ["Core (P4D)", "Swarm", "TeamHub", "ALM", "DAM", "Proxy/Broker"],
  },
  perfecto: {
    id: "perfecto",
    name: "Perfecto",
    tagline: "Continuous testing cloud",
    components: ["Mobile Lab", "Web Lab", "Scriptless", "Smart Reporting", "CI Integrations"],
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
