const gulp = require( 'gulp' );
const concat = require( 'gulp-concat' );
const debug = require( 'gulp-debug' );
const sourcemaps = require( 'gulp-sourcemaps' );
const gulpif = require( 'gulp-if' );
const del = require( 'del' );
const newer = require( 'gulp-newer' );
const browserSync = require( 'browser-sync' ).create();
const uglify = require( 'gulp-uglify-es' ).default;
const cleanCSS = require( 'gulp-clean-css' );
const autoprefixer = require( 'gulp-autoprefixer' );


let isDevelopment = false;
let namePage = 'gulp_test';  //название папки для продакшена

let _path_ = {
    css: [
        'frontend/styles/lib.css',
        'frontend/styles/style.css'
    ],
    js: [
        'frontend/js/jquery-3.3.1.min.js',
        'frontend/js/script.js'
    ]
};

gulp.task( 'styles', function () {
    return gulp.src( _path_.css )
            .pipe( gulpif( isDevelopment, sourcemaps.init() ) )
            .pipe( autoprefixer( {
                overrideBrowserslist: [ 'last 2 versions' ],
                cascade: false
            } ) )
            .pipe( cleanCSS( { debug: true }, details => {
                console.log( `${details.name}: ${details.stats.originalSize}` );
                console.log( `${details.name}: ${details.stats.minifiedSize}` );
            } ) )
            .pipe( concat( 'style.css' ) )
            .pipe( gulpif( isDevelopment, sourcemaps.write( './css_maps' ) ) )
            .pipe( gulp.dest( `${namePage}/css` ) );
} );

gulp.task( 'js', function () {
    return gulp.src( _path_.js )
            .pipe( uglify( ) )
            .pipe( debug( { title: 'js' } ) )
            .pipe( gulpif( isDevelopment, sourcemaps.init() ) )
            .pipe( concat( 'script.js' ) )
            .pipe( debug( { title: 'js' } ) )
            .pipe( gulpif( isDevelopment, sourcemaps.write( './js_maps' ) ) )
            .pipe( gulp.dest( `${namePage}/js` ) );
} );

gulp.task( 'clean', function () {
    return del( `${namePage}` );
} );

gulp.task( 'assets', function () {
    return gulp.src( './frontend/assets/**', { since: gulp.lastRun( 'assets' ) } )
            .pipe( newer( `${namePage}` ) )
            .pipe( gulp.dest( `./${namePage}` ) );
} );

gulp.task( 'build', gulp.series( 'clean', gulp.parallel( 'styles', 'assets', 'js' ) ) );

gulp.task( 'serve', function () {
    browserSync.init( {
        server: `./${namePage}`
    } );

    browserSync.watch( `./${namePage}/**/*.*` ).on( `change`, browserSync.reload );
} );

gulp.task( 'watch', function () {
    gulp.watch( 'frontend/styles/**/*.*', gulp.series( 'styles' ) );
    gulp.watch( 'frontend/js/**/*.*', gulp.series( 'js' ) );
    gulp.watch( 'frontend/assets/**/*.*', gulp.series( 'assets' ) );
} );

gulp.task(
        'dev', gulp.series( 'build', gulp.parallel( 'watch', 'serve' ) )
        );

