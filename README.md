# CompareFigures-FE
相图比较前端部分

## 环境要求
请先确保 NodeJs( ≥ 18) 、yarn 已经安装.
> 安装 NodeJs, 请参考 [nodejs 官网](https://nodejs.org/en/download/)
>
> 安装 yarn，请参考 [yarn 官网](https://classic.yarnpkg.com/en/docs/install/#windows-stable)
## 依赖安装

```shell
yarn install
```
## 设置后端地址
请在项目根目录下新建 .env 文件, 内容如下
```shell
VITE_BASE=http://{ip}:{port}/
```
> 默认的后端 ip 为 localhost, port 为 7777
## 启动项目
```shell
yarn dev
```
