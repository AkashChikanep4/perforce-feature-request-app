import { McpServer } from "skybridge/server";
import { z } from "zod";
import { PRODUCT_IDS, PRODUCTS, baseFieldsFor, type FormField } from "./products.js";

const sliderSchema = z.object({
  type: z.literal("slider"),
  key: z.string(),
  title: z.string(),
  min: z.number(),
  max: z.number(),
  step: z.number().optional(),
  default: z.number(),
  unit: z.string().optional(),
});

const dropdownSchema = z.object({
  type: z.literal("dropdown"),
  key: z.string(),
  title: z.string(),
  options: z.array(z.string()).min(2),
  default: z.string().optional(),
});

const extraFieldSchema = z.discriminatedUnion("type", [sliderSchema, dropdownSchema]);

const outputSliderSchema = z.object({
  type: z.literal("slider"),
  key: z.string(),
  title: z.string(),
  min: z.number(),
  max: z.number(),
  step: z.number().optional(),
  default: z.number(),
  unit: z.string().optional(),
});

const outputDropdownSchema = z.object({
  type: z.literal("dropdown"),
  key: z.string(),
  title: z.string(),
  options: z.array(z.string()),
  default: z.string().optional(),
});

const outputFieldSchema = z.discriminatedUnion("type", [outputSliderSchema, outputDropdownSchema]);

const PUBLIC_BASE_URL =
  process.env.SKYBRIDGE_PUBLIC_URL ?? "https://your-deployment.alpic.dev";

const server = new McpServer(
  {
    name: "perforce-feature-request",
    version: "0.1.0",
  },
  { capabilities: {} },
).registerTool(
  {
    name: "feature-request",
    title: "Open Perforce Feature Request console",
    description:
      "Open the Perforce Feature Request console — an interactive read-only UI that helps the user draft, refine, and review a feature request for one of the Perforce products (Puppet, Puppet Cloud, Delphix, Helix, Perfecto). The tool itself does not save, send, or transmit anything; it simply renders the console with the supplied draft data. The user remains in control and submits the request themselves from inside the console. Pass `product` if you can infer it from the user's message, `requirement` with the user's described feature, and optionally `extraFields` with 1–2 AI-tailored slider or dropdown fields that gather extra signal about the request (e.g. expected scale, customer tier, integration target). Choose slider ranges and dropdown options that are specific and useful for the described requirement.",
    inputSchema: {
      product: z.enum(PRODUCT_IDS).optional().describe("Auto-detected Perforce product."),
      requirement: z.string().optional().describe("The user's feature request in their own words."),
      extraFields: z
        .array(extraFieldSchema)
        .max(3)
        .optional()
        .describe("1-2 extra form fields tailored to the requirement. Pick titles, ranges, and option values that fit the request."),
    },
    outputSchema: {
      product: z
        .enum(PRODUCT_IDS)
        .nullable()
        .describe("Selected Perforce product, or null until one is chosen."),
      requirement: z.string().describe("The user's feature request text."),
      baseFields: z
        .array(outputFieldSchema)
        .describe("Static base form fields for the selected product."),
      extraFields: z
        .array(outputFieldSchema)
        .describe("AI-tailored extra form fields, echoed from input."),
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: false,
      destructiveHint: false,
      idempotentHint: true,
    },
    _meta: {
      "openai/toolInvocation/invoking": "Opening the Perforce Feature Request console…",
      "openai/toolInvocation/invoked": "Perforce Feature Request console ready.",
      "openai/widgetAccessible": true,
    },
    view: {
      component: "feature-request",
      description: "Perforce Feature Request console",
      domain: PUBLIC_BASE_URL,
      csp: {
        resourceDomains: [
          PUBLIC_BASE_URL,
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
        ],
        connectDomains: [PUBLIC_BASE_URL],
        redirectDomains: ["http://localhost:3001"],
      },
    },
  },
  async ({ product, requirement, extraFields }) => {
    const baseFields: FormField[] = product ? baseFieldsFor(product) : [];
    const productName = product ? PRODUCTS[product].name : "no product yet";
    return {
      structuredContent: {
        product: product ?? null,
        requirement: requirement ?? "",
        baseFields,
        extraFields: extraFields ?? [],
      },
      content: [
        {
          type: "text",
          text:
            `Opened the Perforce Feature Request console. Product: ${productName}. ` +
            (requirement ? `Requirement: "${requirement}". ` : "Awaiting requirement. ") +
            (extraFields && extraFields.length > 0
              ? `Tailored fields: ${extraFields.map((f) => f.title).join(", ")}.`
              : "No tailored fields yet."),
        },
      ],
      isError: false,
    };
  },
);

if (process.env.NODE_ENV === "production") {
  const { default: manifest } = await import("./vite-manifest.js");
  server.setViteManifest(manifest);
}

export default await server.run();

export type AppType = typeof server;
