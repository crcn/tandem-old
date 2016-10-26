export enum LogLevel {
   VERBOSE = 1       << 1,
   INFO    = VERBOSE << 1,
   WARN    = INFO    << 1,
   ERROR   = WARN    << 1,
   LOG     = ERROR   << 1,
   ALL     = VERBOSE | INFO | WARN | ERROR | LOG,
}
