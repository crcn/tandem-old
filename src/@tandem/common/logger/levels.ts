export enum LogLevel {
   DEBUG   = 1       << 1,
   INFO    = DEBUG   << 1,
   WARN    = INFO    << 1,
   ERROR   = WARN    << 1,
   LOG     = ERROR   << 1,

   NONE    = 0,
   DEFAULT = INFO | WARN | ERROR,
   ALL     = DEBUG | INFO | WARN | ERROR | LOG,
   VERBOSE = ALL,
}
