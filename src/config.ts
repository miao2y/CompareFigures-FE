export const Config = {
  // basePath: 'http://spring.oxiracetam.yijiahe.com/',
  basePath: "http://127.0.0.1:7777",
  version: "1.0.0",
};
console.log(import.meta.env);
if (import.meta.env.VITE_BASE) {
  // dev code
  Config.basePath = import.meta.env.VITE_BASE;
} else {
  // production code
  throw new Error("缺少 HOST & PORT");
}
