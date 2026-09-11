export type TutorAvailability = {
  day: string;
  time: string;
};

export type TutorReview = {
  name: string;
  rating: string;
  comment: string;
};

export type Tutor = {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  rating: string;
  reviews: number;
  availability: string;
  subjects: string[];
  bio: string;
  phone: string;
  studentsTutored: number;
  weeklyAvailability: TutorAvailability[];
  reviewComments: TutorReview[];
};

export const tutors: Tutor[] = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    initials: 'MC',
    avatar: 'https://i.pravatar.cc/160?img=47',
    rating: '4.9',
    reviews: 128,
    availability: 'Available today',
    subjects: ['Mathematics', 'Science'],
    bio: 'Makes complex ideas feel practical and approachable. Maya builds confidence through clear explanations and patient guidance.',
    phone: '+1 (555) 014-2281',
    studentsTutored: 86,
    weeklyAvailability: [
      { day: 'Mon', time: '4:00 PM - 7:00 PM' },
      { day: 'Tue', time: '3:00 PM - 6:00 PM' },
      { day: 'Thu', time: '4:00 PM - 8:00 PM' },
      { day: 'Sat', time: '10:00 AM - 1:00 PM' },
    ],
    reviewComments: [
      { name: 'Liam P.', rating: '5.0', comment: 'Maya helped me finally understand equations without making them feel overwhelming.' },
      { name: 'Sofia R.', rating: '5.0', comment: 'She is patient, encouraging, and always comes prepared with helpful examples.' },
    ],
  },
  {
    id: 'theo-brooks',
    name: 'Theo Brooks',
    initials: 'TB',
    avatar: 'https://i.pravatar.cc/160?img=12',
    rating: '4.8',
    reviews: 96,
    availability: 'Next available tomorrow',
    subjects: ['English', 'History'],
    bio: 'Helps students find confidence in writing and discussion through thoughtful feedback and practical structure.',
    phone: '+1 (555) 014-3462',
    studentsTutored: 64,
    weeklyAvailability: [
      { day: 'Mon', time: '5:00 PM - 8:00 PM' },
      { day: 'Wed', time: '4:00 PM - 7:00 PM' },
      { day: 'Fri', time: '3:00 PM - 6:00 PM' },
      { day: 'Sun', time: '11:00 AM - 2:00 PM' },
    ],
    reviewComments: [
      { name: 'Noah K.', rating: '5.0', comment: 'Theo made essay planning much less stressful and gave feedback I could use immediately.' },
      { name: 'Emma J.', rating: '4.5', comment: 'Great at asking the right questions and helping me develop my own ideas.' },
    ],
  },
  {
    id: 'sam-rivera',
    name: 'Sam Rivera',
    initials: 'SR',
    avatar: 'https://i.pravatar.cc/160?img=32',
    rating: '4.9',
    reviews: 114,
    availability: 'Available today',
    subjects: ['Coding', 'Mathematics'],
    bio: 'Turns big problems into small, buildable steps and makes technical concepts approachable for every learner.',
    phone: '+1 (555) 014-5084',
    studentsTutored: 73,
    weeklyAvailability: [
      { day: 'Tue', time: '4:00 PM - 8:00 PM' },
      { day: 'Thu', time: '3:00 PM - 6:00 PM' },
      { day: 'Sat', time: '9:00 AM - 12:00 PM' },
      { day: 'Sun', time: '2:00 PM - 5:00 PM' },
    ],
    reviewComments: [
      { name: 'Ethan W.', rating: '5.0', comment: 'Sam explains coding in a way that makes me want to keep experimenting.' },
      { name: 'Ava M.', rating: '5.0', comment: 'The sessions are focused, practical, and always connected to something I want to build.' },
    ],
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    initials: 'JL',
    avatar: 'https://i.pravatar.cc/160?img=49',
    rating: '4.7',
    reviews: 82,
    availability: 'Next available Friday',
    subjects: ['History', 'Languages'],
    bio: 'Connects lessons to stories, culture, and the world around us to make learning memorable.',
    phone: '+1 (555) 014-6193',
    studentsTutored: 58,
    weeklyAvailability: [
      { day: 'Wed', time: '5:00 PM - 8:00 PM' },
      { day: 'Fri', time: '4:00 PM - 7:00 PM' },
      { day: 'Sat', time: '1:00 PM - 4:00 PM' },
      { day: 'Sun', time: '10:00 AM - 1:00 PM' },
    ],
    reviewComments: [
      { name: 'Mia T.', rating: '5.0', comment: 'Jordan makes every topic feel connected to a real story.' },
      { name: 'Oliver D.', rating: '4.5', comment: 'Helpful, kind, and great at making difficult material easier to remember.' },
    ],
  },
];
