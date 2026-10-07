# ED Generator

Две версии генератора на Next.js:

- Корень репозитория — локальная версия без входа и Supabase. Запуск и формат шаблонов описаны в [README_OFFLINE.md](README_OFFLINE.md). Рабочие шаблоны не включены; добавьте свою выгрузку в `public/templates_rows.csv`.
- `web/` — веб-версия с Supabase Auth, профилями и админкой шаблонов. Для запуска укажите значения из `web/.env.example` в `web/.env.local`, выполните `npm ci` и `npm run dev` внутри `web/`.
