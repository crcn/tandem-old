export type Dependency = {

  // URI used here since it could be a url
  uri: string;
  dirty?: boolean; // TRUE if the contents have changed
  content: Buffer;
  imports: string[];
};

export type DependencyGraph = {
  [identifier: string]: Dependency
};

