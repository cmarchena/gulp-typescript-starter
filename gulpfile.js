
var gulp = require("gulp");
var ts = require("gulp-typescript");
var browserify = require("browserify");  
var tsProject = ts.createProject("tsconfig.json");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();


const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

var paths = {
    pages: ['src/*.html', 'src/*.js','src/*.json']
};
var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries:
    ['src/assets/js/dbhelper.ts', 'src/assets/js/index.ts', 'src/assets/js/restaurant-detail.ts'
 ],
    cache: {},
    packageCache: {}
}).plugin(tsify));
gulp.task("scripts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist/js"));
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    })
})

// Gulp task to minify CSS files
gulp.task('styles', function () {
    return gulp.src('./src/assets/sass/styles.scss')
        // Compile SASS files
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        // Auto-prefix css styles for cross browser compatibility
        .pipe(autoprefixer({
            browsers: AUTOPREFIXER_BROWSERS
        }))
        // Minify the file
        .pipe(csso())
        // Output
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
}); 

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});
gulp.task('imagemin', function () {
    var imgSrc = 'src/assets/images/*.+(png|jpg|gif|svg|webp)',
        imgDst = 'dist/images';

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest(imgDst));
});
gulp.task('fonts', function () {
    return gulp.src('src/assets/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})
gulp.task('watch', ['browserSync',  'styles' ], function () {
    gulp.watch('src/assets/sass/**/*.scss', ['styles']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/*.js', browserSync.reload);

});

function bundle() {
    return watchedBrowserify
        .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist"));
}

gulp.task("default", ["scripts","copy-html", "styles",
 "imagemin", "fonts", "watch"],bundle);

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
