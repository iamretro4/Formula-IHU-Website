import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'result',
  title: 'Result',
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
      name: 'category',
      title: 'Vehicle Category',
      type: 'string',
      options: {
        list: [
          { title: 'Combustion Vehicle (CV)', value: 'CV' },
          { title: 'Electric Vehicle (EV)', value: 'EV' },
          { title: 'Driverless (DV)', value: 'DV' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Result Subcategory',
      type: 'string',
      options: {
        list: [
          { title: 'Overall', value: 'overall' },
          { title: 'Engineering Design', value: 'engineering-design' },
          { title: 'Cost & Manufacturing', value: 'cost-manufacturing' },
          { title: 'Business Plan', value: 'business-plan' },
          { title: 'Acceleration', value: 'acceleration' },
          { title: 'Skidpad', value: 'skidpad' },
          { title: 'Autocross', value: 'autocross' },
          { title: 'Endurance', value: 'endurance' },
          { title: 'Efficiency', value: 'efficiency' },
        ],
      },
      description: 'The specific category of this result (e.g., Overall, Engineering Design, etc.)',
    }),
    defineField({
      name: 'vehicleNumber',
      title: 'Vehicle Number',
      type: 'string',
      description: 'The vehicle number (e.g., E88, C12)',
    }),
    defineField({
      name: 'penalties',
      title: 'Penalties',
      type: 'number',
      description: 'Penalty points (if applicable)',
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'reference',
      to: [{ type: 'team' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'points',
      title: 'Total Points',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of awards won (e.g., "Best Design", "First Place")',
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
      team: 'team.name',
      event: 'event.title',
      position: 'position',
      category: 'category',
      points: 'points',
    },
    prepare({ team, event, position, category, points }) {
      return {
        title: `${team || 'Unknown Team'}`,
        subtitle: `${event || 'Unknown Event'} - ${category} - Position ${position} (${points} pts)`,
      };
    },
  },
  orderings: [
    {
      title: 'Position, Lowest',
      name: 'positionAsc',
      by: [{ field: 'position', direction: 'asc' }],
    },
    {
      title: 'Points, Highest',
      name: 'pointsDesc',
      by: [{ field: 'points', direction: 'desc' }],
    },
  ],
});

