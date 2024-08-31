module.exports = {
  input: [
    "src/**/*.{js,jsx,ts,tsx}", // папки и файлы, которые нужно сканировать
    "!src/locales/**", // исключите папку с переводами
  ],
  output: "./src/locales", // папка, куда будут сохраняться переводы
  options: {
    debug: true,
    removeUnusedKeys: true, // опция для удаления неиспользуемых ключей
    func: {
      list: ["i18next.t", "i18n.t", "t"], // функции, которые нужно сканировать
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    lngs: ["en", "ru"], // языки, которые нужно поддерживать
    ns: ["translation"], // пространство имен (namespace)
    defaultLng: "en",
    defaultNs: "translation",
    defaultValue: (lng, ns, key) => key, // значение по умолчанию (можно оставить ключ)
    resource: {
      loadPath: "src/locales/{{lng}}.json",
      savePath: "{{lng}}.json",
      jsonIndent: 2,
    },
    keySeparator: ".", // разделитель для ключей
    nsSeparator: ":", // разделитель для пространства имен
  },
};
