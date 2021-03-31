const { src, dest, watch, series, parallel } = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const csso = require("gulp-csso");
const prefix = require("gulp-autoprefixer");
const fileInclude = require("gulp-file-include");
const babel = require("gulp-babel");
const jsmin = require("gulp-jsmin");
const imgmin = require("gulp-imagemin");
const newer = require("gulp-newer");
const browserSync = require("browser-sync").create();

//Files for which we do not use plugins
let files = [
    { name: "*", folder: "fonts" },
    { name: "*", folder: "slick" }
];

const html = function () {
    return src("src/**/*.html")
        .pipe(fileInclude({ prefix: "@@" }))
        .pipe(dest("dist/"))
        .pipe(browserSync.stream());
}

const style = function () {
    return src("src/css/*.css")
        .pipe(sourcemaps.init())
        .pipe(csso())
        .pipe(prefix())
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/css/"))
        .pipe(browserSync.stream());
}

const scripts = function () {
    return src("src/js/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(jsmin())
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/js/"))
        .pipe(browserSync.stream());
}

const img = function () {
    return src(["src/img/*.png", "src/img/*.jpg", "src/img/*.svg"])
        .pipe(newer("dist/img/"))
        .pipe(imgmin())
        .pipe(dest("dist/img"));
}

const moveFile = function (cb) {
    files.forEach(file => {
        src(`src/${file.folder}/${file.name}`)
            .pipe(dest(`dist/${file.folder}`));
    });
    cb();
}

const server = function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false,
        open: true,
    });
}

const observe = function () {
    watch("src/**/*.html", { usePolling: true }, series(html));
    watch(["src/css/*.css", "src/css/*.scss"], { usePolling: true }, series(style));
    watch("src/js/*.js", { usePolling: true }, series(scripts));
}

exports.default = series(html, style, scripts, img, moveFile);
exports.html = html;
exports.css = style;
exports.scripts = scripts;
exports.img = img;
exports.movefile = moveFile;
exports.watch = parallel(observe, server);
