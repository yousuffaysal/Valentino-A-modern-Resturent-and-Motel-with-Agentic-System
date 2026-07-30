/**
 * Policy copy. The design source linked to these four pages without writing
 * them, so the text below is the hotel's stated practice, with anything still
 * unconfirmed marked as such rather than invented.
 */
export interface Policy {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

export const POLICIES: Policy[] = [
  {
    slug: 'terms',
    label: 'Terms of use',
    eyebrow: 'POLICIES · TERMS',
    title: 'Terms of use',
    intro:
      'These terms cover this website. The stay itself is governed by the booking terms and by what reception confirms with you on the phone.',
    sections: [
      {
        heading: 'The site',
        body: [
          'Rates, room descriptions and menu prices on this site are published in good faith and are checked against the front desk. Where a figure is still being confirmed with the hotel it is marked CONFIRM rather than guessed.',
          'Photographs show the actual rooms and dishes. Room layouts vary slightly within a category, so the room you are given may not be the one photographed.',
        ],
      },
      {
        heading: 'Using the site',
        body: [
          'You may browse, book and share pages freely. You may not scrape the site, resell the rates, or present the hotel as your own agency without written permission from the management.',
        ],
      },
      {
        heading: 'Getting it corrected',
        body: [
          'If something here is wrong, call reception on +880 1795 855555 and it gets fixed. The desk is staffed 24 hours.',
        ],
      },
    ],
  },
  {
    slug: 'booking-terms',
    label: 'Booking terms',
    eyebrow: 'POLICIES · BOOKING',
    title: 'Booking terms',
    intro: 'What you are agreeing to when you confirm a room on this site.',
    sections: [
      {
        heading: 'Check in and check out',
        body: [
          'Check in from 12:00. Check out by 12:00. Reception is staffed around the clock, so a late arrival is not a problem as long as you tell the desk the approximate time when you book.',
          'Early check in from 08:00 can be added to the booking as an extra, subject to the room being free that morning.',
        ],
      },
      {
        heading: 'Rates and charges',
        body: [
          'Room rates are quoted per night, per room. VAT and service charge of 15% are added at checkout and shown on the summary before you confirm.',
          'Extras arranged by reception, such as airport transfers, car rental and tour packages, are charged separately at the rates confirmed by the desk.',
        ],
      },
      {
        heading: 'Payment',
        body: [
          'bKash, Nagad, card, or pay at the desk on arrival. A booking made online is held under the confirmation code shown on screen and sent to the mobile number you gave.',
          'Reception may call to verify a reservation before the arrival date. If the number does not answer, the room is still held until the check in date unless the desk tells you otherwise.',
        ],
      },
      {
        heading: 'Occupancy',
        body: [
          'Each category has a stated capacity. An extra bed can be added to most rooms for a nightly charge. Guests staying in the room must be registered at the desk with valid photo identification, as required in Bangladesh.',
        ],
      },
    ],
  },
  {
    slug: 'cancellation-refund',
    label: 'Cancellation and refund',
    eyebrow: 'POLICIES · CANCELLATION',
    title: 'Cancellation and refund',
    intro:
      'The free cancellation window is being confirmed with the hotel. Until it is published here, treat the following as the working rule and confirm on the phone.',
    sections: [
      {
        heading: 'Cancelling a room',
        body: [
          'Call reception on +880 1795 855555 with your confirmation code. Cancellations are recorded at the desk and the room is released immediately.',
          'The exact free cancellation window is CONFIRM WITH HOTEL. Ask when you book if you need certainty on this.',
        ],
      },
      {
        heading: 'Refunds',
        body: [
          'Where a payment was made through bKash, Nagad or card, an approved refund is returned through the same channel. Processing time depends on the provider.',
          'Where the stay was to be paid at the desk, there is nothing to refund; simply cancel so the room is released.',
        ],
      },
      {
        heading: 'No show',
        body: [
          'A room held for a guest who does not arrive and does not call is released the following morning. Reception will try the mobile number on the booking first.',
        ],
      },
      {
        heading: 'Sky View tables',
        body: ['Tables are held for 20 minutes past the booking time. Call the desk if you are running late.'],
      },
    ],
  },
  {
    slug: 'privacy',
    label: 'Privacy',
    eyebrow: 'POLICIES · PRIVACY',
    title: 'Privacy',
    intro: 'What the hotel collects when you book, and what happens to it.',
    sections: [
      {
        heading: 'What is collected',
        body: [
          'The booking flow collects your name, mobile number, optional email address, stay dates, room choice and any note you leave for reception. The table reservation flow collects a name, mobile number, date, time and party size.',
          'Messages sent from the contact form are stored so reception can answer them.',
        ],
      },
      {
        heading: 'What it is used for',
        body: [
          'Holding and servicing your reservation, and contacting you about it. Nothing more. The hotel does not sell guest details.',
        ],
      },
      {
        heading: 'The reception assistant',
        body: [
          'The chat on this site is answered by an AI assistant. What you type is sent to the model provider to generate the reply, and to the hotel so reception can follow up on a booking you started in chat. Do not send card numbers or passwords through it.',
        ],
      },
      {
        heading: 'Removal',
        body: [
          'Ask reception to delete a booking record or a message and it is removed from the system, subject to the records the hotel is required to keep for registration purposes.',
        ],
      },
    ],
  },
];

export const getPolicy = (slug: string) => POLICIES.find((p) => p.slug === slug) ?? null;
