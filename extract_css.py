import cssutils

# Parse the CSS file
css_map = {}
with open("/mnt/e/code/html/my-website/src/index.css", "r", encoding="utf-8") as css_file:
    stylesheet = cssutils.parseString(css_file.read())

    for rule in stylesheet:
        if rule.type == rule.STYLE_RULE:
            selector = rule.selectorText
            styles = rule.style.cssText
            css_map[selector] = styles

print(css_map)  # Dictionary mapping selectors to styles
