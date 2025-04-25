
const MenuData= [
  {
    path: '/',
    name: 'home',
    label: '数据看版',
    icon: 's-data',
    url: 'Home/Home'
  },
  {
    path: '/mall',
    name: 'mall',
    label: '考试信息管理',
    icon: 's-management',
    url: 'MallManage/MallManage'
  },
  {
    path: '/announcement',
    name: 'announcement',
    label: '系统公告管理',
    icon: 'info',
    url: 'Announcement/Announcement'
  },

  {
    path: '/user',
    name: 'user',
    label: '用户管理',
    icon: 'user',
    url: 'UserManage/UserManage'
  },
  // {
  //   label: '其他',
  //   icon: 'location',
  //   children: [
  //     {
  //       path: '/page1',
  //       name: 'page1',
  //       label: '页面1',
  //       icon: 'setting',
  //       url: 'Other/PageOne'
  //     },
  //     {
  //       path: '/page2',
  //       name: 'page2',
  //       label: '页面2',
  //       icon: 'setting',
  //       url: 'Other/PageTwo'
  //     }
  //   ]
  // }
]

export default MenuData
