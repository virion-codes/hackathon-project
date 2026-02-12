export const MOCK_GROUPS = [
  { id: '1', name: 'BYU', icon: 'Y', color: '#1a365d', isSchool: true },
  { id: '2', name: 'CS Study', icon: 'CS', color: '#2c5282' },
  { id: '3', name: 'Pre-Med', icon: 'PM', color: '#2b6cb0' },
  { id: '4', name: 'Math 1130', icon: 'M', color: '#3182ce' },
  { id: '5', name: 'Writing Center', icon: 'W', color: '#4299e1' },
];

export const MOCK_POSTS = [
  {
    id: '1',
    groupId: '1',
    author: 'Alex',
    title: 'Library 3rd Floor – Linear Algebra',
    location: 'Harold B. Lee Library, 3rd Floor',
    expectations: 'Quiet study, bring laptop. We\'re covering linear algebra.',
    timeframe: 'Today 2:00 PM - 5:00 PM',
    createdAt: '2h ago',
  },
  {
    id: '2',
    groupId: '1',
    author: 'Jordan',
    title: 'Wilkinson Center – Midterm Review',
    location: 'Wilkinson Center, Cougareat',
    expectations: 'Group review for midterm. Bring notes and questions.',
    timeframe: 'Tomorrow 10:00 AM - 12:00 PM',
    createdAt: '5h ago',
  },
  {
    id: '3',
    groupId: '2',
    author: 'Sam',
    title: 'Engineering 234 – Project 3',
    location: 'Engineering Building, Room 234',
    expectations: 'Pair programming - working on project 3.',
    timeframe: 'Today 4:00 PM - 6:00 PM',
    createdAt: '1h ago',
  },
];

export const MOCK_MESSAGES = [
  { id: '1', author: 'Alex', text: 'Who\'s in for the 2pm session?', time: '1:45 PM' },
  { id: '2', author: 'Jordan', text: 'I\'ll be there!', time: '1:48 PM' },
  { id: '3', author: 'Sam', text: 'Same, see you at the library', time: '1:50 PM' },
];

export const MOCK_DISCOVERY_GROUPS = [
  { id: '1', name: 'BYU - Computer Science', level: 'Undergraduate', members: 24, interests: ['CS', 'Programming'] },
  { id: '2', name: 'BYU - Pre-Med Study', level: 'Undergraduate', members: 18, interests: ['Biology', 'Chemistry'] },
  { id: '3', name: 'BYU - Business 301', level: 'Undergraduate', members: 12, interests: ['Business', 'Finance'] },
  { id: '4', name: 'BYU - Grad Math', level: 'Graduate', members: 8, interests: ['Mathematics', 'Research'] },
  { id: '5', name: 'BYU - Writing Center', level: 'All levels', members: 32, interests: ['Writing', 'Essays'] },
];
