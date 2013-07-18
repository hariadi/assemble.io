/*
 * gh-pages for Assemble
 * https://github.com/assemble/assemble-examples/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Internal lib
  grunt.util._.mixin(require('./src/mixins').init(grunt));

  // Project configuration.
  grunt.initConfig({

    // Metadata for templates
    pkg: grunt.file.readJSON('package.json'),
    bootstrap: grunt.file.readYAML('src/less/bootstrap.yml'),
    ghpages  : grunt.file.readYAML('src/less/ghpages.yml'),

    less: {
      options: {
        paths: ['src/less', 'src/less/components', 'vendor/bootstrap/less'],
        imports: {
          less: '<%= ghpages.globals %>'
        }
      },
      main: {
        src:  ['<%= ghpages.bundle.docs %>'],
        dest: 'docs/assets/css/assemble.css'
      }
    },

    // Templates
    assemble: {
      options: {
        flatten: true,
        production: true,
        today: '<%= grunt.template.today() %>',
        layoutdir: 'src/templates/layouts',
        helpers: 'src/local-helpers.js',
        assets: 'docs/assets',
        data: [
          'src/data/*.{json,yml}',
          'package.json'
        ],
        partials: ['src/templates/partials/**/*.{hbs,md}']
      },
      // readme: {
      //   options: {
      //     ext: '',
      //     partials: 'src/readme/sections/*.hbs',
      //     data: [
      //       '<%= config.assemble_master %>/package.json'
      //     ]
      //   },
      //   files: [
      //     { expand: true, flatten: true, cwd: 'src/assemble/', src: ['sections/*.hbs', '!index.hbs'], dest: '<%= config.assemble_master %>/docs/' },
      //     { expand: true, flatten: true, cwd: 'src/assemble/', src: ['README.md.hbs'], dest: 'src/assemble/' }
      //   ]
      // },
      links: {
        options: {
          ext: '.hbs',
          layout: false
        },
        files: [
          { expand: true, flatten: true, cwd: 'src/templates/partials/snippets', src: ['generated-links.md.hbs'], dest: 'src/templates/partials/' },
        ]
      },
      pages: {
        options: {
          layout: 'layout-landing.hbs'
        },
        files: [
          { expand: true, cwd: 'src/templates/pages', src: ['*.hbs'], dest: './' }
        ]
      },
      docs: {
        options: {
          layout: 'layout-docs.hbs'
        },
        files: [
          { expand: true, flatten: true, cwd: 'src/templates/pages/docs', src: ['*.hbs'], dest: 'docs/', ext: '.html' }
        ]
      },
      helpers: {
        options: {
          layout: 'layout-helpers.hbs'
        },
        files: [
          { expand: true, flatten: true, cwd: 'src/templates/pages/helpers', src: ['*.hbs'], dest: './docs/helpers', ext: '.html' }
        ]
      },
      diagnostics: {
        options: {
          layout: 'layout-diagnostics.md.hbs',
          ext: '.md'
        },
        files: [{
            expand: true,
            cwd: 'src/templates/pages',
            src: ['*.hbs', 'docs/*.hbs', 'examples/*.hbs', 'helpers/**/*.hbs'],
            dest: './tmp/diagnostics/',
            rename: function(dest, src) {
              return dest + src.substring(0, src.indexOf('.'));
            }
          }
        ]
      }
    },

    prettify: {
      options: {
        prettifyrc: '.prettifyrc'
      },
      docs: {
        files: [
          {expand: true, cwd: 'docs/', ext: '.html', src: ['**/*.html'], dest: 'docs/'},
          {expand: true, cwd: './',    ext: '.html', src: ['*.html'],    dest: './'}
        ]
      }
    },
    copy: {
      docs: {
        files: [
          {expand: true, cwd: 'docs', src: ['**'],     dest: '../assemble-docs-gh-pages/docs'},
          {expand: true, cwd: './',   src: ['*.html'], dest: '../assemble-docs-gh-pages/'}
        ]
      }
    },

    // Before generating any new files,
    // remove files from previous build.
    clean: {
      all: ['*.html', 'docs/*.html', 'tmp/diagnostics/**/*.{html,md}']
    }
  });

  // Set the base path for Bootstrap LESS library.
  grunt.config.set('vendor.base', 'vendor');

  // Load npm and local plugins.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('assemble-less');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Default task to be run.
  grunt.registerTask('default', [
    'clean',
    'less',
    'assemble:links',
    'assemble:pages',
    'assemble:docs',
    'assemble:helpers',
    'prettify',
    'copy'
  ]);
};

