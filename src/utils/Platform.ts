export const isMobile = (): boolean =>
  !!navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);

export const isDesktop = (): boolean => (!isMobile() ? true : false);
