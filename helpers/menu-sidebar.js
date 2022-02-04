const getMenuSidebar = (role = 'USER_ROLE') => {
    const menu = [
        {
            titulo: "Inicio",
            icono: "fas fa-igloo",
            url: "/",
            submenu: [],
        },
        // {
        //     titulo: "CRUD",
        //     icono: "fas fa-hammer",
        //     url: "",
        //     submenu: [
        //         { titulo: "Usuarios", url: "/usuarios" },
        //         { titulo: "Posts", url: "/home/posts" },
        //     ],
        // },
        {
            titulo: "Dashboard",
            icono: "fas fa-tachometer-alt",
            url: "/dashboard",
            submenu: [{ titulo: "Prueba?", url: "/usuarios" }],
        },
        {
            titulo: "Nosotros",
            icono: "fas fa-child",
            url: "/about",
            submenu: [],
        },
        {
            titulo: "Ajustes & Perfil",
            icono: "fas fa-cogs",
            url: "/perfil",
            submenu: [],
        },
    ];

    if (role === 'ADMIN_ROLE') {
        menu.push({
            titulo: "CRUD",
            icono: "fas fa-hammer",
            url: "",
            submenu: [
                { titulo: "Usuarios", url: "/usuarios" },
                { titulo: "Posts", url: "/home/posts" },
            ],
        });
    }

    return menu;
};

module.exports = {
    getMenuSidebar
}
