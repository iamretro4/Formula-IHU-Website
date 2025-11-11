import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Award Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sponsor',
      title: 'Sponsor',
      type: 'reference',
      to: [{ type: 'sponsor' }],
      description: 'Sponsor associated with this award (if applicable)',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Overall', value: 'overall' },
          { title: 'CV', value: 'CV' },
          { title: 'EV', value: 'EV' },
          { title: 'DV', value: 'DV' },
          { title: 'Design', value: 'design' },
          { title: 'Business', value: 'business' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'winner',
      title: 'Winner',
      type: 'reference',
      to: [{ type: 'team' }],
    }),
    defineField({
      name: 'prize',
      title: 'Prize',
      type: 'string',
      description: 'Prize amount or description (e.g., "€1000", "Reserved slot for next event")',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      event: 'event.title',
      category: 'category',
      winner: 'winner.name',
    },
    prepare({ title, event, category, winner }) {
      return {
        title,
        subtitle: `${event || 'Unknown Event'}${category ? ` - ${category}` : ''}${winner ? ` - Winner: ${winner}` : ''}`,
      };
    },
  },
});

