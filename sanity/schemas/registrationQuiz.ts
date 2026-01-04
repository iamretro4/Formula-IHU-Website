import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'registrationQuiz',
  title: 'Registration Quiz Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Quiz Title',
      type: 'string',
      initialValue: 'Formula IHU Registration Quiz',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Quiz Active',
      type: 'boolean',
      description: 'When active, the entire site will redirect to the quiz at the scheduled time',
      initialValue: false,
    }),
    defineField({
      name: 'scheduledStartTime',
      title: 'Scheduled Start Date & Time',
      type: 'datetime',
      description: 'The exact date and time when the quiz should go live. The quiz will remain open for exactly 2 hours from this time and then automatically close. At this time, fihu.gr will automatically redirect to the quiz.',
      validation: (Rule) => Rule.required(),
    }),
    // Duration is fixed at 2 hours from start time - no need for durationMinutes field
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Question Text',
              type: 'text',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'options',
              title: 'Answer Options',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule: any) => Rule.required().min(2).max(6),
            },
            {
              name: 'correctOption',
              title: 'Correct Answer',
              type: 'string',
              description: 'Must match one of the options exactly',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'image',
              title: 'Question Image',
              type: 'image',
              description: 'Optional image to display with the question',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'category',
              title: 'Question Category',
              type: 'string',
              description: 'Which vehicle category this question applies to',
              options: {
                list: [
                  { title: 'Common (Both EV and CV)', value: 'common' },
                  { title: 'Electric Vehicle (EV) Only', value: 'EV' },
                  { title: 'Combustion Vehicle (CV) Only', value: 'CV' },
                ],
              },
              initialValue: 'common',
            },
          ],
          preview: {
            select: {
              title: 'text',
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'instructions',
      title: 'Quiz Instructions',
      type: 'text',
      rows: 4,
      description: 'Instructions shown to teams before starting the quiz',
      initialValue: 'Please read all questions carefully. You have one attempt. Your progress will be saved automatically.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      isActive: 'isActive',
      scheduledTime: 'scheduledStartTime',
    },
    prepare({ title, isActive, scheduledTime }) {
      return {
        title: title || 'Registration Quiz',
        subtitle: `${isActive ? '🟢 Active' : '🔴 Inactive'} - ${scheduledTime ? new Date(scheduledTime).toLocaleString() : 'No date set'}`,
      };
    },
  },
});

