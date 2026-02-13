// Groups for sidebar
export const MOCK_GROUPS = [
  { id: '1', name: 'General', icon: 'G', color: '#0f2942', isSchool: false },
  { id: '2', name: 'Study Group', icon: 'SG', color: '#2563eb' },
  { id: '3', name: 'Project Team', icon: 'PT', color: '#059669' },
];

// Posts for HomeScreen and GroupChatScreen
export const MOCK_POSTS = [
  {
    id: '1',
    groupId: '1',
    author: 'Alex',
    title: 'Library Study Session',
    location: 'Main Library, 3rd Floor',
    expectations: 'Quiet study, bring laptop.',
    timeframe: 'Today 2:00 PM - 5:00 PM',
    createdAt: '2h ago',
  },
  {
    id: '2',
    groupId: '1',
    author: 'Jordan',
    title: 'Coffee & Study',
    location: 'Campus Cafe, Main St',
    expectations: 'Casual study hangout, bring notes.',
    timeframe: 'Tomorrow 9:00 AM - 11:00 AM',
    createdAt: '4h ago',
  },
  {
    id: '3',
    groupId: '1',
    author: 'Sam',
    title: 'Weekend Study Marathon',
    location: 'Study Hall, Building B',
    expectations: 'All-day study session. Bring snacks!',
    timeframe: 'Saturday 10:00 AM - 6:00 PM',
    createdAt: '1d ago',
  },
  {
    id: '4',
    groupId: '2',
    author: 'Jordan',
    title: 'Midterm Review',
    location: 'Student Center, Room 101',
    expectations: 'Group review, bring notes and questions.',
    timeframe: 'Tomorrow 10:00 AM - 12:00 PM',
    createdAt: '5h ago',
  },
  {
    id: '5',
    groupId: '2',
    author: 'Alex',
    title: 'Quiz Prep Session',
    location: 'Library, Room 215',
    expectations: 'Practice problems together. Bring textbook.',
    timeframe: 'Thursday 3:00 PM - 5:00 PM',
    createdAt: '8h ago',
  },
  {
    id: '6',
    groupId: '2',
    author: 'Jordan',
    title: 'Final Exam Cram',
    location: 'Engineering Lab 302',
    expectations: 'Last-minute review. Flashcards welcome.',
    timeframe: 'Next Monday 6:00 PM - 9:00 PM',
    createdAt: '2d ago',
  },
  {
    id: '7',
    groupId: '3',
    author: 'Sam',
    title: 'Project Kickoff',
    location: 'Engineering Building, Room 234',
    expectations: 'Plan sprint, assign tasks.',
    timeframe: 'Friday 1:00 PM - 3:00 PM',
    createdAt: '1d ago',
  },
  {
    id: '8',
    groupId: '3',
    author: 'Alex',
    title: 'Design Review',
    location: 'Conference Room A',
    expectations: 'Review wireframes and feedback.',
    timeframe: 'Tuesday 2:00 PM - 4:00 PM',
    createdAt: '2d ago',
  },
  {
    id: '9',
    groupId: '3',
    author: 'Jordan',
    title: 'Demo Prep',
    location: 'Lab 101',
    expectations: 'Run through presentation, practice Q&A.',
    timeframe: 'Thursday 11:00 AM - 1:00 PM',
    createdAt: '3d ago',
  },
];

// Messages per group
export function getMessagesForGroup(groupId) {
  const messagesByGroup = {
    '1': [
      { id: 'g1-m1', author: 'Alex', text: 'Welcome to the group!', time: '9:00 AM', isSystem: false },
      { id: 'g1-m2', author: 'Jordan', text: 'Thanks for creating this.', time: '9:15 AM', isSystem: false },
      { id: 'g1-m3', author: 'You', text: "Happy to have everyone here. Let's study together!", time: '9:20 AM', isSystem: false },
    ],
    '2': [
      { id: 'g2-m1', author: 'Jordan', text: 'Who is free for the review session?', time: '10:30 AM', isSystem: false },
      { id: 'g2-m2', author: 'Alex', text: "I'll be there!", time: '10:35 AM', isSystem: false },
    ],
    '3': [
      { id: 'g3-m1', author: 'Sam', text: 'Project meeting Friday at 1pm.', time: '2:00 PM', isSystem: false },
      { id: 'g3-m2', author: 'Alex', text: 'Got it, see you then.', time: '2:15 PM', isSystem: false },
    ],
  };
  return messagesByGroup[groupId] || messagesByGroup['1'];
}

// Discovery groups
export const MOCK_DISCOVERY_GROUPS = [
  { id: '1', name: 'Computer Science Study', level: 'Undergraduate', members: 12, interests: ['CS', 'Programming'] },
  { id: '2', name: 'Pre-Med Study Group', level: 'Undergraduate', members: 8, interests: ['Biology', 'Chemistry'] },
  { id: '3', name: 'Business 301', level: 'Undergraduate', members: 15, interests: ['Business', 'Finance'] },
  { id: '4', name: 'Grad Research Collab', level: 'Graduate', members: 6, interests: ['Mathematics', 'Research'] },
  { id: '5', name: 'Writing Center', level: 'All levels', members: 24, interests: ['Writing', 'Essays'] },
  { id: '6', name: 'Spanish Practice', level: 'Undergraduate', members: 10, interests: ['Spanish', 'Languages'] },
  { id: '7', name: 'Engineering Lab', level: 'Undergraduate', members: 9, interests: ['Physics', 'Engineering'] },
  { id: '8', name: 'Film Club', level: 'All levels', members: 18, interests: ['Film', 'Media'] },
];

// Members and pending requests per group
export function getMembersForGroup(groupId) {
  const membersByGroup = {
    '1': [
      { id: 'm1-1', name: 'Alex', role: 'admin', joinedAt: '1d ago' },
      { id: 'm1-2', name: 'Jordan', role: 'member', joinedAt: '1d ago' },
      { id: 'm1-3', name: 'Sam', role: 'member', joinedAt: '12h ago' },
    ],
    '2': [
      { id: 'm2-1', name: 'Jordan', role: 'admin', joinedAt: '2d ago' },
      { id: 'm2-2', name: 'Alex', role: 'member', joinedAt: '1d ago' },
    ],
    '3': [
      { id: 'm3-1', name: 'Sam', role: 'admin', joinedAt: '3d ago' },
      { id: 'm3-2', name: 'Alex', role: 'member', joinedAt: '2d ago' },
      { id: 'm3-3', name: 'Jordan', role: 'member', joinedAt: '1d ago' },
    ],
  };
  return membersByGroup[groupId] || membersByGroup['1'];
}

export function getPendingForGroup(groupId) {
  const pendingByGroup = {
    '1': [{ id: 'p1-1', name: 'Morgan K.', requestedAt: '2h ago' }],
    '2': [],
    '3': [
      { id: 'p3-1', name: 'Taylor S.', requestedAt: '1h ago' },
      { id: 'p3-2', name: 'Casey J.', requestedAt: '30m ago' },
    ],
  };
  return pendingByGroup[groupId] || [];
}

// Account screen sections
export const MOCK_ACCOUNT_ROWS = [
  { section: 'My Account', items: ['Account & Security', 'Profile Settings', 'Email Preferences'] },
  { section: 'Settings', items: ['Notifications', 'Privacy', 'Display'] },
  { section: 'Support', items: ['Help Centre', 'Community Rules', 'About'] },
];
