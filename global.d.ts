// global.d.ts
declare module "*.js?url" {
  const value: string;
  export default value;
}
