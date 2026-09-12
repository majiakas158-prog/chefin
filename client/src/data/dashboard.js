const chefJobs = [
  { title: 'Head Chef', company: 'The Food House', location: 'Kolkata', salary: '₹35,000 – ₹50,000', tags: ['Indian', 'Bengali', 'Continental'], experience: '3+ years' },
  { title: 'Sous Chef', company: 'Spice Garden', location: 'Kolkata', salary: '₹30,000 – ₹42,000', tags: ['North Indian', 'Tandoor'], experience: '2+ years' },
  { title: 'Chinese Chef', company: 'Dragon Kitchen', location: 'Mumbai', salary: '₹40,000 – ₹55,000', tags: ['Chinese', 'Pan Asian'], experience: '4+ years' },
];
const chefs = [
  { name: 'Rahul Sharma', title: 'Head Chef', location: 'Kolkata', experience: '5 years', tags: ['Indian', 'Bengali', 'Chinese'], rating: '4.8', available: 'Available now' },
  { name: 'Priya Das', title: 'Pastry Chef', location: 'Kolkata', experience: '4 years', tags: ['Bakery', 'Desserts'], rating: '4.9', available: 'Available in 15 days' },
  { name: 'Arjun Mehta', title: 'Sous Chef', location: 'Delhi', experience: '6 years', tags: ['Continental', 'Italian'], rating: '4.7', available: 'Available now' },
];
export const dashboardData = {
  chef: { role: 'Chef', name: 'Akas Maji', greeting: 'Good morning, Akas', avatar: 'chef', navigation: [{key:'home',label:'Home',mobile:'Home',icon:'⌂'}, {key:'discover',label:'Find jobs',mobile:'Jobs',icon:'⌕'}, {key:'applications',label:'Applications',mobile:'Applied',icon:'▣'}, {key:'messages',label:'Messages',mobile:'Chat',icon:'◌'}, {key:'profile',label:'My profile',mobile:'Profile',icon:'♙'}, {key:'saved',label:'Saved jobs',icon:'♡'}, {key:'notifications',label:'Notifications',icon:'♧'}], stats: [['15', 'Applications'], ['8', 'Interviews'], ['24', 'Saved jobs'], ['85%', 'Profile complete']], jobs: chefJobs },
  restaurant: { role: 'Restaurant', name: 'Royal Palace', greeting: 'Welcome back, Royal Palace', avatar: 'restaurant', navigation: [{key:'home',label:'Dashboard',mobile:'Home',icon:'⌂'}, {key:'discover',label:'Find chefs',mobile:'Chefs',icon:'⌕'}, {key:'post',label:'Post a job',mobile:'Post',icon:'+'}, {key:'applications',label:'Applications',mobile:'Apps',icon:'▣'}, {key:'messages',label:'Messages',mobile:'Chat',icon:'◌'}, {key:'profile',label:'Restaurant profile',mobile:'Profile',icon:'♙'}, {key:'saved',label:'Shortlist',icon:'♡'}, {key:'notifications',label:'Notifications',icon:'♧'}], stats: [['8', 'Active jobs'], ['42', 'Applications'], ['12', 'Interviews'], ['5', 'Hired chefs']], chefs },
};
