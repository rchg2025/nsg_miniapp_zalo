const fs = require('fs');
const file = 'E:\\ZALO MINI APP\\TRƯỜNG NSG\\NSG NEWS\\src\\pages\\news-detail.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr =   useEffect(() => {
    const load = () => {
      try {
        // Ưu tiên adminNewsList (dữ liệu mới nhất từ admin)
        const adminData = localStorage.getItem('adminNewsList');
        const appData = localStorage.getItem('app_news_data');
        
        const raw = adminData || appData;
        if (raw) {
          const list = JSON.parse(raw);
          setAllNews(list);
          const found = list.find(item => String(item.id) === String(id));
          if (found) {
            setNewsDetail(found);
            console.log('📰 News detail loaded:', found?.title);
          } else {
            console.log('⚠️ News not found with id:', id);
          }
          
          // Đồng bộ dữ liệu nếu cần
          if (adminData && !appData) {
            localStorage.setItem('app_news_data', adminData);
          }
        } else {
          console.log('⚠️ No news data found in localStorage');
        }
      } catch (e) {
        console.error('Lỗi load chi tiết:', e);
      }
    };
    
    if (id) load();
  }, [id]);;

const newStr =   useEffect(() => {
    const load = async () => {
      try {
        const { getNews } = await import('@/utils/api');
        const list = await getNews();
        setAllNews(list);
        const found = list.find((item: any) => String(item.id) === String(id));
        if (found) {
          setNewsDetail(found);
        }
      } catch (e) {
        console.error('Lỗi load chi tiết API:', e);
      }
    };
    if (id) load();
  }, [id]);;

const idx = content.indexOf('  useEffect(() => {\n    const load = () => {');
if(idx > -1) {
  content = content.substring(0, idx) + newStr + content.substring(content.indexOf('  // Check if news is saved', idx));
  fs.writeFileSync(file, content, 'utf8');
  console.log('Replaced by substring logic');
} else {
  console.log('Could not find substring');
}

