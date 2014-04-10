var fs = require("fs");
var gulp = require('gulp');

var es = require('event-stream');
var exec = require('child_process').exec;

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var handlebars = require('gulp-handlebars');
var declare = require("gulp-declare");
var notify = require('gulp-notify');
var runSequence = require('run-sequence');
var nodemon = require('gulp-nodemon');

var wrap = require('gulp-wrap-umd');

var paths = {
    scripts: {
        core: [
            "lib/base.js",
            //"lib/json2.js",
            "lib/validator.js",
            "lib/equiv_and_hoozit.js",
            "lib/jquery.maskedinput-1.3.1.js",

            "src/js/Alpaca.js",
            "src/js/TemplateEngineRegistry.js",
            "src/js/AbstractTemplateEngine.js",
            "src/js/HandlebarsTemplateEngine.js",
            "src/js/NormalizedView.js",
            "src/js/RuntimeView.js",
            "src/js/Field.js",
            "src/js/ControlField.js",
            "src/js/ContainerField.js",
            "src/js/Connector.js",
            "src/js/Form.js",

            // fields
            "src/js/fields/basic/TextField.js",
            "src/js/fields/basic/TextAreaField.js",
            "src/js/fields/basic/CheckBoxField.js",
            "src/js/fields/basic/FileField.js",
            "src/js/fields/basic/ListField.js",
            "src/js/fields/basic/RadioField.js",
            "src/js/fields/basic/SelectField.js",
            "src/js/fields/basic/NumberField.js",
            "src/js/fields/basic/ArrayField.js",
            "src/js/fields/basic/ObjectField.js",
            "src/js/fields/basic/AnyField.js",
            "src/js/fields/basic/HiddenField.js",

            "src/js/fields/advanced/AddressField.js",
            "src/js/fields/advanced/DateField.js",
            "src/js/fields/advanced/DatetimeField.js",
            "src/js/fields/advanced/EditorField.js",
            "src/js/fields/advanced/EmailField.js",
            "src/js/fields/advanced/IntegerField.js",
            "src/js/fields/advanced/IPv4Field.js",
            "src/js/fields/advanced/JSONField.js",
            "src/js/fields/advanced/IntegerField.js",
            "src/js/fields/advanced/LowerCaseField.js",
            "src/js/fields/advanced/MapField.js",
            "src/js/fields/advanced/PasswordField.js",
            "src/js/fields/advanced/PersonalNameField.js",
            "src/js/fields/advanced/PhoneField.js",
            "src/js/fields/advanced/TagField.js",
            "src/js/fields/advanced/TimeField.js",
            "src/js/fields/advanced/UpperCaseField.js",
            "src/js/fields/advanced/CKEditorField.js",
            "src/js/fields/advanced/StateField.js",
            "src/js/fields/advanced/CountryField.js",
            "src/js/fields/advanced/ZipcodeField.js",
            "src/js/fields/advanced/URLField.js",
            "src/js/fields/advanced/UploadField.js",
            "src/js/fields/advanced/TableField.js",
            "src/js/fields/advanced/GridField.js",

            // views
            "src/js/base.js",

            // i18n
            "src/js/messages/i18n/de_AT.js",
            "src/js/messages/i18n/es_ES.js",
            "src/js/messages/i18n/fr_FR.js",
            "src/js/messages/i18n/pt_BR.js",
            "src/js/messages/i18n/zh_CN.js"
        ],
        all_views: [
            "src/js/views/web.js",
            "src/js/views/jqueryui.js",
            "src/js/views/jquerymobile.js",
            "src/js/views/bootstrap.js"
        ],
        web: [
            "build/tmp/scripts-core.js",
            "build/tmp/templates-web.js",
            "src/js/views/web.js"
        ],
        jqueryui: [
            "build/tmp/scripts-core.js",
            "build/tmp/templates-web.js",
            "build/tmp/templates-jqueryui.js",
            "src/js/views/web.js",
            "src/js/views/jqueryui.js"
        ],
        jquerymobile: [
            "build/tmp/scripts-core.js",
            "build/tmp/templates-web.js",
            "build/tmp/templates-jquerymobile.js",
            "src/js/views/web.js",
            "src/js/views/jquerymobile.js"
        ],
        bootstrap: [
            "build/tmp/scripts-core.js",
            "build/tmp/templates-web.js",
            "build/tmp/templates-bootstrap.js",
            "src/js/views/web.js",
            "src/js/views/bootstrap.js"
        ]
    },
    templates: {
        web: [
            "src/templates/view_web_display/**/*.html",
            "src/templates/view_web_edit/***/*.html"
        ],
        jqueryui: [
            "src/templates/view_web_display/**/*.html",
            "src/templates/view_web_edit/***/*.html",
            "src/templates/view_jqueryui_display/**/*.html",
            "src/templates/view_jqueryui_edit/**/*.html"
        ],
        jquerymobile: [
            "src/templates/view_web_display/**/*.html",
            "src/templates/view_web_edit/***/*.html",
            "src/templates/view_jquerymobile_display/**/*.html",
            "src/templates/view_jquerymobile_edit/**/*.html"
        ],
        bootstrap: [
            "src/templates/view_web_display/**/*.html",
            "src/templates/view_web_edit/***/*.html",
            "src/templates/view_bootstrap_display/**/*.html",
            "src/templates/view_bootstrap_edit/**/*.html"
        ],
        all: [
            "src/templates/**/*.html"
        ]
    },
    styles: {
        all: [
            "src/css/**/*.css"
        ],
        web: [
            "src/css/alpaca-web.css"
        ],
        bootstrap: [
            "src/css/alpaca-web.css",
            "src/css/alpaca-bootstrap.css"
        ],
        jquerymobile: [
            "src/css/alpaca-web.css",
            "src/css/alpaca-jquerymobile.css"
        ],
        jqueryui: [
            "src/css/alpaca-web.css",
            "src/css/alpaca-jqueryui.css"
        ]
    }
};

gulp.task('clean', function() {
    gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('styles', function() {

    return es.concat(

        // web
        gulp.src(paths.styles.web)
            .pipe(concat('alpaca.css'))
            .pipe(gulp.dest('build/alpaca/web'))
            .pipe(rename({suffix: ".min"}))
            .pipe(minifyCss())
            .pipe(gulp.dest('build/alpaca/web')),
        gulp.src("src/css/images/**")
            .pipe(gulp.dest('./build/alpaca/web/images')),

        // bootstrap (includes web)
        gulp.src(paths.styles.bootstrap)
            .pipe(concat('alpaca.css'))
            .pipe(gulp.dest('build/alpaca/bootstrap'))
            .pipe(rename({suffix: ".min"}))
            .pipe(minifyCss())
            .pipe(gulp.dest('build/alpaca/bootstrap')),
        gulp.src("src/css/images/**")
            .pipe(gulp.dest('./build/alpaca/bootstrap/images')),

        // jqueryui
        gulp.src(paths.styles.jqueryui)
            .pipe(concat('alpaca.css'))
            .pipe(gulp.dest('build/alpaca/jqueryui'))
            .pipe(rename({suffix: ".min"}))
            .pipe(minifyCss())
            .pipe(gulp.dest('build/alpaca/jqueryui')),
        gulp.src("src/css/images/**")
            .pipe(gulp.dest('./build/alpaca/jqueryui/images')),

        // jquerymobile
        gulp.src(paths.styles.jquerymobile)
            .pipe(concat('alpaca.css'))
            .pipe(gulp.dest('build/alpaca/jquerymobile'))
            .pipe(rename({suffix: ".min"}))
            .pipe(minifyCss())
            .pipe(gulp.dest('build/alpaca/jquerymobile')),
        gulp.src("src/css/images/**")
            .pipe(gulp.dest('./build/alpaca/jquerymobile/images'))

    ).pipe(es.wait()).pipe(notify({message: "Built Alpaca CSS"}));
});

gulp.task('scripts', function(cb) {

    // alpaca umd
    var wrapper = "" + fs.readFileSync("./config/umd-wrapper.txt");
    var alpacaWrapConfig = {
        deps: ['jquery'],
        params: ['$'],
        namespace: "Alpaca",
        exports: "Alpaca",
        template: wrapper
    };

    // core
    var first = gulp.src(paths.scripts.core).pipe(concat('scripts-core.js')).pipe(gulp.dest('build/tmp'));
    first.on("end", function() {

        es.concat(

            // web
            gulp.src(paths.scripts.web)
                .pipe(concat('alpaca.js'))
                .pipe(wrap(alpacaWrapConfig))
                .pipe(gulp.dest('build/alpaca/web')),
            gulp.src(paths.scripts.web)
                .pipe(uglify())
                .pipe(concat('alpaca.min.js'))
                .pipe(gulp.dest('build/alpaca/web')),

            // bootstrap
            gulp.src(paths.scripts.bootstrap)
                .pipe(concat('alpaca.js'))
                .pipe(wrap(alpacaWrapConfig))
                .pipe(gulp.dest('build/alpaca/bootstrap')),
            gulp.src(paths.scripts.bootstrap)
                .pipe(uglify())
                .pipe(concat('alpaca.min.js'))
                .pipe(gulp.dest('build/alpaca/bootstrap')),

            // jqueryui
            gulp.src(paths.scripts.jqueryui)
                .pipe(concat('alpaca.js'))
                .pipe(wrap(alpacaWrapConfig))
                .pipe(gulp.dest('build/alpaca/jqueryui')),
            gulp.src(paths.scripts.jqueryui)
                .pipe(uglify())
                .pipe(concat('alpaca.min.js'))
                .pipe(gulp.dest('build/alpaca/jqueryui')),

            // jquerymobile
            gulp.src(paths.scripts.jquerymobile)
                .pipe(concat('alpaca.js'))
                .pipe(wrap(alpacaWrapConfig))
                .pipe(gulp.dest('build/alpaca/jquerymobile')),
            gulp.src(paths.scripts.jquerymobile)
                .pipe(uglify())
                .pipe(concat('alpaca.min.js'))
                .pipe(gulp.dest('build/alpaca/jquerymobile'))

        ).pipe(es.wait(function() {

            cb();

        })).pipe(notify({message: "Built Alpaca JS"}));
    });
});

gulp.task('templates', function()
{
    var processName = function(filepath)
    {
        // strip .js from end
        var i = filepath.indexOf(".js");
        if (i > -1)
        {
            filepath = filepath.substring(0, i);
        }

        // strip src/templates/ from the beginning
        if (filepath.indexOf("src/templates/") == 0)
        {
            filepath = filepath.substring(14);
        }

        // replace any "/" with .
        filepath = filepath.replace(new RegExp("/", 'g'), ".");

        return filepath;
    };

    return es.concat(

        // web
        gulp.src(paths.templates["web"])
            .pipe(handlebars())
            .pipe(declare({
                namespace: 'AlpacaTemplates.handlebars',
                processName: processName
            }))
            .pipe(concat('templates-web.js'))
            .pipe(gulp.dest('build/tmp/')),

        // bootstrap
        gulp.src(paths.templates["bootstrap"])
            .pipe(handlebars())
            .pipe(declare({
                namespace: 'AlpacaTemplates.handlebars',
                processName: processName
            }))
            .pipe(concat('templates-bootstrap.js'))
            .pipe(gulp.dest('build/tmp/')),

        // jqueryui
        gulp.src(paths.templates["jqueryui"])
            .pipe(handlebars())
            .pipe(declare({
                namespace: 'AlpacaTemplates.handlebars',
                processName: processName
            }))
            .pipe(concat('templates-jqueryui.js'))
            .pipe(gulp.dest('build/tmp/')),

        // jquerymobile
        gulp.src(paths.templates["jquerymobile"])
            .pipe(handlebars())
            .pipe(declare({
                namespace: 'AlpacaTemplates.handlebars',
                processName: processName
            }))
            .pipe(concat('templates-jquerymobile.js'))
            .pipe(gulp.dest('build/tmp/'))

    ).pipe(es.wait()).pipe(notify({message: "Built Alpaca Templates"}));

});

gulp.task('jekyll', function(cb)
{
    exec('jekyll build -s ./web -d ./build/web2 --trace', function(err, stdout, stderr) {

        if (err)
        {
            console.log(stderr);
        }

        cb(err);
    });

});

gulp.task('update-web-full', function() {

    return es.concat(

        // copy web2 into web
        gulp.src("build/web2/**").pipe(gulp.dest("./build/web")),

        // copy lib/ into web
        gulp.src("lib/**")
            .pipe(gulp.dest('./build/web/lib')),

        // copy alpaca into web
        gulp.src("build/alpaca/**")
            .pipe(gulp.dest('./build/web/assets/themes/dbyll/lib/alpaca'))

    ).pipe(es.wait()).pipe(notify({message: "Built Alpaca Web Site"}));

});

var refreshWeb = function()
{
    runSequence('jekyll', 'update-web-full');
};

gulp.task('refreshWeb', function()
{
    refreshWeb();
});

// Rerun the task when a file changes
gulp.task('watch', function() {

    // scripts
    gulp.watch(paths.scripts.core, function() {
        return runSequence('scripts', refreshWeb);
    });
    gulp.watch(paths.scripts.all_views, function() {
        return runSequence('scripts', refreshWeb);
    });

    // templates
    gulp.watch(paths.templates.all, function() {
        return runSequence('templates', 'scripts', refreshWeb);
    });

    // styles
    gulp.watch(paths.styles.all, function() {
        return runSequence('styles', refreshWeb);
    });

    // web
    gulp.watch("web/**", function() {
        refreshWeb();
    });

});

gulp.task('web', ['watch'], function() {

    nodemon({
        script: 'server/site-webserver.js'
    });

});

gulp.task('testsite', ['watch'], function() {

    nodemon({
        script: 'server/test-webserver.js'
    });

});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['templates', 'scripts', 'styles', 'refreshWeb']);

gulp.task('default', function(callback) {
    return runSequence(['templates', 'scripts'], 'styles', 'refreshWeb', callback);
});
