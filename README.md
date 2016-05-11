# New projects

## Set up
- Check `package.json`
- Check `Gruntfile.js`
- Update `css` **@imports** to `scss`

## Organisation
- **Dev:** Add all content here. *Jade* for html templates
  - **Content:**: All files and folders are copied from this location, from `jade` to `html`, **excluding** files from the *template* folder
  - **CSS/template:** Contains all basic custom files -> `main.scss`
  - **JS/template:** Contains all basic custom files -> `main.js`
- **Build:** All dev changes are tracked in the *build* folder. These files are compiled for web friendly viewing.
- **Dist:** All build files are compiled for final host purposes in the *dist* folder. These files (css, js, html & images) are optimized for the web (minified & concatenated)

## On `dist`
- Remove relative path from directories in `header` & `footer` templates from **/new_project/build/** (to *SERVER*)

## For more information
- [Source and writer](http://kenvandamme.be/) or [on Github as solo244](https://github.com/solo244)

## Requirements/used
- jQuery **v2.1.4**
- Bootstrap **v3.3.6**
- SASS for `css`
- Jade for `html`
- Grunt **v1.0**

## Browser compatibility
- Internet Explorer 9+
- Firefox
- Chrome
- Opera
- Safari

## License
It's on the internet, so yea :P
