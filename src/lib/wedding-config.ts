// Wedding Configuration - Customize your wedding details here
export const weddingConfig = {
  couple: {
    names: ['Sophia', 'Alexander'],
    initials: 'S&A',
    hashtag: '#SophiaAndAlexander2025',
  },
  date: {
    full: 'September 14, 2025',
    time: '4:00 PM',
    iso: '2025-09-14T16:00:00',
  },
  venues: {
    ceremony: {
      name: "St. Mary's Cathedral",
      address: '123 Main Street, San Francisco, CA',
      time: '4:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.992681944!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1234567890',
      directionsUrl: 'https://maps.google.com/?q=123+Main+Street+San+Francisco+CA',
      image: '/images/ceremony.jpg',
    },
    reception: {
      name: 'The Grand Ballroom',
      address: '456 Park Avenue, San Francisco, CA',
      time: '6:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.992681944!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1234567890',
      directionsUrl: 'https://maps.google.com/?q=456+Park+Avenue+San+Francisco+CA',
      image: '/images/reception.jpg',
    },
  },
  events: [
    { time: '3:30 PM', title: 'Guest Arrival', icon: 'Users', description: 'Doors open for seating' },
    { time: '4:00 PM', title: 'Ceremony', icon: 'Heart', description: 'Exchange of vows' },
    { time: '4:45 PM', title: 'Cocktail Hour', icon: 'Wine', description: 'Refreshments & mingling' },
    { time: '6:00 PM', title: 'Reception', icon: 'UtensilsCrossed', description: 'Dinner & celebrations' },
    { time: '7:30 PM', title: 'First Dance', icon: 'Music', description: 'The newlyweds take the floor' },
    { time: '11:00 PM', title: 'Last Dance', icon: 'Moon', description: 'Final farewell' },
  ],
  heroImages: [
    '/images/hero-1.jpg',
    '/images/hero-2.jpg',
    '/images/hero-3.jpg',
    '/images/hero-4.jpg',
    '/images/hero-5.jpg',
  ],
  loveStory: [
    { year: '2018', title: 'First Meet', description: 'We met at a mutual friend\'s birthday party. It was love at first sight.' },
    { year: '2019', title: 'First Date', description: 'Coffee turned into dinner, dinner turned into a lifetime of adventures.' },
    { year: '2022', title: 'The Proposal', description: 'Under the stars at our favorite spot, he got down on one knee.' },
    { year: '2025', title: 'Our Wedding', description: 'The day we become husband and wife. Our forever begins.' },
  ],
  accommodations: {
    hotel: 'The Fairmont San Francisco',
    address: '950 Mason Street, San Francisco, CA',
    phone: '(415) 772-5000',
    blockCode: 'SOPHIAALEX2025',
    discount: '15%',
  },
  registry: {
    message: 'Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have registered at the following stores.',
    stores: [
      { name: 'Crate & Barrel', url: 'https://www.crateandbarrel.com' },
      { name: 'Williams Sonoma', url: 'https://www.williams-sonoma.com' },
    ],
  },
  faqs: [
    { q: 'What is the dress code?', a: 'Formal attire. Black tie optional.' },
    { q: 'Can I bring a plus one?', a: 'Please indicate on your RSVP if you have been given a plus one.' },
    { q: 'Is there parking available?', a: 'Yes, complimentary valet parking is provided at both venues.' },
    { q: 'What time should I arrive?', a: 'Please arrive by 3:30 PM for the 4:00 PM ceremony.' },
    { q: 'Will the ceremony be indoors or outdoors?', a: 'The ceremony will be indoors at the cathedral.' },
  ],
}
