from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackContext

# Токен вашего бота
TOKEN = "8008519316:AAFQ8wQydgAqCn1xT-FG_6HPM1ACIQ3MZck"

def start(update: Update, context: CallbackContext):
    """Обработчик команды /start"""
    keyboard = [
        [
            InlineKeyboardButton(
                "Open this app",
                url="http://t.me/NoNameWebAppBot/net"
            )
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    update.message.reply_text(
        "Open this app",
        reply_markup=reply_markup
    )

def main():
    """Запуск бота"""
    # Создаем Updater и передаем ему токен бота
    updater = Updater(TOKEN)

    # Получаем диспетчера для регистрации обработчиков
    dispatcher = updater.dispatcher

    # Регистрируем обработчик команды /start
    dispatcher.add_handler(CommandHandler("start", start))

    # Запускаем бота
    updater.start_polling()

    # Останавливаем бота, если были нажаты Ctrl + C
    updater.idle()

if __name__ == '__main__':
    main() 