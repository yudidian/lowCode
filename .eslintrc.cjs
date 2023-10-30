module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "tsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "vue/html-indent": ["error", 2],  // 强制 HTML 缩进为 2 个空格
        "vue/html-self-closing": ["error", {"html": {"void": "always"}}],  // 要求自动关闭的标签自闭合
        "vue/no-unused-vars": "error",  // 禁止未使用的 Vue.js 组件定义
        "vue/require-v-for-key": "error",  // 要求 v-for 使用 key
        "vue/order-in-components": ["error", {"order": ["name", "components", "props", "data", "methods"]}],  // 强制组件选项的顺序
        'vue/multi-word-component-names': 0,
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "array-bracket-spacing": ["error","always"],
        "object-curly-spacing": ["error","always"],
        "no-unused-vars": "off"
    },
};
