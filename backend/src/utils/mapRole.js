export function frontendRoleToDbRole(role) {
  if (role === 'organize') return 'organizer';
  if (role === 'admin') return 'admin';
  return 'attendee';
}

export function dbRoleToFrontendRole(role) {
  if (role === 'organizer') return 'organize';
  if (role === 'admin') return 'admin';
  return 'attend';
}
