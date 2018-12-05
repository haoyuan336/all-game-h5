# fisher

> 本来打算以pixi-filters的示例为原型写个小游戏，后来种种原因放弃了。顺便就放上来了。

## 2018/10/05
> 自己的微信小游戏上线了，感兴可以微信小游戏搜一下 colloc。
>
> 开发中用到的优化同步到这个项目了。

- 升级到`babel7`
- 项目结构改变：微信开发工具指定目录为`dist`(开发者工具里可以去掉`ES6`转`ES5`)，同时复制`static`到`dist`目录(当然你也可以选择删掉项目根目录下的`static`，要改一下`prepare.js`)
- `adpater`优化，可以避免一些坑


>

# 使用

进入项目根目录首先安装依赖：
```
npm i
```
开发模式(打开微信开发者工具添加该项目目录):
```
npm run dev
```
发布(在开发工具中上传代码之前):
```
npm run build
```

`/src/config.js` 配置资源目录


# 说明
* 图片素材来自 [pixi-filters](https://github.com/pixijs/pixi-filters) 项目，包括部分代码。