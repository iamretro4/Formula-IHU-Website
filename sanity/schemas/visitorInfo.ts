import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'visitorInfo',
  title: 'Visitor Information',
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'event' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ticketPrice',
      title: 'Ticket Price',
      type: 'string',
      description: 'e.g., "5 EUR / 100 CZK"',
    }),
    defineField({
      name: 'ticketLink',
      title: 'Ticket Purchase Link',
      type: 'url',
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'day', type: 'string', title: 'Day' },
            { name: 'hours', type: 'string', title: 'Hours', description: 'e.g., "9:00 - 20:00"' },
          ],
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'directions',
      title: 'Directions',
      type: 'text',
      rows: 4,
      description: 'How to get to the venue',
    }),
    defineField({
      name: 'parking',
      title: 'Parking Information',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'facilities',
      title: 'Facilities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Available facilities (e.g., "Food & Beverages", "Restrooms", "First Aid")',
    }),
    defineField({
      name: 'openHours',
      title: 'Open Hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'day', type: 'string', title: 'Day' },
            { name: 'hours', type: 'string', title: 'Hours' },
            { name: 'description', type: 'string', title: 'Description' },
          ],
        },
      ],
    }),
    defineField({
      name: 'mapEmbed',
      title: 'Map Embed Code',
      type: 'text',
      description: 'Google Maps embed code or coordinates',
    }),
  ],
  preview: {
    select: {
      event: 'event.title',
      location: 'location',
    },
    prepare({ event, location }) {
      return {
        title: `Visitor Info - ${event || 'Unknown Event'}`,
        subtitle: location,
      };
    },
  },
});

