/**
 * scrapbookData.js - Personal Section Scrapbook Content
 * Human tone, meme-aware, no portfolio buzzwords
 */

export const scrapbookContent = {

  interests: [
    {
      id: 'travel',
      doodle: '🗺️',
      label: 'TRAVEL',
      scribble: 'somewhere new every few months',
      tilt: '-3deg',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      id: 'photography',
      doodle: '📷',
      label: 'SHOTS',
      scribble: 'took 47. kept 2.',
      tilt: '2.5deg',
      color: 'bg-sky-50 border-sky-200 text-sky-900',
    },
    {
      id: 'books',
      doodle: '📖',
      label: 'READS',
      scribble: 'dog-eared & coffee-stained',
      tilt: '-1.5deg',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      id: 'coffee',
      doodle: '☕',
      label: 'COFFEE',
      scribble: 'filter coffee or gtfo',
      tilt: '3.5deg',
      color: 'bg-orange-50 border-orange-200 text-orange-900',
    },
    {
      id: 'fitness',
      doodle: '🏋️',
      label: 'GYM',
      scribble: 'trying not to skip leg day',
      tilt: '-2deg',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
    },
  ],

  readingBook: {
    title: 'Shoe Dog',
    subtitle: 'Phil Knight. A raw, brutally honest memoir from the creator of Nike. Pages are marked with scribbles about obsession and risk.',
    tagline: 'currently on the nightstand',
    bookmarkNote: 'somewhere in the middle — can\'t put it down',
    progress: 'page-turning. no idea what page.',
  },

  fitnessFragment: {
    title: 'CURRENT BESTS',
    scribble: 'not a gym bro, just showing up',
    items: [
      {
        name: 'PUSHUPS',
        value: '40',
        unit: 'reps',
        bar: '████████░░',
        note: 'max set without dying',
      },
      {
        name: 'PLANK',
        value: '5:32',
        unit: 'min',
        bar: '███████░░░',
        note: 'watched the clock the whole time',
      },
    ],
  },

  internetStickers: [
    { id: 's1', text: '404: motivation not found', tilt: '-2.5deg' },
    { id: 's2', text: 'works on my machine ¯\\_(ツ)_/¯', tilt: '3deg' },
    { id: 's3', text: 'one more tab', tilt: '-1.5deg' },
    { id: 's4', text: 'Ctrl + S', tilt: '2deg' },
    { id: 's5', text: 'ship it ✓', tilt: '-3deg' },
    { id: 's6', text: 'git commit -m "wip"', tilt: '1.5deg' },
  ],
}
