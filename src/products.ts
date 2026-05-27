export const PRODUCT_IDS = [
  "puppet",
  "puppet-cloud",
  "delphix",
  "helix",
  "perfecto",
] as const;

export type ProductId = (typeof PRODUCT_IDS)[number];

export interface ProductDef {
  id: ProductId;
  name: string;
  monogram: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  components: string[];
}

export const PRODUCTS: Record<ProductId, ProductDef> = {
  puppet: {
    id: "puppet",
    name: "Puppet",
    monogram: "Pu",
    tagline: "Infrastructure automation",
    accent: "#FFAE1A",
    accentSoft: "rgba(255, 174, 26, 0.18)",
    components: ["Agent", "Server", "PuppetDB", "Bolt", "Forge", "Console UI"],
  },
  "puppet-cloud": {
    id: "puppet-cloud",
    name: "Puppet Cloud",
    monogram: "PC",
    tagline: "SaaS configuration management",
    accent: "#7B4DB5",
    accentSoft: "rgba(123, 77, 181, 0.18)",
    components: ["Workspace", "Edge Connector", "Policy Engine", "Reporting", "Identity"],
  },
  delphix: {
    id: "delphix",
    name: "Delphix",
    monogram: "Dx",
    tagline: "Data masking & virtualization",
    accent: "#00B5A5",
    accentSoft: "rgba(0, 181, 165, 0.18)",
    components: ["Engine", "Masking", "Continuous Data", "Continuous Compliance", "Self-Service"],
  },
  helix: {
    id: "helix",
    name: "Helix",
    monogram: "Hx",
    tagline: "Version control & DevOps",
    accent: "#0098D4",
    accentSoft: "rgba(0, 152, 212, 0.18)",
    components: ["Core (P4D)", "Swarm", "TeamHub", "ALM", "DAM", "Proxy/Broker"],
  },
  perfecto: {
    id: "perfecto",
    name: "Perfecto",
    monogram: "Pf",
    tagline: "Continuous testing cloud",
    accent: "#E94E77",
    accentSoft: "rgba(233, 78, 119, 0.18)",
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
