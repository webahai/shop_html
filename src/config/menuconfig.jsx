
//配置数据，admin页面根据数据来生成菜单导航栏
const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: 'HomeOutlined',
        ispublic:'true'
    },
    {
        title: '商品',
        key: '/goods',
        icon: 'DesktopOutlined',
        children: [
            {
                title: '种类管理',
                key: '/kind',
                icon: 'BarsOutlined'
            },
            {
                title: '商品管理',
                key: '/shop',
                icon: 'ShoppingCartOutlined'
            }
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: 'UserOutlined'
    },
    {
        title: '用户授权',
        key: '/role',
        icon: 'ToolOutlined'
    },
    {
        title: '可视化图表',
        key: '/set',
        icon: 'AreaChartOutlined',
        children: [
            {
                title: '柱状图',
                key: '/count',
                icon: 'AreaChartOutlined'
            },
            {
                title: '饼状图',
                key: '/setting',
                icon: 'SettingOutlined'
            }
        ]
    }
];
export default menuList;