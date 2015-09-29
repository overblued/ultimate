module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/js/*.js'],
      options: {
        laxcomma: true,
        multistr: true,
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
		copy: {
			main: {
				files:[
					{
						expand: true,
						cwd: 'src/',
						src: '{js,css,img}/*',
						dest: 'www/'
					},
					{
						src: 'src/index.html',
						dest: 'www/index.html'
						
					}
				]
			},
			options: {
				process: function (content, srcpath){
					if (srcpath == 'src/index.html') {
						return content.replace('bower_components/jquery/dist/jquery.min.js', 'http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js');
					}
					return content;
				}
			}
		}
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['jshint']);

};