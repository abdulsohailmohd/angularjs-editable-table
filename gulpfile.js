var gulp = require('gulp');
var embedTemplates = require('gulp-angular-embed-templates');
 
gulp.task('prod', function () {
    return gulp.src('editable-table.js')
        .pipe(embedTemplates())
        .pipe(gulp.dest('dist'));
});