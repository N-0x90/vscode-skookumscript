'use strict';

const gulp = require('gulp');
const yaml = require('gulp-yaml');

const inputGrammar = "syntaxes/skookumscript.tmLanguage.yaml";
const grammarsDirectory = "syntaxes/";

gulp.task('buildTmLanguage', done => {
    gulp.src(inputGrammar)
      .pipe(yaml({ schema: 'DEFAULT_SAFE_SCHEMA' }))
      .pipe(gulp.dest(grammarsDirectory))

    done();
});

gulp.task('default', gulp.series(gulp.parallel('buildTmLanguage')));