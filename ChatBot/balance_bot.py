import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import requests
from flask import Flask, request, jsonify
import threading
import hmac
from hashlib import sha256

BOT_TOKEN = "7736951923:AAHaXa-zYyM2i3bu7zi5usGZiU0UXRoV8hI"
CRYPTO_PAY_TOKEN = "376809:AA8RHtjg7Wq3B0mqXrFLyTmXGK10CBZZtbY"

logging.basicConfig(level=logging.INFO)

# Балансы пользователей (user_id: balance)
balances = {}

# Flask-приложение для webhook и баланса
app = Flask(__name__)

@app.route('/crypto_pay_webhook', methods=['POST'])
def crypto_pay_webhook():
    signature = request.headers.get('crypto-pay-api-signature')
    raw_body = request.get_data()  # raw bytes
    secret = sha256(CRYPTO_PAY_TOKEN.encode()).digest()
    h = hmac.new(secret, raw_body, 'sha256').hexdigest()
    if h != signature:
        return jsonify({'ok': False, 'error': 'Invalid signature'}), 403

    data = request.json
    if data.get('update_type') == 'invoice_paid':
        invoice = data.get('payload', {})
        user_id = invoice.get('user_id')
        amount = float(invoice.get('amount', 0))
        if user_id:
            balances[user_id] = balances.get(user_id, 0) + amount
            # Отправляем сообщение об успехе
            requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage', json={
                'chat_id': user_id,
                'text': f'✅ Оплата прошла успешно! Баланс пополнен на {amount} USDT.'
            })
    return jsonify(ok=True)

@app.route('/get_balance', methods=['GET'])
def get_balance():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify(balance=0)
    return jsonify(balance=balances.get(int(user_id), 0))

# --- Telegram Bot ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if context.args and context.args[0].startswith("balance_"):
        try:
            amount = float(context.args[0].replace("balance_", ""))
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
            "description": "Пополнение баланса в мини-приложении",
            "user_id": update.effective_user.id
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
    keyboard = [
        [InlineKeyboardButton("Открыть мини-приложение", url="https://t.me/orderenineenngbot/Ordering")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Добро пожаловать! Здесь вы можете заказать дизайн. Для заказа используйте наше мини-приложение:",
        reply_markup=reply_markup
    )

async def balance(update: Update, context: ContextTypes.DEFAULT_TYPE):
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
            "description": "Пополнение баланса в мини-приложении",
            "user_id": update.effective_user.id
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

# --- Запуск Flask и Telegram Bot параллельно ---
def run_flask():
    app.run(port=5000)

def run_telegram():
    app_telegram = ApplicationBuilder().token(BOT_TOKEN).build()
    app_telegram.add_handler(CommandHandler("start", start))
    app_telegram.add_handler(CommandHandler("Balance", balance))
    app_telegram.run_polling()

if __name__ == "__main__":
    threading.Thread(target=run_flask, daemon=True).start()
    run_telegram()