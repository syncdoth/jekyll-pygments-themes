# Jekyll Pygments CSS Themes

This is the source for the Pygments CSS themes previews and builder site.  The site is built using Jekyll.

## Hacking

- Clone this repository and checkout the `gh-pages` branch
- Install [Jekyll](http://jekyllrb.com/docs/installation/)
- Install the [GitHub Pages gem](https://github.com/github/pages-gem)
- Serve the site with `bundle exec jekyll serve`.  Use `--watch` to automatically regenerate the site when
  any files are changed.

## Notes

- The samples for each language reside in `_include/languages/`
- Data for the site resides under `_data`.  It includes
  - `languages.yml`: the list of programming languages available for using as samples
  - `themes.yml`: data concerning the original set of Pygments themes
  - `file_format.yml`: data about the CSS file format.  Includes entries with the CSS selector and description, e.g.:
    ```yaml
    - selector: .nf
      description: Name Function
    ```

## Author & Contributors

- [James Warwood - @jwarby](https://github.com/jwarby) - *Author*

## License

Licensed under the MIT license.  Copyright (c) James Warwood 2015.
