"use client";

/**
 * Configuration for the embedded Sanity Studio at `/studio`.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schema } from "@/sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  title: "Dad of Diamonds — Catalogue",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Catalogue")
          .items([
            S.documentTypeListItem("product").title("All pieces"),
            S.divider(),
            ...["loose-diamonds", "rings", "necklaces", "earrings", "bracelets"].map(
              (cat) =>
                S.listItem()
                  .title(cat.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()))
                  .id(cat)
                  .child(
                    S.documentList()
                      .title(cat)
                      .filter('_type == "product" && category == $cat')
                      .params({ cat }),
                  ),
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
