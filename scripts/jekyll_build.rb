# frozen_string_literal: true

# Local Windows/Ruby 3.3 compatibility shim for GitHub Pages' Jekyll 3.x stack.
# GitHub Pages runs the site normally; this file only helps this workspace build.

project_root = Dir.pwd
gems_root = File.join(project_root, "vendor", "bundle", "ruby", "3.3.0", "gems")

require "liquid"

liquid_tags = File.join(gems_root, "liquid-4.0.4", "lib", "liquid", "tags")
Dir.children(liquid_tags).grep(/\.rb\z/).sort.each do |file|
  require File.join(liquid_tags, file)
end

require "jekyll/filters/url_filters"
require "jekyll/filters/grouping_filters"
require "jekyll/filters/date_filters"
require "jekyll"

jekyll_lib = File.join(gems_root, "jekyll-3.10.0", "lib", "jekyll")
%w[drops commands converters converters/markdown generators tags].each do |folder|
  absolute_folder = File.join(jekyll_lib, folder)
  next unless Dir.exist?(absolute_folder)

  Dir.children(absolute_folder).grep(/\.rb\z/).sort.each do |file|
    require File.join(absolute_folder, file)
  end
end

Jekyll::Commands::Build.process({})
