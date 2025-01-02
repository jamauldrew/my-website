from bs4 import BeautifulSoup

# Load the HTML file
with open("/mnt/e/code/html/my-website/index.html", "r", encoding="utf-8") as file:
    soup = BeautifulSoup(file, "html.parser")

# Extract relevant information
elements = []
for el in soup.find_all(True):  # Finds all tags
    tag_name = el.name
    inline_style = el.get("style", "")
    class_name = el.get("class", [])
    elements.append(
        {
            "tag": tag_name,
            "classes": class_name,
            "inline_style": inline_style,
        }
    )

print(elements)  # List of elements with styles and classes
