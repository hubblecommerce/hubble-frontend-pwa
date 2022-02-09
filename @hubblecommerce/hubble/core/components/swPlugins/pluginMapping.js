export const pluginMapping = [
    {
        "slot": "checkout-payment-methods-method",
        "componentName": "test-plugin",
        "componentPath": "/swPlugins/TestPlugin.vue"
    },
    {
        "slot": "checkout-payment-methods-modal",
        "componentName": "loader",
        "componentPath": "/utils/Loader"
    }
];

export const generateImports = () => {
    let obj = {};
    pluginMapping.map((plugin) => {
        Object.assign(obj, {
            [plugin.componentName]: () => import('@/components'+plugin.componentPath)
        });
    });

    return obj;
};

export default pluginMapping;
