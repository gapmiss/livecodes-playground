export interface Parameters {
  playgroundPath: string;
  gistUrl: string;
}

declare module "*.svg" {
  const content: string;
  export default content;
}
