1. Получение токена доступа (EAS_TOKEN)
   Для того чтобы GitHub имел право отправлять команды от вашего имени, ему нужен секретный токен.

Зайдите в Expo Dashboard -> Access Tokens.

Нажмите Create token, назовите его (например, github-actions) и скопируйте.

Перейдите в ваш репозиторий на GitHub.

Откройте Settings -> Secrets and variables -> Actions.

Нажмите New repository secret.

Имя: EXPO_TOKEN, значение: (ваш скопированный токен).

2. Создание Workflow файла
   В корне вашего проекта создайте папку .github/workflows/ (если её нет) и в ней файл deploy-expo.yml.

Вставьте туда следующий код:

YAML
name: Expo Publish Update

on:
push:
branches: - main
pull_request:
branches: - main

jobs:
publish:
name: Install and Publish to Expo
runs-on: ubuntu-latest
steps: # 1. Загружаем код из репозитория - name: 🏗 Checkout
uses: actions/checkout@v4

      # 2. Устанавливаем Node.js
      - name: ⚙️ Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      # 3. Устанавливаем EAS CLI
      - name: 🏗 Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      # 4. Устанавливаем зависимости проекта
      - name: 📦 Install dependencies
        run: npm install

      # 5. Публикуем обновление
      - name: 🚀 Publish update
        run: eas update --branch production --message "Update from GitHub Action (Commit ${{ github.sha }})"

3. Как это будет работать
   При создании Pull Request: Скрипт запустится и опубликует код в ветку production. Это удобно для быстрого предпросмотра изменений в Expo Go.

При Merge (слиянии) в main: Код снова опубликуется, обновляя "живую" версию приложения.

Несколько советов:
Переменные окружения (.env): Если ваше приложение использует API-ключи, которые прописаны в .env, они не попадут на GitHub. Вам нужно будет добавить их в секреты GitHub и прописать в шаге сборки, либо использовать EAS Secrets.

Оптимизация: Шаг npm install может занимать время. Если вы используете yarn или pnpm, замените команды в шагах 2 и 4.

Уведомления: Можно добавить еще один шаг в GitHub Actions, чтобы в комментарии к PR приходил QR-код для быстрого открытия в Expo Go. Для этого существует официальный экшен expo/expo-github-action с параметром comment: true.

Теперь при каждом обновлении кода на GitHub ваше приложение в Expo Go будет обновляться автоматически без участия вашего компьютера!
