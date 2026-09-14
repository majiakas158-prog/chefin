const roleArtwork = {
  chef: {
    signin: '/images/chef-sign-in.png',
    signup: '/images/restaurant-create-account.png',
  },
  restaurant: {
    signin: '/images/restaurant-sign-in.png',
    signup: '/images/restaurant-create-account.png',
  },
};

const authArtwork = () => {
  const role = localStorage.getItem('selectedRole') || 'chef';
  const page = window.location.pathname === '/signup' ? 'signup' : 'signin';
  return roleArtwork[role]?.[page] || roleArtwork.chef.signin;
};

export const assets = {
  logo: '/images/logo.png',
  chef: '/images/chef.png',
  restaurant: '/images/restaurant.png',
  get background() {
    return window.location.pathname === '/' ? '/images/background-1.png' : authArtwork();
  },
};
