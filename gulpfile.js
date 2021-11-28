'use strict';

const { src, dest, parallel, series, watch } = require('gulp'),
    fs = require("fs"),
    babel = require("gulp-babel"),
    browserSync = require("browser-sync"),
    sass = require('gulp-sass')(require('sass')),
    cleanCSS = require("gulp-clean-css"),
    del = require("del"),
    postcss = require("gulp-postcss"),
    mqpacker = require("css-mqpacker"),
    autoprefixer = require("autoprefixer"),
    named = require("vinyl-named"),
    wait = require("gulp-wait"),
    webpack = require("webpack-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    gulpRevAll = require("gulp-rev-all"),
    svgo = require("gulp-svgo"),
    iconfont = require("gulp-iconfont"),
    iconfontCss = require("gulp-iconfont-css");

const path = {
    src: {
        html: "src/*.html",
        style: "src/style/*.{sass,scss}",
        img: "src/img/**/*.*",
        svg: "src/svg/**/*.*",
        svgico: "src/svgico/*.svg",
        js: "src/js/*.js",
        fonts: "src/fonts/**/*.*",
        favicon: "src/favicon.ico",
    },
    build: {
        root: "build/",
        style: "build/css/",
        fonts: "build/fonts/",
        js: "build/js/",
        img: "build/img/",
        svg: "build/img/svg",
    },
    watch: {
        html: "src/**/*.html",
        js: "src/js/**/*.js",
        style: "src/style/**/*.{scss,sass,css}",
        img: "src/img/**/*.+{jpg,jpeg,png,gif,ico}",
        svg: "src/svg/*.svg",
        svgico: "src/svgico/*.svg",
        fonts: "src/fonts/**/*.*",
        favicon: "src/favicon.ico",
    }
}

const processors = [
    autoprefixer({
        cascade: false
    }),
    mqpacker({
        sort: function(a, b) {
            a = a.replace(/\D/g, "");
            b = b.replace(/\D/g, "");
            return b - a;
            // replace this with a-b for Mobile First approach
        }
    })
];

function html() {
    return src(path.src.html)
        .pipe(dest(path.build.root))
        .pipe(
            browserSync.reload({
                stream: true
            })
        );
}

function css() {
    return src(path.src.style)
        .pipe(sourcemaps.init({ largeFile: true }))
        .pipe(wait(200))
        .pipe(sass({ includePaths: ["node_modules/"] }).on("error", sass.logError))
        .pipe(postcss(processors))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write("maps"))
        .pipe(dest(path.build.style))
        .pipe(
            browserSync.reload({
                stream: true
            })
        );
}

function js() {
    return src(path.src.js)
        .pipe(named())
        .pipe(
            webpack({
                mode: "development",
                devtool: "source-map",
                module: {
                    rules: [{
                        test: /\.(js)$/,
                        loader: "babel-loader",
                        exclude: /(node_modules)/,
                        options: {
                            presets: ["@babel/env"],
                        }
                    }]
                },
                externals: {
                    jquery: "jQuery"
                }
            })
        )
        .on("error", function(err) {
            this.emit("end");
        })
        .pipe(dest(path.build.js))
        .pipe(
            browserSync.reload({
                stream: true
            })
        );
}

function fonts() {
    return src(path.src.fonts).pipe(dest(path.build.fonts));
}

function images() {
    return src(path.src.img).pipe(dest(path.build.img));
}

function fico(done) {
    const iconsPath = "src/style/partials/font-icons.scss";
    if (!fs.existsSync(iconsPath)) {
        fs.writeFileSync(iconsPath, "");
    }

    return src(path.src.svgico)
        .pipe(wait(1000))
        .pipe(svgo())
        .pipe(
            iconfontCss({
                fontName: "fico", // required
                target: iconsPath,
                targetPath: "../../style/partials/font-icons.scss",
                fontPath: "../fonts/icons/",
                cssClass: "fico"
            })
        )
        .pipe(
            iconfont({
                fontName: "fico", // required
                prependUnicode: true, // recommended option
                formats: ["ttf", "eot", "woff", "woff2", "svg"], // default, 'woff2' and 'svg' are available
                normalize: true,
                fontHeight: 1001,
                fontStyle: "normal",
                fontWeight: "normal"
            })
        )
        .on("error", function(err) {
            this.emit("end");
        })
        .pipe(dest("src/fonts/icons"));
}

function favicon() {
    return src(path.src.favicon).pipe(dest(path.build.root));
}

function startServer(done) {
    browserSync.init({
        server: {
            baseDir: path.build.root
        },
        startPath: "/",
        tunnel: false,
        host: "localhost",
        port: 9000,
        logPrefix: "gulper"
    });
    done();
}

function revAll(rootPath = path.build.root) {
    return src(rootPath + "**")
        .pipe(
            gulpRevAll.revision({
                dontRenameFile: [".*"],
                dontUpdateReference: [".html", ".map"],
                transformFilename: function(file, hash) {
                    return nodePath.basename(file.path);
                },
                transformPath: function(rev, source, path) {
                    if (rev.startsWith("/") || rev.startsWith("http")) {
                        return rev;
                    }
                    return "/" + rev;
                }
            })
        )
        .pipe(dest(rootPath));
}

function reloadBrowser(done) {
    browserSync.reload();
    done();
}

function watchSource() {
    watch(path.watch.html, series(html, revAll, reloadBrowser));
    watch(path.watch.style, series(css, revAll, reloadBrowser));
    watch(path.watch.js, series(js, revAll, reloadBrowser));
    watch(path.watch.fonts, series(fonts, revAll, reloadBrowser));
    watch(path.watch.img, series(images, revAll, reloadBrowser));
    watch(path.watch.svgico, series(fico, revAll, reloadBrowser));
    watch(path.watch.favicon, series(favicon, revAll, reloadBrowser));
}

function clean(done) {
    del.sync(path.build.root);
    return done();
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.fonts = fonts;
exports.images = images;
exports.default = series(
    clean,
    parallel(html, css, js, fonts, images, fico, favicon),
    revAll
);

exports.watch = series(exports.default, startServer, watchSource);