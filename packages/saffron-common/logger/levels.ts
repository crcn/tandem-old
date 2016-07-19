export const VERBOSE = 1       << 1;
export const INFO    = VERBOSE << 1;
export const WARN    = INFO    << 1;
export const ERROR   = WARN    << 1;

export const ALL     = VERBOSE | INFO | WARN | ERROR;
