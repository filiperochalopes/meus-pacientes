from datetime import date, datetime, timedelta
import random


def calculate_age(dob: date):
    """Captura a idade completa, dada uma data de nascimento"""

    today = date.today()
    birthday_not_passed = (today.month, today.day) < (dob.month, dob.day)
    age_year = today.year - dob.year - birthday_not_passed
    age_month = (
        (dob.month + today.month) if birthday_not_passed else (dob.month - today.month)
    )
    age_day = (dob.day + today.day) if birthday_not_passed else (today.day - dob.day)
    age_string = ""
    if age_year > 1:
        age_string += f"{age_year} anos"
    elif age_year == 1:
        age_string += f"{age_year} ano"
    if age_month > 1:
        age_string += f", {age_month} meses"
    elif age_month == 1:
        age_string += f", {age_month} mês"
    if age_day > 1:
        age_string += f", {age_day} dias"
    elif age_day == 1:
        age_string += f", {age_day} dia"
    return age_string


def generate_cpf():
    cpf = [random.randint(0, 9) for x in range(9)]

    for _ in range(2):
        val = sum([(len(cpf) + 1 - i) * v for i, v in enumerate(cpf)]) % 11

        cpf.append(11 - val if val > 1 else 0)

    return "%s%s%s%s%s%s%s%s%s%s%s" % tuple(cpf)
