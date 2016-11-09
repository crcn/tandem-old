export enum LogLevel {
   VERBOSE = 1       << 1,
   INFO    = VERBOSE << 1,
   WARN    = INFO    << 1,
   ERROR   = WARN    << 1,
   LOG     = ERROR   << 1,

   NONE    = 0,
   DEFAULT = INFO | WARN | ERROR,
   ALL     = VERBOSE | INFO | WARN | ERROR | LOG,
}
