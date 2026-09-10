import { defineField, defineType } from "sanity";

const CATEGORIES = [
  { title: "Loose Diamonds", value: "loose-diamonds" },
  { title: "Rings", value: "rings" },
  { title: "Necklaces", value: "necklaces" },
  { title: "Earrings", value: "earrings" },
  { title: "Bracelets", value: "bracelets" },
];

export const product = defineType({
  name: "product",
  title: "Piece",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g. "1.51ct Round Brilliant, E / VS1"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: "The web address for this piece. Click Generate.",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: CATEGORIES, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      description: "Whole dollars, no symbol. e.g. 16500",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "status",
      title: "Availability",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Reserved", value: "reserved" },
          { title: "Sold", value: "sold" },
        ],
        layout: "radio",
      },
      initialValue: "available",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Show on the homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alt text (for accessibility / SEO)",
              type: "string",
            },
          ],
        },
      ],
      validation: (rule) => rule.min(1).error("Add at least one photo"),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "string",
      description: "One line, shown on listing cards.",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "material",
      title: "Metal / material",
      type: "string",
      description: 'e.g. "950 Platinum", "18k White Gold". Leave blank for loose stones.',
    }),
    defineField({
      name: "diamond",
      title: "Diamond details",
      type: "object",
      description: "Fill in for loose diamonds or stones set in a piece.",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "carat", title: "Carat", type: "number" },
        { name: "shape", title: "Shape", type: "string" },
        { name: "cut", title: "Cut", type: "string" },
        { name: "color", title: "Colour", type: "string" },
        { name: "clarity", title: "Clarity", type: "string" },
        { name: "certificateLab", title: "Certificate lab (GIA / IGI)", type: "string" },
        { name: "certificateNumber", title: "Certificate number", type: "string" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "status",
      media: "images.0",
    },
  },
});
