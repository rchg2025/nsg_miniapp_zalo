import fs from 'fs';
let c = fs.readFileSync('src/components/bottom-navigation.tsx', 'utf8');
let s = c.indexOf('const baseNavItems');
let e = c.indexOf('];', s) + 2;
let rep = \const baseNavItems: BottomNavItem[] = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: 'zi-home',
      path: '/'
    },
    {
      id: 'news',
      label: 'Tin tức',
      icon: 'zi-bookmark',
      path: '/news'
    },
    {
      id: 'majors',
      label: 'Ngành đào tạo',
      icon: 'zi-calendar',
      path: '/majors'
    },
    {
      id: 'admission',
      label: 'Đăng ký',
      icon: 'zi-edit',
      path: '/admission-registration'
    }
  ];\;
fs.writeFileSync('src/components/bottom-navigation.tsx', c.substring(0, s) + rep + c.substring(e));

