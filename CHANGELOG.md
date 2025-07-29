# Changelog

All notable changes to the Simple Morph project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Fix hamburger menu functionality in mobile mode
- Improve shimmer effect animation
- Enhance strong glass effect styling
- Fix tooltip hover functionality
- Improve modal dialog interactions

## [0.0.1-beta] - 2025-07-30

### Added
- Table of contents with close button functionality
- Consistent code examples with copy buttons across documentation
- GitHub link button in demo interface
- Get Started button that scrolls to relevant content

### Changed
- Updated version status from alpha to beta
- Simplified README to be more succinct
- Removed deprecated files and documentation

### Fixed
- Restored sticky positioning for table of contents on desktop
- Improved code example formatting consistency

## [0.0.1-alpha] - 2025-01-11

### Added
- Initial alpha release of Simple Morph CSS framework
- Futuristic dark theme with glassmorphism effects
- Semantic HTML-first approach inspired by Simple.css
- Complete component library including:
  - Navigation bar with fixed positioning
  - Interactive buttons with multiple variants (primary, secondary, success, warning, error, outline)
  - Enhanced alerts with icons and close buttons
  - Interactive cards with hover effects, shimmer, and tilt animations
  - Progress bars with different states
  - Badges with color variants
  - Modal dialogs with backdrop blur
  - Dropdown menus
  - Tabs with smooth transitions
  - Breadcrumb navigation
  - Pagination controls
  - Data tables with responsive design
  - Form elements with glassmorphism styling
- Code example accordions for each component
- Responsive design with mobile hamburger menu
- GitHub Pages deployment with automated workflow
- Comprehensive documentation and TODO tracking

### Fixed
- **Critical**: Desktop layout issue where main content was hidden behind fixed navbar
  - Added `padding-top: 4rem` to body element for desktop layouts
  - Reduced main content padding to optimize spacing
  - Maintains existing mobile layout functionality

### Technical
- Vite build system with PostCSS processing
- CSS custom properties for easy theming
- Modern CSS features including backdrop-filter and CSS Grid
- Automated GitHub Actions deployment to GitHub Pages
- Jest testing framework setup
- Playwright end-to-end testing setup

### Documentation
- Complete README.md with usage examples
- Live demo at https://davidteren.github.io/simple_morph/
- Code examples for all components
- Installation and quick start guide
- Browser compatibility information
- Contributing guidelines

### Infrastructure
- Git repository initialization
- GitHub Pages deployment workflow
- Package.json with proper metadata
- Build and development scripts
- Comprehensive .gitignore

---

## Version History Summary

- **v0.0.1-beta** (2025-07-30): Beta release with improved documentation, TOC functionality, and version status update
- **v0.0.1-alpha** (2025-01-11): Initial alpha release with complete component library and fixed desktop layout
- **Unreleased**: Ongoing improvements and bug fixes

---

## Release Notes Format

### Added
- New features and components

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements

---

**Note**: This project follows semantic versioning. Given the current 0.0.1 version:
- **Patch releases** (0.0.x) for bug fixes and small improvements
- **Minor releases** (0.x.0) for new features and components
- **Major releases** (x.0.0) for breaking changes and major redesigns
