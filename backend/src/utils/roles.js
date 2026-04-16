export function toDbRole(role) {
  if (role === 'organizer' || role === 'organize') return 'organizer';
  if (role === 'admin') return 'admin';
  return 'attendee';
}

export function toFrontendRole(role) {
  if (role === 'organizer') return 'organizer';
  if (role === 'admin') return 'admin';
  return 'attend';
}
