export const Config = {
  // basePath: 'http://spring.oxiracetam.yijiahe.com/',
  basePath: "http://127.0.0.1:7777",
  version: "1.0.0",
};
if (import.meta.env.VITE_HOST && import.meta.env.VITE_PORT) {
  // dev code
  Config.basePath =
    "http://" + import.meta.env.VITE_HOST + ":" + import.meta.env.VITE_PORT;
} else {
  // production code
  throw new Error("缺少 HOST & PORT");
}
