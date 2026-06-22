import sys
sys.stdout.reconfigure(encoding="utf-8")
with open("forum.html","r",encoding="utf-8") as f:
    content = f.read()

# Fix gameTitle template literal
old1 = 'data.name} ????`;'
new1 = 'data.name} \u672c\u7ad9\u8bba\u575b`;'
content = content.replace(old1, new1)

# Fix topic meta template literals
old2 = '<span class="author">?? ${topic.author}</span>'
new2 = '<span class="author">\U0001f464 ${topic.author}</span>'
content = content.replace(old2, new2)

old3 = '<span>?? ${topic.replies} ??</span>'
new3 = '<span>\U0001f4ac ${topic.replies} \u56de\u590d</span>'
content = content.replace(old3, new3)

old4 = '<span>?? ${topic.time}</span>'
new4 = '<span>\U0001f550 ${topic.time}</span>'
content = content.replace(old4, new4)

with open("forum.html","w",encoding="utf-8") as f:
    f.write(content)
print("Done! Fixed template literal placeholders.")
