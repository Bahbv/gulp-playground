const gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat");

const paths = {
  styles: {
    src: ["./src/scss/main.scss"],
    all: ["./src/scss/*.scss","./src/scss/**/*.scss"],
    dest: "./dist/css/"
  },
  scripts: {
    src: ["./src/js/*.js"],
    lib: "./src/js/lib/*.js",
    dest: "./dist/js/"
  },
  html: {
    src: "./index.html"
  }
};

/* STYLES */
function doStyles(done) {
  return gulp.series(style, done => {
    done();
  })(done);
}

function style() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}
/* END STYLES */

/* SCRIPTS */
function doScripts(done) {
  return gulp.series(
    preprocessJs,
    concatJs,
    reload,
    done => {
      done();
    }
  )(done);
}

function preprocessJs() {
  return gulp
    .src(paths.scripts.src)
    .pipe(
      babel({
        presets: ["@babel/env"],
        plugins: ["@babel/plugin-proposal-class-properties"]
      })
    )
    .pipe(gulp.dest("./dist/js/build/"));
}

function concatJs() {
  return gulp
    .src([
      paths.scripts.lib,
      "./dist/js/build/*.js"
    ])
    .pipe(concat("main-concat.js"))
    .pipe(gulp.dest("./dist/js/"));
}


/* END SCRIPTS */

/* WATCH */
function reload(done) {
  browserSync.reload();
  done();
}

function watch() {
  browserSync.init({
    server: {
        baseDir: "./" /* Of proxy */
    }
  });
  gulp.watch(paths.styles.all, doStyles);
  gulp.watch(paths.scripts.src, doScripts);
  gulp.watch(paths.html.src, reload);

}
/* END WATCH */

gulp.task("default", watch);