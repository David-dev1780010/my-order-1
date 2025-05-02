import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import requests

BOT_TOKEN = "7736951923:AAHaXa-zYyM2i3bu7zi5usGZiU0UXRoV8hI"
CRYPTO_PAY_TOKEN = "376809:AA8RHtjg7Wq3B0mqXrFLyTmXGK10CBZZtbY"

logging.basicConfig(level=logging.INFO)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if context.args and context.args[0].startswith("balance_"):
        try:
            amount = float(context.args[0].replace("balance_", ""))
        except Exception:
            await update.message.reply_text("Некорректная сумма.")
            return

        # Генерируем счет через Crypto Pay API
        url = "https://pay.crypt.bot/api/createInvoice"
        headers = {
            "Crypto-Pay-API-Token": CRYPTO_PAY_TOKEN
        }
        data = {
            "asset": "USDT",
            "amount": str(amount),
            "description": "Пополнение баланса в мини-приложении"
        }
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        if result.get("ok"):
            invoice_url = result["result"].get("pay_url") or result["result"].get("bot_invoice_url")
            keyboard = [
                [InlineKeyboardButton("Оплатить через CryptoBot", url=invoice_url)]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await update.message.reply_text(
                f"Счет на пополнение баланса на {amount} USDT создан!\nНажмите кнопку ниже для оплаты:",
                reply_markup=reply_markup
            )
        else:
            await update.message.reply_text("Ошибка при создании счета.")
        return

    # Обычное приветствие, если нет параметра
    keyboard = [
        [InlineKeyboardButton("Открыть мини-приложение", url="https://t.me/orderenineenngbot/Ordering")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Добро пожаловать! Здесь вы можете заказать дизайн. Для заказа используйте наше мини-приложение:",
        reply_markup=reply_markup
    )

async def balance(update: Update, context: ContextTypes.DEFAULT_TYPE):
    # Оставляем для совместимости, если вдруг кто-то вызовет /Balance вручную
    if context.args:
        try:
            amount = float(context.args[0])
        except Exception:
            await update.message.reply_text("Некорректная сумма.")
            return

        url = "https://pay.crypt.bot/api/createInvoice"
        headers = {
            "Crypto-Pay-API-Token": CRYPTO_PAY_TOKEN
        }
        data = {
            "asset": "USDT",
            "amount": str(amount),
            "description": "Пополнение баланса в мини-приложении"
        }
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        if result.get("ok"):
            invoice_url = result["result"].get("pay_url") or result["result"].get("bot_invoice_url")
            keyboard = [
                [InlineKeyboardButton("Оплатить через CryptoBot", url=invoice_url)]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await update.message.reply_text(
                f"Счет на пополнение баланса на {amount} USDT создан!\nНажмите кнопку ниже для оплаты:",
                reply_markup=reply_markup
            )
        else:
            await update.message.reply_text("Ошибка при создании счета.")

if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("Balance", balance))
    app.run_polling()