const fs = require('fs');
const file = 'E:\\ZALO MINI APP\\TRƯỜNG NSG\\NSG NEWS\\src\\pages\\news-detail.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /useEffect\(\(\) => \{\s+const load = \(\) => \{[\s\S]+?\}, \[id\]\);/g;

const replacement = "useEffect(() => {\n" +
  "    const load = async () => {\n" +
  "      try {\n" +
  "        const { getNews } = await import('@/utils/api');\n" +
  "        const list = await getNews();\n" +
  "        setAllNews(list);\n" +
  "        const found = list.find((item: any) => String(item.id) === String(id));\n" +
  "        if (found) {\n" +
  "          setNewsDetail(found);\n" +
  "        }\n" +
  "      } catch (e) {\n" +
  "        console.error('Lỗi API:', e);\n" +
  "      }\n" +
  "    };\n" +
  "    if (id) load();\n" +
  "  }, [id]);";

if(regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Replaced successfully in news-detail.tsx');
} else {
  console.log('Regex not matching in news-detail.tsx');
}
