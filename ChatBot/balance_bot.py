import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import requests
from flask import Flask, request, jsonify
import threading
import hmac
from hashlib import sha256
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
CRYPTO_PAY_TOKEN = os.getenv("CRYPTO_PAY_TOKEN")

if not BOT_TOKEN or not CRYPTO_PAY_TOKEN:
    raise ValueError("Не найдены необходимые токены в переменных окружения")

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

@app.route('/send_order_result', methods=['POST'])
def send_order_result():
    data = request.json
    user_id = data.get('user_id')
    file_id = data.get('file_id')
    comment = data.get('comment', 'Ваш заказ выполнен успешно')
    if not user_id or not file_id:
        return jsonify({'ok': False, 'error': 'user_id и file_id обязательны'}), 400
    try:
        requests.post(f'https://api.telegram.org/bot{BOT_TOKEN}/sendDocument', json={
            'chat_id': user_id,
            'document': file_id,
            'caption': comment
        })
        return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

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
                [InlineKeyboardButton("Pay via CryptoBot", url=invoice_url)]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            # Отправляем анимацию с текстом
            with open('../public/images/Crypto Pay.mp4', 'rb') as video:
                await update.message.reply_animation(
                    animation=video,
                    caption=f"Счет на пополнение баланса на {amount} USDT создан!💰\n\nНажмите кнопку ниже для оплаты:",
                    reply_markup=reply_markup
                )
        else:
            await update.message.reply_text("Ошибка при создании счета.")
        return
    
    keyboard = [
        [InlineKeyboardButton("Open moodern-app", url="https://t.me/orderenineenngbot/Ordering")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    # Отправляем видео как анимацию вместе с текстом
    with open('../public/images/Hello_bot.mp4', 'rb') as video:
        await update.message.reply_animation(
            animation=video,
            caption="Добро пожаловать в Moodern design!👾\n\nЗдесь вы сможете заказать дизайн в нашем мини-приложении🚀",
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
                [InlineKeyboardButton("Pay via CryptoBot", url=invoice_url)]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            # Отправляем анимацию с текстом
            with open('../public/images/Crypto Pay.mp4', 'rb') as video:
                await update.message.reply_animation(
                    animation=video,
                    caption=f"Счет на пополнение баланса на {amount} USDT создан!💰\n\nНажмите кнопку ниже для оплаты:",
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