module.exports = {
    // webpack-dev-server 相关配置
    devServer: {
        port:8080,
        proxy: {
            '/warehouseinfo': {
                target: 'http://127.0.0.1:8000',
                ws: true,
                changeOrigin: true,
            },
            '/*': {
                target : 'http://127.0.0.1:8000',
                ws: true,
                changeOrigin:  true,
            }
        }
    },
}