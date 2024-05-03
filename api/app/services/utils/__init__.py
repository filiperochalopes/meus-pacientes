from datetime import date, datetime, timedelta

def calculate_age(dob:date):
    '''Captura a idade completa, dada uma data de nascimento'''

    today = date.today()
    birthday_not_passed = ((today.month, today.day) < (dob.month, dob.day))
    age_year = today.year - dob.year - birthday_not_passed
    age_month = (dob.month + today.month) if birthday_not_passed else (dob.month - today.month)
    age_day = (dob.day + today.day) if birthday_not_passed else (today.day - dob.day)
    age_string = ''
    if age_year > 1:
        age_string += f'{age_year} anos'
    elif age_year == 1:
        age_string += f'{age_year} ano'
    if age_month > 1:
        age_string += f', {age_month} meses'
    elif age_month == 1:
        age_string += f', {age_month} mês'
    if age_day > 1:
        age_string += f', {age_day} dias'
    elif age_day == 1:
        age_string += f', {age_day} dia'
    return age_string