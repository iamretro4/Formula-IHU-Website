import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'statistic',
  title: 'Statistic',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'e.g., "Events", "Teams", "Volunteers"',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description: 'Optional suffix (e.g., "+", "%", "years")',
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Icon identifier (e.g., "calendar", "users", "trophy")',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which to display on homepage',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      label: 'label',
      value: 'value',
      suffix: 'suffix',
    },
    prepare({ label, value, suffix }) {
      return {
        title: label,
        subtitle: `${value}${suffix ? suffix : ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});

