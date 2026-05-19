// Test script để kiểm tra đồng bộ dữ liệu giữa admin và user
// Chạy script này trong Console (F12) để test

(function testDataSync() {
  console.log('🧪 Testing Data Synchronization...\n');
  
  // 1. Kiểm tra tin tức
  console.log('📰 Testing News Data Sync:');
  const adminNews = localStorage.getItem('adminNewsList');
  const appNews = localStorage.getItem('app_news_data');
  
  if (adminNews) {
    const adminCount = JSON.parse(adminNews).length;
    console.log(`✅ adminNewsList: ${adminCount} items`);
  } else {
    console.log('❌ adminNewsList: NOT FOUND');
  }
  
  if (appNews) {
    const appCount = JSON.parse(appNews).length;
    console.log(`✅ app_news_data: ${appCount} items`);
  } else {
    console.log('❌ app_news_data: NOT FOUND');
  }
  
  if (adminNews && appNews) {
    const isSync = adminNews === appNews;
    console.log(isSync ? '✅ News data is SYNCED' : '⚠️ News data is NOT SYNCED');
  }
  
  console.log('\n📚 Testing Majors Data Sync:');
  const adminMajors = localStorage.getItem('adminMajorsList');
  const appMajors = localStorage.getItem('app_majors_data');
  
  if (adminMajors) {
    const adminCount = JSON.parse(adminMajors).length;
    console.log(`✅ adminMajorsList: ${adminCount} items`);
  } else {
    console.log('❌ adminMajorsList: NOT FOUND');
  }
  
  if (appMajors) {
    const appCount = JSON.parse(appMajors).length;
    console.log(`✅ app_majors_data: ${appCount} items`);
  } else {
    console.log('❌ app_majors_data: NOT FOUND');
  }
  
  if (adminMajors && appMajors) {
    const isSync = adminMajors === appMajors;
    console.log(isSync ? '✅ Majors data is SYNCED' : '⚠️ Majors data is NOT SYNCED');
  }
  
  // 2. Test DataManager
  console.log('\n🔧 Testing DataManager:');
  try {
    // Check if DataManager is available
    if (typeof DataManager !== 'undefined') {
      const newsFromDM = DataManager.getNews();
      const majorsFromDM = DataManager.getMajors();
      console.log(`✅ DataManager.getNews(): ${newsFromDM.length} items`);
      console.log(`✅ DataManager.getMajors(): ${majorsFromDM.length} items`);
    } else {
      console.log('⚠️ DataManager not available in this context');
    }
  } catch (e) {
    console.log('⚠️ DataManager test skipped (not in app context)');
  }
  
  // 3. Summary
  console.log('\n📊 Summary:');
  const newsKeys = [adminNews ? '✅' : '❌', appNews ? '✅' : '❌'];
  const majorsKeys = [adminMajors ? '✅' : '❌', appMajors ? '✅' : '❌'];
  
  console.log(`News: adminNewsList ${newsKeys[0]} | app_news_data ${newsKeys[1]}`);
  console.log(`Majors: adminMajorsList ${majorsKeys[0]} | app_majors_data ${majorsKeys[1]}`);
  
  if (adminNews && appNews && adminNews === appNews && 
      adminMajors && appMajors && adminMajors === appMajors) {
    console.log('\n✅✅✅ ALL DATA IS SYNCED CORRECTLY! ✅✅✅');
  } else {
    console.log('\n⚠️ Data needs synchronization. Run seed-demo-data.js to fix.');
  }
  
  console.log('\n💡 Tip: If data is not synced, reload the page or run DataManager methods.');
})();
